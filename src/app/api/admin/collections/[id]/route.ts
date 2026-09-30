import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR, AdminRole.CUSTOMER_SUPPORT]);
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: { select: { id: true, name: true, sku: true, price: true } },
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const { id } = await params;
    const body = await req.json();

    const data: Prisma.CollectionUpdateInput = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.heroImage !== undefined) data.heroImage = body.heroImage;
    if (body.bannerUrl !== undefined) data.bannerUrl = body.bannerUrl;
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription;

    const updated = await prisma.collection.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, message: "Collection updated successfully", collection: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);
    const { id } = await params;

    await prisma.collection.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
