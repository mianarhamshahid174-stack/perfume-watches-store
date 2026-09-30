"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface CollectionCardProps {
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  itemCount?: number;
  featured?: boolean;
  aspectRatio?: "portrait" | "landscape" | "wide";
  className?: string;
}

export function CollectionCard({
  title,
  slug,
  description,
  imageUrl,
  itemCount,
  featured,
  aspectRatio = "portrait",
  className,
}: CollectionCardProps) {
  const aspectStyles = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    wide: "aspect-[16/9]",
  };

  return (
    <Link
      href={`/collections/${slug}`}
      className={cn(
        "group relative block overflow-hidden bg-charcoal-950 border border-white/5 hover:border-metallic/40 transition-all duration-700",
        aspectStyles[aspectRatio],
        className
      )}
    >
      {/* Background Image with Slow Zoom */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
      />

      {/* Luxury Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:via-black/50" />

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        {featured ? (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-sans font-semibold uppercase tracking-editorial bg-black/70 backdrop-blur-md text-metallic border border-metallic/30">
            Featured Series
          </span>
        ) : (
          <span />
        )}

        {itemCount !== undefined && (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-sans font-mono tracking-editorial bg-black/60 backdrop-blur-md text-ivory/80 border border-white/10">
            {itemCount} {itemCount === 1 ? "Piece" : "Pieces"}
          </span>
        )}
      </div>

      {/* Bottom Editorial Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 space-y-2.5">
        <span className="font-sans text-[10px] uppercase tracking-ultra text-metallic block">
          Curated Atelier Series
        </span>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory group-hover:text-metallic-light transition-colors leading-tight">
          {title}
        </h3>

        {description && (
          <p className="font-sans text-xs text-neutral-stone line-clamp-2 font-light leading-relaxed max-w-md">
            {description}
          </p>
        )}

        <div className="pt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-editorial text-ivory group-hover:text-metallic transition-colors">
          <span>Discover Collection</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
