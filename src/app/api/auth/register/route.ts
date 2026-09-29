import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, setCustomerSession } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

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

    const { email, password, firstName, lastName, phone } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user, profile, cart, and wishlist inside a single transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: hashedPassword,
          role: UserRole.CUSTOMER,
          profile: {
            create: {
              firstName,
              lastName,
              phone: phone || null,
            },
          },
          cart: {
            create: {},
          },
          wishlist: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });

      return user;
    });

    // Set secure HttpOnly session cookie
    await setCustomerSession(newUser.id, newUser.email, newUser.role);

    return NextResponse.json({
      success: true,
      message: "Client account created successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.profile?.firstName,
        lastName: newUser.profile?.lastName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
