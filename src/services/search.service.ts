import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FALLBACK_PRODUCTS, FALLBACK_COLLECTIONS } from "@/lib/catalog-data";

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
  "Signature 01",
  "Signature 02",
  "Noir 01",
  "Noir 02",
  "Classic 01",
  "Aurel 01",
  "Velora Noir",
  "Velora Aura",
  "Velora Élan",
  "Velora Oud",
  "Velora Santé",
  "Titanium",
  "Sapphire",
  "Rose Gold",
];

export async function searchDatabase(query: string, limit = 40) {
  const q = query.trim();
  if (!q) return [];

  try {
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

    if (items.length > 0) {
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

    return fallbackSearch(q, limit);
  } catch (err) {
    console.warn("searchDatabase failed, using fallback:", err);
    return fallbackSearch(q, limit);
  }
}

function fallbackSearch(query: string, limit = 40) {
  const lower = query.toLowerCase();
  return FALLBACK_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(lower) ||
      p.sku.toLowerCase().includes(lower) ||
      p.shortDescription.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower)) ||
      p.collections?.some((c) => c.collection.name.toLowerCase().includes(lower))
    );
  }).slice(0, limit);
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

  try {
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

    if (matchingProducts.length > 0 || matchingCollections.length > 0) {
      return {
        products: matchingProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: Number(p.price),
          imageUrl: p.images[0]?.url || "/images/velora-signature-01.jpg",
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

    return fallbackAutocomplete(q);
  } catch (err) {
    console.warn("getAutocompleteResults failed, using fallback:", err);
    return fallbackAutocomplete(q);
  }
}

function fallbackAutocomplete(q: string): AutocompleteResult {
  const lower = q.toLowerCase();
  const products = FALLBACK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.sku.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower))
  )
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      imageUrl: p.images[0]?.url || "/images/velora-signature-01.jpg",
      collectionName: p.collections?.[0]?.collection.name || "Maison Collection",
    }));

  const collections = FALLBACK_COLLECTIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower)
  )
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: FALLBACK_PRODUCTS.filter((p) =>
        p.collections?.some((col) => col.collection.slug === c.slug)
      ).length,
    }));

  return {
    products,
    collections,
    popularSearches: POPULAR_SEARCHES.filter((term) =>
      term.toLowerCase().includes(lower)
    ),
  };
}
