"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { ProductItem, ProductVariantItem } from "@/types/product";
import { useCart } from "@/context/cart-context";

interface ProductInfoProps {
  product: ProductItem;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  // State for selected variant
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Effective price and stock from selected variant or product
  const effectivePrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price);

  const availableStock = selectedVariant
    ? selectedVariant.stock
    : product.inventory?.quantity ?? 0;

  const isOutOfStock = availableStock <= 0;

  // Quantity state (capped by available stock, min 1)
  const [quantity, setQuantity] = useState(1);

  // Update quantity if stock changes
  useEffect(() => {
    if (quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    }
  }, [availableStock, quantity]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("velora_wishlist");
      if (stored) {
        const list = JSON.parse(stored);
        setIsWishlisted(list.includes(product.id));
      }
    } catch (e) {}
  }, [product.id]);

  const toggleWishlist = () => {
    try {
      const stored = localStorage.getItem("velora_wishlist");
      let list = stored ? JSON.parse(stored) : [];
      if (list.includes(product.id)) {
        list = list.filter((id: string) => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem("velora_wishlist", JSON.stringify(list));
    } catch (e) {}
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  const primaryCollection = product.collections?.[0]?.collection;

  return (
    <div className="w-full flex flex-col space-y-7">
      {/* 1. COLLECTION EYEBROW & SKU */}
      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
        {primaryCollection ? (
          <Link
            href={`/collections/${primaryCollection.slug}`}
            className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 transition-colors"
          >
            Collection {primaryCollection.name}
          </Link>
        ) : (
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-gold-400">
            VELORA Ateliers Geneva
          </span>
        )}
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          REF. {selectedVariant ? selectedVariant.sku : product.sku}
        </span>
      </div>

      {/* 2. PRODUCT NAME & SHORT DESCRIPTION */}
      <div className="space-y-3">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-sand-50 tracking-tight leading-tight">
          {product.name}
        </h1>
        <p className="text-sm sm:text-base text-platinum-300 font-light leading-relaxed">
          {product.shortDescription}
        </p>
      </div>

      {/* 3. PRICE & AVAILABILITY STATUS */}
      <div className="flex flex-wrap items-baseline gap-4 py-2 border-y border-white/10">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-mono font-medium text-gold-300">
            ${effectivePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-sans uppercase tracking-wider text-neutral-400">
            USD
          </span>

          {product.compareAtPrice && Number(product.compareAtPrice) > effectivePrice && (
            <span className="text-sm font-mono line-through text-neutral-500">
              ${Number(product.compareAtPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Dynamic Stock Indicator */}
        <div className="ml-auto flex items-center gap-2">
          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/30 text-red-300 rounded-sm text-[11px] font-sans uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Allocation Exhausted / Sold Out</span>
            </div>
          ) : availableStock <= 3 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-sm text-[11px] font-sans uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Vault Reservation: Only {availableStock} Remaining</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-sm text-[11px] font-sans uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Numbered Allocation: {availableStock} Available</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. VARIANTS SELECTION (If applicable) */}
      {variants.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-platinum-300 uppercase tracking-widest text-[11px]">
              Configuration & Straps
            </span>
            <span className="text-gold-400 font-mono text-[11px]">
              {selectedVariant ? selectedVariant.title : "Default"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isVarOutOfStock = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? "border-gold-400 bg-gold-950/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                      : "border-white/10 hover:border-white/30 bg-neutral-900/40"
                  } ${isVarOutOfStock ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-medium text-sand-100 line-clamp-1">
                      {variant.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 ml-1" />}
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                    <span>${Number(variant.price).toLocaleString()}</span>
                    <span>{isVarOutOfStock ? "Unavailable" : `${variant.stock} available`}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. QUANTITY SELECTOR & CALL-TO-ACTION BUTTONS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          {!isOutOfStock && (
            <div className="flex items-center border border-white/15 bg-neutral-900 h-13 px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-full flex items-center justify-center text-sand-100 hover:text-gold-300 disabled:opacity-30 cursor-pointer text-lg font-mono transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-sm text-sand-50 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                disabled={quantity >= availableStock}
                className="w-8 h-full flex items-center justify-center text-sand-100 hover:text-gold-300 disabled:opacity-30 cursor-pointer text-lg font-mono transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}

          {/* Add to Cart CTA */}
          {!isOutOfStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-13 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_25px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.4)] active:scale-[0.99]"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-obsidian stroke-[2.5]" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsInquiryOpen(true)}
              className="flex-1 h-13 bg-neutral-800 hover:bg-neutral-700 text-sand-100 font-medium text-xs font-sans uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <MessageSquare className="w-4 h-4 text-gold-400" />
              <span>Notify When Available</span>
            </button>
          )}

          {/* Wishlist Toggle Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`w-13 h-13 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isWishlisted
                ? "border-gold-400 bg-gold-950/20 text-gold-400"
                : "border-white/15 hover:border-gold-400/50 text-neutral-400 hover:text-gold-300 bg-neutral-900/60"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-gold-400" : ""}`} />
          </button>
        </div>

        {/* Buy Now Instant Action */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full h-12 border border-white/20 hover:border-gold-400/80 bg-neutral-950 hover:bg-white/5 text-sand-100 text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* 6. CONCIERGE WAITLIST MODAL FOR OUT-OF-STOCK PIECES */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/20 p-6 sm:p-8 max-w-md w-full space-y-5 relative">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                Product Waitlist
              </span>
              <h3 className="font-serif-luxury text-2xl text-sand-50">
                Notify Me: {product.name}
              </h3>
              <p className="text-xs text-platinum-300 font-light leading-relaxed">
                This item is currently out of stock. Enter your email address to receive an email notification as soon as it becomes available.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you. We will notify you when this item is back in stock.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inquiryEmail) setInquirySent(true);
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full h-11 bg-neutral-900 border border-white/15 px-3 text-xs text-sand-100 placeholder:text-neutral-500 focus:outline-none focus:border-gold-400"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Notify Me
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsInquiryOpen(false);
                      setInquirySent(false);
                    }}
                    className="px-4 h-11 border border-white/10 text-xs text-neutral-400 hover:text-sand-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. ATELIER TRUST HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-neutral-400">
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h6 className="text-[11px] font-sans font-medium text-sand-100 uppercase tracking-wider">
              Free Insured Delivery
            </h6>
            <p className="text-[10px] text-neutral-400 leading-tight">
              Dispatched with signature and full tracking.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h6 className="text-[11px] font-sans font-medium text-sand-100 uppercase tracking-wider">
              5-Year Warranty
            </h6>
            <p className="text-[10px] text-neutral-400 leading-tight">
              Covers all mechanical and craftsmanship defects.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h6 className="text-[11px] font-sans font-medium text-sand-100 uppercase tracking-wider">
              30-Day Returns
            </h6>
            <p className="text-[10px] text-neutral-400 leading-tight">
              Complimentary returns in original packaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
