"use client";

import * as React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingBag, Eye } from "lucide-react";

export interface ProductCardData {
  id?: string;
  name: string;
  slug: string;
  sku?: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  category?: { name: string } | string | null;
  collectionName?: string | null;
  specs?: string | null;
  images?: Array<{ url: string; altText?: string | null; isPrimary?: boolean }>;
  imageUrl?: string;
  secondaryImageUrl?: string;
  featured?: boolean;
}

export interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  onQuickView?: (product: ProductCardData) => void;
  onAddToBag?: (product: ProductCardData) => void;
}

export function ProductCard({
  product,
  className,
  onQuickView,
  onAddToBag,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Extract images
  const primaryImg =
    product.imageUrl ||
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85";

  const secondaryImg =
    product.secondaryImageUrl ||
    (product.images && product.images.length > 1 ? product.images[1].url : null);

  const categoryTitle =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || product.collectionName || "Haute Horlogerie";

  const priceValue = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  return (
    <div
      className={`group relative flex flex-col ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal-950 border border-white/5 transition-all duration-500 group-hover:border-metallic/35">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <img
            src={primaryImg}
            alt={product.name}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              secondaryImg && isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Secondary Hover Image (if available) */}
          {secondaryImg && (
            <img
              src={secondaryImg}
              alt={`${product.name} detail view`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
        </Link>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {product.featured ? (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-sans font-semibold uppercase tracking-editorial bg-black/70 backdrop-blur-md text-metallic border border-metallic/30 pointer-events-auto">
              Masterwork
            </span>
          ) : <span />}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-ivory/80 hover:text-metallic hover:bg-black/80 transition-colors"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                isWishlisted ? "fill-metallic text-metallic" : ""
              }`}
            />
          </button>
        </div>

        {/* Quick Action Overlay Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-center gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="flex-1 h-9 px-3 bg-black/80 backdrop-blur-md border border-white/20 text-ivory hover:text-metallic hover:border-metallic/60 text-[10px] font-sans font-medium uppercase tracking-editorial transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="h-3 w-3" />
              <span>Quick View</span>
            </button>
          )}

          {onAddToBag && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddToBag(product);
              }}
              className="h-9 px-3 bg-metallic text-black hover:bg-metallic-light text-[10px] font-sans font-semibold uppercase tracking-editorial transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Acquire</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-3.5 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-editorial text-neutral-stone">
          <span>{categoryTitle}</span>
          {product.sku && <span className="font-mono text-[9px] text-neutral-slate">{product.sku}</span>}
        </div>

        <Link href={`/products/${product.slug}`} className="block group/title">
          <h3 className="font-serif-luxury text-base sm:text-lg font-light text-ivory group-hover/title:text-metallic transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.specs && (
          <p className="text-[11px] font-sans text-neutral-stone/80 truncate font-light">
            {product.specs}
          </p>
        )}

        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-sans text-xs sm:text-sm font-medium text-metallic font-mono">
            ${priceValue.toLocaleString()} USD
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] font-mono text-neutral-slate line-through">
              ${Number(product.compareAtPrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
