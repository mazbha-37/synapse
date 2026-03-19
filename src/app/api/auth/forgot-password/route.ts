import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/validators/auth";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = result.data;

    await dbConnect();

    const user = await User.findOne({ email, provider: "credentials" }).select(
      "+resetToken +resetTokenExpiry"
    );

    // Always respond the same to prevent email enumeration
    const genericResponse = {
      message: "If an account exists with that email, a reset link has been sent.",
    };

    if (!user) {
      return NextResponse.json(genericResponse);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Synapse <noreply@yourdomain.com>", // change to your verified domain
        to: email,
        subject: "Reset your Synapse password",
        html: `
          <p>Hi,</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        `,
      });
    } else {
      // Development: log to console and return link in response
      console.log(`[Password Reset] Reset link for ${email}: ${resetUrl}`);
    }

    return NextResponse.json({
      ...genericResponse,
      ...(process.env.NODE_ENV !== "production" && { resetUrl }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
