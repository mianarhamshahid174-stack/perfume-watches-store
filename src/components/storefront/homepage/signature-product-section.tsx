"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
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
  movement?: string | null;
  caseMaterial?: string | null;
  images?: Array<{ url: string; altText?: string | null }>;
}

interface SignatureProductSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    productSlug?: string;
    features?: string[];
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
  };
  product?: ProductData | null;
}

export function SignatureProductSection({
  title,
  subtitle,
  content,
  product,
}: SignatureProductSectionProps) {
  const productName = title || product?.name || "VELORA SIGNATURE 01";
  const desc =
    subtitle ||
    "Contemporary timepieces created for moments that matter. The archetype of modern Swiss precision.";
  const ctaLabel = content?.ctaText || "DISCOVER";
  const ctaLink =
    content?.ctaLink ||
    (product ? `/product/${product.slug}` : "/product/velora-signature-01");

  // Specs: Automatic movement, Sapphire crystal, Stainless steel
  const specs = content?.features || [
    "In-house automatic movement",
    "Scratch-proof sapphire crystal",
    "Surgical 904L stainless steel",
  ];

  const watchImage =
    content?.imageUrl ||
    product?.images?.[0]?.url ||
    "/images/products/watches/velora-signature-01/front.jpg";

  const formattedPrice = product?.price
    ? formatPrice(Number(product.price))
    : "Rs. 125,000";

  return (
    <section className="relative py-32 sm:py-40 bg-[var(--background)] text-[var(--foreground)] border-b border-white/5 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <Container size="default" className="relative z-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: LUXURY_EASE }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className="h-px w-8 bg-gold-400/60" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400">
            Signature Creation
          </span>
          <span className="h-px w-8 bg-gold-400/60" />
        </motion.div>

        {/* Product Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: LUXURY_EASE }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-sand-50 tracking-tight leading-[1.05] mb-4"
        >
          {productName}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: LUXURY_EASE }}
          className="text-xs sm:text-sm md:text-base text-platinum-400 font-light max-w-xl mx-auto leading-relaxed mb-10"
        >
          {desc}
        </motion.p>

        {/* Large Centered Watch Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3, ease: LUXURY_EASE }}
          className="relative max-w-lg mx-auto mb-12 group cursor-pointer"
        >
          <Link href={ctaLink}>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950/80 border border-white/10 p-4 transition-all duration-700 group-hover:border-gold-500/40 group-hover:shadow-[0_0_60px_rgba(197,160,89,0.12)]">
              <img
                src={watchImage}
                alt={productName}
                className="w-full h-full object-contain filter contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
          </Link>
        </motion.div>

        {/* Three Specifications: Automatic movement • Sapphire crystal • Stainless steel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.45, ease: LUXURY_EASE }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10 pt-4 border-t border-white/10"
        >
          {specs.map((spec, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-neutral-950/40 border border-white/5"
            >
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                Specification 0{i + 1}
              </span>
              <span className="font-serif-luxury text-base text-sand-100 font-normal">
                {spec}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Price & CTA: "DISCOVER" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: LUXURY_EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="text-center sm:text-right">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
              Reference Acquisition
            </span>
            <span className="text-xl font-serif-luxury text-gold-300">
              {formattedPrice}
            </span>
          </div>

          <Link href={ctaLink} className="group">
            <span className="inline-flex items-center justify-center px-10 py-4 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 shadow-xl group-hover:scale-[1.02]">
              <span>{ctaLabel}</span>
              <ArrowRight className="ml-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
