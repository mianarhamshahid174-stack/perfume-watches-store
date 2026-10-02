"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { LUXURY_EASE } from "@/lib/motion";

export interface FilterOptionsData {
  collections?: Array<{ id: string; name: string; slug: string }>;
  movements?: string[];
  straps?: string[];
  caseMaterials?: string[];
  dialColors?: string[];
  fragranceFamilies?: string[];
  genders?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "watches" | "fragrances" | "all";
  options: FilterOptionsData;
}

export function FilterDrawer({
  isOpen,
  onClose,
  mode,
  options,
}: FilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current active params
  const currentCollection = searchParams.get("collection") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMovement = searchParams.get("movement") || "";
  const currentStrap = searchParams.get("strap") || "";
  const currentCase = searchParams.get("caseMaterial") || "";
  const currentDial = searchParams.get("dialColor") || "";
  const currentFamily = searchParams.get("fragranceFamily") || "";
  const currentGender = searchParams.get("gender") || "";
  const currentAvailability = searchParams.get("availability") || "";

  // Local draft state for drawer
  const [collection, setCollection] = React.useState(currentCollection);
  const [minPrice, setMinPrice] = React.useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(currentMaxPrice);
  const [movement, setMovement] = React.useState(currentMovement);
  const [strap, setStrap] = React.useState(currentStrap);
  const [caseMaterial, setCaseMaterial] = React.useState(currentCase);
  const [dialColor, setDialColor] = React.useState(currentDial);
  const [family, setFamily] = React.useState(currentFamily);
  const [gender, setGender] = React.useState(currentGender);
  const [availability, setAvailability] = React.useState(currentAvailability);

  // Sync draft state with URL params when opened
  React.useEffect(() => {
    if (isOpen) {
      setCollection(searchParams.get("collection") || "");
      setMinPrice(searchParams.get("minPrice") || "");
      setMaxPrice(searchParams.get("maxPrice") || "");
      setMovement(searchParams.get("movement") || "");
      setStrap(searchParams.get("strap") || "");
      setCaseMaterial(searchParams.get("caseMaterial") || "");
      setDialColor(searchParams.get("dialColor") || "");
      setFamily(searchParams.get("fragranceFamily") || "");
      setGender(searchParams.get("gender") || "");
      setAvailability(searchParams.get("availability") || "");
    }
  }, [isOpen, searchParams]);

  // Apply changes to URL
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (collection) params.set("collection", collection);
    else params.delete("collection");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (movement) params.set("movement", movement);
    else params.delete("movement");

    if (strap) params.set("strap", strap);
    else params.delete("strap");

    if (caseMaterial) params.set("caseMaterial", caseMaterial);
    else params.delete("caseMaterial");

    if (dialColor) params.set("dialColor", dialColor);
    else params.delete("dialColor");

    if (family) params.set("fragranceFamily", family);
    else params.delete("fragranceFamily");

    if (gender) params.set("gender", gender);
    else params.delete("gender");

    if (availability) params.set("availability", availability);
    else params.delete("availability");

    // Reset pagination to 1
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  };

  const handleReset = () => {
    setCollection("");
    setMinPrice("");
    setMaxPrice("");
    setMovement("");
    setStrap("");
    setCaseMaterial("");
    setDialColor("");
    setFamily("");
    setGender("");
    setAvailability("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("collection");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("movement");
    params.delete("strap");
    params.delete("caseMaterial");
    params.delete("dialColor");
    params.delete("fragranceFamily");
    params.delete("gender");
    params.delete("availability");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="relative z-10 w-full max-w-md bg-neutral-950 border-l border-white/10 text-sand-100 flex flex-col h-full shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-4 w-4 text-gold-400" />
                <h3 className="font-serif-luxury text-xl font-light text-sand-50">
                  Filter Products
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-white/5">
              {/* 1. Availability Filter */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                  Availability
                </span>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availability === "in_stock"}
                    onChange={(e) => setAvailability(e.target.checked ? "in_stock" : "")}
                    className="h-4 w-4 rounded bg-neutral-900 border border-neutral-700 text-gold-500 focus:ring-gold-500 focus:ring-offset-black"
                  />
                  <span className="text-xs text-sand-100 font-light">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* 2. Collection Filter (for Watches and All) */}
              {(mode === "watches" || mode === "all") && options.collections && options.collections.length > 0 && (
                <div className="pt-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                    Collection
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {options.collections.map((col) => {
                      const active = collection === col.slug;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setCollection(active ? "" : col.slug)}
                          className={`text-xs px-3.5 py-1.5 border transition-all ${
                            active
                              ? "bg-gold-400 text-black border-gold-400 font-medium"
                              : "bg-neutral-900/60 text-sand-200 border-white/10 hover:border-gold-500/40"
                          }`}
                        >
                          {col.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Price Filter */}
              <div className="pt-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                  Price Range (USD)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="$ Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-xs px-3 py-2 text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="$ Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-xs px-3 py-2 text-sand-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* WATCH FILTERS */}
              {(mode === "watches" || mode === "all") && (
                <>
                  {/* Movement */}
                  {options.movements && options.movements.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Movement Type
                      </span>
                      <div className="space-y-2">
                        {options.movements.map((mov) => {
                          const active = movement === mov;
                          return (
                            <button
                              key={mov}
                              type="button"
                              onClick={() => setMovement(active ? "" : mov)}
                              className={`w-full text-left px-3 py-2 text-xs border flex items-center justify-between transition-all ${
                                active
                                  ? "bg-gold-500/10 border-gold-500/40 text-gold-300"
                                  : "border-transparent text-neutral-300 hover:text-white"
                              }`}
                            >
                              <span>{mov}</span>
                              {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Case Material */}
                  {options.caseMaterials && options.caseMaterials.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Case Material
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {options.caseMaterials.map((mat) => {
                          const active = caseMaterial === mat;
                          return (
                            <button
                              key={mat}
                              type="button"
                              onClick={() => setCaseMaterial(active ? "" : mat)}
                              className={`text-xs px-3.5 py-1.5 border transition-all ${
                                active
                                  ? "bg-gold-400 text-black border-gold-400 font-medium"
                                  : "bg-neutral-900/60 text-sand-200 border-white/10 hover:border-gold-500/40"
                              }`}
                            >
                              {mat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dial Color */}
                  {options.dialColors && options.dialColors.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Dial Color
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {options.dialColors.map((dial) => {
                          const active = dialColor === dial;
                          return (
                            <button
                              key={dial}
                              type="button"
                              onClick={() => setDialColor(active ? "" : dial)}
                              className={`text-xs px-3.5 py-1.5 border transition-all ${
                                active
                                  ? "bg-gold-400 text-black border-gold-400 font-medium"
                                  : "bg-neutral-900/60 text-sand-200 border-white/10 hover:border-gold-500/40"
                              }`}
                            >
                              {dial}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Strap */}
                  {options.straps && options.straps.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Strap Material
                      </span>
                      <div className="space-y-1.5">
                        {options.straps.map((s) => {
                          const active = strap === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStrap(active ? "" : s)}
                              className={`w-full text-left px-3 py-2 text-xs border flex items-center justify-between transition-all ${
                                active
                                  ? "bg-gold-500/10 border-gold-500/40 text-gold-300"
                                  : "border-transparent text-neutral-300 hover:text-white"
                              }`}
                            >
                              <span>{s}</span>
                              {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* FRAGRANCE FILTERS */}
              {(mode === "fragrances" || mode === "all") && (
                <>
                  {/* Fragrance Family */}
                  {options.fragranceFamilies && options.fragranceFamilies.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Fragrance Family
                      </span>
                      <div className="space-y-1.5">
                        {options.fragranceFamilies.map((fam) => {
                          const active = family === fam;
                          return (
                            <button
                              key={fam}
                              type="button"
                              onClick={() => setFamily(active ? "" : fam)}
                              className={`w-full text-left px-3 py-2 text-xs border flex items-center justify-between transition-all ${
                                active
                                  ? "bg-gold-500/10 border-gold-500/40 text-gold-300"
                                  : "border-transparent text-neutral-300 hover:text-white"
                              }`}
                            >
                              <span>{fam}</span>
                              {active && <Check className="h-3.5 w-3.5 text-gold-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Gender */}
                  {options.genders && options.genders.length > 0 && (
                    <div className="pt-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-3">
                        Gender
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {options.genders.map((g) => {
                          const active = gender === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGender(active ? "" : g)}
                              className={`text-xs px-3.5 py-1.5 border transition-all ${
                                active
                                  ? "bg-gold-400 text-black border-gold-400 font-medium"
                                  : "bg-neutral-900/60 text-sand-200 border-white/10 hover:border-gold-500/40"
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-white/10 bg-black flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3 px-6 bg-sand-50 hover:bg-gold-300 text-black text-xs font-medium uppercase tracking-[0.2em] transition-all text-center"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
