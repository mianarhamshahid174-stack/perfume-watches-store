import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, items: [] });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ success: true, items: [] });
    }

    const formattedItems = cart.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      variantId: i.variantId,
      name: i.product.name,
      slug: i.product.slug,
      sku: i.variant?.sku || i.product.sku,
      price: Number(i.variant?.price || i.product.price),
      imageUrl: i.product.images[0]?.url || "/images/velora-signature-01.jpg",
      quantity: i.quantity,
      variantTitle: i.variant?.title || null,
      attributes: (i.variant?.attributes as any) || null,
    }));

    return NextResponse.json({ success: true, items: formattedItems });
  } catch (err: any) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch cart." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, message: "Guest mode (stored locally)." });
    }

    const body = await req.json();
    const { items = [] } = body;

    // Upsert user's cart
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    // Replace items with synchronized batch
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    for (const item of items) {
      // Validate product existence
      const prod = await prisma.product.findUnique({ where: { id: item.productId } });
      if (prod) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity || 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Cart synchronized to database." });
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to sync cart." }, { status: 500 });
  }
}
