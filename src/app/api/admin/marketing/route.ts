import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, UserRole } from "@prisma/client";
import { DEFAULT_MARKETING_CONFIG } from "@/app/api/marketing/settings/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    // 1. Load Marketing Config from SiteSetting
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "marketing_config" },
    });

    let config = DEFAULT_MARKETING_CONFIG;
    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        config = {
          ...DEFAULT_MARKETING_CONFIG,
          ...parsed,
          announcementBar: { ...DEFAULT_MARKETING_CONFIG.announcementBar, ...parsed.announcementBar },
          homepagePromotions: { ...DEFAULT_MARKETING_CONFIG.homepagePromotions, ...parsed.homepagePromotions },
          newsletter: { ...DEFAULT_MARKETING_CONFIG.newsletter, ...parsed.newsletter },
          popup: { ...DEFAULT_MARKETING_CONFIG.popup, ...parsed.popup },
          socialLinks: { ...DEFAULT_MARKETING_CONFIG.socialLinks, ...parsed.socialLinks },
        };
      } catch (e) {
        console.error("Error parsing marketing_config:", e);
      }
    }

    // 2. Fetch products and collections for marketing multi-selectors
    const [products, collections] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, name: true, sku: true, slug: true, price: true },
        orderBy: { name: "asc" },
      }),
      prisma.collection.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
    ]);

    // 3. Coupons with usage stats and generated revenue
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

    // 4. VIP Patrons cohort
    const vipPatronsCount = await prisma.user.count({
      where: { role: UserRole.VIP_CUSTOMER },
    });

    const standardPatronsCount = await prisma.user.count({
      where: { role: UserRole.CUSTOMER },
    });

    // 5. Featured Reviews for Social Proof
    const featuredTestimonialsCount = await prisma.review.count({
      where: { isFeatured: true },
    });

    return NextResponse.json({
      success: true,
      config,
      products,
      collections,
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

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    const body = await req.json();
    const configString = JSON.stringify(body);

    const setting = await prisma.siteSetting.upsert({
      where: { key: "marketing_config" },
      update: {
        value: configString,
        description: "Storefront marketing configurations (announcement bar, promotions, popup, newsletter, social)",
      },
      create: {
        key: "marketing_config",
        value: configString,
        type: "json",
        description: "Storefront marketing configurations (announcement bar, promotions, popup, newsletter, social)",
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
