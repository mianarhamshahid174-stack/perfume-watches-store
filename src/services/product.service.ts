import prisma from "@/lib/prisma";
import { ProductFilterParams, ProductItem } from "@/types/product";
import { Prisma } from "@prisma/client";

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

    // Real Search across Name, SKU, Description, Tags, Collections
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
      // Order by order items frequency or fallback to featured
      orderBy = [{ orderItems: { _count: "desc" } }, { featured: "desc" }];
    } else {
      // "featured" default
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
    console.error("Database query failed in product service:", error);
    return [];
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

    if (!item) return null;

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
    console.error("Database query error in getProductBySlug:", error);
    return null;
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

    // 2. Complete The Look: cross-category complementary recommendation
    // If current is Haute Horlogerie (watches), recommend High Perfumery; and vice-versa
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

    // 3. From The Collection: products sharing the same collection
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

    return {
      youMayAlsoLike: formatItems(youMayAlsoLikeRaw),
      completeTheLook: formatItems(completeTheLookRaw),
      fromTheCollection: formatItems(fromTheCollectionRaw),
    };
  } catch (err) {
    console.error("Failed to load related products:", err);
    return {
      youMayAlsoLike: [],
      completeTheLook: [],
      fromTheCollection: [],
    };
  }
}

// Fetch all distinct filter options dynamically from database
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
    console.error("Failed to load filter options:", err);
    return {
      collections: [],
      movements: [],
      straps: [],
      caseMaterials: [],
      dialColors: [],
      fragranceFamilies: [],
      genders: [],
      minPrice: 0,
      maxPrice: 100000,
    };
  }
}
