"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard, ProductCardData } from "@/components/storefront/product-card";
import { Sparkles, RotateCcw } from "lucide-react";
import { LUXURY_EASE } from "@/lib/motion";

interface ProductGridProps {
  products: ProductCardData[];
  onResetFilters?: () => void;
  className?: string;
  columns?: 3 | 4;
}

export function ProductGrid({
  products,
  onResetFilters,
  className = "",
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center space-y-6 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full border border-white/10 bg-neutral-950 flex items-center justify-center text-gold-400 mx-auto">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif-luxury text-2xl font-light text-sand-50">
            No Repertoire Matches Found
          </h3>
          <p className="text-xs text-platinum-400 font-light leading-relaxed">
            No creations match the selected combination of horological criteria. Consider clearing active filters to view all available pieces.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-gold-300 border border-gold-500/30 text-xs font-mono uppercase tracking-[0.2em] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  // Responsive Grid:
  // Desktop: 3–4 columns (lg:grid-cols-3 xl:grid-cols-4)
  // Tablet: 2–3 columns (sm:grid-cols-2 md:grid-cols-3)
  // Mobile: 2 columns (grid-cols-2)
  const colClass =
    columns === 3
      ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${colClass} gap-x-3 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-14 ${className}`}>
      {products.map((product, idx) => (
        <motion.div
          key={product.id || product.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.4), ease: LUXURY_EASE }}
        >
          <ProductCard product={product} priority={idx < 4} />
        </motion.div>
      ))}
    </div>
  );
}
