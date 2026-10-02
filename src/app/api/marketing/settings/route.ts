import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const DEFAULT_MARKETING_CONFIG = {
  announcementBar: {
    enabled: true,
    text: "Complimentary insured worldwide shipping and 5-year warranty on all orders.",
    badge: "Free Shipping",
    linkText: "Learn More",
    linkUrl: "/shipping",
    theme: "gold" as const, // "gold" | "black" | "charcoal"
  },
  homepagePromotions: {
    enabled: true,
    headline: "Welcome to VELORA",
    subheadline: "Use code VELORA10 at checkout to enjoy 10% off your first order.",
    promoCode: "VELORA10",
    discountText: "10% Off Your Order",
    ctaText: "Explore Watches",
    ctaLink: "/watches",
  },
  featuredProducts: [
    "velora-signature-01",
    "velora-signature-02",
    "velora-noir-01",
  ],
  featuredCollections: [
    "signature",
    "noir",
    "classic",
  ],
  newsletter: {
    enabled: true,
    title: "Join the VELORA Newsletter",
    subtitle: "Subscribe to receive updates on new watch releases, fragrance arrivals, and private events.",
    incentiveText: "Enjoy 10% off your first order",
    disclaimer: "We respect your privacy. You can unsubscribe at any time.",
  },
  popup: {
    enabled: true,
    delaySeconds: 5,
    title: "Welcome to VELORA",
    subtitle: "Subscribe to our newsletter and enjoy 10% off your first watch or fragrance order.",
    badge: "Welcome Gift",
    couponCode: "VELORA10",
    discountText: "10% Off",
    imageUrl: "/images/products/watches/velora-signature-01/front.jpg",
    ctaText: "Claim 10% Off",
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
