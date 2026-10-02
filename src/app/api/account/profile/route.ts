import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, preferredCurrency } = body;

    const updatedProfile = await prisma.customerProfile.upsert({
      where: { userId: session.userId },
      update: {
        firstName,
        lastName,
        phone,
        preferredCurrency: preferredCurrency || "PKR",
      },
      create: {
        userId: session.userId,
        firstName,
        lastName,
        phone,
        preferredCurrency: preferredCurrency || "PKR",
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
