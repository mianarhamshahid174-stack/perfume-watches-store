"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, LayoutGrid, Grid3X3, ArrowUpDown } from "lucide-react";
import { FilterDrawer, FilterOptionsData } from "./filter-drawer";

interface FilterBarProps {
  totalCount: number;
  mode: "watches" | "fragrances" | "all";
  options: FilterOptionsData;
  columns?: 3 | 4;
  onColumnsChange?: (cols: 3 | 4) => void;
}

export function FilterBar({
  totalCount,
  mode,
  options,
  columns = 4,
  onColumnsChange,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Active filters count
  const activeParams = [
    "collection",
    "minPrice",
    "maxPrice",
    "movement",
    "strap",
    "caseMaterial",
    "dialColor",
    "fragranceFamily",
    "gender",
    "availability",
  ];

  const activeCount = activeParams.filter((p) => searchParams.has(p)).length;

  const currentSort = searchParams.get("sortBy") || "featured";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "featured") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", newSort);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    activeParams.forEach((key) => params.delete(key));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Build list of active filter chips
  const activeChips: Array<{ key: string; label: string }> = [];
  if (searchParams.get("collection")) {
    const colSlug = searchParams.get("collection")!;
    const colName =
      options.collections?.find((c) => c.slug === colSlug)?.name || colSlug;
    activeChips.push({ key: "collection", label: `Collection: ${colName}` });
  }
  if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    let label = "Price: ";
    if (min && max) label += `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
    else if (min) label += `> $${Number(min).toLocaleString()}`;
    else if (max) label += `< $${Number(max).toLocaleString()}`;
    activeChips.push({ key: min ? "minPrice" : "maxPrice", label });
  }
  if (searchParams.get("movement")) {
    activeChips.push({ key: "movement", label: `Movement: ${searchParams.get("movement")}` });
  }
  if (searchParams.get("caseMaterial")) {
    activeChips.push({ key: "caseMaterial", label: `Case: ${searchParams.get("caseMaterial")}` });
  }
  if (searchParams.get("dialColor")) {
    activeChips.push({ key: "dialColor", label: `Dial: ${searchParams.get("dialColor")}` });
  }
  if (searchParams.get("strap")) {
    activeChips.push({ key: "strap", label: `Strap: ${searchParams.get("strap")}` });
  }
  if (searchParams.get("fragranceFamily")) {
    activeChips.push({ key: "fragranceFamily", label: `Family: ${searchParams.get("fragranceFamily")}` });
  }
  if (searchParams.get("gender")) {
    activeChips.push({ key: "gender", label: `Gender: ${searchParams.get("gender")}` });
  }
  if (searchParams.get("availability") === "in_stock") {
    activeChips.push({ key: "availability", label: "In Stock Only" });
  }

  return (
    <>
      <div className="py-6 border-b border-[var(--border-subtle)] space-y-4 mb-8">
        {/* Main Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Filter Trigger & Total Count */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:text-metallic text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-metallic" />
              <span>Filter Products</span>
              {activeCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-metallic text-black text-[10px] font-bold flex items-center justify-center font-mono ml-1">
                  {activeCount}
                </span>
              )}
            </button>

            <span className="text-xs font-mono text-[var(--color-neutral-stone)] hidden sm:inline">
              {totalCount} {totalCount === 1 ? "Product" : "Products"}
            </span>
          </div>

          {/* Right: Grid Switcher & Sort Selector */}
          <div className="flex items-center gap-4 self-end sm:self-center">
            {/* Desktop Column Switcher */}
            {onColumnsChange && (
              <div className="hidden lg:flex items-center gap-1 border border-[var(--border-subtle)] p-1 bg-[var(--surface)]">
                <button
                  type="button"
                  onClick={() => onColumnsChange(3)}
                  className={`p-1.5 transition-colors cursor-pointer ${
                    columns === 3 ? "text-metallic bg-[var(--surface-hover)]" : "text-[var(--color-neutral-stone)] hover:text-[var(--foreground)]"
                  }`}
                  title="3 Columns"
                  aria-label="3 Columns View"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onColumnsChange(4)}
                  className={`p-1.5 transition-colors cursor-pointer ${
                    columns === 4 ? "text-metallic bg-[var(--surface-hover)]" : "text-[var(--color-neutral-stone)] hover:text-[var(--foreground)]"
                  }`}
                  title="4 Columns"
                  aria-label="4 Columns View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-neutral-stone)] hidden md:inline">
                Sort:
              </span>
              <div className="relative">
                <select
                  value={currentSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-10 pl-3 pr-8 bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--foreground)] text-xs font-mono tracking-wide focus:outline-none focus:border-metallic appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="best-selling">Best Selling</option>
                </select>
                <ArrowUpDown className="h-3 w-3 text-[var(--color-neutral-stone)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in duration-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mr-1">
              Active:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-gold-500/30 text-sand-100 text-xs font-light"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(chip.key)}
                  className="p-0.5 text-neutral-400 hover:text-gold-300"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 underline ml-2 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={mode}
        options={options}
      />
    </>
  );
}
