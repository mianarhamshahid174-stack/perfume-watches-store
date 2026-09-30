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

    // 1. Coupons with usage stats and generated revenue
    const coupons = await prisma.coupon.findMany({
      include: {
        usages: {
          include: {
            order: {
              select: { id: true, total: true, orderNumber: true, createdAt: true },
            },
          },
        },
      },
      orderBy: { usageCount: "desc" },
    });

    const campaignStats = coupons.map((c) => {
      const totalGenerated = c.usages.reduce(
        (sum, u) => sum + Number(u.order?.total || 0),
        0
      );
      const totalDiscountGiven = c.usages.reduce(
        (sum, u) => sum + Number(u.discountApplied || 0),
        0
      );

      return {
        id: c.id,
        code: c.code,
        description: c.description || "General Campaign",
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        redemptions: c.usageCount,
        usageLimit: c.usageLimit,
        revenueGenerated: totalGenerated,
        discountGranted: totalDiscountGiven,
        isActive: c.isActive,
        expiresAt: c.expiresAt,
      };
    });

    // 2. VIP Patrons cohort
    const vipPatronsCount = await prisma.user.count({
      where: { role: UserRole.VIP_CUSTOMER },
    });

    const standardPatronsCount = await prisma.user.count({
      where: { role: UserRole.CUSTOMER },
    });

    // 3. Featured Reviews for Social Proof
    const featuredTestimonialsCount = await prisma.review.count({
      where: { isFeatured: true },
    });

    return NextResponse.json({
      success: true,
      marketing: {
        campaignStats,
        vipPatronsCount,
        standardPatronsCount,
        featuredTestimonialsCount,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
