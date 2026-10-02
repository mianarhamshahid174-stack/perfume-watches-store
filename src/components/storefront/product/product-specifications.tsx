"use client";

import React from "react";
import {
  Compass,
  Clock,
  Shield,
  Droplets,
  Layers,
  Sparkles,
  Maximize2,
  Lock,
  Flame,
  Award,
} from "lucide-react";
import { ProductItem } from "@/types/product";
import { Container } from "@/components/ui/container";

interface ProductSpecificationsProps {
  product: ProductItem;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const isWatch =
    product.category?.slug === "haute-horlogerie" ||
    !!product.movement ||
    !!product.caseMaterial;

  const watchSpecs = [
    {
      label: "Case Metallurgy",
      value: product.caseMaterial || "316L Surgical Stainless Steel",
      icon: Layers,
      detail: "Micro-machined monobloc with hand-satin brushing and mirror-polished anglage.",
    },
    {
      label: "Case Diameter",
      value: product.caseDiameter || "40.0 mm",
      icon: Maximize2,
      detail: "Proportioned for ergonomic wrist posture and architectural presence.",
    },
    {
      label: "Case Thickness",
      value: product.caseThickness || "9.8 mm",
      icon: Maximize2,
      detail: "Engineered ultra-slim profile sliding effortlessly beneath formal attire.",
    },
    {
      label: "Mechanical Movement",
      value: product.movement || "In-House Automatic Calibre VA-100",
      icon: Compass,
      detail: "Regulated in 5 positions, hand-beveled bridges with Côtes de Genève stripes.",
    },
    {
      label: "Power Reserve",
      value: product.powerReserve || "68 Hours",
      icon: Clock,
      detail: "Extended twin-barrel architecture ensuring uninterrupted chronometric cadence.",
    },
    {
      label: "Sapphire Crystal",
      value: product.crystal || "Double-domed sapphire crystal with anti-reflective coating",
      icon: Shield,
      detail: "9 Mohs hardness rating with five internal multi-layer anti-reflective coatings.",
    },
    {
      label: "Water Resistance",
      value: product.waterResistance || "50m / 5 ATM",
      icon: Droplets,
      detail: "Hermetically sealed with dual internal gasket o-rings and tested under water pressure.",
    },
    {
      label: "Strap & Hide",
      value: product.strapMaterial || "Full-Grain Horween Noir Alligator",
      icon: Award,
      detail: "Sourced from premier French and Chicago tanneries with tone-on-tone saddle stitch.",
    },
    {
      label: "Deployant Clasp",
      value: product.clasp || "Triple-blade folding deployant clasp with micro-adjustment",
      icon: Lock,
      detail: "Quick-adjust micro extension mechanism and engraved atelier coat of arms.",
    },
  ];

  const fragranceSpecs = [
    {
      label: "Olfactory Family",
      value: product.olfactiveFamily || "Smoky Amber & Resinous Woods",
      icon: Flame,
      detail: "Complex architectural evolution lingering from crisp top notes into velvety amber depth.",
    },
    {
      label: "Concentration",
      value: product.concentration || "Extrait de Parfum (32%)",
      icon: Sparkles,
      detail: "Ultra-concentrated pure perfume essence yielding extreme sillage and 18+ hour longevity.",
    },
    {
      label: "Gender Classification",
      value: product.gender || "Unisex",
      icon: Award,
      detail: "Designed without synthetic boundaries for patrons of refined discerning taste.",
    },
    {
      label: "Volume & Packaging",
      value: `${product.volumeMl || 100}ml Flacon / 3.4 FL. OZ.`,
      icon: Layers,
      detail: "Hand-polished heavy French crystalline glass with magnetic monogram ruthenium cap.",
    },
  ];

  const activeSpecs = isWatch ? watchSpecs : fragranceSpecs;

  return (
    <section className="py-20 border-t border-white/10 bg-neutral-950/60 relative overflow-hidden">
      {/* Background ambient luxury glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/5 blur-3xl pointer-events-none rounded-full" />

      <Container size="wide">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-gold-400">
            {isWatch ? "Horological Architecture" : "Olfactory Composition"}
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-sand-50 font-light tracking-tight">
            {isWatch ? "Watch Specifications" : "Essence Specifications"}
          </h2>
          <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
            {isWatch
              ? "Every millimeter and metallurgical element is certified by master horologists in Geneva."
              : "Formulated in Grasse utilizing cold-maceration botanical absolutes and precious resins."}
          </p>
        </div>

        {/* Visual Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeSpecs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.label}
                className="p-6 border border-white/10 bg-neutral-900/50 hover:bg-neutral-900/80 hover:border-gold-500/30 transition-all duration-300 group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 group-hover:text-gold-400 transition-colors">
                    {spec.label}
                  </span>
                  <div className="p-2 rounded bg-white/5 text-neutral-400 group-hover:text-gold-300 group-hover:bg-gold-500/10 transition-colors">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif-luxury text-lg text-sand-100 font-normal leading-snug">
                    {spec.value}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {spec.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
