"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import { useCart } from "@/context/cart-context";
import { formatPKR, usdToPKR } from "@/lib/currency";
import {
  ShoppingBag,
  X,
  ArrowRight,
  Tag,
  Check,
  Shield,
  Truck,
  Sparkles,
} from "lucide-react";

export function CartDrawer() {
  const {
    items: cartItems,
    itemCount,
    subtotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

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
  const shippingUSD = 0; // Complimentary Armored Delivery across Pakistan
  const shippingPKR = 0;
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

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      side="right"
      size="md"
      title="Shopping Bag"
      subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      footer={
        <div className="space-y-4 text-xs font-sans">
          {/* Coupon Code Input */}
          <div className="border-t border-b border-white/10 py-3 space-y-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-gold-950/20 border border-gold-500/30 rounded-sm">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-mono text-gold-300 font-medium tracking-wider">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    ({appliedCoupon.formattedDiscountPKR} Privilege)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-neutral-400 hover:text-rose-400 transition-colors p-1"
                  aria-label="Remove coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter privilege / coupon code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full h-9 bg-neutral-900 border border-white/10 pl-8 pr-2 text-[11px] text-sand-100 placeholder:text-neutral-500 uppercase tracking-wider focus:outline-none focus:border-gold-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-3 h-9 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-[10px] uppercase font-semibold tracking-wider text-sand-100 border border-white/10 transition-colors cursor-pointer"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[10px] text-rose-400 font-light">{couponError}</p>
            )}
          </div>

          {/* Pricing Breakdown: Subtotal, Discount, Shipping, Total */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-sand-100">
                {formatPKR(subtotalPKR)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-gold-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Atelier Discount ({appliedCoupon.code})</span>
                </span>
                <span className="font-mono">
                  -{appliedCoupon.formattedDiscountPKR}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-gold-400" />
                <span>Insured Delivery</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">
                Free
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-white/10">
              <span className="text-sand-100">Total</span>
              <div className="text-right">
                <div className="font-mono text-gold-300 text-base">
                  {formatPKR(totalPKR, { includeCode: true })}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 font-normal">
                  Approx. ${totalUSD.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full text-center text-xs text-neutral-400 hover:text-sand-100 py-2 transition-colors uppercase tracking-[0.2em] border border-white/10 hover:border-white/20"
            >
              View Shopping Cart
            </Link>
          </div>
        </div>
      }
    >
      {cartItems.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-neutral-stone/40 mx-auto stroke-[1.2]" />
          <div className="space-y-1">
            <h5 className="font-serif-luxury text-lg text-sand-100">Your Bag is Empty</h5>
            <p className="text-xs text-platinum-400 font-light max-w-xs mx-auto">
              You have no items in your shopping bag. Explore our watch and fragrance collections.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/watches"
              onClick={closeCart}
              className="px-4 py-2 text-[10px] uppercase tracking-editorial border border-white/10 hover:border-gold-500/50 text-sand-200 transition-colors"
            >
              Watches
            </Link>
            <Link
              href="/fragrances"
              onClick={closeCart}
              className="px-4 py-2 text-[10px] uppercase tracking-editorial border border-white/10 hover:border-gold-500/50 text-sand-200 transition-colors"
            >
              Fragrances
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-white/5">
          {cartItems.map((item) => {
            const itemPricePKR = usdToPKR(item.price);
            const lineTotalPKR = itemPricePKR * item.quantity;

            return (
              <div key={item.id} className="pt-3 flex gap-4 text-xs group">
                {/* Image */}
                <div className="w-20 h-24 bg-neutral-950 border border-white/10 shrink-0 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity Manipulation */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-ultra text-gold-400 font-mono truncate">
                      REF. {item.sku}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors p-1 -mr-1 cursor-pointer"
                      aria-label="Remove item"
                      title="Remove from bag"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h5 className="font-serif-luxury text-sm text-sand-50 truncate">
                    {item.name}
                  </h5>

                  {item.variantTitle && (
                    <p className="text-neutral-400 text-[11px] truncate">
                      {item.variantTitle}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    {/* Quantity Selector: Decrease / Value / Increase */}
                    <div className="flex items-center border border-white/10 bg-neutral-900 rounded-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-sand-100 hover:text-gold-300 font-mono text-sm cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-mono text-xs text-sand-50 select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-sand-100 hover:text-gold-300 font-mono text-sm cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price in PKR and USD */}
                    <div className="text-right">
                      <div className="text-gold-300 font-mono font-medium">
                        {formatPKR(lineTotalPKR)}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        ${(item.price * item.quantity).toLocaleString()} USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
