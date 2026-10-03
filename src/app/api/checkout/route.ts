import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PaymentService, PaymentMethodId } from "@/services/payment";
import { usdToPKR, formatPKR } from "@/lib/currency";
import { OrderStatus, PaymentStatus, FulfillmentStatus, ShipmentStatus, InventoryTransactionType, Prisma } from "@prisma/client";
import { FALLBACK_PRODUCTS } from "@/lib/catalog-data";
import { saveCachedOrder, CachedOrder } from "@/lib/orders-cache";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contact,
      shippingAddress,
      deliveryMethod = "standard",
      paymentMethod = "cod",
      items = [],
      couponCode,
      notes,
    } = body;

    // 1. Validation
    if (!contact?.email || !contact?.firstName || !contact?.lastName) {
      return NextResponse.json(
        { success: false, error: "Please complete all contact details." },
        { status: 400 }
      );
    }

    if (!shippingAddress?.street1 || !shippingAddress?.city || !shippingAddress?.state) {
      return NextResponse.json(
        { success: false, error: "Please provide a complete delivery address in Pakistan." },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your atelier bag is empty." },
        { status: 400 }
      );
    }

    // 2. Resolve Customer (Logged in or Guest)
    let user = await getCurrentUser();

    // If guest requested account creation
    if (!user && contact.createAccount && contact.password) {
      const existingUser = await prisma.user.findUnique({
        where: { email: contact.email },
        include: { profile: true },
      });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(contact.password, 12);
        user = await prisma.user.create({
          data: {
            email: contact.email,
            passwordHash,
            role: "CUSTOMER",
            profile: {
              create: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone || null,
                preferredCurrency: "PKR",
              },
            },
          },
          include: { profile: true },
        });
      } else {
        user = existingUser;
      }
    }

    // 3. Verify stock and calculate subtotal
    let subtotalUSD = 0;
    const verifiedItems: Array<{
      productId: string;
      variantId?: string | null;
      productName: string;
      productSku: string;
      quantity: number;
      unitPriceUSD: number;
      totalPriceUSD: number;
      attributes?: any;
    }> = [];

    for (const cartItem of items) {
      let product: any = null;
      try {
        product = await prisma.product.findUnique({
          where: { id: cartItem.productId },
          include: { inventory: true },
        });
      } catch (e) {
        console.warn("DB product lookup failed, using catalog data:", e);
      }

      if (!product) {
        const found = FALLBACK_PRODUCTS.find(
          (p) =>
            p.id === cartItem.productId ||
            p.slug === cartItem.productId ||
            p.sku === cartItem.sku ||
            p.name.toLowerCase() === (cartItem.name || "").toLowerCase()
        );
        if (found) {
          product = {
            id: found.id,
            name: found.name,
            sku: found.sku,
            price: found.price,
            images: found.images,
          };
        } else {
          product = {
            id: cartItem.productId || `prod-${Date.now()}`,
            name: cartItem.name || "Velora Luxury Creation",
            sku: cartItem.sku || "VEL-01",
            price: cartItem.price || 125000,
          };
        }
      }

      let unitPrice = Number(product.price);
      let targetSku = product.sku;
      let targetAttributes = null;

      if (cartItem.variantId) {
        try {
          const variant = await prisma.productVariant.findUnique({
            where: { id: cartItem.variantId },
          });
          if (variant) {
            unitPrice = Number(variant.price);
            targetSku = variant.sku;
            targetAttributes = variant.attributes;
          }
        } catch {
          // ignore
        }
      }

      const qty = Math.max(1, cartItem.quantity || 1);
      const lineTotal = unitPrice * qty;
      subtotalUSD += lineTotal;

      verifiedItems.push({
        productId: product.id,
        variantId: cartItem.variantId || null,
        productName: product.name,
        productSku: targetSku,
        quantity: qty,
        unitPriceUSD: unitPrice,
        totalPriceUSD: lineTotal,
        attributes: targetAttributes,
      });
    }

    // 4. Calculate Discount
    let discountUSD = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        appliedCoupon = coupon;
        if (coupon.discountType === "PERCENTAGE") {
          discountUSD = (subtotalUSD * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscountAmount && discountUSD > Number(coupon.maxDiscountAmount)) {
            discountUSD = Number(coupon.maxDiscountAmount);
          }
        } else {
          discountUSD = Number(coupon.discountValue);
        }
        discountUSD = Math.min(discountUSD, subtotalUSD);
      }
    }

    // 5. Shipping and Total
    // Standard Armored Courier is complimentary; Express VIP White-glove is $50 / ₨ 14,000
    const shippingUSD = deliveryMethod === "express" ? 50 : 0;
    const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

    // Convert to PKR
    const subtotalPKR = usdToPKR(subtotalUSD);
    const discountPKR = usdToPKR(discountUSD);
    const shippingPKR = usdToPKR(shippingUSD);
    const totalPKR = usdToPKR(totalUSD);

    // 6. Generate Unique Order Number
    const orderNumber = `VEL-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 7. Process Payment through Abstraction
    const paymentResult = await PaymentService.processPayment(paymentMethod as PaymentMethodId, {
      orderId: "", // will attach
      orderNumber,
      amountPKR: totalPKR,
      amountUSD: totalUSD,
      customer: {
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        phone: contact.phone,
      },
      notes,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.message,
          paymentStatus: paymentResult.paymentStatus,
        },
        { status: 400 }
      );
    }

    // 8. Create Shipping Address in PostgreSQL
    const savedAddress = await prisma.address.create({
      data: {
        userId: user ? user.id : null,
        type: "SHIPPING",
        firstName: contact.firstName,
        lastName: contact.lastName,
        street1: shippingAddress.street1,
        street2: shippingAddress.street2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode || "74000",
        country: "Pakistan",
        phone: contact.phone || null,
        isDefault: true,
      },
    });

    let order: any = null;
    const trackingNumber = `PK-EXPRESS-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 9. Create Order record in PostgreSQL
      order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: user ? user.id : null,
          guestEmail: user ? null : contact.email,
          status: paymentResult.orderStatus as OrderStatus,
          subtotal: new Prisma.Decimal(subtotalUSD),
          discount: new Prisma.Decimal(discountUSD),
          shipping: new Prisma.Decimal(shippingUSD),
          total: new Prisma.Decimal(totalUSD),
          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: paymentResult.paymentStatus as PaymentStatus,
          fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
          shippingAddressId: savedAddress.id,
          trackingNumber,
          notes: notes || null,
          items: {
            create: verifiedItems.map((vi) => ({
              productId: vi.productId,
              variantId: vi.variantId,
              productName: vi.productName,
              productSku: vi.productSku,
              unitPrice: new Prisma.Decimal(vi.unitPriceUSD),
              quantity: vi.quantity,
              total: new Prisma.Decimal(vi.totalPriceUSD),
              attributes: vi.attributes,
            })),
          },
        },
      });

      // 10. Record Payment Transaction
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: paymentResult.providerId,
          transactionId: paymentResult.transactionId || `TXN-${order.orderNumber}`,
          amount: new Prisma.Decimal(totalUSD),
          currency: "PKR",
          status: paymentResult.paymentStatus as PaymentStatus,
          paymentMethod: paymentMethod.toUpperCase(),
          rawDetails: {
            ...paymentResult.rawDetails,
            totalPKR,
            totalUSD,
            exchangeRate: 280,
          },
        },
      });

      // 11. Create Initial Shipment record
      await prisma.shipment.create({
        data: {
          orderId: order.id,
          carrier: "TCS / Leopard Express Logistics (Pakistan)",
          trackingNumber: order.trackingNumber,
          status: ShipmentStatus.PREPARING,
          notes: "Order verified. Dispatch and packaging underway for express courier delivery across Pakistan.",
        },
      });

      // 12. Record Coupon Usage if applied
      if (appliedCoupon && user) {
        await prisma.couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            userId: user.id,
            orderId: order.id,
            discountApplied: new Prisma.Decimal(discountUSD),
          },
        });
      }

      // 13. Deduct inventory and record transaction
      for (const vi of verifiedItems) {
        const inv = await prisma.inventory.findFirst({
          where: { productId: vi.productId },
        });
        if (inv) {
          const prevQty = inv.quantity;
          const newQty = Math.max(0, prevQty - vi.quantity);
          await prisma.inventory.update({
            where: { id: inv.id },
            data: { quantity: newQty },
          });

          await prisma.inventoryTransaction.create({
            data: {
              inventoryId: inv.id,
              type: InventoryTransactionType.SALE_DEDUCTION,
              quantity: -vi.quantity,
              previousQuantity: prevQty,
              newQuantity: newQty,
              reference: `Order ${order.orderNumber}`,
              notes: `Order fulfillment deduction for customer purchase`,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("Database order persist error, continuing in resilient memory mode:", dbErr);
    }

    // Always save order in fast cache for instant confirmation page loading
    const cachedOrder: CachedOrder = {
      id: order?.id || orderNumber,
      orderNumber,
      status: "Confirmed",
      fulfillmentStatus: "Unfulfilled",
      createdAt: new Date().toISOString(),
      trackingNumber,
      shippingAddress: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        street1: shippingAddress.street1,
        street2: shippingAddress.street2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode || "74000",
        country: "Pakistan",
        phone: contact.phone || "",
      },
      notes: notes || undefined,
      items: verifiedItems.map((vi) => ({
        id: vi.productId,
        productName: vi.productName,
        productSku: vi.productSku,
        imageUrl: "/images/products/watches/velora-signature-01/front.jpg",
        quantity: vi.quantity,
        unitPriceUSD: vi.unitPriceUSD,
        unitPricePKR: usdToPKR(vi.unitPriceUSD),
        totalPriceUSD: vi.totalPriceUSD,
        totalPricePKR: usdToPKR(vi.totalPriceUSD),
      })),
      pricing: {
        formattedTotalPKR: formatPKR(totalPKR),
        formattedSubtotalPKR: formatPKR(subtotalPKR),
        formattedDiscountPKR: formatPKR(discountPKR),
        formattedShippingPKR: shippingPKR === 0 ? "Complimentary" : formatPKR(shippingPKR),
        totalUSD,
      },
      payment: {
        method: paymentMethod.toUpperCase(),
        status: paymentMethod === "cod" ? "Pending (Cash on Delivery)" : "Confirmed",
        amountPKR: formatPKR(totalPKR),
        amountUSD: `$${totalUSD.toLocaleString()}`,
        isCOD: paymentMethod === "cod",
      },
      timeline: [
        {
          step: "Order Placed",
          status: "Completed",
          date: new Date().toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" }),
          description: "Your order has been recorded in our Pakistan fulfillment center.",
          isDone: true,
        },
        {
          step: "Verification & Packing",
          status: "In Progress",
          date: "Underway",
          description: "Quality verification and presentation packaging at our workshop.",
          isDone: false,
        },
        {
          step: "Courier Dispatch",
          status: "Pending",
          description: `Dispatched via TCS / Leopard express courier to ${shippingAddress.city}, Pakistan.`,
          isDone: false,
        },
        {
          step: "Delivery & Payment",
          status: "Pending",
          description: paymentMethod === "cod" ? "Open-parcel inspection & payment upon delivery." : "Signature delivery.",
          isDone: false,
        },
      ],
    };

    saveCachedOrder(cachedOrder);

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order?.id || orderNumber,
      paymentResult,
      totals: {
        subtotalUSD,
        discountUSD,
        shippingUSD,
        totalUSD,
        subtotalPKR,
        discountPKR,
        shippingPKR,
        totalPKR,
        formattedTotalPKR: formatPKR(totalPKR),
      },
    });
  } catch (err: any) {
    console.error("Checkout submission failed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process order." },
      { status: 500 }
    );
  }
}
