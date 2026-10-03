"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { LUXURY_EASE } from "@/lib/motion";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "lucide-react";

interface CollectionStorySectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    bgImageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export function CollectionStorySection({
  title,
  subtitle,
  content,
}: CollectionStorySectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle Parallax Transform: smoothly translates image between -7% and +7%
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const headline = title || "DESIGNED BEYOND THE MOMENT.";
  const description =
    subtitle ||
    "Where timeless watchmaking discipline meets modern refinement. Every gear, dial, and hand is meticulously finished to endure for generations.";
  const ctaLabel = content?.ctaText || "DISCOVER OUR STORY";
  const ctaLink = content?.ctaLink || "/about";
  const bgImage =
    content?.bgImageUrl ||
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=85";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] sm:min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black py-28 border-b border-white/5"
    >
      {/* Parallax Background Container */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
      >
        <img
          src={bgImage}
          alt="VELORA Craftsmanship"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
        />
        {/* Layered cinematic darkening & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      </motion.div>

      {/* Narrative Content */}
      <Container size="default" className="relative z-10 text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: LUXURY_EASE }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Editorial Eyebrow */}
          <div className="inline-flex items-center gap-3 justify-center mb-2">
            <span className="h-px w-10 bg-gold-400/60" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-300">
              Brand Philosophy & Heritage
            </span>
            <span className="h-px w-10 bg-gold-400/60" />
          </div>

          {/* Headline: "DESIGNED BEYOND THE MOMENT." */}
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
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-sand-100 hover:text-gold-300 transition-colors pb-1 border-b border-gold-400/40 hover:border-gold-300">
                <span>{ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
