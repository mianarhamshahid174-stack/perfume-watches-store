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

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: "asc" } },
                inventory: true,
                collections: {
                  include: { collection: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({ success: true, items: [] });
    }

    const formatted = wishlist.items.map((wi) => ({
      id: wi.id,
      productId: wi.productId,
      name: wi.product.name,
      slug: wi.product.slug,
      sku: wi.product.sku,
      price: Number(wi.product.price),
      imageUrl: wi.product.images[0]?.url || "/images/velora-signature-01.jpg",
      collectionName: wi.product.collections[0]?.collection?.name || null,
      inStock: (wi.product.inventory?.quantity ?? 0) > 0,
      stockQuantity: wi.product.inventory?.quantity ?? 0,
    }));

    return NextResponse.json({ success: true, items: formatted });
  } catch (err: any) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, message: "Guest mode." });
    }

    const body = await req.json();
    const { productId, productIds } = body;

    const wishlist = await prisma.wishlist.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    if (Array.isArray(productIds)) {
      // Bulk sync from guest local storage
      for (const pId of productIds) {
        await prisma.wishlistItem.upsert({
          where: {
            wishlistId_productId: {
              wishlistId: wishlist.id,
              productId: pId,
            },
          },
          create: {
            wishlistId: wishlist.id,
            productId: pId,
          },
          update: {},
        });
      }
    } else if (productId) {
      // Single toggle / add
      await prisma.wishlistItem.upsert({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          },
        },
        create: {
          wishlistId: wishlist.id,
          productId,
        },
        update: {},
      });
    }

    return NextResponse.json({ success: true, message: "Wishlist saved to database." });
  } catch (err: any) {
    console.error("Wishlist POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to update wishlist." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, message: "Guest mode." });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, error: "Missing productId" }, { status: 400 });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Removed from database wishlist." });
  } catch (err: any) {
    console.error("Wishlist DELETE error:", err);
    return NextResponse.json({ success: false, error: "Failed to remove item." }, { status: 500 });
  }
}
