import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    // 1. All valid orders
    const allOrders = await prisma.order.findMany({
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const completedOrders = allOrders.filter(
      (o) => o.status !== OrderStatus.Cancelled && o.status !== OrderStatus.Refunded
    );

    const grossRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const totalDiscounts = completedOrders.reduce((sum, o) => sum + Number(o.discount || 0), 0);
    const netRevenue = grossRevenue - totalDiscounts;
    const aov = completedOrders.length > 0 ? Math.round(grossRevenue / completedOrders.length) : 0;

    // 2. Sales by Category
    const categoryMap = new Map<string, { name: string; revenue: number; units: number }>();
    completedOrders.forEach((o) => {
      o.items.forEach((it) => {
        const catName = it.product?.category?.name || "Bespoke Complications";
        const current = categoryMap.get(catName) || { name: catName, revenue: 0, units: 0 };
        current.revenue += Number(it.total || 0);
        current.units += it.quantity;
        categoryMap.set(catName, current);
      });
    });

    const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);

    // 3. Geographical breakdown (by country)
    const countryMap = new Map<string, { country: string; count: number; revenue: number }>();
    completedOrders.forEach((o) => {
      const country = o.shippingAddress?.country || "Switzerland";
      const current = countryMap.get(country) || { country, count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += Number(o.total || 0);
      countryMap.set(country, current);
    });

    const countryBreakdown = Array.from(countryMap.values()).sort((a, b) => b.revenue - a.revenue);

    // 4. Order Status Breakdown
    const statusCounts: Record<string, number> = {};
    allOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // 5. Repeat Patron Analysis
    const customerOrderCounts = await prisma.order.groupBy({
      by: ["customerId"],
      where: {
        customerId: { not: null },
        status: { notIn: [OrderStatus.Cancelled, OrderStatus.Refunded] },
      },
      _count: { id: true },
    });

    const repeatPatrons = customerOrderCounts.filter((c) => c._count.id > 1).length;
    const totalUniquePatrons = customerOrderCounts.length;
    const repeatRate = totalUniquePatrons > 0 ? Math.round((repeatPatrons / totalUniquePatrons) * 100) : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        grossRevenue,
        netRevenue,
        totalDiscounts,
        totalOrders: allOrders.length,
        completedOrders: completedOrders.length,
        averageOrderValue: aov,
        repeatPatronRate: repeatRate,
        categoryBreakdown,
        countryBreakdown,
        statusCounts,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
