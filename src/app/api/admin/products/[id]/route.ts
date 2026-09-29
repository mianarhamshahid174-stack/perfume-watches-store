import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
        inventory: {
          include: {
            transactions: { take: 5, orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
    ]);

    const { id } = await params;
    const body = await req.json();

    const data: Prisma.ProductUpdateInput = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.price !== undefined) data.price = new Prisma.Decimal(body.price.toString());
    if (body.status !== undefined) data.status = body.status;
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.description !== undefined) data.description = body.description;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only SUPER_ADMIN and ADMIN can delete products
    await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN]);

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product removed from catalog.",
    });
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
