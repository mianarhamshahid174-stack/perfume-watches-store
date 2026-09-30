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
    "We do not believe in mass creation. From the hand-finishing of bridges in Geneva to the patient aging of extraits in Grasse, our work honors time itself.";
  const quote =
    content?.quote ||
    "In an accelerated world, true luxury is the quiet confidence of objects crafted without compromise.";
  const author = content?.author || "The Velora Atelier Masters";
  const ctaLabel = content?.ctaText || "DISCOVER THE MAISON";
  const ctaLink = content?.ctaLink || "/about";

  return (
    <section className="py-28 sm:py-36 bg-black text-sand-100 border-b border-white/5 overflow-hidden">
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
                alt="VELORA Geneva Horological Atelier"
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Atelier Hallmark Seal */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/70 backdrop-blur-md border border-white/10 space-y-2">
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-gold-400 block">
                  GENEVA • GRASSE
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
                Maison Heritage
              </span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-sand-50 tracking-tight leading-[1.08]">
              {headline}
            </h2>

            <p className="text-sm sm:text-base text-platinum-300 font-light leading-relaxed">
              {narrative}
            </p>

            {/* Twin Ateliers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="p-5 bg-neutral-950/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300">
                    Geneva, Switzerland
                  </span>
                </div>
                <h4 className="font-serif-luxury text-base text-sand-100">
                  Horological Ateliers
                </h4>
                <p className="text-xs text-platinum-400 font-light leading-relaxed">
                  Dedicated to micro-mechanics, flying tourbillons, hand-beveled titanium, and chronometer calibration.
                </p>
              </div>

              <div className="p-5 bg-neutral-950/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-gold-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300">
                    Grasse, France
                  </span>
                </div>
                <h4 className="font-serif-luxury text-base text-sand-100">
                  Botanical Laboratories
                </h4>
                <p className="text-xs text-platinum-400 font-light leading-relaxed">
                  Compounding 35% pure parfum extraits matured in seasoned French oak casks for six months.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href={ctaLink} className="inline-block group">
                <span className="inline-flex items-center justify-center px-8 py-4 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300 group-hover:scale-[1.02] shadow-xl">
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
