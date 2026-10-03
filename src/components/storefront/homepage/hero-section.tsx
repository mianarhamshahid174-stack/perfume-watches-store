"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LUXURY_EASE } from "@/lib/motion";

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    badge?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    bgImageUrl?: string;
    videoUrl?: string;
  };
}

export function HeroSection({ title, subtitle, content }: HeroSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 900], [0, 180]);
  const opacityText = useTransform(scrollY, [0, 450], [1, 0]);

  const headline = title || "TIME, REFINED.";
  const description =
    subtitle || "Contemporary timepieces created for moments that matter.";
  const primaryCta = content?.ctaText || "DISCOVER THE COLLECTION";
  const primaryLink = content?.ctaLink || "/collections/signature";
  const secondaryCta = content?.secondaryCtaText || "EXPLORE WATCHES";
  const secondaryLink = content?.secondaryCtaLink || "/watches";
  const badge = content?.badge || "Swiss Craftsmanship";
  const bgImage = content?.bgImageUrl || "/images/products/watches/velora-signature-01/editorial.jpg";

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      className="keep-dark relative h-screen min-h-[720px] w-full flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* 1. Cinematic Background Image Reveal & Subtle Ambient Drift */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 w-full h-[115%] -top-[7.5%] will-change-transform"
      >
        <motion.div
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          {/* Subtle Ambient Continuous Breathing/Drift Animation */}
          <motion.div
            animate={{
              scale: [1.0, 1.03, 1.0],
              x: [0, 10, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full"
          >
            {content?.videoUrl ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={bgImage}
                className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
              >
                <source src={content.videoUrl} type="video/mp4" />
                <source src={content.videoUrl} type="video/webm" />
              </video>
            ) : (
              <img
                src={bgImage}
                alt="VELORA Luxury Timepiece"
                className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
                loading="eager"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Multi-layered cinematic vignettes and radial glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      </motion.div>

      {/* 2. Content Container with Staggered Fade / Slide Motion */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-16 flex flex-col items-center"
      >
        {/* Atelier Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: LUXURY_EASE }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-500/25 bg-black/40 backdrop-blur-md mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-sand-200">
            {badge}
          </span>
        </motion.div>

        {/* Headline: "TIME, REFINED." */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease: LUXURY_EASE }}
            className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-sand-50 tracking-tight leading-[1.04]"
          >
            {headline}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.8, ease: LUXURY_EASE }}
          className="text-sm sm:text-base md:text-lg text-platinum-300 font-light max-w-xl mx-auto leading-relaxed mb-10 tracking-wide drop-shadow-md"
        >
          {description}
        </motion.p>

        {/* CTAs: "DISCOVER THE COLLECTION" and "EXPLORE WATCHES" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.05, ease: LUXURY_EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href={primaryLink} className="w-full sm:w-auto group">
            <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 shadow-xl hover:shadow-gold-500/20 group-hover:scale-[1.02]">
              <span>{primaryCta}</span>
              <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          <Link href={secondaryLink} className="w-full sm:w-auto group">
            <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 border border-sand-50/40 hover:border-gold-400 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-sand-100 hover:text-gold-200 text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 group-hover:scale-[1.02]">
              <span>{secondaryCta}</span>
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* 3. Luxury Scroll Indicator */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.4, ease: LUXURY_EASE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 text-platinum-400 hover:text-gold-300 transition-colors group cursor-pointer"
        aria-label="Scroll to featured section"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-platinum-400 group-hover:text-gold-300 transition-colors">
          SCROLL
        </span>
        <div className="w-[18px] h-[30px] rounded-full border border-sand-50/25 group-hover:border-gold-400/60 p-1 flex justify-center transition-colors">
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-1.5 rounded-full bg-gold-400"
          />
        </div>
      </motion.button>
    </section>
  );
}
