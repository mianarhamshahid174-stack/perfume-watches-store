import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, ProductStatus, Prisma } from "@prisma/client";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(2, "SKU is required"),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().optional().nullable(),
  cost: z.number().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  initialStock: z.number().int().nonnegative().default(1),
  // Technical specs
  movement: z.string().optional().nullable(),
  caseMaterial: z.string().optional().nullable(),
  caseDiameter: z.string().optional().nullable(),
  powerReserve: z.string().optional().nullable(),
  waterResistance: z.string().optional().nullable(),
  dialColor: z.string().optional().nullable(),
  strapMaterial: z.string().optional().nullable(),
  concentration: z.string().optional().nullable(),
  olfactiveFamily: z.string().optional().nullable(),
  volumeMl: z.number().optional().nullable(),
  imageUrl: z.string().url().optional(),
});

// GET: List all products for Admin table
export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status") as ProductStatus | null;

    const where: Prisma.ProductWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// POST: Create a new product (Requires SUPER_ADMIN, ADMIN, or EDITOR)
export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
    ]);

    const body = await req.json();
    const validated = createProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const d = validated.data;

    // Check unique slug or SKU
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: d.slug }, { sku: d.sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A product with this slug or SKU already exists." },
        { status: 409 }
      );
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: d.name,
          slug: d.slug,
          sku: d.sku,
          shortDescription: d.shortDescription,
          description: d.description,
          price: new Prisma.Decimal(d.price.toString()),
          compareAtPrice: d.compareAtPrice
            ? new Prisma.Decimal(d.compareAtPrice.toString())
            : null,
          cost: d.cost ? new Prisma.Decimal(d.cost.toString()) : null,
          categoryId: d.categoryId || null,
          tags: d.tags,
          status: d.status,
          featured: d.featured,
          seoTitle: d.seoTitle || null,
          seoDescription: d.seoDescription || null,
          movement: d.movement || null,
          caseMaterial: d.caseMaterial || null,
          caseDiameter: d.caseDiameter || null,
          powerReserve: d.powerReserve || null,
          waterResistance: d.waterResistance || null,
          dialColor: d.dialColor || null,
          strapMaterial: d.strapMaterial || null,
          concentration: d.concentration || null,
          olfactiveFamily: d.olfactiveFamily || null,
          volumeMl: d.volumeMl || null,
          images: d.imageUrl
            ? {
                create: [
                  {
                    url: d.imageUrl,
                    altText: d.name,
                    isPrimary: true,
                    sortOrder: 1,
                  },
                ],
              }
            : undefined,
          inventory: {
            create: {
              quantity: d.initialStock,
              warehouseLocation: "Geneva Vault Primary",
              transactions: {
                create: [
                  {
                    type: "PURCHASE_RECEIPT",
                    quantity: d.initialStock,
                    previousQuantity: 0,
                    newQuantity: d.initialStock,
                    adminUserId: adminSession.adminId,
                    reference: `INITIAL-ENTRY-${d.sku}`,
                    notes: "Initial inventory setup on product creation.",
                  },
                ],
              },
            },
          },
        },
        include: {
          category: true,
          images: true,
          inventory: true,
        },
      });

      return product;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product record generated and inventory initialized.",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
