"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { LUXURY_EASE } from "@/lib/motion";

export interface ImageRevealProps {
  src: string;
  alt: string;
  aspectRatio?: "portrait" | "square" | "landscape" | "wide" | "cinematic";
  className?: string;
  imageClassName?: string;
  caption?: string;
  priority?: boolean;
}

export function ImageReveal({
  src,
  alt,
  aspectRatio = "portrait",
  className,
  imageClassName,
  caption,
}: ImageRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const aspectStyles = {
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    landscape: "aspect-[4/3]",
    wide: "aspect-[16/9]",
    cinematic: "aspect-[21/9]",
  };

  return (
    <div ref={containerRef} className={cn("group flex flex-col space-y-2", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-charcoal-900 border border-white/5",
          aspectStyles[aspectRatio]
        )}
      >
        {/* Animated Reveal Mask */}
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={isInView ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1.15, ease: LUXURY_EASE }}
          className="w-full h-full"
        >
          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 1.12 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 1.4, ease: LUXURY_EASE }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 ease-out",
              imageClassName
            )}
            loading="lazy"
          />
        </motion.div>

        {/* Subtle Luxury Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60" />
      </div>

      {caption && (
        <span className="font-sans text-[11px] text-neutral-stone font-light italic tracking-normal">
          {caption}
        </span>
      )}
    </div>
  );
}
