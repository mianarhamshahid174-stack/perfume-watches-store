import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { usdToPKR, formatPKR } from "@/lib/currency";
import { getCachedOrder } from "@/lib/orders-cache";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    let order: any = null;

    try {
      // Find by ID or orderNumber in database
      order = await prisma.order.findFirst({
        where: {
          OR: [{ id }, { orderNumber: id }],
        },
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              profile: { select: { firstName: true, lastName: true, phone: true } },
            },
          },
          shippingAddress: true,
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: "asc" }, take: 1 },
                },
              },
              variant: true,
            },
          },
          payments: true,
          shipments: { orderBy: { createdAt: "desc" } },
        },
      });
    } catch (dbErr) {
      console.warn("Database lookup failed, falling back to cache:", dbErr);
    }

    if (!order) {
      const cached = getCachedOrder(id);
      if (cached) {
        return NextResponse.json({ success: true, order: cached });
      }
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    const subtotalUSD = Number(order.subtotal);
    const discountUSD = Number(order.discount);
    const shippingUSD = Number(order.shipping);
    const totalUSD = Number(order.total);

    const subtotalPKR = usdToPKR(subtotalUSD);
    const discountPKR = usdToPKR(discountUSD);
    const shippingPKR = usdToPKR(shippingUSD);
    const totalPKR = usdToPKR(totalUSD);

    // Build timeline stages
    const statuses = ["Confirmed", "Processing", "Packed", "Shipped", "Delivered"];
    const currentStatusIndex = statuses.indexOf(order.status);
    const activeStep = currentStatusIndex >= 0 ? currentStatusIndex : 0;

    const timeline = [
      {
        step: "Order Created",
        status: "Completed",
        date: order.createdAt.toISOString(),
        description: "Allocation registered in Geneva master ledger.",
        isDone: true,
      },
      {
        step: "Atelier Confirmation",
        status: activeStep >= 0 ? "Confirmed" : "Pending",
        description: "Concierge verified payment and allocation authenticity.",
        isDone: activeStep >= 0,
      },
      {
        step: "Processing & Master Inspection",
        status: activeStep >= 1 ? "In Progress" : "Pending",
        description: "Horological calibration and 20x magnification inspection.",
        isDone: activeStep >= 1,
      },
      {
        step: "Packed in Armored Box",
        status: activeStep >= 2 ? "Completed" : "Pending",
        description: "Sealed with tamper-evident security holographic locks.",
        isDone: activeStep >= 2,
      },
      {
        step: "Shipped via Armored Courier",
        status: activeStep >= 3 ? "In Transit" : "Pending",
        description: `Dispatched via Ferrari Secure Armored Logistics (${order.trackingNumber || "Assigned"}).`,
        isDone: activeStep >= 3,
      },
      {
        step: "Delivered & Handed Over",
        status: activeStep >= 4 ? "Delivered" : "Pending",
        description: "Personal white-glove handover at your sanctuary.",
        isDone: activeStep >= 4,
      },
    ];

    // Safe payment info: DO NOT REVEAL SENSITIVE CARD DETAILS!
    const primaryPayment = order.payments[0];
    const safePayment = {
      method: order.paymentMethod || "CASH ON DELIVERY (COD)",
      status: order.paymentStatus,
      amountPKR: formatPKR(totalPKR),
      amountUSD: `$${totalUSD.toLocaleString()} USD`,
      isCOD: order.paymentMethod?.toLowerCase().includes("cod"),
    };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        trackingNumber: order.trackingNumber,
        shippingAddress: order.shippingAddress,
        notes: order.notes,
        customer: order.customer,
        guestEmail: order.guestEmail,
        items: order.items.map((i: any) => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName,
          productSku: i.productSku,
          slug: i.product?.slug || "",
          imageUrl: i.product?.images[0]?.url || "/images/velora-signature-01.jpg",
          quantity: i.quantity,
          unitPriceUSD: Number(i.unitPrice),
          unitPricePKR: usdToPKR(Number(i.unitPrice)),
          totalPriceUSD: Number(i.total),
          totalPricePKR: usdToPKR(Number(i.total)),
          variantTitle: i.variant?.title || null,
          attributes: i.attributes,
        })),
        pricing: {
          subtotalUSD,
          discountUSD,
          shippingUSD,
          totalUSD,
          subtotalPKR,
          discountPKR,
          shippingPKR,
          totalPKR,
          formattedTotalPKR: formatPKR(totalPKR),
          formattedSubtotalPKR: formatPKR(subtotalPKR),
          formattedDiscountPKR: formatPKR(discountPKR),
          formattedShippingPKR: shippingPKR > 0 ? formatPKR(shippingPKR) : "Complimentary",
        },
        payment: safePayment,
        timeline,
        shipment: order.shipments[0] || null,
      },
    });
  } catch (err: any) {
    console.error("Order details fetch error:", err);
    const cached = getCachedOrder(id);
    if (cached) {
      return NextResponse.json({ success: true, order: cached });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch order." }, { status: 500 });
  }
}
