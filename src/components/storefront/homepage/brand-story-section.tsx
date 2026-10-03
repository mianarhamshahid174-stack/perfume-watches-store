"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface BrandStorySectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    quote?: string;
    author?: string;
    ctaText?: string;
    ctaLink?: string;
    location?: string;
  };
}

export function BrandStorySection({
  title,
  subtitle,
  content,
}: BrandStorySectionProps) {
  const headline = title || "BORN FROM PATIENCE, DRIVEN BY DISCIPLINE.";
  const narrative =
    subtitle ||
    "We do not believe in mass production. From hand-crafted mechanical timepieces to carefully blended luxury fragrances, our work honors timeless craftsmanship.";
  const quote =
    content?.quote ||
    "In an accelerated world, true luxury is the quiet confidence of objects crafted without compromise.";
  const author = content?.author || "VELORA Design Studio";
  const ctaLabel = content?.ctaText || "DISCOVER OUR STORY";
  const ctaLink = content?.ctaLink || "/about";

  return (
    <section className="py-28 sm:py-36 bg-obsidian-950 text-foreground border-b border-border overflow-hidden">
      <Container size="wide">
        {/* Editorial Layout: Monograph Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Monograph Composition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[1/1] w-full rounded-none overflow-hidden bg-neutral-950 border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
                alt="VELORA Watchmakers"
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Hallmark Seal */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/70 backdrop-blur-md border border-white/10 space-y-2">
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-gold-400 block">
                  LAHORE • KARACHI • ISLAMABAD
                </span>
                <p className="font-serif-luxury text-base sm:text-lg text-sand-100 italic font-light leading-relaxed">
                  "{quote}"
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block pt-1">
                  — {author}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Coordinates */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400/60" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gold-400">
                Brand Heritage
              </span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight leading-[1.08]">
              {headline}
            </h2>

            <p className="text-sm sm:text-base text-neutral-stone font-light leading-relaxed">
              {narrative}
            </p>

            {/* Twin Workshops Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="p-5 bg-card/60 border border-border space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300">
                    Lahore & Islamabad Showrooms
                  </span>
                </div>
                <h4 className="font-serif-luxury text-base text-foreground">
                  Luxury Watch Workshop
                </h4>
                <p className="text-xs text-neutral-stone font-light leading-relaxed">
                  Precision mechanical movements, sapphire crystals, hand-finished cases, and 5-year official warranty.
                </p>
              </div>

              <div className="p-5 bg-card/60 border border-border space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300">
                    Karachi Flagship
                  </span>
                </div>
                <h4 className="font-serif-luxury text-base text-foreground">
                  Artisanal Fragrance Studio
                </h4>
                <p className="text-xs text-neutral-stone font-light leading-relaxed">
                  Rare aged oud, pure botanicals, and long-lasting perfume extracts formulated for the Pakistani climate.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href={ctaLink} className="inline-block group">
                <span className="inline-flex items-center justify-center px-8 py-4 bg-metallic hover:bg-metallic-light text-black text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300 group-hover:scale-[1.02] shadow-xl">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
