"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface FragranceEditorialSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    ctaText?: string;
    ctaLink?: string;
    bgImageUrl?: string;
  };
}

export function FragranceEditorialSection({
  title,
  subtitle,
  content,
}: FragranceEditorialSectionProps) {
  const headline = title || "A Fragrance That Becomes Your Signature.";
  const description =
    subtitle ||
    "Crafted in small batches in Grasse, France. Formulated with rare botanical absolutes and aged oils for exceptional depth and longevity.";
  const ctaLabel = content?.ctaText || "Explore Fragrances";
  const ctaLink = content?.ctaLink || "/fragrances";
  const bgImage =
    content?.bgImageUrl || "/images/products/fragrances/velora-noir-extrait/editorial.jpg";

  return (
    <section className="keep-dark relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black py-32 sm:py-40 border-b border-white/5">
      {/* Background Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="VELORA High Perfumery"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1]"
        />
        {/* Amber & Charcoal Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <Container size="default" className="relative z-10 text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: LUXURY_EASE }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full border border-gold-500/25 bg-black/50 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-gold-400" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-sand-200">
              Grasse Botanical Laboratory • 35% Pure Extrait
            </span>
          </div>

          {/* Headline: "A SCENT THAT BECOMES YOUR SIGNATURE." */}
          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-sand-50 tracking-tight leading-[1.08]">
            "{headline}"
          </h2>

          {/* Editorial Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-platinum-300 font-light max-w-2xl mx-auto leading-relaxed tracking-wide pt-2">
            {description}
          </p>

          {/* CTA Link */}
          <div className="pt-8">
            <Link href={ctaLink} className="inline-block group">
              <span className="inline-flex items-center justify-center px-10 py-4 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 group-hover:scale-[1.02] shadow-xl">
                <span>{ctaLabel}</span>
                <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
