"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { ProductItem } from "@/types/product";

interface ProductStorytellingProps {
  product: ProductItem;
}

export function ProductStorytelling({ product }: ProductStorytellingProps) {
  const isWatch =
    product.category?.slug === "haute-horlogerie" ||
    !!product.movement ||
    !!product.caseMaterial;

  return (
    <section className="py-24 sm:py-32 border-t border-white/10 bg-obsidian relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-600/5 blur-3xl pointer-events-none rounded-full -translate-y-1/2" />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Editorial Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl">
              <img
                src={
                  product.images?.[1]?.url ||
                  product.images?.[0]?.url ||
                  "/images/velora-hero-editorial.jpg"
                }
                alt={`${product.name} Atelier Craft`}
                className="w-full h-full object-cover object-center filter saturate-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-gold-400 block mb-1">
                  Atelier Horloger • Geneva
                </span>
                <p className="text-xs text-sand-200 font-light italic">
                  "True luxury is not an accumulation of ornament, but the relentless elimination of the superfluous."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                Design Philosophy
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-sand-50 font-light tracking-tight leading-[1.15]">
                "Every detail is considered."
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-platinum-300 font-light leading-relaxed">
              <p>
                {product.name} is conceived as a dialogue between architectural geometry and mechanical purity. Before the first metal is turned or the first raw botanical is cold-pressed, hundreds of hours are spent refining the curvature of every lug, the bevel of every bridge, and the weight of every tactile touchpoint.
              </p>

              <p>
                {isWatch
                  ? "In the quiet of our Geneva atelier, our master watchmakers assemble each mechanical calibre by hand. Each component is scrutinized under 20x magnification — bridges are hand-chamfered, screws are heat-tempered to an iridescent cornflower blue, and the dial's subtle opaline texture is calibrated to disperse ambient light without glare."
                  : "Formulated in Grasse over an uninterrupted 180-day cold maturation cycle, each flacon contains rare botanical absolutes harvested at dawn. Form follows sensory emotion, yielding an intimate aura that belongs exclusively to the wearer."}
              </p>

              <p>
                We do not create for mass consumption. Production of this reference is strictly limited by the finite capacity of our artisanal benches, ensuring each piece remains a rare and singular milestone of personal achievement.
              </p>
            </div>

            {/* Atelier Horologist Signature block */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <h5 className="font-serif-luxury text-base text-sand-100 font-normal">
                  Master Horologist & Atelier Director
                </h5>
                <p className="text-xs text-neutral-400 font-sans tracking-wider uppercase">
                  VELORA Manufacture Genevoise
                </p>
              </div>

              <div className="font-serif-luxury text-xl text-gold-400/80 italic select-none">
                Velora Ateliers
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
