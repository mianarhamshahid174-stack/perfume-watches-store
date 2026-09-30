import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, InventoryTransactionType } from "@prisma/client";
import { z } from "zod";

const adjustSchema = z.object({
  inventoryId: z.string().min(1, "Inventory ID required"),
  adjustmentQuantity: z.number().int().refine((val) => val !== 0, "Adjustment cannot be zero"),
  reason: z.string().min(3, "Adjustment reason is required"),
  transactionType: z
    .nativeEnum(InventoryTransactionType)
    .default(InventoryTransactionType.AUDIT_ADJUSTMENT),
  reference: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminAuth([AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]);
    const body = await req.json();
    const validated = adjustSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { inventoryId, adjustmentQuantity, reason, transactionType, reference } = validated.data;

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { product: true },
    });

    if (!inventory) {
      return NextResponse.json({ success: false, error: "Inventory record not found" }, { status: 404 });
    }

    const previousQuantity = inventory.quantity;
    const newQuantity = previousQuantity + adjustmentQuantity;

    if (newQuantity < 0) {
      return NextResponse.json(
        { success: false, error: "Cannot reduce vault stock below zero." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Inventory stock
      const updatedInv = await tx.inventory.update({
        where: { id: inventoryId },
        data: { quantity: newQuantity },
      });

      // 2. Create Audit Transaction Record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryId,
          type: transactionType,
          quantity: adjustmentQuantity,
          previousQuantity,
          newQuantity,
          reference: reference || `ADJUST-${Date.now().toString().slice(-6)}`,
          adminUserId: admin.adminId,
          notes: reason,
        },
        include: {
          adminUser: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      return { inventory: updatedInv, transaction };
    });

    return NextResponse.json({
      success: true,
      message: `Stock successfully adjusted (${adjustmentQuantity > 0 ? "+" : ""}${adjustmentQuantity}) for ${inventory.product?.name || "piece"}.`,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
