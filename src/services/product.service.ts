import prisma from "@/lib/prisma";
import { ProductFilterParams, ProductItem } from "@/types/product";
import { Prisma } from "@prisma/client";
import { FALLBACK_PRODUCTS, FALLBACK_COLLECTIONS } from "@/lib/catalog-data";

function filterFallbackProducts(params?: ProductFilterParams): ProductItem[] {
  let list = [...FALLBACK_PRODUCTS];

  if (params?.isFeatured !== undefined) {
    list = list.filter((p) => p.featured === params.isFeatured);
  }

  if (params?.categorySlug) {
    list = list.filter((p) => p.category?.slug === params.categorySlug);
  }

  if (params?.collectionSlug) {
    list = list.filter((p) =>
      p.collections?.some((c) => c.collection.slug === params.collectionSlug)
    );
  }

  if (params?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= (params.minPrice as number));
  }
  if (params?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= (params.maxPrice as number));
  }

  if (params?.movement) {
    const q = params.movement.toLowerCase();
    list = list.filter((p) => p.movement?.toLowerCase().includes(q));
  }
  if (params?.strap) {
    const q = params.strap.toLowerCase();
    list = list.filter((p) => p.strapMaterial?.toLowerCase().includes(q));
  }
  if (params?.caseMaterial) {
    const q = params.caseMaterial.toLowerCase();
    list = list.filter((p) => p.caseMaterial?.toLowerCase().includes(q));
  }
  if (params?.dialColor) {
    const q = params.dialColor.toLowerCase();
    list = list.filter((p) => p.dialColor?.toLowerCase().includes(q));
  }
  if (params?.fragranceFamily) {
    const q = params.fragranceFamily.toLowerCase();
    list = list.filter((p) => p.olfactiveFamily?.toLowerCase().includes(q));
  }
  if (params?.gender) {
    const q = params.gender.toLowerCase();
    list = list.filter((p) => p.gender?.toLowerCase().includes(q));
  }
  if (params?.availability === "in_stock") {
    list = list.filter((p) => (p.inventory?.quantity || 0) > 0);
  }

  if (params?.search && params.search.trim().length > 0) {
    const q = params.search.trim().toLowerCase();
    list = list.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchShort = p.shortDescription.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCol = p.collections?.some((c) =>
        c.collection.name.toLowerCase().includes(q)
      );
      return matchName || matchSku || matchShort || matchDesc || matchTags || matchCol;
    });
  }

  if (params?.sortBy === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (params?.sortBy === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (params?.sortBy === "newest") {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // "featured" default
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (params?.limit) {
    list = list.slice(0, params.limit);
  }

  return list;
}

export async function getProducts(params?: ProductFilterParams): Promise<ProductItem[]> {
  try {
    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED",
    };

    if (params?.isFeatured !== undefined) {
      where.featured = params.isFeatured;
    }

    if (params?.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    if (params?.collectionSlug) {
      where.collections = {
        some: {
          collection: { slug: params.collectionSlug },
        },
      };
    }

    // Price Filtering
    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(params.minPrice);
      }
      if (params.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(params.maxPrice);
      }
    }

    // Watch Specific Filters
    if (params?.movement) {
      where.movement = { contains: params.movement, mode: "insensitive" };
    }
    if (params?.strap) {
      where.strapMaterial = { contains: params.strap, mode: "insensitive" };
    }
    if (params?.caseMaterial) {
      where.caseMaterial = { contains: params.caseMaterial, mode: "insensitive" };
    }
    if (params?.dialColor) {
      where.dialColor = { contains: params.dialColor, mode: "insensitive" };
    }

    // Fragrance Specific Filters
    if (params?.fragranceFamily) {
      where.olfactiveFamily = { contains: params.fragranceFamily, mode: "insensitive" };
    }
    if (params?.gender) {
      where.gender = { equals: params.gender, mode: "insensitive" };
    }

    // Availability Filter (In Stock)
    if (params?.availability === "in_stock") {
      where.inventory = {
        quantity: { gt: 0 },
      };
    }

    // Search across Name, SKU, Description, Tags, Collections
    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      where.OR = [
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
      ];
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }];
    if (params?.sortBy === "price-asc") {
      orderBy = [{ price: "asc" }];
    } else if (params?.sortBy === "price-desc") {
      orderBy = [{ price: "desc" }];
    } else if (params?.sortBy === "newest") {
      orderBy = [{ createdAt: "desc" }];
    } else if (params?.sortBy === "best-selling") {
      orderBy = [{ orderItems: { _count: "desc" } }, { featured: "desc" }];
    } else {
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
    }

    const items = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
        collections: {
          include: {
            collection: { select: { id: true, name: true, slug: true, bannerUrl: true } },
          },
        },
        variants: true,
        inventory: true,
      },
      orderBy,
      take: params?.limit ?? 48,
    });

    if (!items || items.length === 0) {
      return filterFallbackProducts(params);
    }

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
    })) as unknown as ProductItem[];
  } catch (error) {
    console.warn("Database query failed in product service, using fallback catalog:", error);
    return filterFallbackProducts(params);
  }
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const item = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        collections: {
          include: {
            collection: { select: { id: true, name: true, slug: true, bannerUrl: true } },
          },
        },
        inventory: true,
        reviews: {
          where: { isPublished: true },
          include: {
            user: { select: { profile: { select: { firstName: true, lastName: true } } } },
          },
        },
      },
    });

    if (!item) {
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    return {
      ...item,
      price: Number(item.price),
      compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
      cost: item.cost ? Number(item.cost) : null,
      variants: item.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        attributes: v.attributes as Record<string, string> | null,
      })),
      macroDetails: (item.macroDetails as any) || null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    } as unknown as ProductItem;
  } catch (error) {
    console.warn("Database query error in getProductBySlug, looking up in fallback catalog:", error);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export interface RelatedProductsResult {
  youMayAlsoLike: ProductItem[];
  completeTheLook: ProductItem[];
  fromTheCollection: ProductItem[];
}

export async function getRelatedProducts(
  productId: string,
  categorySlug?: string,
  collectionSlug?: string
): Promise<RelatedProductsResult> {
  try {
    const formatItems = (items: any[]) =>
      items.map((item) => ({
        ...item,
        price: Number(item.price),
        compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
        cost: item.cost ? Number(item.cost) : null,
        variants: item.variants.map((v: any) => ({
          ...v,
          price: Number(v.price),
          attributes: v.attributes as Record<string, string> | null,
        })),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })) as unknown as ProductItem[];

    // 1. You May Also Like: same category, excluding current product
    const youMayAlsoLikeRaw = await prisma.product.findMany({
      where: {
        id: { not: productId },
        status: "PUBLISHED",
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        collections: {
          include: {
            collection: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      take: 4,
      orderBy: { featured: "desc" },
    });

    const complementaryCategorySlug =
      categorySlug === "haute-horlogerie" ? "high-perfumery" : "haute-horlogerie";

    const completeTheLookRaw = await prisma.product.findMany({
      where: {
        id: { not: productId },
        status: "PUBLISHED",
        category: { slug: complementaryCategorySlug },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        collections: {
          include: {
            collection: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      take: 4,
      orderBy: { featured: "desc" },
    });

    let fromTheCollectionRaw: any[] = [];
    if (collectionSlug) {
      fromTheCollectionRaw = await prisma.product.findMany({
        where: {
          id: { not: productId },
          status: "PUBLISHED",
          collections: {
            some: {
              collection: { slug: collectionSlug },
            },
          },
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
          collections: {
            include: {
              collection: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      });
    }

    const youMayAlsoLike = formatItems(youMayAlsoLikeRaw);
    const completeTheLook = formatItems(completeTheLookRaw);
    const fromTheCollection = formatItems(fromTheCollectionRaw);

    if (youMayAlsoLike.length > 0 || completeTheLook.length > 0) {
      return { youMayAlsoLike, completeTheLook, fromTheCollection };
    }

    // If DB returned nothing, use fallback
    return getFallbackRelated(productId, categorySlug, collectionSlug);
  } catch (err) {
    console.warn("Failed to load related products from DB, using fallback:", err);
    return getFallbackRelated(productId, categorySlug, collectionSlug);
  }
}

function getFallbackRelated(
  productId: string,
  categorySlug?: string,
  collectionSlug?: string
): RelatedProductsResult {
  const youMayAlsoLike = FALLBACK_PRODUCTS.filter(
    (p) => p.id !== productId && (!categorySlug || p.category?.slug === categorySlug)
  ).slice(0, 4);

  const complementarySlug =
    categorySlug === "haute-horlogerie" ? "high-perfumery" : "haute-horlogerie";
  const completeTheLook = FALLBACK_PRODUCTS.filter(
    (p) => p.id !== productId && p.category?.slug === complementarySlug
  ).slice(0, 4);

  const fromTheCollection = collectionSlug
    ? FALLBACK_PRODUCTS.filter(
        (p) =>
          p.id !== productId &&
          p.collections?.some((c) => c.collection.slug === collectionSlug)
      ).slice(0, 4)
    : [];

  return { youMayAlsoLike, completeTheLook, fromTheCollection };
}

// Fetch all distinct filter options dynamically
export async function getDiscoveryFilterOptions(categorySlug?: string) {
  try {
    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED",
    };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [products, collections] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          price: true,
          movement: true,
          strapMaterial: true,
          caseMaterial: true,
          dialColor: true,
          olfactiveFamily: true,
          gender: true,
          inventory: { select: { quantity: true } },
        },
      }),
      prisma.collection.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
    ]);

    if (!products || products.length === 0) {
      return getFallbackDiscoveryFilterOptions(categorySlug);
    }

    const movements = Array.from(new Set(products.map((p) => p.movement).filter(Boolean))) as string[];
    const straps = Array.from(new Set(products.map((p) => p.strapMaterial).filter(Boolean))) as string[];
    const caseMaterials = Array.from(new Set(products.map((p) => p.caseMaterial).filter(Boolean))) as string[];
    const dialColors = Array.from(new Set(products.map((p) => p.dialColor).filter(Boolean))) as string[];
    const fragranceFamilies = Array.from(new Set(products.map((p) => p.olfactiveFamily).filter(Boolean))) as string[];
    const genders = Array.from(new Set(products.map((p) => p.gender).filter(Boolean))) as string[];

    const prices = products.map((p) => Number(p.price));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 100000;

    return {
      collections,
      movements,
      straps,
      caseMaterials,
      dialColors,
      fragranceFamilies,
      genders,
      minPrice,
      maxPrice,
    };
  } catch (err) {
    console.warn("Failed to load filter options from DB, using fallback:", err);
    return getFallbackDiscoveryFilterOptions(categorySlug);
  }
}

function getFallbackDiscoveryFilterOptions(categorySlug?: string) {
  const filteredProducts = categorySlug
    ? FALLBACK_PRODUCTS.filter((p) => p.category?.slug === categorySlug)
    : FALLBACK_PRODUCTS;

  const movements = Array.from(new Set(filteredProducts.map((p) => p.movement).filter(Boolean))) as string[];
  const straps = Array.from(new Set(filteredProducts.map((p) => p.strapMaterial).filter(Boolean))) as string[];
  const caseMaterials = Array.from(new Set(filteredProducts.map((p) => p.caseMaterial).filter(Boolean))) as string[];
  const dialColors = Array.from(new Set(filteredProducts.map((p) => p.dialColor).filter(Boolean))) as string[];
  const fragranceFamilies = Array.from(new Set(filteredProducts.map((p) => p.olfactiveFamily).filter(Boolean))) as string[];
  const genders = Array.from(new Set(filteredProducts.map((p) => p.gender).filter(Boolean))) as string[];

  const prices = filteredProducts.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 50000;

  return {
    collections: FALLBACK_COLLECTIONS.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    movements,
    straps,
    caseMaterials,
    dialColors,
    fragranceFamilies,
    genders,
    minPrice,
    maxPrice,
  };
}
