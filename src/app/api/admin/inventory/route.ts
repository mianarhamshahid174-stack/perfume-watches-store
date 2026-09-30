import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole } from "@prisma/client";

export const dynamic = "force-dynamic";

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

    const items = await prisma.inventory.findMany({
      include: {
        product: {
          select: { id: true, name: true, sku: true, price: true, status: true },
        },
        variant: {
          select: { id: true, title: true, sku: true, price: true },
        },
        transactions: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            adminUser: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { quantity: "asc" },
    });

    const formatted = items.map((inv) => {
      const current = inv.quantity;
      const reserved = inv.reserved;
      const available = Math.max(0, current - reserved);
      const isLowStock = current <= 3;
      const status = current === 0 ? "OUT_OF_STOCK" : isLowStock ? "LOW_STOCK" : "HEALTHY";

      return {
        id: inv.id,
        productId: inv.productId,
        productName: inv.product?.name || inv.variant?.title || "Masterpiece",
        sku: inv.product?.sku || inv.variant?.sku || "ZV-SKU",
        currentStock: current,
        reservedStock: reserved,
        availableStock: available,
        isLowStock,
        status,
        warehouseLocation: inv.warehouseLocation || "Geneva Vault",
        updatedAt: inv.updatedAt,
        recentTransactions: inv.transactions,
      };
    });

    const filtered = search
      ? formatted.filter(
          (f) =>
            f.productName.toLowerCase().includes(search.toLowerCase()) ||
            f.sku.toLowerCase().includes(search.toLowerCase())
        )
      : formatted;

    return NextResponse.json({ success: true, inventory: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
