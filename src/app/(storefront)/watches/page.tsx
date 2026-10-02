import { Metadata } from "next";
import { getProducts, getDiscoveryFilterOptions } from "@/services/product.service";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { CatalogView } from "@/components/storefront/discovery/catalog-view";
import { Container } from "@/components/ui/container";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: "haute-horlogerie" } });
  return {
    title: cat?.seoTitle || "Luxury Watches | VELORA",
    description:
      cat?.seoDescription ||
      "Explore precision mechanical watches crafted with in-house movements, sapphire crystal, and premium materials.",
    alternates: {
      canonical: cat?.canonicalUrl || "https://velora-ateliers.com/watches",
    },
    openGraph: {
      title: cat?.seoTitle || "Luxury Watches | VELORA",
      description:
        cat?.seoDescription ||
        "Explore precision mechanical watches crafted with in-house movements, sapphire crystal, and premium materials.",
      images: [{ url: cat?.ogImage || "/images/velora-hero-editorial.jpg" }],
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
    <div className="min-h-screen bg-obsidian text-sand-100 pb-32">
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
