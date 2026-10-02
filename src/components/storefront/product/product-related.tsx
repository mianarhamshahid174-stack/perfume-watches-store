"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types/product";
import { ProductCard } from "@/components/storefront/product-card";
import { Container } from "@/components/ui/container";

interface ProductRelatedProps {
  youMayAlsoLike: ProductItem[];
  completeTheLook: ProductItem[];
  fromTheCollection: ProductItem[];
  collectionName?: string;
}

export function ProductRelated({
  youMayAlsoLike = [],
  completeTheLook = [],
  fromTheCollection = [],
  collectionName,
}: ProductRelatedProps) {
  // Available tabs
  const tabs = [
    { id: "similar", label: "You May Also Like", count: youMayAlsoLike.length, items: youMayAlsoLike },
    { id: "complete", label: "Complete The Look", count: completeTheLook.length, items: completeTheLook },
    {
      id: "collection",
      label: collectionName ? `From ${collectionName}` : "From The Collection",
      count: fromTheCollection.length,
      items: fromTheCollection,
    },
  ].filter((t) => t.items.length > 0);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "similar");

  if (tabs.length === 0) return null;

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="py-24 border-t border-white/10 bg-neutral-950">
      <Container size="wide">
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
              Curated Recommendations
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-sand-50 font-light tracking-tight">
              Related Creations
            </h2>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-xs font-sans uppercase tracking-[0.2em] transition-all whitespace-nowrap cursor-pointer relative ${
                  activeTab === tab.id
                    ? "text-gold-300 font-medium"
                    : "text-neutral-400 hover:text-sand-100"
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {currentTab.items.slice(0, 4).map((prod) => (
            <ProductCard
              key={prod.id}
              product={{
                id: prod.id,
                name: prod.name,
                slug: prod.slug,
                sku: prod.sku,
                price: prod.price,
                compareAtPrice: prod.compareAtPrice || undefined,
                imageUrl: prod.images?.[0]?.url || "/images/velora-signature-01.jpg",
                secondaryImageUrl: prod.images?.[1]?.url,
                collectionName: prod.collections?.[0]?.collection?.name,
                specs: prod.caseDiameter
                  ? `${prod.caseDiameter} • ${prod.movement || prod.caseMaterial}`
                  : prod.concentration || undefined,
                inventory: prod.inventory || undefined,
                images: prod.images,
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
