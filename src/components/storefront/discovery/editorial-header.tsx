"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LUXURY_EASE } from "@/lib/motion";
import { Container } from "@/components/ui/container";

interface EditorialHeaderProps {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
  badge?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function EditorialHeader({
  title,
  subtitle,
  description,
  imageUrl,
  productCount,
  badge = "Maison Collection",
  breadcrumbs = [],
}: EditorialHeaderProps) {
  return (
    <div className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-white/10 overflow-hidden bg-black text-sand-100">
      {/* Background Cinematic Visual if provided */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
      )}

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(197,160,89,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <Container size="wide" className="relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 mb-6">
            <Link href="/" className="hover:text-gold-300 transition-colors">
              Atelier
            </Link>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <span className="text-white/20">/</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-gold-300 transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-gold-400">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="max-w-4xl space-y-4">
          {/* Eyebrow & Product Count */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/25 bg-black/50 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-sand-200">
                {badge}
              </span>
            </div>

            {productCount !== undefined && (
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider">
                {productCount} {productCount === 1 ? "Creation" : "Creations Available"}
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: LUXURY_EASE }}
            className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-light text-sand-50 tracking-tight leading-[1.06]"
          >
            {title}
          </motion.h1>

          {/* Subtitle / Description */}
          {(subtitle || description) && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: LUXURY_EASE }}
              className="text-xs sm:text-sm md:text-base text-platinum-300 font-light max-w-2xl leading-relaxed pt-1"
            >
              {subtitle || description}
            </motion.p>
          )}
        </div>
      </Container>
    </div>
  );
}
