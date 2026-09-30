"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Shield, PenTool } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface GiftingSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
  };
}

export function GiftingSection({
  title,
  subtitle,
  content,
}: GiftingSectionProps) {
  const headline = title || "MADE TO BE REMEMBERED.";
  const description =
    subtitle ||
    "Each acquisition arrives in our bespoke American walnut presentation vault with obsidian leather trim, wax-sealed certificate, and personalized hand-lettering.";
  const ctaLabel = content?.ctaText || "EXPLORE BESPOKE SERVICES";
  const ctaLink = content?.ctaLink || "/concierge";
  const packagingImage =
    content?.imageUrl || "/images/velora-gifting-packaging.jpg";

  return (
    <section className="py-28 sm:py-36 bg-obsidian text-sand-100 border-b border-white/5 overflow-hidden">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Premium Packaging Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-none overflow-hidden bg-neutral-950 border border-white/10 group">
              <img
                src={packagingImage}
                alt="VELORA Bespoke Presentation Vault"
                className="w-full h-full object-cover object-center filter brightness-[0.88] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-sand-200">
                <span className="font-mono text-[10px] tracking-widest text-platinum-400 uppercase">
                  Bespoke American Walnut & Suede Vault
                </span>
                <span className="font-mono text-[10px] tracking-widest text-gold-400 uppercase">
                  Wax Seal No. 2026
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Gifting Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400/60" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gold-400">
                The Presentation Ritual
              </span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-sand-50 tracking-tight leading-[1.08]">
              "{headline}"
            </h2>

            <p className="text-sm sm:text-base text-platinum-400 font-light leading-relaxed">
              {description}
            </p>

            {/* Gifting Features */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-sand-100">
                    Personalized Provenance Letter
                  </h4>
                  <p className="text-xs text-platinum-400 font-light leading-relaxed">
                    Hand-inscribed with the patron’s name and specific atelier serial allocation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-sand-100">
                    Armored Valuables Logistics
                  </h4>
                  <p className="text-xs text-platinum-400 font-light leading-relaxed">
                    Dispatched in discreet tamper-evident vaults via dedicated bonded couriers.
                  </p>
                </div>
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
