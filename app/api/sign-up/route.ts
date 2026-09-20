import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helper/sendverificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // 1. Check if a VERIFIED user already owns this username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    // 2. Generate verification code & hash password
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry

    // 3. Check if user exists by email
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        // If unverified, user can change their username and request a new code
        // Delete any other unverified user currently holding this username to prevent MongoDB duplicate key conflicts
        await UserModel.deleteMany({
          username,
          isVerified: false,
          _id: { $ne: existingUserByEmail._id },
        });

        // Update unverified user's username, password, and verification code
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
          return Response.json(
            { success: false, message: emailResponse.message },
            { status: 500 }
          );
        }

        return Response.json(
          {
            success: true,
            message: "Verification email sent. Please verify your account.",
          },
          { status: 200 }
        );
      }
    }

    // 4. If email is brand new, clean up any old unverified accounts holding this username
    await UserModel.deleteMany({
      username,
      isVerified: false,
    });

    // Create new unverified user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: error?.message || "Error registering user" },
      { status: 500 }
    );
  }
}
