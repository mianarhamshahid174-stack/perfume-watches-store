import React from "react";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import {
  HeroSection,
  FeaturedWatchSection,
  CollectionStorySection,
  CollectionsGridSection,
  WatchFragranceSplitSection,
  SignatureProductSection,
  CraftsmanshipGallerySection,
  FragranceEditorialSection,
  GiftingSection,
  BrandStorySection,
  DeliveryConciergeSection,
  NewsletterSection,
} from "@/components/storefront/homepage";
import { PersonalStylist } from "@/components/storefront/personal-stylist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VELORA Pakistan | Luxury Watches & Fine Fragrances",
  description:
    "Original luxury automatic timepieces and artisanal fine fragrances. Nationwide complimentary delivery across Pakistan with Cash on Delivery, open parcel inspection, and 7-day checking warranty.",
  openGraph: {
    title: "VELORA Pakistan | Luxury Watches & Fine Fragrances",
    description:
      "Original luxury automatic timepieces and fine fragrances. Nationwide delivery with Cash on Delivery across Pakistan.",
    images: [{ url: "/images/velora-hero-editorial.jpg" }],
  },
};

import {
  FALLBACK_HOMEPAGE_SECTIONS,
  FALLBACK_PRODUCTS,
  FALLBACK_COLLECTIONS,
} from "@/lib/catalog-data";

// Default fallback ordering if CMS is temporarily unseeded
const DEFAULT_SECTION_KEYS = [
  "hero_main",
  "featured_watch",
  "collection_story",
  "collections_grid",
  "watch_fragrance_split",
  "signature_product",
  "craftsmanship_gallery",
  "fragrance_editorial",
  "gifting_packaging",
  "brand_story",
  "delivery_concierge",
  "newsletter_section",
];

export default async function StorefrontHomePage() {
  // 1. Fetch CMS-controlled active homepage sections in sort order
  let cmsSections: any[] = [];
  try {
    cmsSections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.warn("Could not query homepage sections from DB, using fallback sections:", err);
  }

  // If no sections found in DB yet, use fallback sections
  const sectionsToRender =
    cmsSections && cmsSections.length > 0
      ? cmsSections
      : FALLBACK_HOMEPAGE_SECTIONS;

  // 2. Fetch real database entities required by sections (with safe fallback)
  let publishedProducts: any[] = [];
  try {
    const rawPublishedProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        variants: true,
      },
    });

    publishedProducts = rawPublishedProducts.map((p: any) => ({
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      cost: p.cost ? Number(p.cost) : null,
      variants: p.variants.map((v: any) => ({
        ...v,
        price: Number(v.price),
        attributes: v.attributes as Record<string, string> | null,
      })),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.warn("Could not query products from DB, using fallback catalog:", err);
  }

  if (publishedProducts.length === 0) {
    publishedProducts = FALLBACK_PRODUCTS;
  }

  // Collections: Fetch real collections (SIGNATURE, NOIR, CLASSIC, etc.)
  let collections: any[] = [];
  try {
    const rawCollections = await prisma.collection.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    collections = rawCollections.map((col: any) => ({
      ...col,
      products: col.products.map((cp: any) => ({
        ...cp,
        product: {
          ...cp.product,
          price: Number(cp.product.price),
          compareAtPrice: cp.product.compareAtPrice ? Number(cp.product.compareAtPrice) : null,
          cost: cp.product.cost ? Number(cp.product.cost) : null,
          createdAt: cp.product.createdAt.toISOString(),
          updatedAt: cp.product.updatedAt.toISOString(),
        },
      })),
      createdAt: col.createdAt.toISOString(),
      updatedAt: col.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.warn("Could not query collections from DB, using fallback collections:", err);
  }

  if (collections.length === 0) {
    collections = FALLBACK_COLLECTIONS.map((c) => ({
      ...c,
      products: FALLBACK_PRODUCTS.filter((p) =>
        p.collections?.some((col) => col.collection.slug === c.slug)
      ).map((prod) => ({
        product: prod,
      })),
    }));
  }



  // Helper map to quickly find products by slug
  const productMap = new Map(publishedProducts.map((p: any) => [p.slug, p]));
  const defaultSignatureProduct =
    productMap.get("velora-signature-01") || publishedProducts[0] || null;

  return (
    <div className="flex flex-col w-full bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      {sectionsToRender.map((sec: any) => {
        const key = sec.sectionKey;
        const content = (sec.content as any) || {};

        switch (key) {
          // SECTION 1 — HERO
          case "hero_main":
            return (
              <HeroSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 2 — FEATURED WATCH
          case "featured_watch": {
            const assignedProduct = content.productSlug
              ? productMap.get(content.productSlug) || defaultSignatureProduct
              : defaultSignatureProduct;

            return (
              <FeaturedWatchSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
                product={assignedProduct}
              />
            );
          }

          // SECTION 3 — COLLECTION STORY
          case "collection_story":
            return (
              <CollectionStorySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 4 — COLLECTIONS (SIGNATURE, NOIR, CLASSIC)
          case "collections_grid":
            return (
              <CollectionsGridSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
                collections={collections}
              />
            );

          // SECTION 5 — WATCH + FRAGRANCE (TIME / SCENT SPLIT) & PERSONAL STYLIST
          case "watch_fragrance_split":
            return (
              <React.Fragment key={sec.id}>
                <WatchFragranceSplitSection
                  title={sec.title}
                  subtitle={sec.subtitle}
                  content={content}
                />
                <PersonalStylist />
              </React.Fragment>
            );

          // SECTION 6 — SIGNATURE PRODUCT (VELORA SIGNATURE 01)
          case "signature_product": {
            const sigProduct = content.productSlug
              ? productMap.get(content.productSlug) || defaultSignatureProduct
              : defaultSignatureProduct;

            return (
              <SignatureProductSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
                product={sigProduct}
              />
            );
          }

          // SECTION 7 — CRAFTSMANSHIP
          case "craftsmanship_gallery":
            return (
              <CraftsmanshipGallerySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 8 — FRAGRANCE EDITORIAL
          case "fragrance_editorial":
            return (
              <FragranceEditorialSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 9 — GIFTING & PACKAGING
          case "gifting_packaging":
            return (
              <GiftingSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 10 — BRAND STORY
          case "brand_story":
            return (
              <BrandStorySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 11 — COURIER, DELIVERY & CONCIERGE CARE
          case "delivery_concierge":
          case "journal_preview":
            return (
              <DeliveryConciergeSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          // SECTION 12 — NEWSLETTER
          case "newsletter_section":
            return (
              <NewsletterSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
