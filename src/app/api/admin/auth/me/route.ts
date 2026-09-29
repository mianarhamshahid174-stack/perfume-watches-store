import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated as administrator" },
      { status: 401 }
    );
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!admin || !admin.isActive) {
    return NextResponse.json(
      { success: false, error: "Admin account not found or deactivated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    admin,
  });
}
