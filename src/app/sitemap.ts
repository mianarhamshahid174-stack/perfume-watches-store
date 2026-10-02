import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velora-ateliers.com";

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/watches`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fragrances`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // 2. Dynamic Published Products
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, canonicalUrl: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: p.canonicalUrl || `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    // 3. Dynamic Active Collections
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, canonicalUrl: true },
    });

    const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
      url: c.canonicalUrl || `${baseUrl}/collections/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 4. Dynamic Published Journal Posts
    const journalPosts = await prisma.journalPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, canonicalUrl: true },
    });

    const journalRoutes: MetadataRoute.Sitemap = journalPosts.map((j) => ({
      url: j.canonicalUrl || `${baseUrl}/journal/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...journalRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
