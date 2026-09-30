import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const users = await prisma.user.findMany({
      include: {
        profile: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const customers = users.map((u) => {
      const name = u.profile
        ? `${u.profile.firstName || ""} ${u.profile.lastName || ""}`.trim() || "Patron"
        : "Patron";

      const validOrders = u.orders.filter(
        (o) => o.status !== "Cancelled" && o.status !== "Refunded"
      );

      const totalSpending = validOrders.reduce(
        (acc, o) => acc + Number(o.total || 0),
        0
      );

      const latestOrder = u.orders.length > 0 ? u.orders[0] : null;

      let status = "Registered Member";
      if (u.role === UserRole.VIP_CUSTOMER) {
        status = "VIP Patron";
      } else if (u.orders.length > 0) {
        status = "Active Client";
      }

      return {
        id: u.id,
        name,
        email: u.email,
        phone: u.profile?.phone || null,
        notes: u.profile?.notes || null,
        role: u.role,
        isActive: u.isActive,
        orderCount: u.orders.length,
        totalSpending,
        latestOrder: latestOrder
          ? {
              id: latestOrder.id,
              orderNumber: latestOrder.orderNumber,
              total: Number(latestOrder.total),
              date: latestOrder.createdAt,
              status: latestOrder.status,
            }
          : null,
        createdAt: u.createdAt,
      };
    });

    const filtered = search
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.phone && c.phone.includes(search))
        )
      : customers;

    return NextResponse.json({ success: true, customers: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
