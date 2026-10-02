import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { usdToPKR, formatPKR } from "@/lib/currency";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotalUSD } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired atelier privilege code." },
        { status: 404 }
      );
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json(
        { success: false, error: "This privilege code is not yet active." },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: "This privilege code has expired." },
        { status: 400 }
      );
    }

    const subtotal = Number(subtotalUSD || 0);

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of $${Number(coupon.minOrderAmount).toLocaleString()} required for this code.`,
        },
        { status: 400 }
      );
    }

    let discountUSD = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountUSD = (subtotal * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscountAmount && discountUSD > Number(coupon.maxDiscountAmount)) {
        discountUSD = Number(coupon.maxDiscountAmount);
      }
    } else {
      // FIXED_AMOUNT
      discountUSD = Number(coupon.discountValue);
    }

    discountUSD = Math.min(discountUSD, subtotal);
    const discountPKR = usdToPKR(discountUSD);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountUSD,
        discountPKR,
        formattedDiscountPKR: formatPKR(discountPKR),
      },
    });
  } catch (err: any) {
    console.error("Coupon validation error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
