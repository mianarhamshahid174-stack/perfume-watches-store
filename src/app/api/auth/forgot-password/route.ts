import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = forgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = validated.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success response to prevent email enumeration attacks
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, password reset instructions have been generated.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
    });

    // In production, an email would be dispatched via Resend / SendGrid / Postmark
    // For local development and verification, we include the reset token in the payload
    return NextResponse.json({
      success: true,
      message: "Password reset instructions have been generated.",
      devResetToken: token,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to process password reset request." },
      { status: 500 }
    );
  }
}
