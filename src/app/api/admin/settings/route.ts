import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";

export const dynamic = "force-dynamic";

const defaultSettings: Record<string, string> = {
  brand_name: "VELORA ATELIERS",
  brand_tagline: "Haute Horlogerie & Pure Parfum Extraits",
  brand_address: "Rue du Rhône 42, 1204 Genève, Switzerland",
  brand_support_email: "concierge@velora-ateliers.com",
  brand_phone: "+41 22 819 9200",

  currency_primary: "USD",
  currency_symbol: "$",
  currency_supported: "USD,EUR,CHF,GBP,AED,JPY",

  shipping_default_carrier: "Ferrari Secure Armored Logistics",
  shipping_free_threshold: "5000",
  shipping_standard_rate: "150",
  shipping_armored_vault_rate: "450",

  payment_stripe_enabled: "true",
  payment_wire_transfer: "true",
  payment_crypto_concierge: "true",
  payment_escrow_service: "true",

  tax_vat_rate: "7.7",
  tax_included_in_price: "true",
  tax_duty_prepaid: "true",

  email_sender_name: "Maison Velora Concierge",
  email_from_address: "concierge@velora-ateliers.com",
  email_order_confirmation: "true",
  email_dispatch_tracking: "true",

  social_instagram: "https://instagram.com/velora.ateliers",
  social_twitter: "https://x.com/velora_ateliers",
  social_youtube: "https://youtube.com/@velora-ateliers",
  social_linkedin: "https://linkedin.com/company/velora-ateliers",

  seo_meta_title: "VELORA ATELIERS | Haute Horlogerie & Pure Parfum Extraits Geneva",
  seo_meta_description: "Original Swiss micro-mechanical complications and hand-compounded Grasse perfume extraits. Handcrafted in numbered editions.",
  seo_keywords: "luxury watches, geneva horology, tourbillon, squelette, pure parfum extrait, velora",

  notifications_order_alerts: "true",
  notifications_low_stock_threshold: "3",
  notifications_vip_inquiries: "true",
};

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const settingsRows = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = { ...defaultSettings };

    settingsRows.forEach((row) => {
      settingsMap[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
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
    const updates = body.settings as Record<string, string>;

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ success: false, error: "Settings object required" }, { status: 400 });
    }

    await prisma.$transaction(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Site settings committed to database successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
