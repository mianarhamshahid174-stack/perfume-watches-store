import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validations/auth";
import { verifyPassword, setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = adminLoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const admin = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: "Access denied. Invalid credentials or inactive administrator profile." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Access denied. Invalid password credentials." },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Set secure HttpOnly admin session cookie
    const fullName = `${admin.firstName} ${admin.lastName}`.trim();
    await setAdminSession(admin.id, admin.email, fullName, admin.role);

    return NextResponse.json({
      success: true,
      message: "Admin authentication confirmed.",
      admin: {
        id: admin.id,
        email: admin.email,
        name: fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during administrative authentication." },
      { status: 500 }
    );
  }
}
