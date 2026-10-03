"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LUXURY_EASE } from "@/lib/motion";

interface CraftsmanshipDetail {
  key: string;
  title: string;
  category?: string;
  description: string;
  imageUrl?: string;
}

interface CraftsmanshipGallerySectionProps {
  title?: string | null;
  subtitle?: string | null;
  content?: {
    details?: CraftsmanshipDetail[];
  };
}

const DEFAULT_DETAILS: CraftsmanshipDetail[] = [
  {
    key: "dial",
    title: "The Dial",
    category: "OPALINE FINISH",
    description:
      "Warm opaline dial with hand-applied gold hour markers and a fine minute track.",
    imageUrl: "/images/products/watches/velora-signature-01/dial-macro.jpg",
  },
  {
    key: "hands",
    title: "The Hands",
    category: "BLUED STEEL",
    description:
      "Heat-tempered blued steel leaf hands, beveled by hand to reflect natural light.",
    imageUrl: "/images/products/watches/velora-signature-01/front.jpg",
  },
  {
    key: "crown",
    title: "The Crown",
    category: "TACTILE KNURLING",
    description:
      "Knurled winding crown with dual internal gaskets for smooth, water-resistant operation.",
    imageUrl: "/images/products/watches/velora-signature-01/crown-macro.jpg",
  },
  {
    key: "case",
    title: "The Case",
    category: "904L STEEL",
    description:
      "Surgical 904L stainless steel case with brushed sides and mirror-polished chamfers.",
    imageUrl: "/images/products/watches/velora-signature-01/case-macro.jpg",
  },
  {
    key: "strap",
    title: "The Strap",
    category: "SADDLE-STITCHED LEATHER",
    description:
      "Hand-stitched French calfskin leather with durable wax-thread saddle stitching.",
    imageUrl: "/images/products/watches/velora-signature-01/strap-clasp.jpg",
  },
  {
    key: "clasp",
    title: "The Clasp",
    category: "DEPLOYANT BUCKLE",
    description:
      "Solid stainless steel folding deployant clasp with a secure quick-release trigger.",
    imageUrl: "/images/products/watches/velora-signature-01/strap-clasp.jpg",
  },
];

export function CraftsmanshipGallerySection({
  title,
  subtitle,
  content,
}: CraftsmanshipGallerySectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const headline = title || "MICROMECHANICAL EXCELLENCE";
  const desc =
    subtitle ||
    "Every facet inspected at forty-times magnification before leaving our benches.";
  const details = content?.details && content.details.length > 0
    ? content.details
    : DEFAULT_DETAILS;

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    updateScrollButtons();
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        ref.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-32 sm:py-40 bg-[var(--background)] text-[var(--foreground)] border-b border-white/5 overflow-hidden">
      <Container size="wide">
        {/* Section Header with Left/Right Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-gold-400" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-gold-400">
                Atelier Anatomy
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-sand-50 tracking-tight">
              {headline}
            </h2>
            <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="h-11 w-11 rounded-full border border-white/15 bg-neutral-950 flex items-center justify-center text-platinum-300 hover:text-gold-300 hover:border-gold-500/40 disabled:opacity-20 disabled:hover:border-white/15 disabled:hover:text-platinum-300 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="h-11 w-11 rounded-full border border-white/15 bg-neutral-950 flex items-center justify-center text-platinum-300 hover:text-gold-300 hover:border-gold-500/40 disabled:opacity-20 disabled:hover:border-white/15 disabled:hover:text-platinum-300 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Gallery */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory will-change-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {details.map((item, idx) => (
            <motion.div
              key={item.key || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: LUXURY_EASE }}
              className="shrink-0 w-[280px] sm:w-[340px] snap-start group"
            >
              <div className="relative aspect-[4/5] rounded-none overflow-hidden bg-neutral-950 border border-white/10 group-hover:border-gold-500/30 transition-all duration-500">
                {/* Macro Detail Image */}
                <img
                  src={item.imageUrl || "/images/velora-signature-01.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[0.9]"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                {/* Key Index Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10">
                    0{idx + 1} • {item.key.toUpperCase()}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-platinum-400 block">
                    {item.category || "Craftsmanship"}
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-light text-sand-50 tracking-wide group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-platinum-300 font-light leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
