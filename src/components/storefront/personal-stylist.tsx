"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { FALLBACK_PRODUCTS } from "@/lib/catalog-data";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/context/cart-context";
import {
  Sparkles,
  Watch,
  Flame,
  Gift,
  Check,
  RotateCcw,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Sliders,
  DollarSign,
  Heart,
} from "lucide-react";

type Discipline = "all" | "watches" | "fragrances";
type Occasion = "daily" | "executive" | "gala" | "gift";
type StylePref = "classic" | "modern_noir" | "oud_amber" | "sport";
type BudgetTier = "under50k" | "50k_150k" | "150k_300k" | "above300k";

export function PersonalStylist() {
  const { addToCart, openCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [discipline, setDiscipline] = useState<Discipline>("all");
  const [occasion, setOccasion] = useState<Occasion>("executive");
  const [stylePref, setStylePref] = useState<StylePref>("classic");
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("50k_150k");
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Calculate tailored recommendations based on customer choices
  const getRecommendations = () => {
    let list = [...FALLBACK_PRODUCTS];

    // Filter discipline
    if (discipline === "watches") {
      list = list.filter((p) => p.category?.slug === "haute-horlogerie");
    } else if (discipline === "fragrances") {
      list = list.filter((p) => p.category?.slug === "high-perfumery");
    }

    // Filter budget in PKR
    list = list.filter((p) => {
      const price = Number(p.price);
      if (budgetTier === "under50k") return price <= 50000;
      if (budgetTier === "50k_150k") return price >= 40000 && price <= 160000;
      if (budgetTier === "150k_300k") return price >= 120000 && price <= 320000;
      if (budgetTier === "above300k") return price >= 250000;
      return true;
    });

    // If too few results, fallback to best matching category
    if (list.length === 0) {
      if (discipline === "fragrances") {
        list = FALLBACK_PRODUCTS.filter((p) => p.category?.slug === "high-perfumery");
      } else {
        list = FALLBACK_PRODUCTS.filter((p) => p.category?.slug === "haute-horlogerie");
      }
    }

    // Filter style preference keywords
    if (stylePref === "modern_noir") {
      const noir = list.filter((p) => p.name.toLowerCase().includes("noir") || p.slug.includes("noir"));
      if (noir.length > 0) list = [...noir, ...list.filter((p) => !noir.includes(p))];
    } else if (stylePref === "oud_amber") {
      const oud = list.filter((p) => p.name.toLowerCase().includes("oud") || p.name.toLowerCase().includes("amber"));
      if (oud.length > 0) list = [...oud, ...list.filter((p) => !oud.includes(p))];
    }

    return list.slice(0, 3);
  };

  const handleQuickAdd = (product: any) => {
    addToCart(product, null, 1);
    setAddedIds((prev) => [...prev, product.id]);
    openCart();
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 3000);
  };

  const resetQuiz = () => {
    setStep(1);
    setDiscipline("all");
    setOccasion("executive");
    setStylePref("classic");
    setBudgetTier("50k_150k");
  };

  const recommendedItems = getRecommendations();

  return (
    <section className="py-32 sm:py-40 bg-card border-t border-b border-border overflow-hidden transition-colors duration-300">
      <Container size="wide">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-[11px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Luxury Advisor • Pakistan</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-foreground tracking-tight">
              Tell Us What You Are Looking For
            </h2>
            <p className="text-xs sm:text-sm text-neutral-stone font-light max-w-xl mx-auto leading-relaxed">
              Answer 4 brief questions and our luxury advisor will immediately curate the finest timepieces and perfumes tailored to your taste, occasion, and budget.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-md mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  s < step
                    ? "bg-gold-500"
                    : s === step
                    ? "bg-gold-500/80"
                    : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Interactive Steps */}
          <div className="bg-background border border-border p-6 sm:p-10 shadow-sm min-h-[380px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {/* STEP 1: Discipline */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
                      Question 1 of 4
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-foreground font-light">
                      What are you interested in curating today?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {[
                      {
                        id: "watches",
                        label: "Luxury Watch",
                        desc: "Automatic mechanical timepieces, tourbillons & chronographs",
                        icon: Watch,
                      },
                      {
                        id: "fragrances",
                        label: "Fine Fragrance",
                        desc: "Pure concentrated perfumes, aged agarwood & rare florals",
                        icon: Flame,
                      },
                      {
                        id: "all",
                        label: "Complete Set / Gift",
                        desc: "Curated watch & fragrance combination for prestige occasions",
                        icon: Gift,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDiscipline(item.id as Discipline)}
                        className={`p-5 text-left border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                          discipline === item.id
                            ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500"
                            : "bg-card border-border hover:border-gold-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <item.icon
                            className={`w-6 h-6 ${
                              discipline === item.id ? "text-gold-600 dark:text-gold-400" : "text-neutral-stone group-hover:text-foreground"
                            }`}
                          />
                          {discipline === item.id && (
                            <span className="w-5 h-5 rounded-full bg-gold-500 text-black flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif-luxury text-lg text-foreground font-medium">{item.label}</h4>
                          <p className="text-xs text-neutral-stone font-light mt-1">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Occasion */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
                      Question 2 of 4
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-foreground font-light">
                      What is the primary occasion or setting?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      {
                        id: "executive",
                        title: "Executive & Corporate",
                        desc: "Boardroom authority, subtle prestige, sharp bespoke tailoring",
                      },
                      {
                        id: "gala",
                        title: "Weddings & Evening Galas",
                        desc: "Opulent presence, gold dials, deep oud projection for celebration",
                      },
                      {
                        id: "daily",
                        title: "Daily Versatility & Casual Elegance",
                        desc: "Resilient stainless steel, fresh versatile citrus, everyday luxury",
                      },
                      {
                        id: "gift",
                        title: "Prestige Milestone Gift",
                        desc: "Anniversaries, birthdays, promotions with luxury velvet packaging",
                      },
                    ].map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setOccasion(occ.id as Occasion)}
                        className={`p-5 text-left border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                          occasion === occ.id
                            ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500"
                            : "bg-card border-border hover:border-gold-500/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-serif-luxury text-base sm:text-lg text-foreground font-medium">
                            {occ.title}
                          </h4>
                          <p className="text-xs text-neutral-stone font-light">{occ.desc}</p>
                        </div>
                        {occasion === occ.id && (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-gold-500 text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Style Preference */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
                      Question 3 of 4
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-foreground font-light">
                      Which aesthetic appeal resonates most with you?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      {
                        id: "classic",
                        title: "Classic Gold & Italian Leather",
                        desc: "Champagne dials, warm roman numerals, timeless alligator straps",
                      },
                      {
                        id: "modern_noir",
                        title: "Noir Ceramic & Matte Titanium",
                        desc: "Dark monochromatic styling, skeleton dials, contemporary minimalism",
                      },
                      {
                        id: "oud_amber",
                        title: "Rich Aged Oud & Amber Accents",
                        desc: "Warm Eastern notes, intense sillage, warm royal craftsmanship",
                      },
                      {
                        id: "sport",
                        title: "Precision Sport Chronograph",
                        desc: "904L surgical stainless steel, tachymeter bezels, 100m water resistance",
                      },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStylePref(st.id as StylePref)}
                        className={`p-5 text-left border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                          stylePref === st.id
                            ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500"
                            : "bg-card border-border hover:border-gold-500/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-serif-luxury text-base sm:text-lg text-foreground font-medium">
                            {st.title}
                          </h4>
                          <p className="text-xs text-neutral-stone font-light">{st.desc}</p>
                        </div>
                        {stylePref === st.id && (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-gold-500 text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Budget in PKR */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
                      Question 4 of 4
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-foreground font-light">
                      What is your preferred investment budget (in PKR)?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      {
                        id: "under50k",
                        title: "Under Rs. 50,000",
                        desc: "Introductory luxury fragrances & refined accessible timepieces",
                      },
                      {
                        id: "50k_150k",
                        title: "Rs. 50,000 – Rs. 150,000",
                        desc: "Most popular tier: Sapphire automatic watches & signature perfume extracts",
                      },
                      {
                        id: "150k_300k",
                        title: "Rs. 150,000 – Rs. 300,000",
                        desc: "Complicated chronographs, diamond dials, aged reserve oud oils",
                      },
                      {
                        id: "above300k",
                        title: "Collector Tier (Rs. 300,000+)",
                        desc: "Flying tourbillons, limited production numbering, private client concierge",
                      },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBudgetTier(bg.id as BudgetTier)}
                        className={`p-5 text-left border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                          budgetTier === bg.id
                            ? "bg-gold-500/10 border-gold-500 ring-1 ring-gold-500"
                            : "bg-card border-border hover:border-gold-500/40"
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="font-serif-luxury text-base sm:text-lg text-foreground font-medium">
                            {bg.title}
                          </h4>
                          <p className="text-xs text-neutral-stone font-light">{bg.desc}</p>
                        </div>
                        {budgetTier === bg.id && (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-gold-500 text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Curated Results */}
              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
                          Curated For You
                        </span>
                      </div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl text-foreground font-light">
                        Your Tailored VELORA Selection
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-stone hover:text-foreground transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Advisor</span>
                    </button>
                  </div>

                  {/* Recommendation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {recommendedItems.map((prod) => {
                      const isAdded = addedIds.includes(prod.id);

                      return (
                        <div
                          key={prod.id}
                          className="bg-card border border-border flex flex-col justify-between overflow-hidden group hover:border-gold-500/50 transition-all shadow-sm"
                        >
                          <div>
                            {/* Product Visual */}
                            <Link href={`/product/${prod.slug}`} className="block relative aspect-square bg-muted overflow-hidden">
                              <img
                                src={prod.images[0]?.url || "/images/velora-signature-01.jpg"}
                                alt={prod.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 bg-black/80 text-sand-50 backdrop-blur-md border border-white/10">
                                  {prod.category?.name || "Luxury"}
                                </span>
                              </div>
                            </Link>

                            {/* Details */}
                            <div className="p-5 space-y-2">
                              <span className="text-[10px] font-mono text-neutral-stone uppercase tracking-wider block">
                                {prod.sku}
                              </span>
                              <Link href={`/product/${prod.slug}`}>
                                <h4 className="font-serif-luxury text-lg text-foreground font-medium group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                                  {prod.name}
                                </h4>
                              </Link>
                              <p className="text-xs text-neutral-stone font-light line-clamp-2">
                                {prod.shortDescription || prod.description}
                              </p>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="p-5 pt-0 space-y-3">
                            <div className="flex items-center justify-between border-t border-border pt-3">
                              <span className="text-[11px] font-mono text-neutral-stone">Pakistan Price:</span>
                              <span className="font-mono text-sm font-bold text-gold-600 dark:text-gold-400">
                                {formatPrice(Number(prod.price))}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleQuickAdd(prod)}
                              className="w-full py-2.5 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isAdded ? "Added to Bag" : "Quick Add to Bag"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-muted/60 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-neutral-stone">
                      Prefer bespoke consultation or live video demonstration on WhatsApp?
                    </span>
                    <a
                      href="https://wa.me/923356600174?text=Hi%20Velora%2C%20I%20completed%20the%20Personal%20Advisor%20and%20would%20like%20to%20inquire%20about%20recommendations."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase font-mono tracking-wider hover:underline flex items-center gap-1.5"
                    >
                      <span>WhatsApp Concierge</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Buttons */}
            {step < 5 && (
              <div className="pt-8 border-t border-border flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
                    className="px-5 py-2.5 border border-border hover:border-foreground text-xs font-mono uppercase tracking-wider text-neutral-stone hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(5, s + 1) as any)}
                  className="px-7 py-3 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{step === 4 ? "View Recommendations" : "Next Question"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
