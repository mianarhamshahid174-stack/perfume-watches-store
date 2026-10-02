"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatPKR, usdToPKR } from "@/lib/currency";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, moveToCart, clearWishlist } = useWishlist();
  const { openCart } = useCart();

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 selection:bg-gold-500/20 selection:text-gold-200">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="border-b border-white/10 pb-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400 block mb-2">
                Curated Private Archive
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-sand-50 tracking-wide">
                Your Curated Wishlist
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-neutral-400">
                {items.length} {items.length === 1 ? "Piece" : "Pieces"} Curated
              </span>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs font-mono text-neutral-500 hover:text-rose-400 uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center border border-white/5 bg-neutral-950/60 rounded-sm p-8 max-w-xl mx-auto space-y-6">
            <Heart className="w-16 h-16 text-neutral-600 mx-auto stroke-[1.2]" />
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl text-sand-100">
                Your Salon Archive is Empty
              </h2>
              <p className="text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                You have not yet marked any timepieces or parfums for reservation. Browse our ateliers and select the heart icon to preserve creations here.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/watches"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Discover Timepieces
              </Link>
              <Link
                href="/fragrances"
                className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-gold-400 text-sand-100 text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Discover Parfums
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const itemPricePKR = usdToPKR(item.price);

              return (
                <div
                  key={item.id}
                  className="bg-neutral-950 border border-white/10 group flex flex-col justify-between hover:border-gold-500/40 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-rose-950 text-neutral-300 hover:text-rose-300 border border-white/10 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gold-400 block">
                        REF. {item.sku}
                      </span>
                      <h3 className="font-serif-luxury text-lg text-sand-50 truncate">
                        {item.name}
                      </h3>
                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="font-mono text-gold-300 text-base font-semibold">
                          {formatPKR(itemPricePKR)}
                        </span>
                        <span className="text-xs font-mono text-neutral-500">
                          ${item.price.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          moveToCart(item.productId);
                          openCart();
                        }}
                        className="flex-1 h-11 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Move to Bag</span>
                      </button>

                      <Link
                        href={`/product/${item.slug || item.productId}`}
                        className="px-4 h-11 border border-white/20 hover:border-white/40 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                        title="View Creation Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
