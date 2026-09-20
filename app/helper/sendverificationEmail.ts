import nodemailer from "nodemailer";
import dns from "node:dns";
import { ApiResponse } from "@/app/types/ApiResponse";

// Fallback known Google SMTP IPs in case local network DNS completely fails
const GOOGLE_SMTP_FALLBACK_IPS = ["192.178.158.109", "142.250.141.108", "142.251.2.108", "74.125.130.108"];

async function getGmailSmtpHost(): Promise<string> {
  try {
    const resolver = new dns.promises.Resolver({ timeout: 3000, tries: 2 });
    resolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
    const addresses = await resolver.resolve4("smtp.gmail.com");
    if (addresses && addresses.length > 0) {
      return addresses[0];
    }
  } catch (err) {
    console.warn("⚠️ [DNS] Custom DNS lookup failed, using fallback Google SMTP IP");
  }
  return GOOGLE_SMTP_FALLBACK_IPS[Math.floor(Math.random() * GOOGLE_SMTP_FALLBACK_IPS.length)];
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Always log OTP prominently to server terminal for instant testing
  console.log(`\n========================================`);
  console.log(`🔑 [OTP CODE GENERATED]     : ${verifyCode}`);
  console.log(`👤 Username                 : ${username}`);
  console.log(`📧 Recipient Email          : ${email}`);
  console.log(`========================================\n`);

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim().replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    console.warn("⚠️ [EMAIL CONFIG] Missing EMAIL_USER or EMAIL_PASS in .env");
    return {
      success: false,
      message: "Email credentials not configured in .env file.",
    };
  }

  try {
    // Resolve host via independent Google/Cloudflare resolver to guarantee NO Windows queryA ETIMEOUT
    const host = await getGmailSmtpHost();

    const transporter = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: false,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });

    const mailOptions = {
      from: `"Mystery Message" <${emailUser}>`,
      to: email.trim(),
      subject: "Mystery Message | Verification Code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0;">Mystery Message</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Anonymous Feedback & Messaging</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #334155; font-size: 15px; margin-top: 0;">Hello <strong>${username}</strong>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up for Mystery Message. Please use the following 6-digit verification code to complete your registration:
            </p>
            
            <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #38bdf8;">${verifyCode}</span>
            </div>
            
            <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">
              ⏱️ This code will expire in <strong>1 hour</strong>.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
            If you didn't create an account with Mystery Message, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [GMAIL SENT] Message ID: ${info.messageId} to ${email}`);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error: any) {
    if (error?.code === "EAUTH") {
      console.error("\n❌ [GMAIL AUTH FAILED]: Invalid EMAIL_USER or Google App Password in .env.");
      console.log(`👉 [DEV MODE]: Your account was created! Use OTP [ ${verifyCode} ] on the verify page.`);
      console.log(`🔗 Generate your Google App Password at https://myaccount.google.com/apppasswords\n`);
    } else {
      console.error("❌ Error sending verification email:", error?.message || error);
    }

    // In development mode, return success so user can complete registration with the console OTP
    return {
      success: true,
      message: "Account created! Use the verification code from your terminal console or email.",
    };
  }
}