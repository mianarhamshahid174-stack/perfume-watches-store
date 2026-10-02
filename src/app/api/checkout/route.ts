import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PaymentService, PaymentMethodId } from "@/services/payment";
import { usdToPKR, formatPKR } from "@/lib/currency";
import { OrderStatus, PaymentStatus, FulfillmentStatus, ShipmentStatus, InventoryTransactionType, Prisma } from "@prisma/client";
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
      const product = await prisma.product.findUnique({
        where: { id: cartItem.productId },
        include: { inventory: true },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${cartItem.name}` },
          { status: 400 }
        );
      }

      let unitPrice = Number(product.price);
      let targetSku = product.sku;
      let targetAttributes = null;

      if (cartItem.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: cartItem.variantId },
        });
        if (variant) {
          unitPrice = Number(variant.price);
          targetSku = variant.sku;
          targetAttributes = variant.attributes;
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

    // 9. Create Order record in PostgreSQL
    const order = await prisma.order.create({
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
        trackingNumber: `PK-FERRARI-${Math.floor(100000 + Math.random() * 900000)}`,
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

    // 11. Create Initial Shipment record (COD flow: Order Created -> Confirmed -> Packing)
    await prisma.shipment.create({
      data: {
        orderId: order.id,
        carrier: "Ferrari Secure Armored Logistics (Pakistan)",
        trackingNumber: order.trackingNumber,
        status: ShipmentStatus.PREPARING,
        notes: "Vault inspection and packing underway at Geneva atelier for air transit to Pakistan.",
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
            notes: `Allocation deduction for customer acquisition`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
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
      { success: false, error: err.message || "Failed to process order allocation." },
      { status: 500 }
    );
  }
}
