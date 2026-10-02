"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface CollectionData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bannerUrl?: string | null;
  heroImage?: string | null;
  products?: any[];
}

interface CollectionsGridSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    collectionSlugs?: string[];
  };
  collections?: CollectionData[];
}

export function CollectionsGridSection({
  title,
  subtitle,
  content,
  collections = [],
}: CollectionsGridSectionProps) {
  const headline = title || "THE COLLECTIONS";
  const sub =
    subtitle || "Three distinctive expressions of design, proportion, and craftsmanship.";

  // Filter or prioritize the 3 required collections: SIGNATURE, NOIR, CLASSIC
  const targetSlugs = content?.collectionSlugs || ["signature", "noir", "classic"];

  const displayCollections = targetSlugs
    .map((slug) => collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase()))
    .filter(Boolean) as CollectionData[];

  // Fallback to collections prop if matching slugs not found
  const finalCollections =
    displayCollections.length > 0 ? displayCollections : collections.slice(0, 3);

  // Default fallback images if collection bannerUrl is not set
  const fallbackImages: Record<string, string> = {
    signature: "/images/products/watches/velora-signature-01/editorial.jpg",
    noir: "/images/products/watches/velora-noir-01/editorial.jpg",
    classic: "/images/products/watches/velora-classic-01/editorial.jpg",
  };

  return (
    <section className="py-28 sm:py-36 bg-black text-sand-100 border-b border-white/5">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: LUXURY_EASE }}
            className="space-y-3 max-w-xl"
          >
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-gold-400" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gold-400">
                Horological Repertoire
              </span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-sand-50 tracking-tight">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
              {sub}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link
              href="/collections"
              className="inline-flex items-center text-xs font-mono tracking-[0.2em] uppercase text-platinum-400 hover:text-gold-300 transition-colors group"
            >
              <span>Explore All Repertoires</span>
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* 3 Large Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {finalCollections.map((col, index) => {
            const cardImg =
              col.bannerUrl ||
              col.heroImage ||
              fallbackImages[col.slug] ||
              "/images/velora-signature-01.jpg";

            return (
              <motion.div
                key={col.id || col.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: index * 0.15, ease: LUXURY_EASE }}
              >
                <Link
                  href={`/collections/${col.slug}`}
                  className="group block relative overflow-hidden bg-neutral-950 border border-white/10 hover:border-gold-500/40 transition-all duration-500"
                >
                  {/* Tall Aspect Ratio Editorial Visual */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={cardImg}
                      alt={col.name}
                      className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-108 group-hover:brightness-[0.9]"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                    {/* Number Badge */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Bottom Card Content */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
                      <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-platinum-400 block">
                        Collection
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-sand-50 tracking-wider group-hover:text-gold-300 transition-colors">
                        {col.name}
                      </h3>
                      {col.description && (
                        <p className="text-xs text-platinum-400 font-light leading-relaxed line-clamp-2 max-w-sm">
                          {col.description}
                        </p>
                      )}

                      {/* CTA link indicator */}
                      <div className="pt-2 flex items-center text-xs font-mono uppercase tracking-[0.2em] text-sand-200 group-hover:text-gold-400 transition-colors">
                        <span>Discover Collection</span>
                        <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
