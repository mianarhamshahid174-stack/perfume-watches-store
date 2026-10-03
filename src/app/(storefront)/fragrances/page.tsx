import { Metadata } from "next";
import { getProducts, getDiscoveryFilterOptions } from "@/services/product.service";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { CatalogView } from "@/components/storefront/discovery/catalog-view";
import { Container } from "@/components/ui/container";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { FALLBACK_CATEGORIES } from "@/lib/catalog-data";

export async function generateMetadata(): Promise<Metadata> {
  let cat: any = null;
  try {
    cat = await prisma.category.findUnique({ where: { slug: "haute-parfumerie" } });
  } catch {
    cat = null;
  }
  const fallbackCat = FALLBACK_CATEGORIES[1];

  return {
    title: cat?.seoTitle || fallbackCat.seoTitle || "Luxury Fragrances | VELORA Pakistan",
    description:
      cat?.seoDescription ||
      fallbackCat.seoDescription ||
      "Discover luxury perfumes crafted with pure essential oils, rich woody notes, and exceptional all-day longevity.",
    alternates: {
      canonical: cat?.canonicalUrl || fallbackCat.canonicalUrl || "https://velora.pk/fragrances",
    },
    openGraph: {
      title: cat?.seoTitle || fallbackCat.seoTitle || "Luxury Fragrances | VELORA Pakistan",
      description:
        cat?.seoDescription ||
        fallbackCat.seoDescription ||
        "Discover luxury perfumes crafted with pure essential oils, rich woody notes, and exceptional all-day longevity.",
      images: [{ url: cat?.ogImage || fallbackCat.ogImage || "/images/velora-hero-editorial.jpg" }],
    },
  };
}

interface FragrancesPageProps {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    fragranceFamily?: string;
    gender?: string;
    availability?: "in_stock" | "all";
    sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";
    search?: string;
  }>;
}

export default async function FragrancesPage({ searchParams }: FragrancesPageProps) {
  const resolvedParams = await searchParams;

  // Query real database products with fragrance filters
  const [products, filterOptions] = await Promise.all([
    getProducts({
      categorySlug: "high-perfumery",
      minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
      maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
      fragranceFamily: resolvedParams.fragranceFamily,
      gender: resolvedParams.gender,
      availability: resolvedParams.availability,
      sortBy: resolvedParams.sortBy,
      search: resolvedParams.search,
      limit: 60,
    }),
    getDiscoveryFilterOptions("high-perfumery"),
  ]);

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pb-32 transition-colors duration-300">
      {/* Editorial Header */}
      <EditorialHeader
        title="Luxury Fragrances"
        subtitle="Artisanal Fine Perfumes"
        description="Handcrafted in small batches using pure essential oils, rare woods, and floral notes. Each fragrance is carefully aged for depth, balance, and all-day longevity."
        imageUrl="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=85"
        productCount={products.length}
        badge="Fragrances"
        breadcrumbs={[{ label: "Fragrances" }]}
      />

      {/* Main Catalog Section */}
      <Container size="wide" className="pt-10">
        <CatalogView
          products={products}
          mode="fragrances"
          filterOptions={filterOptions}
          defaultColumns={4}
        />
      </Container>
    </div>
  );
}
