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
    category: "OPALINE FINISHING",
    description:
      "Opaline surface treated with hand-applied faceted markers and micro-grooved track.",
    imageUrl: "/images/velora-signature-01.jpg",
  },
  {
    key: "hands",
    title: "The Hands",
    category: "FACETED POLISHING",
    description:
      "Diamond-cut dauphine hands, mirror-beveled at 45° to catch fleeting ambient light.",
    imageUrl:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "crown",
    title: "The Crown",
    category: "FLUTED KNURLING",
    description:
      "Double-fluted knurled crown with laser-engraved Maison monogram and dual gasket sealing.",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "case",
    title: "The Case",
    category: "316L ARCHITECTURE",
    description:
      "Surgically forged 316L stainless steel with alternating brushed flanks and mirror-polished bezel.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "strap",
    title: "The Strap",
    category: "HORWEEN LEATHER",
    description:
      "Hand-stitched Horween Noir alligator leather with hypoallergenic vegetal calfskin lining.",
    imageUrl:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=85",
  },
  {
    key: "clasp",
    title: "The Clasp",
    category: "DEPLOYANT MECHANISM",
    description:
      "Solid stainless steel butterfly deployant mechanism with dual micro-sprung safety release triggers.",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85",
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
    <section className="py-28 sm:py-36 bg-black text-sand-100 border-b border-white/5 overflow-hidden">
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
