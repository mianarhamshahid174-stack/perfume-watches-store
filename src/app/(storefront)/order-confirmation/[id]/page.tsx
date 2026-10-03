"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  Copy,
  Check,
  Building,
  Banknote,
  CreditCard,
  MapPin,
  Calendar,
  ExternalLink,
  Printer,
  ArrowRight,
} from "lucide-react";

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  createdAt: string;
  trackingNumber: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    imageUrl: string;
    quantity: number;
    unitPriceUSD: number;
    unitPricePKR: number;
    totalPriceUSD: number;
    totalPricePKR: number;
    variantTitle?: string;
  }>;
  pricing: {
    formattedTotalPKR: string;
    formattedSubtotalPKR: string;
    formattedDiscountPKR: string;
    formattedShippingPKR: string;
    totalUSD: number;
  };
  payment: {
    method: string;
    status: string;
    amountPKR: string;
    amountUSD: string;
    isCOD: boolean;
  };
  timeline: Array<{
    step: string;
    status: string;
    date?: string;
    description: string;
    isDone: boolean;
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Order not found.");
        }
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order allocation.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const copyToClipboard = (text: string, type: "number" | "tracking") => {
    navigator.clipboard.writeText(text);
    if (type === "number") {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } else {
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-sand-100 pt-36 pb-24 flex items-center justify-center transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-300">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-obsidian text-sand-100 pt-36 pb-24 transition-colors duration-300">
        <Container size="narrow">
          <div className="p-8 bg-neutral-950 border border-white/10 text-center space-y-4">
            <h1 className="font-serif-luxury text-2xl text-sand-50">Order Notice</h1>
            <p className="text-xs text-neutral-400">{error || "Order record could not be found."}</p>
            <div className="pt-4">
              <Link
                href="/watches"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider inline-block"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pt-28 pb-24 selection:bg-gold-500/20 selection:text-gold-200 transition-colors duration-300">
      <Container size="wide">
        {/* Top Hero Confirmation Banner */}
        <div className="bg-neutral-950 border border-gold-500/30 p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-950/40 border border-gold-500/30 rounded-full text-gold-300 text-[10px] font-mono uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Order Confirmed</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-sand-50">
                Thank You for Your Order
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed">
                Your order has been successfully placed. We have begun preparing your items for delivery across Pakistan.
              </p>
            </div>

            {/* Order Number Badge */}
            <div className="p-5 bg-neutral-900/90 border border-white/10 shrink-0 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
                Order Number
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl sm:text-2xl text-gold-300 font-semibold tracking-wider">
                  {order.orderNumber}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.orderNumber, "number")}
                  className="p-1.5 text-neutral-400 hover:text-gold-300 transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 6-Stage COD Order Timeline */}
        <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 mb-10 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block">
                Order Timeline
              </span>
              <h2 className="font-serif-luxury text-xl text-sand-50">
                Delivery Status (Pakistan)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-gold-500/10 text-gold-300 border border-gold-500/20 rounded-sm">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline Visual */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {order.timeline.map((step, idx) => {
              return (
                <div
                  key={idx}
                  className={`p-4 border transition-all ${
                    step.isDone
                      ? "bg-gold-950/20 border-gold-500/40"
                      : "bg-neutral-900/40 border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gold-400">
                      0{idx + 1}
                    </span>
                    {step.isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                  </div>
                  <h4 className="font-serif-luxury text-sm text-sand-50 mb-1 leading-snug">
                    {step.step}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Content: Order Items & Delivery / Safe Payment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Reserved Creations & Price Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6 rounded-sm">
              <h3 className="font-serif-luxury text-xl text-sand-50 border-b border-white/10 pb-4">
                Order Items ({order.items.length})
              </h3>

              <div className="divide-y divide-white/10">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 text-xs items-center">
                    <div className="w-20 h-24 bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gold-400">
                        REF. {item.productSku}
                      </span>
                      <h4 className="font-serif-luxury text-base text-sand-100 truncate">
                        {item.productName}
                      </h4>
                      {item.variantTitle && (
                        <p className="text-[11px] text-neutral-400 truncate">
                          {item.variantTitle}
                        </p>
                      )}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-neutral-400 font-mono text-[11px]">
                          Qty: {item.quantity}
                        </span>
                        <div className="text-right">
                          <span className="font-mono text-gold-300 font-medium">
                            ₨ {item.totalPricePKR.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs font-sans">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-sand-100">
                    {order.pricing.formattedSubtotalPKR}
                  </span>
                </div>

                {order.pricing.formattedDiscountPKR && (
                  <div className="flex justify-between items-center text-gold-400">
                    <span>Discount</span>
                    <span className="font-mono">
                      -{order.pricing.formattedDiscountPKR}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-neutral-400">
                  <span>Shipping (Pakistan)</span>
                  <span className="font-mono text-emerald-400">
                    {order.pricing.formattedShippingPKR}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                  <div>
                    <span className="font-serif-luxury text-base text-sand-50 block">
                      Total
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Settlement in Pakistani Rupees (PKR)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl sm:text-2xl text-gold-300 font-semibold">
                      {order.pricing.formattedTotalPKR}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Seal */}
            <div className="p-5 bg-neutral-950/60 border border-white/5 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-serif-luxury text-sand-100 text-sm block">
                  100% Authentic & 7-Day Checking Warranty
                </span>
                <p className="text-neutral-400 font-light leading-relaxed">
                  Your piece includes our luxury presentation box, inspection guarantee, and 7-day checking warranty covering movement and manufacturing defects.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery, Tracking & Safe Payment Notice */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Destination */}
            <div className="bg-neutral-950 border border-white/10 p-6 space-y-4 rounded-sm">
              <div className="flex items-center gap-2 text-gold-400 border-b border-white/10 pb-3">
                <MapPin className="w-4 h-4" />
                <h3 className="font-serif-luxury text-base text-sand-50">
                  Shipping Address
                </h3>
              </div>

              <div className="text-xs space-y-1 text-neutral-300 font-sans">
                <div className="text-sand-50 font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </div>
                <div>{order.shippingAddress.street1}</div>
                {order.shippingAddress.street2 && <div>{order.shippingAddress.street2}</div>}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                {order.shippingAddress.phone && (
                  <div className="text-neutral-400 pt-1 font-mono">
                    Tel: {order.shippingAddress.phone}
                  </div>
                )}
              </div>

              {/* Courier Tracking */}
              <div className="pt-3 border-t border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Tracking Number
                </span>
                <div className="flex items-center justify-between p-2.5 bg-neutral-900 border border-white/10 rounded-sm">
                  <div className="font-mono text-xs text-gold-300 font-semibold truncate mr-2">
                    {order.trackingNumber}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.trackingNumber, "tracking")}
                    className="text-neutral-400 hover:text-gold-300 p-1 cursor-pointer shrink-0"
                    title="Copy Tracking"
                  >
                    {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono block">
                  Carrier: Express Courier Logistics (Pakistan)
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-neutral-950 border border-white/10 p-6 space-y-4 rounded-sm">
              <div className="flex items-center gap-2 text-gold-400 border-b border-white/10 pb-3">
                <Banknote className="w-4 h-4" />
                <h3 className="font-serif-luxury text-base text-sand-50">
                  Payment Details
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Method:</span>
                  <span className="text-sand-100 font-medium uppercase font-mono">
                    {order.payment.method}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Payment Status:</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/20 rounded-full">
                    {order.payment.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Total Amount:</span>
                  <span className="font-mono text-gold-300 font-medium text-sm">
                    {order.payment.amountPKR}
                  </span>
                </div>

                {order.payment.isCOD && (
                  <div className="p-3 bg-gold-950/20 border border-gold-500/20 rounded-sm text-[11px] text-neutral-300 leading-relaxed">
                    <span className="text-gold-300 font-semibold block mb-0.5">
                      Cash on Delivery Notice:
                    </span>
                    Please keep <strong>{order.payment.amountPKR}</strong> ready upon delivery. You can inspect the parcel before paying the courier.
                  </div>
                )}

                {/* Privacy Guarantee */}
                <div className="text-[10px] text-neutral-500 border-t border-white/5 pt-2">
                  Privacy Notice: No sensitive card credentials or banking secrets are stored or rendered in client sessions.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href="/account"
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-sand-50 border border-white/20 text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <span>View Order in Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/watches"
                className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
