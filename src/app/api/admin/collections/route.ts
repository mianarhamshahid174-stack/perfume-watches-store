import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const collectionSchema = z.object({
  name: z.string().min(2, "Collection name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  productIds: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR, AdminRole.CUSTOMER_SUPPORT]);

    const collections = await prisma.collection.findMany({
      include: {
        products: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, collections });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const body = await req.json();
    const validated = collectionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const d = validated.data;

    const existing = await prisma.collection.findUnique({ where: { slug: d.slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A collection with this slug already exists." }, { status: 409 });
    }

    const collection = await prisma.$transaction(async (tx) => {
      const col = await tx.collection.create({
        data: {
          name: d.name,
          slug: d.slug,
          description: d.description || null,
          heroImage: d.heroImage || null,
          bannerUrl: d.bannerUrl || null,
          featured: d.featured,
          isActive: d.isActive,
          seoTitle: d.seoTitle || null,
          seoDescription: d.seoDescription || null,
        },
      });

      if (d.productIds.length > 0) {
        await tx.productCollection.createMany({
          data: d.productIds.map((pid, idx) => ({
            collectionId: col.id,
            productId: pid,
            displayOrder: idx,
          })),
        });
      }

      return col;
    });

    return NextResponse.json({ success: true, message: "Collection created successfully", collection }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
