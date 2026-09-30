import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, Prisma } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;

    const original = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        collections: true,
        inventory: true,
      },
    });

    if (!original) {
      return NextResponse.json({ success: false, error: "Original product not found" }, { status: 404 });
    }

    const timestamp = Date.now().toString().slice(-4);
    const duplicatedSku = `${original.sku}-COPY-${timestamp}`;
    const duplicatedSlug = `${original.slug}-copy-${timestamp}`;
    const duplicatedName = `${original.name} (Copy)`;

    const duplicated = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: duplicatedName,
          slug: duplicatedSlug,
          sku: duplicatedSku,
          shortDescription: original.shortDescription,
          description: original.description,
          price: original.price,
          compareAtPrice: original.compareAtPrice,
          cost: original.cost,
          categoryId: original.categoryId,
          tags: original.tags,
          status: "DRAFT",
          featured: false,
          seoTitle: original.seoTitle ? `${original.seoTitle} (Copy)` : null,
          seoDescription: original.seoDescription,
          movement: original.movement,
          powerReserve: original.powerReserve,
          caseMaterial: original.caseMaterial,
          caseDiameter: original.caseDiameter,
          waterResistance: original.waterResistance,
          dialColor: original.dialColor,
          strapMaterial: original.strapMaterial,
          concentration: original.concentration,
          olfactiveFamily: original.olfactiveFamily,
          volumeMl: original.volumeMl,
          images: {
            create: original.images.map((img) => ({
              url: img.url,
              altText: img.altText,
              sortOrder: img.sortOrder,
              isPrimary: img.isPrimary,
            })),
          },
          collections: {
            create: original.collections.map((c) => ({
              collectionId: c.collectionId,
              displayOrder: c.displayOrder,
            })),
          },
          inventory: {
            create: {
              quantity: original.inventory?.quantity ?? 1,
              warehouseLocation: original.inventory?.warehouseLocation ?? "Geneva Vault",
              transactions: {
                create: [
                  {
                    type: "PURCHASE_RECEIPT",
                    quantity: original.inventory?.quantity ?? 1,
                    previousQuantity: 0,
                    newQuantity: original.inventory?.quantity ?? 1,
                    adminUserId: admin.adminId,
                    reference: `DUPLICATE-FROM-${original.sku}`,
                    notes: `Duplicated from product ${original.id}`,
                  },
                ],
              },
            },
          },
        },
      });

      return product;
    });

    return NextResponse.json({
      success: true,
      message: `Product duplicated successfully as "${duplicated.name}"`,
      product: duplicated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
