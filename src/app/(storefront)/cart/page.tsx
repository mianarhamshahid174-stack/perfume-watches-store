"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { formatPKR, usdToPKR } from "@/lib/currency";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  X,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addItem: addToWishlist } = useWishlist();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountUSD: number;
    discountPKR: number;
    formattedDiscountPKR: string;
  } | null>(null);

  const subtotalPKR = usdToPKR(subtotal);
  const discountUSD = appliedCoupon ? appliedCoupon.discountUSD : 0;
  const discountPKR = appliedCoupon ? appliedCoupon.discountPKR : 0;
  const shippingPKR = 0; // Complimentary Armored White-Glove Courier across Pakistan
  const shippingUSD = 0;
  const totalUSD = Math.max(0, subtotal - discountUSD + shippingUSD);
  const totalPKR = Math.max(0, subtotalPKR - discountPKR + shippingPKR);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotalUSD: subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid coupon code.");
      }

      setAppliedCoupon(data.coupon);
      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Could not validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleSaveToWishlist = (item: (typeof items)[0]) => {
    addToWishlist({
      productId: item.productId,
      name: item.name,
      slug: item.productId, // standard fallback
      price: item.price,
      imageUrl: item.imageUrl,
      sku: item.sku,
      collectionName: "Atelier Piece",
    });
    removeFromCart(item.id);
  };

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pt-28 pb-20 selection:bg-gold-500/20 selection:text-gold-200 transition-colors duration-300">
      <Container size="wide">
        {/* Editorial Page Header */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400 block mb-2">
                Luxury Watches & Fine Fragrances
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-sand-50 tracking-wide">
                Your Shopping Bag
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-neutral-400">
                {itemCount} {itemCount === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="py-24 text-center border border-white/5 bg-neutral-950/60 rounded-sm p-8 max-w-2xl mx-auto space-y-6">
            <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto stroke-[1.2]" />
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl text-sand-100">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                You have not added any watches or fragrances to your bag yet. Explore our original collections to find your perfect piece.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/watches"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Shop Watches
              </Link>
              <Link
                href="/fragrances"
                className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-gold-400 text-sand-100 text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Shop Fragrances
              </Link>
            </div>
          </div>
        ) : (
          /* Two-Column Grid: Bag Items vs Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="divide-y divide-white/10 border-t border-b border-white/10">
                {items.map((item) => {
                  const itemPricePKR = usdToPKR(item.price);
                  const lineTotalPKR = itemPricePKR * item.quantity;
                  const lineTotalUSD = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="py-6 sm:py-8 flex flex-col sm:flex-row gap-6 items-start group"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-28 h-36 sm:w-36 sm:h-44 bg-neutral-950 border border-white/10 overflow-hidden shrink-0 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 space-y-3 w-full">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-1">
                              REF. {item.sku}
                            </span>
                            <h3 className="font-serif-luxury text-xl sm:text-2xl text-sand-50 font-light">
                              {item.name}
                            </h3>
                            {item.variantTitle && (
                              <p className="text-xs text-neutral-400 mt-0.5">
                                Variant: {item.variantTitle}
                              </p>
                            )}
                          </div>

                          {/* Unit / Line Pricing */}
                          <div className="text-right shrink-0">
                            <div className="font-mono text-lg sm:text-xl text-gold-300 font-medium">
                              {formatPKR(lineTotalPKR)}
                            </div>
                            <div className="text-xs font-mono text-neutral-500">
                              ${lineTotalUSD.toLocaleString()} USD
                            </div>
                          </div>
                        </div>

                        {/* Interactive Row: Quantity & Quick Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-neutral-400">Qty</span>
                            <div className="flex items-center border border-white/15 bg-neutral-900 rounded-sm">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-sand-200 hover:text-gold-300 font-mono text-base transition-colors"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-mono text-xs text-sand-50 select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-sand-200 hover:text-gold-300 font-mono text-base transition-colors"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Actions: Save to Wishlist & Remove */}
                          <div className="flex items-center gap-4 text-xs font-sans">
                            <button
                              type="button"
                              onClick={() => handleSaveToWishlist(item)}
                              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-gold-300 transition-colors"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>Save for Later</span>
                            </button>
                            <span className="text-white/10">|</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions: Clear bag & Continue Shopping */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-neutral-500 hover:text-rose-400 uppercase tracking-wider font-mono transition-colors"
                >
                  Clear Bag
                </button>
                <Link
                  href="/watches"
                  className="text-xs text-neutral-400 hover:text-gold-300 uppercase tracking-widest font-mono transition-colors"
                >
                  + Continue Shopping
                </Link>
              </div>

              {/* Delivery Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="p-4 bg-neutral-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Free Insured Shipping
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    Fast and fully insured delivery across Pakistan including Karachi, Lahore, and Islamabad.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-gold-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      5-Year Warranty
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    Every timepiece arrives with an authentic certificate and a 5-year international warranty.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-gold-400">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      30-Day Returns
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    Hassle-free 30-day returns with free doorstep pickup in original packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6 rounded-sm">
                <h2 className="font-serif-luxury text-xl text-sand-50 border-b border-white/10 pb-4">
                  Order Summary
                </h2>

                {/* Coupon Code Section */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Discount Code
                  </span>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-gold-950/20 border border-gold-500/30 rounded-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gold-400" />
                        <div>
                          <span className="font-mono text-gold-300 font-medium text-xs block">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Discount applied: {appliedCoupon.formattedDiscountPKR}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-neutral-400 hover:text-rose-400 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. VELORA10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 placeholder:text-neutral-600 uppercase tracking-widest focus:outline-none focus:border-gold-400"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 h-10 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-[10px] font-semibold uppercase tracking-wider text-sand-100 border border-white/10 transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-400 font-light">{couponError}</p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-sand-100 text-sm">
                      {formatPKR(subtotalPKR)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-gold-400">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Discount ({appliedCoupon.code})</span>
                      </span>
                      <span className="font-mono">
                        -{appliedCoupon.formattedDiscountPKR}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-gold-400" />
                      <span>Insured Delivery (Pakistan)</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                    <div>
                      <span className="font-serif-luxury text-base text-sand-50 block">
                        Total
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        All taxes included
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl sm:text-2xl text-gold-300 font-medium">
                        {formatPKR(totalPKR, { includeCode: true })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full h-14 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(212,175,55,0.25)]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-400">
                    <Lock className="w-3 h-3 text-gold-400" />
                    <span>Cash on Delivery & Bank Transfer available in Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Customer Support Card */}
              <div className="p-5 bg-neutral-950/40 border border-white/5 space-y-2 text-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 block">
                  Pakistan Customer Care
                </span>
                <p className="text-xs text-neutral-400 font-light">
                  Need help placing your order or have questions about delivery?
                </p>
                <div className="pt-1 font-mono text-xs text-sand-200">
                  concierge@velora.pk | +92 300 1234567
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
