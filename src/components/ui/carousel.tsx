"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerView?: 1 | 2 | 3 | 4;
}

export function Carousel({
  children,
  className,
  itemClassName,
  showArrows = true,
  showDots = true,
  itemsPerView = 3,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const totalItems = React.Children.count(children);
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const perViewWidths = {
    1: "basis-full",
    2: "basis-full sm:basis-1/2",
    3: "basis-full sm:basis-1/2 lg:basis-1/3",
    4: "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
  };

  return (
    <div className={cn("relative w-full space-y-6", className)}>
      {/* Viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {React.Children.map(children, (child, idx) => (
            <div
              key={idx}
              className={cn(
                "shrink-0 grow-0 transition-opacity duration-300",
                perViewWidths[itemsPerView],
                itemClassName
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-2">
        {/* Progress Dots */}
        {showDots && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? "w-8 bg-metallic"
                    : "w-2 bg-neutral-stone/30 hover:bg-neutral-stone/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Arrow Navigation */}
        {showArrows && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full border border-white/10 bg-charcoal-900 text-ivory/80 hover:text-metallic hover:border-metallic/40 transition-colors disabled:opacity-20 disabled:hover:text-ivory disabled:hover:border-white/10 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2.5 rounded-full border border-white/10 bg-charcoal-900 text-ivory/80 hover:text-metallic hover:border-metallic/40 transition-colors disabled:opacity-20 disabled:hover:text-ivory disabled:hover:border-white/10 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
