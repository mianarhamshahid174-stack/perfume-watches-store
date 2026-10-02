import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      addresses: true,
      orders: {
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          payments: true,
          shipments: true,
        },
      },
      wishlist: {
        include: {
          items: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return NextResponse.json(
      { success: false, error: "User record unavailable or deactivated" },
      { status: 401 }
    );
  }

  // Sanitize sensitive fields
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      profile: user.profile,
      addresses: user.addresses,
      orders: user.orders,
      wishlist: user.wishlist,
    },
  });
}
