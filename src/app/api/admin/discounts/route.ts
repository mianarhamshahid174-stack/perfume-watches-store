import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, DiscountType } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const couponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 chars").transform((val) => val.toUpperCase().trim()),
  description: z.string().optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().min(0, "Discount value must be positive"),
  minOrderAmount: z.number().optional().nullable(),
  maxDiscountAmount: z.number().optional().nullable(),
  targetType: z.enum(["ALL", "PRODUCTS", "COLLECTIONS"]).default("ALL"),
  productIds: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  expiresAt: z.string().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const coupons = await prisma.coupon.findMany({
      where: search
        ? {
            OR: [
              { code: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: { usages: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, coupons });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);

    const body = await req.json();
    const validated = couponSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      targetType,
      productIds,
      collectionIds,
      expiresAt,
      usageLimit,
      isActive,
    } = validated.data;

    // Check duplicate code
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Discount voucher code "${code}" already exists.` },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description: description || null,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount ?? null,
        maxDiscountAmount: maxDiscountAmount ?? null,
        targetType,
        productIds,
        collectionIds,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ?? null,
        isActive,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
