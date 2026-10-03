"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  Banknote,
  RotateCcw,
} from "lucide-react";

interface TrackedOrder {
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
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    imageUrl?: string;
    quantity: number;
    unitPricePKR: number;
    totalPricePKR: number;
  }>;
  pricing: {
    formattedTotalPKR: string;
    formattedShippingPKR: string;
  };
  payment: {
    method: string;
    status: string;
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

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Load recent orders from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("velora_recent_orders") || "[]");
      if (Array.isArray(stored)) {
        setRecentOrders(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleTrack = async (e?: React.FormEvent, customNumber?: string) => {
    if (e) e.preventDefault();
    const query = (customNumber || orderQuery).trim().toUpperCase();

    if (!query) {
      setError("Please enter your order reference number (e.g. VEL-PK-2026-1234).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        throw new Error(
          data.error ||
            "Order not found. Please verify your order reference number or contact our WhatsApp concierge."
        );
      }

      setTrackedOrder(data.order);
      setOrderQuery(query);
    } catch (err: any) {
      setError(err.message || "Unable to retrieve tracking details.");
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-foreground pt-28 pb-24 transition-colors duration-300">
      <Container size="wide">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-[11px] font-mono uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Pakistan Express Courier Tracking</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-light text-foreground tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-neutral-stone font-light leading-relaxed">
            Enter your order reference number to check live dispatch progress, TCS / Leopard courier tracking, and delivery schedules across Pakistan.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="max-w-2xl mx-auto bg-card border border-border p-6 sm:p-8 shadow-sm space-y-6 mb-12">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-stone mb-2">
                Order Reference Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. VEL-PK-2026-8942"
                  value={orderQuery}
                  onChange={(e) => {
                    setOrderQuery(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-12 bg-background border border-border px-4 text-sm font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-gold-500 uppercase tracking-wider"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 rounded-none flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Quick Info Badges */}
          <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-background border border-border/60">
              <span className="text-[10px] font-mono uppercase text-neutral-stone block">Courier Partners</span>
              <span className="text-xs font-semibold text-foreground">TCS • Leopard • Trax</span>
            </div>
            <div className="p-2.5 bg-background border border-border/60">
              <span className="text-[10px] font-mono uppercase text-neutral-stone block">Delivery Time</span>
              <span className="text-xs font-semibold text-foreground">2 – 4 Working Days</span>
            </div>
            <div className="p-2.5 bg-background border border-border/60">
              <span className="text-[10px] font-mono uppercase text-neutral-stone block">Verification</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Open-Parcel Allowed</span>
            </div>
          </div>
        </div>

        {/* Live Order Details Card if loaded */}
        {trackedOrder && (
          <div className="max-w-4xl mx-auto bg-card border border-border p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in-50 duration-300 mb-12">
            {/* Order Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gold-600 dark:text-gold-400">
                    {trackedOrder.orderNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider">
                    {trackedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-stone">
                  Placed on {new Date(trackedOrder.createdAt).toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-stone block">
                  Courier Tracking #
                </span>
                <span className="font-mono text-xs font-bold text-foreground block">
                  {trackedOrder.trackingNumber}
                </span>
              </div>
            </div>

            {/* Shipment Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-lg text-foreground font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>Delivery Progress</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {trackedOrder.timeline?.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        step.isDone
                          ? "bg-gold-500 border-gold-500 text-black"
                          : "bg-background border-border text-neutral-400"
                      }`}
                    >
                      {step.isDone ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{step.step}</span>
                        {step.date && (
                          <span className="text-[10px] font-mono text-neutral-stone">({step.date})</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-stone font-light">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              {/* Destination */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-stone block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  <span>Delivery Destination</span>
                </span>
                <p className="text-xs text-foreground font-medium">
                  {trackedOrder.shippingAddress.firstName} {trackedOrder.shippingAddress.lastName}
                </p>
                <p className="text-xs text-neutral-stone font-light leading-relaxed">
                  {trackedOrder.shippingAddress.street1}
                  {trackedOrder.shippingAddress.street2 && `, ${trackedOrder.shippingAddress.street2}`}
                  <br />
                  {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} {trackedOrder.shippingAddress.postalCode}
                  <br />
                  {trackedOrder.shippingAddress.phone && `Contact: ${trackedOrder.shippingAddress.phone}`}
                </p>
              </div>

              {/* Payment & Total */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-stone block flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-gold-500" />
                  <span>Payment & Total</span>
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-stone">Payment Method:</span>
                    <span className="font-semibold text-foreground uppercase">{trackedOrder.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-stone">Shipping:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {trackedOrder.pricing.formattedShippingPKR}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border font-bold">
                    <span className="text-foreground">Total Amount:</span>
                    <span className="text-gold-600 dark:text-gold-400 font-mono text-sm">
                      {trackedOrder.pricing.formattedTotalPKR}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <Link
                href={`/order-confirmation/${trackedOrder.orderNumber}`}
                className="text-xs font-mono uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:underline inline-flex items-center gap-1.5"
              >
                <span>View Full Invoice & Receipt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`https://wa.me/923001234567?text=Hi%20Velora%2C%20I%20am%20inquiring%20about%20my%20order%20${trackedOrder.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                <span>WhatsApp Concierge for this Order</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Recent Orders List from this device */}
        {recentOrders.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg text-foreground font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>Recent Orders Placed on this Device</span>
              </h3>
              <span className="text-xs font-mono text-neutral-stone">{recentOrders.length} Orders</span>
            </div>

            <div className="space-y-2.5">
              {recentOrders.map((ord: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleTrack(undefined, ord.orderNumber)}
                  className="p-4 bg-card hover:bg-surface-hover border border-border transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-400 group-hover:underline block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-neutral-stone block">
                      {new Date(ord.createdAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })} • {ord.paymentMethod || "COD"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      Rs. {Number(ord.totalPKR || 0).toLocaleString()}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-gold-600 dark:text-gold-400 group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help & Support Banner */}
        <div className="max-w-2xl mx-auto bg-card border border-border p-6 text-center space-y-3">
          <h4 className="font-serif-luxury text-lg text-foreground">Need Urgent Assistance with Your Delivery?</h4>
          <p className="text-xs text-neutral-stone font-light max-w-lg mx-auto leading-relaxed">
            Our Pakistan client care team is available Monday to Saturday, 10:00 AM – 8:00 PM PKT. Reach out anytime via WhatsApp or phone.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono uppercase tracking-wider">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1.5"
            >
              <span>WhatsApp: +92 300 1234567</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-neutral-stone hidden sm:inline">•</span>
            <a href="tel:+924235789000" className="text-neutral-stone hover:text-foreground">
              Phone: +92 (42) 3578-9000
            </a>
            <span className="text-neutral-stone hidden sm:inline">•</span>
            <Link href="/faq" className="text-gold-600 dark:text-gold-400 hover:underline">
              Delivery FAQs
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
