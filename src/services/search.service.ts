import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface AutocompleteResult {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    imageUrl: string;
    collectionName?: string;
  }>;
  collections: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
  popularSearches: string[];
}

export const POPULAR_SEARCHES = [
  "Tourbillon",
  "Titanium",
  "Signature 01",
  "Nocturne",
  "Grand Feu",
  "Rose Gold",
  "Santal",
  "Flyback",
  "Extrait",
  "Chronometer",
];

export async function searchDatabase(query: string, limit = 40) {
  const q = query.trim();
  if (!q) return [];

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
      {
        collections: {
          some: {
            collection: {
              name: { contains: q, mode: "insensitive" },
            },
          },
        },
      },
    ],
  };

  const items = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, name: true, slug: true } },
      collections: {
        include: {
          collection: { select: { id: true, name: true, slug: true } },
        },
      },
      inventory: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return items.map((item) => ({
    ...item,
    price: Number(item.price),
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
    cost: item.cost ? Number(item.cost) : null,
    variants: item.variants.map((v) => ({
      ...v,
      price: Number(v.price),
      attributes: v.attributes as Record<string, string> | null,
    })),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export async function getAutocompleteResults(query: string): Promise<AutocompleteResult> {
  const q = query.trim();

  if (!q) {
    return {
      products: [],
      collections: [],
      popularSearches: POPULAR_SEARCHES,
    };
  }

  const [matchingProducts, matchingCollections] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
          { shortDescription: { contains: q, mode: "insensitive" } },
          {
            collections: {
              some: {
                collection: {
                  name: { contains: q, mode: "insensitive" },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        images: {
          select: { url: true, isPrimary: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        collections: {
          select: { collection: { select: { name: true } } },
          take: 1,
        },
      },
      take: 6,
    }),
    prisma.collection.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      take: 4,
    }),
  ]);

  return {
    products: matchingProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: Number(p.price),
      imageUrl:
        p.images[0]?.url ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=85",
      collectionName: p.collections[0]?.collection.name || "Maison Collection",
    })),
    collections: matchingCollections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    })),
    popularSearches: POPULAR_SEARCHES.filter((term) =>
      term.toLowerCase().includes(q.toLowerCase())
    ),
  };
}
