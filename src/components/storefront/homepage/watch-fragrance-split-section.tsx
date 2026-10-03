"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface WatchFragranceSplitSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    timeTitle?: string;
    timeSubtitle?: string;
    timeLink?: string;
    timeImageUrl?: string;
    scentTitle?: string;
    scentSubtitle?: string;
    scentLink?: string;
    scentImageUrl?: string;
  };
}

export function WatchFragranceSplitSection({
  content,
}: WatchFragranceSplitSectionProps) {
  const [hoveredSide, setHoveredSide] = React.useState<"time" | "scent" | null>(
    null
  );

  const timeTitle = content?.timeTitle || "TIME";
  const timeSub =
    content?.timeSubtitle ||
    "Mechanical timepieces assembled with precision by master watchmakers in Geneva.";
  const timeHref = content?.timeLink || "/watches";
  const timeImage =
    content?.timeImageUrl || "/images/products/watches/velora-signature-01/editorial.jpg";

  const scentTitle = content?.scentTitle || "SCENT";
  const scentSub =
    content?.scentSubtitle ||
    "Pure extraits de parfum formulated with rare botanical essences in Grasse.";
  const scentHref = content?.scentLink || "/fragrances";
  const scentImage =
    content?.scentImageUrl || "/images/products/fragrances/velora-noir-extrait/editorial.jpg";

  return (
    <section className="relative w-full min-h-[80vh] grid grid-cols-1 md:grid-cols-2 border-b border-white/5 overflow-hidden bg-black">
      {/* LEFT: TIME */}
      <Link
        href={timeHref}
        onMouseEnter={() => setHoveredSide("time")}
        onMouseLeave={() => setHoveredSide(null)}
        className="group relative min-h-[460px] md:min-h-[80vh] flex flex-col justify-end p-8 sm:p-14 lg:p-20 overflow-hidden border-b md:border-b-0 md:border-r border-white/10"
      >
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={timeImage}
            alt={timeTitle}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out filter brightness-[0.6] ${
              hoveredSide === "time"
                ? "scale-105 brightness-[0.75]"
                : hoveredSide === "scent"
                ? "scale-100 opacity-60"
                : "scale-100"
            }`}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4 max-w-md">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400 block">
            Luxury Watches
          </span>

          <h2 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl font-light text-sand-50 tracking-tight group-hover:text-gold-200 transition-colors">
            {timeTitle}
          </h2>

          <p className="text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
            {timeSub}
          </p>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-sand-100 group-hover:text-gold-300 transition-colors pb-1 border-b border-gold-400/40 group-hover:border-gold-300">
              <span>Explore Watches</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>

      {/* RIGHT: SCENT */}
      <Link
        href={scentHref}
        onMouseEnter={() => setHoveredSide("scent")}
        onMouseLeave={() => setHoveredSide(null)}
        className="group relative min-h-[460px] md:min-h-[80vh] flex flex-col justify-end p-8 sm:p-14 lg:p-20 overflow-hidden"
      >
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={scentImage}
            alt={scentTitle}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out filter brightness-[0.55] ${
              hoveredSide === "scent"
                ? "scale-105 brightness-[0.7]"
                : hoveredSide === "time"
                ? "scale-100 opacity-60"
                : "scale-100"
            }`}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4 max-w-md">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400 block">
            Luxury Fragrances
          </span>

          <h2 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl font-light text-sand-50 tracking-tight group-hover:text-gold-200 transition-colors">
            {scentTitle}
          </h2>

          <p className="text-xs sm:text-sm text-platinum-300 font-light leading-relaxed">
            {scentSub}
          </p>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-sand-100 group-hover:text-gold-300 transition-colors pb-1 border-b border-gold-400/40 group-hover:border-gold-300">
              <span>Explore Fragrances</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
