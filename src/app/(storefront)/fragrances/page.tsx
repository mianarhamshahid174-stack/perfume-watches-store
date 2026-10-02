import { Metadata } from "next";
import { getProducts, getDiscoveryFilterOptions } from "@/services/product.service";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { CatalogView } from "@/components/storefront/discovery/catalog-view";
import { Container } from "@/components/ui/container";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: "haute-parfumerie" } });
  return {
    title: cat?.seoTitle || "High Perfumery Extraits | VELORA Laboratories Grasse",
    description:
      cat?.seoDescription ||
      "Ultra-concentrated extraits de parfum aged in French oak vats. Wild Cambodian agarwood, Florentine orris butter, and rare ambergris.",
    alternates: {
      canonical: cat?.canonicalUrl || "https://velora-ateliers.com/fragrances",
    },
    openGraph: {
      title: cat?.seoTitle || "High Perfumery Extraits | VELORA",
      description:
        cat?.seoDescription ||
        "Ultra-concentrated extraits de parfum aged in French oak vats.",
      images: [{ url: cat?.ogImage || "/images/velora-hero-editorial.jpg" }],
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
    <div className="min-h-screen bg-obsidian text-sand-100 pb-32">
      {/* Editorial Header */}
      <EditorialHeader
        title="High Perfumery"
        subtitle="The Olfactive Sanctuary"
        description="Compounded in small batches in Grasse, France. Formulated with wild orris butter, aged Cambodian agarwood, May rose absolutes, and rare ambers macerated for six months in seasoned oak casks."
        imageUrl="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=85"
        productCount={products.length}
        badge="Laboratories Grasse"
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
