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
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { shortDescription: { contains: params.search, mode: "insensitive" } },
        { sku: { contains: params.search, mode: "insensitive" } },
      ];
    }

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
        variants: true,
        inventory: true,
      },
      orderBy:
        params?.sortBy === "price-asc"
          ? { price: "asc" }
          : params?.sortBy === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
      take: params?.limit ?? 24,
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
    })) as ProductItem[];
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
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        collections: {
          include: {
            collection: { select: { id: true, name: true, slug: true } },
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
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    } as ProductItem;
  } catch (error) {
    console.error("Failed to query product by slug:", error);
    return null;
  }
}
