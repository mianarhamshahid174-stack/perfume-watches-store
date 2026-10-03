"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { POPULAR_SEARCHES, AutocompleteResult } from "@/services/search.service";

interface SearchExperienceProps {
  initialQuery?: string;
  onSelectResult?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchExperience({
  initialQuery = "",
  onSelectResult,
  autoFocus = false,
  className = "",
}: SearchExperienceProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [results, setResults] = React.useState<AutocompleteResult>({
    products: [],
    collections: [],
    popularSearches: POPULAR_SEARCHES,
  });
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("velora_recent_searches");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 6));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem("velora_recent_searches", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("velora_recent_searches");
    } catch {
      // ignore
    }
  };

  // Debounced API call for autocomplete
  React.useEffect(() => {
    if (!query.trim()) {
      setResults({
        products: [],
        collections: [],
        popularSearches: POPULAR_SEARCHES,
      });
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        if (data.success) {
          setResults({
            products: data.products || [],
            collections: data.collections || [],
            popularSearches: data.popularSearches || POPULAR_SEARCHES,
          });
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close autocomplete dropdown
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    saveRecentSearch(query.trim());
    setIsOpen(false);
    if (onSelectResult) onSelectResult();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    setIsOpen(false);
    if (onSelectResult) onSelectResult();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const hasAnyResults = results.products.length > 0 || results.collections.length > 0;
  const isSearchActive = query.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-white/15 focus-within:border-gold-500 transition-all duration-300 search-input-box">
          <div className="pl-4 pr-3 text-neutral-500 dark:text-neutral-400">
            <Search className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search watches, fragrances, collections..."
            autoFocus={autoFocus}
            className="w-full bg-transparent py-3.5 pr-10 text-xs sm:text-sm text-neutral-900 dark:text-sand-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none font-sans"
          />

          {/* Clear button or loading indicator */}
          <div className="pr-3 flex items-center gap-2">
            {isLoading && (
              <span className="h-4 w-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            )}

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-sand-100 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors hidden sm:block cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Autocomplete Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-neutral-950/98 backdrop-blur-xl border border-neutral-200 dark:border-white/15 shadow-2xl text-neutral-900 dark:text-sand-100 overflow-hidden max-h-[80vh] overflow-y-auto search-dropdown-menu"
          >
            {/* 1. Loading State */}
            {isLoading && !hasAnyResults && (
              <div className="p-8 text-center space-y-3">
                <span className="inline-block h-6 w-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 tracking-wider">
                  Searching catalog...
                </p>
              </div>
            )}

            {/* 2. Error State */}
            {hasError && (
              <div className="p-6 text-center space-y-3 bg-rose-50 dark:bg-rose-950/20 border-b border-rose-200 dark:border-rose-500/20">
                <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-400 mx-auto" />
                <p className="text-xs text-rose-700 dark:text-rose-300 font-light">
                  Unable to complete search. Please check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry Search</span>
                </button>
              </div>
            )}

            {/* 3. Empty State (When user searched something with 0 results) */}
            {isSearchActive && !isLoading && !hasError && !hasAnyResults && (
              <div className="p-8 text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="font-serif-luxury text-lg text-neutral-900 dark:text-sand-50">
                    No Results Found
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-sm mx-auto">
                    We couldn&apos;t find any watches, fragrances, or collections matching &quot;{query}&quot;.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 block mb-2 font-semibold">
                    Suggested Searches
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 5).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectTerm(term)}
                        className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-sand-200 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Active Results Display */}
            {hasAnyResults && (
              <div className="divide-y divide-neutral-200 dark:divide-white/5">
                {/* Matching Collections */}
                {results.collections.length > 0 && (
                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 block mb-3 font-semibold">
                      Matching Collections
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.collections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.slug}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            setIsOpen(false);
                            if (onSelectResult) onSelectResult();
                          }}
                          className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-white/5 hover:border-gold-500/40 transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                            <span className="text-xs font-serif-luxury text-neutral-900 dark:text-sand-100 group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
                              {col.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {col.productCount} {col.productCount === 1 ? "Product" : "Products"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Products */}
                {results.products.length > 0 && (
                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 block mb-3 font-semibold">
                      Matching Products
                    </span>
                    <div className="space-y-2">
                      {results.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.slug}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            setIsOpen(false);
                            if (onSelectResult) onSelectResult();
                          }}
                          className="flex items-center justify-between p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900/80 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-white/5 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded bg-neutral-100 dark:bg-neutral-900 overflow-hidden shrink-0 border border-neutral-200 dark:border-white/10">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 block">
                                {p.collectionName} • {p.sku}
                              </span>
                              <h5 className="font-serif-luxury text-sm text-neutral-900 dark:text-sand-50 group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                                {p.name}
                              </h5>
                            </div>
                          </div>

                          <div className="text-right pl-3 shrink-0">
                            <span className="font-mono text-xs text-gold-600 dark:text-gold-300 block font-semibold">
                              Rs. {p.price.toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* View all results button */}
                    <div className="pt-4 border-t border-neutral-200 dark:border-white/5 mt-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 dark:text-sand-100 hover:text-gold-600 dark:hover:text-gold-300 transition-colors cursor-pointer"
                      >
                        <span>View All Results for "{query}"</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Default Suggestions (Recent & Popular Searches) */}
            {!isSearchActive && (
              <div className="p-5 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-semibold">
                        <Clock className="h-3 w-3 text-gold-600 dark:text-gold-400" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[10px] font-mono text-neutral-400 hover:text-gold-600 dark:hover:text-gold-300 underline transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectTerm(term)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-sand-200 transition-colors cursor-pointer"
                        >
                          <Clock className="h-2.5 w-2.5 text-neutral-400" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-3 w-3" />
                    <span>Popular Searches</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectTerm(term)}
                        className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-sand-200 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
