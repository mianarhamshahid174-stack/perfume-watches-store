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
  JournalPreviewSection,
  NewsletterSection,
} from "@/components/storefront/homepage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VELORA | Haute Horlogerie & High Perfumery",
  description:
    "Contemporary timepieces and extraits de parfum created for moments that matter. Hand-finished mechanical complications and rare botanical essences from Geneva and Grasse.",
  openGraph: {
    title: "VELORA | Haute Horlogerie & High Perfumery",
    description:
      "Contemporary timepieces and extraits de parfum created for moments that matter.",
    images: [{ url: "/images/velora-hero-editorial.jpg" }],
  },
};

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
  "journal_preview",
  "newsletter_section",
];

export default async function StorefrontHomePage() {
  // 1. Fetch CMS-controlled active homepage sections in sort order
  const cmsSections = await prisma.homepageSection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // If no sections found in DB yet, create fallback objects for seamless display
  const sectionsToRender =
    cmsSections.length > 0
      ? cmsSections
      : DEFAULT_SECTION_KEYS.map((key, idx) => ({
          id: `fallback_${key}`,
          name: key,
          sectionKey: key,
          title: null,
          subtitle: null,
          content: null,
          sortOrder: idx + 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

  // 2. Fetch real database entities required by sections (no hardcoding!)
  const rawPublishedProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
  });

  const publishedProducts = rawPublishedProducts.map((p: any) => ({
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

  // Collections: Fetch real collections (SIGNATURE, NOIR, CLASSIC, etc.)
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

  const collections = rawCollections.map((col: any) => ({
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

  // Journal: Fetch latest 3 published articles
  const journalPosts = await prisma.journalPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Helper map to quickly find products by slug
  const productMap = new Map(publishedProducts.map((p: any) => [p.slug, p]));
  const defaultSignatureProduct =
    productMap.get("velora-signature-01") || publishedProducts[0] || null;

  return (
    <div className="flex flex-col w-full bg-obsidian text-sand-100 overflow-x-hidden">
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

          // SECTION 5 — WATCH + FRAGRANCE (TIME / SCENT SPLIT)
          case "watch_fragrance_split":
            return (
              <WatchFragranceSplitSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
              />
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

          // SECTION 11 — JOURNAL (LATEST 3 ARTICLES)
          case "journal_preview":
            return (
              <JournalPreviewSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={content}
                posts={journalPosts}
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
