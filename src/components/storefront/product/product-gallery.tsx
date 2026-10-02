"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ProductImageItem, ProductVideoItem } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImageItem[];
  videos?: ProductVideoItem[];
  productName: string;
}

type MediaItem =
  | { type: "image"; url: string; altText: string; id: string }
  | { type: "video"; url: string; title: string; posterUrl?: string | null; id: string };

export function ProductGallery({
  images = [],
  videos = [],
  productName,
}: ProductGalleryProps) {
  // Combine images and videos into unified media playlist
  const mediaItems: MediaItem[] = [
    ...images.map((img) => ({
      type: "image" as const,
      url: img.url,
      altText: img.altText || productName,
      id: img.id,
    })),
    ...videos.map((vid) => ({
      type: "video" as const,
      url: vid.url,
      title: vid.title || `${productName} Movement Video`,
      posterUrl: vid.posterUrl,
      id: vid.id,
    })),
  ];

  // Fallback if no media provided
  if (mediaItems.length === 0) {
    mediaItems.push({
      type: "image",
      url: "/images/velora-signature-01.jpg",
      altText: productName,
      id: "fallback-media",
    });
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const activeMedia = mediaItems[activeIndex] || mediaItems[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // swipe left -> next
        handleNext();
      } else {
        // swipe right -> prev
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    setIsZoomed(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsZoomed(false);
  };

  // Keyboard navigation for fullscreen lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "Escape") setIsFullscreen(false);
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, mediaItems.length]);

  // Interactive mouse zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || activeMedia.type !== "image") return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 select-none">
      {/* 1. THUMBNAILS (Horizontal row on mobile, Vertical column on desktop) */}
      {mediaItems.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[640px] scrollbar-none py-1 lg:w-20 shrink-0">
          {mediaItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-16 h-20 lg:w-20 lg:h-24 shrink-0 overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-gold-400 ring-1 ring-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                }`}
                aria-label={`View media ${idx + 1}`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
                    {item.posterUrl && (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                    )}
                    <Play className="w-5 h-5 text-gold-300 relative z-10 fill-gold-300/30" />
                  </div>
                )}
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. MAIN LARGE DISPLAY VIEWPORT */}
      <div className="relative flex-1 bg-neutral-950 border border-white/10 overflow-hidden group">
        <div
          ref={mainImageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => activeMedia.type === "image" && setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden flex items-center justify-center cursor-crosshair"
        >
          <AnimatePresence mode="wait">
            {activeMedia.type === "image" ? (
              <motion.div
                key={activeMedia.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                {/* Standard View */}
                <img
                  src={activeMedia.url}
                  alt={activeMedia.altText}
                  className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                    isZoomed ? "scale-105" : "scale-100"
                  }`}
                />

                {/* Interactive High-Res Magnification Lens overlay on hover */}
                {isZoomed && (
                  <div
                    className="hidden lg:block absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${activeMedia.url})`,
                      backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      backgroundSize: "220%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeMedia.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative bg-black flex items-center justify-center"
              >
                <video
                  ref={videoRef}
                  src={activeMedia.url}
                  poster={activeMedia.posterUrl || undefined}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-sm">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleVideoPlayback}
                      className="text-sand-100 hover:text-gold-300 transition-colors p-1"
                      aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-sand-100 hover:text-gold-300 transition-colors p-1"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Atelier 4K Cinema
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Floating Actions: Zoom Hint & Fullscreen */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2.5 bg-black/60 hover:bg-black/90 text-sand-100 hover:text-gold-300 backdrop-blur-md border border-white/10 transition-all rounded-sm cursor-pointer shadow-lg"
              title="Expand to Fullscreen Lightbox (Esc)"
              aria-label="Fullscreen view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-sand-100 hover:text-gold-300 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all rounded-sm cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-sand-100 hover:text-gold-300 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all rounded-sm cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile Swipe Indicators / Dots */}
          {mediaItems.length > 1 && (
            <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              {mediaItems.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-4 bg-gold-400"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. FULLSCREEN CINEMATIC LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center z-20">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400">
                  {productName}
                </span>
                <p className="text-xs text-neutral-400 font-sans">
                  Slide {activeIndex + 1} of {mediaItems.length}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 text-sand-100 hover:text-rose-400 border border-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close fullscreen view"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Center Media */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {activeMedia.type === "image" ? (
                <motion.img
                  key={activeMedia.url}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={activeMedia.url}
                  alt={activeMedia.altText}
                  className="max-h-[82vh] max-w-full object-contain shadow-2xl"
                />
              ) : (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="max-h-[82vh] max-w-full object-contain"
                />
              )}

              {/* Next / Prev Buttons */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-sand-100 hover:text-gold-300 border border-white/10 rounded-full transition-colors"
                    aria-label="Previous media"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-black text-sand-100 hover:text-gold-300 border border-white/10 rounded-full transition-colors"
                    aria-label="Next media"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-20">
              {mediaItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-14 shrink-0 overflow-hidden border transition-all ${
                    idx === activeIndex
                      ? "border-gold-400 ring-1 ring-gold-400"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.type === "image" ? item.url : item.posterUrl || item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
