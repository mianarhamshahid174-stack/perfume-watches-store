"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FALLBACK_PRODUCTS } from "@/lib/catalog-data";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/context/cart-context";
import {
  Flame,
  Award,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Banknote,
  RotateCcw,
  Check,
} from "lucide-react";

export default function BestSellersPage() {
  const { addToCart, openCart } = useCart();
  const [filter, setFilter] = useState<"all" | "watches" | "fragrances">("all");
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Curate best seller products
  const bestSellers = FALLBACK_PRODUCTS.filter((p) => {
    if (filter === "watches") return p.category?.slug === "haute-horlogerie";
    if (filter === "fragrances") return p.category?.slug === "high-perfumery";
    return true;
  });

  const handleQuickAdd = (product: any) => {
    addToCart(product, null, 1);
    setAddedIds((prev) => [...prev, product.id]);
    openCart();
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 3000);
  };

  const getBadgeForIndex = (index: number) => {
    switch (index) {
      case 0:
        return "#1 Best Seller in Pakistan";
      case 1:
        return "Most Gifted Choice";
      case 2:
        return "Trending This Season";
      default:
        return "Collector Favorite";
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-foreground pt-28 pb-24 transition-colors duration-300">
      <Container size="wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-[11px] font-mono uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Most Loved Across Pakistan</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-foreground tracking-tight">
            Best Sellers Collection
          </h1>

          <p className="text-xs sm:text-sm text-neutral-stone font-light max-w-xl mx-auto leading-relaxed">
            Discover the most coveted timepieces and concentrated perfume extracts chosen by discerning clientele across Karachi, Lahore, and Islamabad.
          </p>

          {/* Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Best Sellers" },
              { id: "watches", label: "Luxury Watches" },
              { id: "fragrances", label: "Fine Fragrances" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-metallic text-black font-semibold shadow-sm"
                    : "bg-card border border-border text-neutral-stone hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bestSellers.map((prod, idx) => {
            const isAdded = addedIds.includes(prod.id);
            const badge = getBadgeForIndex(idx);

            return (
              <div
                key={prod.id}
                className="bg-card border border-border overflow-hidden flex flex-col justify-between group hover:border-gold-500/50 transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Visual Image */}
                  <Link href={`/product/${prod.slug}`} className="block relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={prod.images[0]?.url || "/images/velora-signature-01.jpg"}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Social proof badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 bg-black/85 text-sand-50 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-sm">
                        <Award className="w-3 h-3 text-gold-400" />
                        <span>{badge}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-card/90 text-foreground backdrop-blur-md border border-border">
                        {prod.category?.name || "Luxury"}
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-mono text-neutral-stone uppercase tracking-wider block">
                      {prod.sku}
                    </span>

                    <Link href={`/product/${prod.slug}`}>
                      <h3 className="font-serif-luxury text-xl text-foreground font-medium group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-stone font-light leading-relaxed line-clamp-2">
                      {prod.shortDescription || prod.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Add to Bag */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-[11px] font-mono text-neutral-stone">Pakistan Price:</span>
                    <span className="font-mono text-base font-bold text-gold-600 dark:text-gold-400">
                      {formatPrice(Number(prod.price))}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${prod.slug}`}
                      className="py-2.5 px-3 border border-border hover:border-gold-500 text-xs font-mono uppercase tracking-wider text-foreground text-center transition-colors"
                    >
                      Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(prod)}
                      className="py-2.5 px-3 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAdded ? "Added" : "Add to Bag"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Guarantees */}
        <div className="bg-card border border-border p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1.5">
            <Truck className="w-5 h-5 text-gold-500 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">Complimentary Express Shipping</h4>
            <p className="text-xs text-neutral-stone font-light">
              TCS, Leopard & Trax express delivery across 200+ cities in Pakistan.
            </p>
          </div>

          <div className="space-y-1.5">
            <Banknote className="w-5 h-5 text-gold-500 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">Cash on Delivery (COD)</h4>
            <p className="text-xs text-neutral-stone font-light">
              Inspect your parcel prior to payment. Raast & Bank Transfer also accepted.
            </p>
          </div>

          <div className="space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-gold-500 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">5-Year Official Warranty</h4>
            <p className="text-xs text-neutral-stone font-light">
              Full mechanical coverage with service centers in Lahore, Karachi & Islamabad.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
