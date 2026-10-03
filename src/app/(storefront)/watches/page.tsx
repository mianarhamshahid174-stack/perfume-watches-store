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
    cat = await prisma.category.findUnique({ where: { slug: "haute-horlogerie" } });
  } catch {
    cat = null;
  }
  const fallbackCat = FALLBACK_CATEGORIES[0];

  return {
    title: cat?.seoTitle || fallbackCat.seoTitle || "Luxury Watches | VELORA Pakistan",
    description:
      cat?.seoDescription ||
      fallbackCat.seoDescription ||
      "Explore precision mechanical watches crafted with automatic movements, sapphire crystal, and premium materials across Pakistan.",
    alternates: {
      canonical: cat?.canonicalUrl || fallbackCat.canonicalUrl || "https://velora.pk/watches",
    },
    openGraph: {
      title: cat?.seoTitle || fallbackCat.seoTitle || "Luxury Watches | VELORA Pakistan",
      description:
        cat?.seoDescription ||
        fallbackCat.seoDescription ||
        "Explore precision mechanical watches crafted with automatic movements, sapphire crystal, and premium materials across Pakistan.",
      images: [{ url: cat?.ogImage || fallbackCat.ogImage || "/images/velora-hero-editorial.jpg" }],
    },
  };
}

interface WatchesPageProps {
  searchParams: Promise<{
    collection?: string;
    minPrice?: string;
    maxPrice?: string;
    movement?: string;
    strap?: string;
    caseMaterial?: string;
    dialColor?: string;
    availability?: "in_stock" | "all";
    sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";
    search?: string;
  }>;
}

export default async function WatchesPage({ searchParams }: WatchesPageProps) {
  const resolvedParams = await searchParams;

  // Query real database products with filter parameters
  const [products, filterOptions] = await Promise.all([
    getProducts({
      categorySlug: "haute-horlogerie",
      collectionSlug: resolvedParams.collection,
      minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
      maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
      movement: resolvedParams.movement,
      strap: resolvedParams.strap,
      caseMaterial: resolvedParams.caseMaterial,
      dialColor: resolvedParams.dialColor,
      availability: resolvedParams.availability,
      sortBy: resolvedParams.sortBy,
      search: resolvedParams.search,
      limit: 60,
    }),
    getDiscoveryFilterOptions("haute-horlogerie"),
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 transition-colors duration-300">
      {/* Editorial Header */}
      <EditorialHeader
        title="Luxury Watches"
        subtitle="Precision Mechanical Craftsmanship"
        description="Hand-finished luxury watches with precision automatic movements, sapphire crystal, and premium materials. Built for collectors who value modern elegance and enduring reliability."
        imageUrl="/images/velora-hero-editorial.jpg"
        productCount={products.length}
        badge="Watches"
        breadcrumbs={[{ label: "Watches" }]}
      />

      {/* Main Catalog Section */}
      <Container size="wide" className="pt-10">
        <CatalogView
          products={products}
          mode="watches"
          filterOptions={filterOptions}
          defaultColumns={4}
        />
      </Container>
    </div>
  );
}
