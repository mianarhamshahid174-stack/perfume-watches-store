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
          <div className="border-t border-b border-[var(--border-subtle)] py-3 space-y-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-gold-500/10 border border-gold-500/30 rounded-sm">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-metallic" />
                  <span className="font-mono text-metallic font-medium tracking-wider">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-[10px] text-[var(--color-neutral-stone)]">
                    ({appliedCoupon.formattedDiscountPKR} Privilege)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-[var(--color-neutral-stone)] hover:text-rose-500 transition-colors p-1 cursor-pointer"
                  aria-label="Remove coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[var(--color-neutral-stone)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter privilege / coupon code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full h-9 bg-[var(--surface-hover)] border border-[var(--border-subtle)] pl-8 pr-2 text-[11px] text-[var(--foreground)] placeholder:text-[var(--color-neutral-stone)] uppercase tracking-wider focus:outline-none focus:border-metallic"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-3 h-9 bg-[var(--surface-hover)] hover:bg-[var(--border-subtle)] disabled:opacity-40 text-[10px] uppercase font-semibold tracking-wider text-[var(--foreground)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[10px] text-rose-500 font-light">{couponError}</p>
            )}
          </div>

          {/* Pricing Breakdown: Subtotal, Discount, Shipping, Total */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[var(--color-neutral-stone)]">
              <span>Subtotal</span>
              <span className="font-mono text-[var(--foreground)]">
                {formatPKR(subtotalPKR)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-metallic">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Discount ({appliedCoupon.code})</span>
                </span>
                <span className="font-mono">
                  -{appliedCoupon.formattedDiscountPKR}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-[var(--color-neutral-stone)]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-metallic" />
                <span>Express Delivery (Pakistan)</span>
              </span>
              <span className="text-emerald-500 font-mono text-[11px]">
                Free
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[var(--foreground)]">Total</span>
              <div className="text-right">
                <div className="font-mono text-metallic text-base">
                  {formatPKR(totalPKR, { includeCode: true })}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full h-12 bg-metallic hover:bg-gold-500 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full text-center text-xs text-[var(--color-neutral-stone)] hover:text-[var(--foreground)] py-2 transition-colors uppercase tracking-[0.2em] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
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
            <h5 className="font-serif-luxury text-lg text-[var(--foreground)]">Your Bag is Empty</h5>
            <p className="text-xs text-[var(--color-neutral-stone)] font-light max-w-xs mx-auto">
              You have no items in your shopping bag. Explore our watch and fragrance collections.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/watches"
              onClick={closeCart}
              className="px-4 py-2 text-[10px] uppercase tracking-editorial border border-[var(--border-subtle)] hover:border-gold-500/50 text-[var(--foreground)] transition-colors"
            >
              Watches
            </Link>
            <Link
              href="/fragrances"
              onClick={closeCart}
              className="px-4 py-2 text-[10px] uppercase tracking-editorial border border-[var(--border-subtle)] hover:border-gold-500/50 text-[var(--foreground)] transition-colors"
            >
              Fragrances
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-[var(--border-subtle)]">
          {cartItems.map((item) => {
            const itemPricePKR = usdToPKR(item.price);
            const lineTotalPKR = itemPricePKR * item.quantity;

            return (
              <div key={item.id} className="pt-3 flex gap-4 text-xs group">
                {/* Image */}
                <div className="w-20 h-24 bg-[var(--surface-hover)] border border-[var(--border-subtle)] shrink-0 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity Manipulation */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-ultra text-metallic font-mono truncate">
                      REF. {item.sku}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[var(--color-neutral-stone)] hover:text-rose-500 transition-colors p-1 -mr-1 cursor-pointer"
                      aria-label="Remove item"
                      title="Remove from bag"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h5 className="font-serif-luxury text-sm text-[var(--foreground)] truncate">
                    {item.name}
                  </h5>

                  {item.variantTitle && (
                    <p className="text-[var(--color-neutral-stone)] text-[11px] truncate">
                      {item.variantTitle}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    {/* Quantity Selector: Decrease / Value / Increase */}
                    <div className="flex items-center border border-[var(--border-subtle)] bg-[var(--surface-hover)] rounded-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--foreground)] hover:text-metallic font-mono text-sm cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-mono text-xs text-[var(--foreground)] select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--foreground)] hover:text-metallic font-mono text-sm cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price in PKR */}
                    <div className="text-right">
                       <div className="text-metallic font-mono font-medium">
                        {formatPKR(lineTotalPKR)}
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
