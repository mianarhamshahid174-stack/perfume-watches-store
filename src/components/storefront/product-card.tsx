"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/currency";

export interface ProductCardData {
  id?: string;
  name: string;
  slug: string;
  sku?: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  category?: { name: string; slug?: string } | string | null;
  collections?: Array<{ collection: { name: string; slug: string } }> | null;
  collectionName?: string | null;
  specs?: string | null;
  images?: Array<{ url: string; altText?: string | null; isPrimary?: boolean; sortOrder?: number }>;
  imageUrl?: string;
  secondaryImageUrl?: string;
  featured?: boolean;
  inventory?: { quantity: number; reserved?: number } | null;
}

export interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  priority?: boolean;
  onQuickView?: (product: ProductCardData) => void;
  onAddToBag?: (product: ProductCardData) => void;
}

export function ProductCard({
  product,
  className = "",
  priority = false,
  onQuickView,
  onAddToBag,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Load wishlist state from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined" && product.id) {
      try {
        const saved = localStorage.getItem("velora_wishlist");
        if (saved) {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids) && ids.includes(product.id)) {
            setIsWishlisted(true);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    if (typeof window !== "undefined" && product.id) {
      try {
        const saved = localStorage.getItem("velora_wishlist");
        let ids: string[] = saved ? JSON.parse(saved) : [];
        if (nextState) {
          if (!ids.includes(product.id)) ids.push(product.id);
        } else {
          ids = ids.filter((id) => id !== product.id);
        }
        localStorage.setItem("velora_wishlist", JSON.stringify(ids));
      } catch {
        // ignore
      }
    }
  };

  // Primary & Secondary Hover Images
  const sortedImages = product.images
    ? [...product.images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  const primaryImg =
    product.imageUrl ||
    sortedImages.find((img) => img.isPrimary)?.url ||
    sortedImages[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85";

  const secondaryImg =
    product.secondaryImageUrl ||
    (sortedImages.length > 1
      ? sortedImages.find((img) => img.url !== primaryImg)?.url || sortedImages[1].url
      : null);

  // Collection name
  const collectionLabel =
    product.collectionName ||
    (product.collections && product.collections.length > 0
      ? product.collections[0].collection.name
      : typeof product.category === "string"
      ? product.category
      : product.category?.name || "Collection");

  const priceValue = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  const isOutOfStock = product.inventory && product.inventory.quantity <= 0;

  return (
    <div
      className={`group relative flex flex-col bg-transparent ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Media Container with Smooth Image Transition & Subtle Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface)] border border-[var(--border-subtle)] transition-all duration-700 ease-out group-hover:border-gold-500/40 group-hover:shadow-lg">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative overflow-hidden">
          {/* Primary Image with Subtle Zoom */}
          <img
            src={primaryImg}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? "scale-108" : "scale-100"
            } ${secondaryImg && isHovered ? "opacity-0" : "opacity-100"}`}
          />

          {/* Secondary Hover Image (with smooth crossfade & matching subtle zoom) */}
          {secondaryImg && (
            <img
              src={secondaryImg}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-108" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Vignette & Atmospheric Contrast Layer */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-75 group-hover:opacity-40 transition-opacity duration-500" />
        </Link>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div>
            {isOutOfStock ? (
              <span className="px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.2em] bg-black/80 text-sand-200 border border-white/10 pointer-events-auto">
                Out of Stock
              </span>
            ) : product.featured ? (
              <span className="px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md text-gold-300 border border-gold-500/30 pointer-events-auto">
                Featured
              </span>
            ) : null}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-gold-300 hover:bg-black/90 transition-all duration-300 border border-white/15 hover:border-gold-500/40"
            aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-transform duration-300 active:scale-125 ${
                isWishlisted ? "fill-gold-400 text-gold-400" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Quick View Link Indicator */}
        <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
          <div className="w-full py-2 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-[0.2em] text-center flex items-center justify-center gap-1.5 shadow-xl">
            <Eye className="h-3 w-3 text-gold-400" />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* 2. Product Information Movement on Hover (Subtle smooth upward translate) */}
      <div className="pt-4 space-y-1.5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {/* Collection Name */}
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-metallic">
          <span>{collectionLabel}</span>
          {product.sku && (
            <span className="text-[var(--color-neutral-stone)] text-[9px] hidden sm:inline">{product.sku}</span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`} className="block group/title">
          <h3 className="font-serif-luxury text-base sm:text-lg font-light text-[var(--foreground)] group-hover/title:text-metallic transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Optional Specs */}
        {product.specs && (
          <p className="text-[11px] font-sans text-[var(--color-neutral-stone)] truncate font-light">
            {product.specs}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-xs sm:text-sm font-medium text-[var(--foreground)] tracking-wide">
            {formatPrice(priceValue)}
          </span>
          {product.compareAtPrice && (
            <span className="text-[10px] font-mono text-[var(--color-neutral-stone)] line-through">
              {formatPrice(Number(product.compareAtPrice))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
