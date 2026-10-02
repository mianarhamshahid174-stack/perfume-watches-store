"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, Eye, Sparkles } from "lucide-react";
import { ProductItem, MacroDetailItem } from "@/types/product";
import { Container } from "@/components/ui/container";

interface ProductMacroDetailsProps {
  product: ProductItem;
}

export function ProductMacroDetails({ product }: ProductMacroDetailsProps) {
  // If product has custom macro details in DB, use them; otherwise fallback to rich horological default
  const defaultMacroItems: MacroDetailItem[] = [
    {
      part: "dial",
      title: "The Dial Architecture",
      subtitle: "Galvanic Finish & Dimensional Indexes",
      description:
        product.dialColor
          ? `${product.dialColor} with circular satin-finished outer minute track, hand-applied faceted markers, and sunken subsidiary seconds register.`
          : "Opaline dial featuring circular satin-finished minute track, diamond-cut faceted hour markers, and hand-applied feuille geometry.",
      imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "hands",
      title: "The Hands",
      subtitle: "Diamond-Faceted Chamfering",
      description:
        "Flame-tempered blued steel hands with 45° mirror-polished chamfers, gliding friction-free across the dial surface with microscopic precision.",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "crown",
      title: "The Fluted Crown",
      subtitle: "Dual-Gasket Ergonomics",
      description:
        "Tactile knurled winding crown sealed with dual internal gasket o-rings for pressure resistance, set with a hand-polished natural black onyx cabochon.",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "case",
      title: "The Case Metallurgy",
      subtitle: "Vertical Satin & Mirror Anglage",
      description:
        product.caseMaterial
          ? `Micro-machined from solid ${product.caseMaterial}, displaying vertical satin-brushed case flanks juxtaposed against mirror-polished bevelled lugs.`
          : "Sculpted 316L stainless steel case with vertical brushed flanks juxtaposed against high-gloss mirror-polished bevelled lugs.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "strap",
      title: "The Leather Strap",
      subtitle: "Artisanal Saddle Stitching",
      description:
        product.strapMaterial
          ? `Hand-selected ${product.strapMaterial} assembled with tone-on-tone French beeswax saddle stitching and supple anti-allergenic calf lining.`
          : "Hand-selected full-grain French alligator assembled with tone-on-tone beeswax saddle stitching and supple anti-allergenic calf lining.",
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "clasp",
      title: "The Deployant Clasp",
      subtitle: "Micro-Adjustable Deployant",
      description:
        product.clasp
          ? `${product.clasp} with twin safety pushers and laser-engraved VELORA Geneva atelier coat of arms.`
          : "Triple-blade folding deployant buckle with spring-loaded dual pushers and laser-engraved VELORA Geneva atelier coat of arms.",
      imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  const items: MacroDetailItem[] =
    product.macroDetails && product.macroDetails.length > 0
      ? product.macroDetails
      : defaultMacroItems;

  const [activeTab, setActiveTab] = useState(0);
  const activeItem = items[activeTab] || items[0];

  return (
    <section className="py-24 border-t border-white/10 bg-black relative">
      <Container size="wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
            Micron Precision
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-sand-50 font-light tracking-tight">
            THE DETAILS
          </h2>
          <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
            Excellence lives in the unseen. Explore the microscopic finishes, hand-bevelled facets, and tactile textures that define the atelier's handiwork.
          </p>
        </div>

        {/* Interactive Tabs Row */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mb-10 border-b border-white/10 pb-4">
          {items.map((item, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={item.part}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-4 sm:px-6 py-2.5 text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer rounded-sm ${
                  isActive
                    ? "bg-gold-500/15 text-gold-300 border border-gold-400/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    : "text-neutral-400 hover:text-sand-100 hover:bg-white/5 border border-transparent"
                }`}
              >
                {item.part}
              </button>
            );
          })}
        </div>

        {/* Selected Macro Focus Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.part}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-950 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl"
          >
            {/* Macro Image Viewport */}
            <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-white/10 group bg-neutral-900">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10 flex items-center gap-2 text-[10px] font-mono text-gold-300 uppercase tracking-widest">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Macro Lens 10x</span>
              </div>
            </div>

            {/* Editorial Explanation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400">
                  Part: {activeItem.part}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-sand-50 font-light">
                  {activeItem.title}
                </h3>
                <h5 className="text-xs uppercase font-sans tracking-widest text-platinum-400">
                  {activeItem.subtitle}
                </h5>
              </div>

              <p className="text-sm text-platinum-300 font-light leading-relaxed">
                {activeItem.description}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-gold-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hand Finished</span>
                </span>
                <span>•</span>
                <span>Geneva Quality Seal</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 6 Macro Thumbnails Grid underneath */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-8">
          {items.map((item, idx) => (
            <button
              key={`thumb-${item.part}`}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`p-2 border text-left transition-all duration-300 cursor-pointer group ${
                idx === activeTab
                  ? "border-gold-400 bg-neutral-900"
                  : "border-white/10 hover:border-white/30 bg-neutral-950"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden mb-2 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-sans uppercase tracking-widest text-platinum-300 group-hover:text-gold-300 transition-colors block truncate">
                {item.part}
              </span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
