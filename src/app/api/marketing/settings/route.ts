import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const DEFAULT_MARKETING_CONFIG = {
  announcementBar: {
    enabled: true,
    text: "Complimentary Armored Courier Delivery & 5-Year Global Manufacture Warranty on all Allocations.",
    badge: "VIP COMPLIMENTARY",
    linkText: "View Policies",
    linkUrl: "/account",
    theme: "gold" as const, // "gold" | "black" | "charcoal"
  },
  homepagePromotions: {
    enabled: true,
    headline: "PRIVATE SALON INVITATION",
    subheadline: "Use code VELORA10 at checkout for an exclusive 10% introductory collector allocation.",
    promoCode: "VELORA10",
    discountText: "10% VIP Concession",
    ctaText: "Discover Masterpieces",
    ctaLink: "/watches",
  },
  featuredProducts: [
    "cmur3om6h000leq5o0bf1cmg8", // velora-signature-01
    "cmur3omii000seq5o6z126mny", // velora-chrono-astral-i
    "cmur3on1i0012eq5ope5kjp4r", // velora-noir-chronometre
  ],
  featuredCollections: [
    "signature",
    "noir",
    "classic",
  ],
  newsletter: {
    enabled: true,
    title: "Receive Private Salon Invitations & Masterpiece Allocations",
    subtitle: "Join the private circle of collectors for confidential previews of numbered timepieces, rare extraction releases, and invitation-only viewings.",
    incentiveText: "Privilege code granted upon admission",
    disclaimer: "Discretion guaranteed. No spam. You may withdraw at any time.",
  },
  popup: {
    enabled: true,
    delaySeconds: 5,
    title: "WELCOME TO MAISON VELORA",
    subtitle: "Enjoy private collector privileges, confidential allocations, and a 10% concession on your inaugural acquisition.",
    badge: "PRIVATE CIRCLE ALLOCATION",
    couponCode: "VELORA10",
    discountText: "10% PRIVILEGE",
    imageUrl: "/images/velora-signature-01.jpg",
    ctaText: "CLAIM COLLECTOR ALLOCATION",
  },
  socialLinks: {
    instagram: "https://instagram.com/velorawatches",
    x: "https://x.com/velorawatches",
    facebook: "https://facebook.com/velorawatches",
    pinterest: "https://pinterest.com/velorawatches",
    youtube: "https://youtube.com/@velorawatches",
    linkedin: "https://linkedin.com/company/velora-geneva",
  },
};

export async function GET(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, config });
  } catch (err: unknown) {
    console.error("Failed to load marketing settings:", err);
    return NextResponse.json({ success: true, config: DEFAULT_MARKETING_CONFIG });
  }
}
