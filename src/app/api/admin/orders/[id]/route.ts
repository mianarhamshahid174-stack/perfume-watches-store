import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import { AdminRole, OrderStatus, PaymentStatus, FulfillmentStatus, ShipmentStatus } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus).optional(),
  trackingNumber: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                preferredCurrency: true,
                notes: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                images: {
                  take: 1,
                  select: { url: true },
                },
              },
            },
            variant: true,
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
        shipments: {
          orderBy: { createdAt: "desc" },
        },
        couponUsages: {
          include: {
            coupon: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
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
    await requireAdminAuth([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.EDITOR,
      AdminRole.CUSTOMER_SUPPORT,
    ]);

    const { id } = await params;
    const body = await req.json();
    const validated = updateOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, paymentStatus, fulfillmentStatus, trackingNumber, carrier, notes } = validated.data;

    // Check order exists
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { shipments: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (fulfillmentStatus !== undefined) updateData.fulfillmentStatus = fulfillmentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: updateData,
      });

      // If tracking number or carrier provided, update or create shipment record
      if (trackingNumber && trackingNumber.trim() !== "") {
        const primaryCarrier = carrier || "Ferrari Secure Logistics (Geneva Courier)";
        if (existing.shipments.length > 0) {
          await tx.shipment.update({
            where: { id: existing.shipments[0].id },
            data: {
              trackingNumber,
              carrier: primaryCarrier,
              status: status === OrderStatus.Delivered ? ShipmentStatus.DELIVERED : ShipmentStatus.IN_TRANSIT,
              dispatchedAt: existing.shipments[0].dispatchedAt || new Date(),
            },
          });
        } else {
          await tx.shipment.create({
            data: {
              orderId: id,
              carrier: primaryCarrier,
              trackingNumber,
              status: status === OrderStatus.Delivered ? ShipmentStatus.DELIVERED : ShipmentStatus.IN_TRANSIT,
              dispatchedAt: new Date(),
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
