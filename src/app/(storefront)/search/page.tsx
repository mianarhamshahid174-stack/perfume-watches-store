import { Metadata } from "next";
import { getProducts, getDiscoveryFilterOptions } from "@/services/product.service";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { CatalogView } from "@/components/storefront/discovery/catalog-view";
import { SearchExperience } from "@/components/storefront/search-experience";
import { Container } from "@/components/ui/container";
import { POPULAR_SEARCHES } from "@/services/search.service";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    collection?: string;
    minPrice?: string;
    maxPrice?: string;
    movement?: string;
    strap?: string;
    caseMaterial?: string;
    dialColor?: string;
    fragranceFamily?: string;
    gender?: string;
    availability?: "in_stock" | "all";
    sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q) {
    return {
      title: "Search | VELORA",
      description: "Search our collection of luxury watches and fine fragrances.",
    };
  }

  return {
    title: `Search: "${q}" | VELORA`,
    description: `Search results for "${q}" at VELORA.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  // Perform real database query across name, SKU, collections, tags, and description
  const [products, filterOptions] = await Promise.all([
    query
      ? getProducts({
          search: query,
          collectionSlug: resolvedParams.collection,
          minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
          maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
          movement: resolvedParams.movement,
          strap: resolvedParams.strap,
          caseMaterial: resolvedParams.caseMaterial,
          dialColor: resolvedParams.dialColor,
          fragranceFamily: resolvedParams.fragranceFamily,
          gender: resolvedParams.gender,
          availability: resolvedParams.availability,
          sortBy: resolvedParams.sortBy,
          limit: 60,
        })
      : Promise.resolve([]),
    getDiscoveryFilterOptions(),
  ]);

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pb-32">
      {/* Editorial Header */}
      <EditorialHeader
        title={query ? `Search: "${query}"` : "Search Products"}
        subtitle={query ? "Search Results" : "Explore Watches & Fragrances"}
        description={
          query
            ? `Showing results for "${query}" across watches, fragrances, and collections.`
            : "Search by product name, collection, materials, movement, or fragrance notes."
        }
        productCount={query ? products.length : undefined}
        badge="Search"
        breadcrumbs={[{ label: "Search" }]}
      />

      <Container size="wide" className="pt-10">
        {/* Interactive Search Bar with Autocomplete */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchExperience initialQuery={query} />
        </div>

        {/* State 1: Active query with results */}
        {query && products.length > 0 && (
          <CatalogView
            products={products}
            mode="all"
            filterOptions={filterOptions}
            defaultColumns={4}
          />
        )}

        {/* State 2: Active query with 0 results */}
        {query && products.length === 0 && (
          <div className="py-16 text-center space-y-8 max-w-lg mx-auto">
            <div className="space-y-3">
              <h3 className="font-serif-luxury text-3xl font-light text-sand-50">
                No Results for &quot;{query}&quot;
              </h3>
              <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed">
                We couldn&apos;t find any products matching your search. Try different keywords or browse our popular searches below.
              </p>
            </div>

            {/* Popular Searches Suggestions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-gold-500/40 text-xs text-sand-200 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links to Repertoire */}
            <div className="flex items-center justify-center gap-6 pt-6 text-xs font-mono uppercase tracking-wider text-sand-100">
              <Link href="/watches" className="hover:text-gold-300 transition-colors underline">
                All Watches
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/fragrances" className="hover:text-gold-300 transition-colors underline">
                All Fragrances
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/collections" className="hover:text-gold-300 transition-colors underline">
                All Collections
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Empty query initial state */}
        {!query && (
          <div className="py-16 text-center space-y-10 max-w-2xl mx-auto">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                Search Catalog
              </span>
              <h3 className="font-serif-luxury text-3xl font-light text-sand-50">
                Explore The VELORA Collection
              </h3>
              <p className="text-xs sm:text-sm text-platinum-400 font-light leading-relaxed max-w-md mx-auto">
                Type in the search bar above or explore popular searches, collections, and featured items below.
              </p>
            </div>

            {/* Popular Searches */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap justify-center gap-2.5">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-neutral-950 border border-white/10 hover:border-gold-500/40 text-xs text-sand-100 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collections Grid Shortcuts */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/collections/signature"
                className="p-5 bg-neutral-950/60 border border-white/5 hover:border-gold-500/30 transition-all text-left group"
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                  Collection
                </span>
                <h4 className="font-serif-luxury text-lg text-sand-50 group-hover:text-gold-300 transition-colors">
                  Signature
                </h4>
                <p className="text-[11px] text-neutral-400 font-light line-clamp-2 mt-1">
                  The definitive archetype of modern horological restraint.
                </p>
              </Link>

              <Link
                href="/collections/noir"
                className="p-5 bg-neutral-950/60 border border-white/5 hover:border-gold-500/30 transition-all text-left group"
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                  Collection
                </span>
                <h4 className="font-serif-luxury text-lg text-sand-50 group-hover:text-gold-300 transition-colors">
                  Noir
                </h4>
                <p className="text-[11px] text-neutral-400 font-light line-clamp-2 mt-1">
                  Monochromatic mastery in DLC titanium and shadowed ruthenium.
                </p>
              </Link>

              <Link
                href="/collections/classic"
                className="p-5 bg-neutral-950/60 border border-white/5 hover:border-gold-500/30 transition-all text-left group"
              >
                <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                  Collection
                </span>
                <h4 className="font-serif-luxury text-lg text-sand-50 group-hover:text-gold-300 transition-colors">
                  Classic
                </h4>
                <p className="text-[11px] text-neutral-400 font-light line-clamp-2 mt-1">
                  Enduring proportions, Grand Feu enamel, and heritage complications.
                </p>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
