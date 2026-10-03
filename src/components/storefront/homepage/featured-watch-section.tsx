"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";
import { formatPrice } from "@/lib/currency";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number | any;
  shortDescription?: string | null;
  description?: string | null;
  movement?: string | null;
  caseMaterial?: string | null;
  caseDiameter?: string | null;
  images?: Array<{ url: string; altText?: string | null }>;
}

interface FeaturedWatchSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    productSlug?: string;
    ctaText?: string;
    ctaLink?: string;
    tagline?: string;
  };
  product?: ProductData | null;
}

export function FeaturedWatchSection({
  title,
  subtitle,
  content,
  product,
}: FeaturedWatchSectionProps) {
  const headline = title || "THE SIGNATURE";
  const editorialText =
    subtitle ||
    "A study in clean design and mechanical balance. Crafted in surgical 904L stainless steel with a scratch-resistant sapphire crystal and our in-house automatic movement.";
  const ctaLabel = content?.ctaText || "DISCOVER THE WATCH";
  const productHref =
    content?.ctaLink || (product ? `/product/${product.slug}` : "/product/velora-signature-01");
  const tagline = content?.tagline || "Featured Timepiece";

  const heroImage =
    product?.images?.[0]?.url || "/images/products/watches/velora-signature-01/front.jpg";

  const formattedPrice = product?.price
    ? formatPrice(Number(product.price))
    : "Rs. 125,000";

  return (
    <section className="relative py-32 sm:py-40 bg-[var(--background)] text-[var(--foreground)] border-b border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <Container size="wide">
        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Asymmetrical Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400/60" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gold-400">
                {tagline}
              </span>
            </div>

            {/* Title: "THE SIGNATURE" */}
            <h2 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-light text-sand-50 tracking-tight leading-[1.06]">
              {headline}
            </h2>

            {/* Editorial Paragraph */}
            <p className="text-sm sm:text-base text-platinum-400 font-light leading-relaxed max-w-lg">
              {editorialText}
            </p>

            {/* Horological Architecture Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Calibre Movement
                </span>
                <span className="text-xs font-serif-luxury text-sand-200 block">
                  {product?.movement || "Automatic Calibre VA-100"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Case Architecture
                </span>
                <span className="text-xs font-serif-luxury text-sand-200 block">
                  {product?.caseMaterial || "316L Stainless Steel"}
                </span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center gap-6">
              <Link href={productHref} className="group inline-block">
                <span className="inline-flex items-center justify-center px-8 py-4 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300 group-hover:scale-[1.02] shadow-xl">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  Atelier Price
                </span>
                <span className="text-lg font-serif-luxury text-gold-300 font-light">
                  {formattedPrice}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Watch Cinematic Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: LUXURY_EASE }}
            className="lg:col-span-7 relative"
          >
            {/* Architectural Frame with Subtle Borders */}
            <div className="keep-dark relative aspect-[4/5] sm:aspect-[16/13] w-full rounded-none overflow-hidden bg-gradient-to-b from-neutral-900/60 to-black border border-white/10 group">
              <img
                src={heroImage}
                alt={product?.name || headline}
                className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Specs Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-sand-200">
                <span className="font-mono text-[10px] tracking-widest text-platinum-400 uppercase">
                  {product?.sku || "REF: VEL-SIG-01"}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase">
                  Geneva Atelier Assembly
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
