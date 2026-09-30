"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface JournalPostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  publishedAt?: Date | string | null;
}

interface JournalPreviewSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    ctaText?: string;
    ctaLink?: string;
  };
  posts?: JournalPostData[];
}

export function JournalPreviewSection({
  title,
  subtitle,
  content,
  posts = [],
}: JournalPreviewSectionProps) {
  const headline = title || "THE JOURNAL";
  const desc =
    subtitle ||
    "Chronicles of horological innovation, artisanal techniques, and material discoveries.";
  const ctaLabel = content?.ctaText || "VIEW ALL ARTICLES";
  const ctaLink = content?.ctaLink || "/journal";

  const displayPosts = posts.slice(0, 3);

  const fallbackPosts = [
    {
      id: "f1",
      title: "The Architecture of the Flyback Calibre VA-920",
      slug: "architecture-of-the-flyback-calibre-va-920",
      excerpt:
        "An intimate look into how our Geneva micro-engineers carved three-dimensional titanium bridges to maximize chronometric stability.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1547996160-71dfabb19283?auto=format&fit=crop&w=1200&q=85",
      category: "Horology Insights",
      publishedAt: new Date(),
    },
    {
      id: "f2",
      title: "The Alchemy of Grasse: Macerating Rare Extraits",
      slug: "alchemy-of-grasse-macerating-rare-extraits",
      excerpt:
        "How 180 days of slow maceration in seasoned French oak barrels transforms raw agarwood and orris butter into liquid velvet.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
      category: "Haute Parfumerie",
      publishedAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      id: "f3",
      title: "The Geometry of Restraint: Defining Contemporary Horology",
      slug: "geometry-of-restraint-the-velora-aesthetic",
      excerpt:
        "Why subtracting superfluous ornament reveals the purest harmony between hand-brushed titanium and opaline dials.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
      category: "Maison Philosophy",
      publishedAt: new Date(Date.now() - 86400000 * 12),
    },
  ];

  const finalPosts = displayPosts.length > 0 ? displayPosts : fallbackPosts;

  return (
    <section className="py-28 sm:py-36 bg-obsidian text-sand-100 border-b border-white/5 overflow-hidden">
      <Container size="wide">
        {/* Header */}
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
                Gazette & Dispatches
              </span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-sand-50 tracking-tight">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
              {desc}
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
              href={ctaLink}
              className="inline-flex items-center text-xs font-mono tracking-[0.2em] uppercase text-platinum-400 hover:text-gold-300 transition-colors group"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* 3 Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {finalPosts.map((post, idx) => {
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent Dispatch";

            return (
              <motion.article
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: LUXURY_EASE }}
                className="group flex flex-col"
              >
                <Link href={`/journal/${post.slug}`} className="block overflow-hidden bg-neutral-950 border border-white/10 group-hover:border-gold-500/40 transition-all duration-500 mb-6">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={post.coverImageUrl || "https://images.unsplash.com/photo-1547996160-71dfabb19283?auto=format&fit=crop&w=1200&q=85"}
                      alt={post.title}
                      className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    {/* Category Tag */}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-mono tracking-widest text-sand-100 uppercase bg-black/70 backdrop-blur-md px-2.5 py-1 border border-white/10">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Article Metadata */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      <Calendar className="h-3 w-3 text-gold-400" />
                      <span>{dateStr}</span>
                    </div>

                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-sand-50 leading-snug group-hover:text-gold-300 transition-colors">
                      <Link href={`/journal/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-xs text-platinum-400 font-light leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/journal/${post.slug}`}
                      className="inline-flex items-center text-xs font-mono uppercase tracking-[0.2em] text-sand-200 hover:text-gold-400 transition-colors group/link"
                    >
                      <span>Read Dispatch</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
