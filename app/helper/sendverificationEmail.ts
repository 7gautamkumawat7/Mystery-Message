import { resend } from "@/app/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/app/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log(`\n🔑 [OTP GENERATED] User: ${username} | Email: ${email} | Code: ${verifyCode}\n`);

    const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const response = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (response.error) {
      console.error("Resend API error:", response.error);
      return {
        success: false,
        message: response.error.message || "Failed to send verification email.",
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}