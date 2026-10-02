"use client";

import React, { useState, useEffect } from "react";
import { ProductItem, ProductVariantItem } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { Check } from "lucide-react";

interface StickyAddToCartProps {
  product: ProductItem;
  selectedVariant?: ProductVariantItem | null;
}

export function StickyAddToCart({ product, selectedVariant }: StickyAddToCartProps) {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 480px
      setIsVisible(window.scrollY > 480);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const effectivePrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price);

  const availableStock = selectedVariant
    ? selectedVariant.stock
    : product.inventory?.quantity ?? 0;

  const isOutOfStock = availableStock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/images/velora-signature-01.jpg";

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] animate-slide-up">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Product Thumbnail & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-14 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h5 className="font-serif-luxury text-xs text-sand-50 truncate leading-snug">
              {product.name}
            </h5>
            <div className="text-xs font-mono font-medium text-gold-300">
              ${effectivePrice.toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`h-11 px-5 text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all shrink-0 cursor-pointer ${
            isOutOfStock
              ? "bg-neutral-800 text-neutral-400 cursor-not-allowed border border-white/10"
              : isAdded
              ? "bg-gold-300 text-obsidian shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "bg-gold-500 hover:bg-gold-400 text-obsidian shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
          }`}
        >
          {isOutOfStock ? (
            "Sold Out"
          ) : isAdded ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Reserved</span>
            </span>
          ) : (
            "Add to Bag"
          )}
        </button>
      </div>
    </div>
  );
}
