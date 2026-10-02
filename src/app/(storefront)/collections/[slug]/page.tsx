import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getProducts, getDiscoveryFilterOptions } from "@/services/product.service";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { CatalogView } from "@/components/storefront/discovery/catalog-view";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
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
    search?: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const col = await prisma.collection.findUnique({ where: { slug } });
  if (!col) return { title: "Collection Not Found | VELORA" };

  return {
    title: `${col.name} Collection | VELORA Haute Horlogerie`,
    description: col.description || `Discover the ${col.name} repertoire of fine luxury creations.`,
  };
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const collection = await prisma.collection.findUnique({
    where: { slug },
  });

  if (!collection) {
    notFound();
  }

  // Determine mode based on slug or contents
  const isFragranceCol = slug === "nocturne-prive" || slug.includes("parfum") || slug.includes("fragrance");
  const mode = isFragranceCol ? "fragrances" : "watches";

  // Query real database products belonging to this collection with filter parameters
  const [products, filterOptions] = await Promise.all([
    getProducts({
      collectionSlug: slug,
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
      search: resolvedParams.search,
      limit: 60,
    }),
    getDiscoveryFilterOptions(),
  ]);

  const fallbackBanners: Record<string, string> = {
    signature: "/images/velora-hero-editorial.jpg",
    noir: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
    classic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    "celestial-complications": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    "nocturne-prive": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85",
  };

  const headerImage =
    collection.bannerUrl ||
    collection.heroImage ||
    fallbackBanners[slug] ||
    "/images/velora-hero-editorial.jpg";

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pb-32">
      {/* Editorial Header */}
      <EditorialHeader
        title={collection.name}
        subtitle="Maison Edition Repertoire"
        description={collection.description || "Finite, numbered timepieces and sensory masterworks engineered without concession."}
        imageUrl={headerImage}
        productCount={products.length}
        badge="Official Repertoire"
        breadcrumbs={[
          { label: "Collections", href: "/collections" },
          { label: collection.name },
        ]}
      />

      {/* Main Catalog with Filters & Responsive Grid */}
      <Container size="wide" className="pt-10">
        <CatalogView
          products={products}
          mode={mode}
          filterOptions={filterOptions}
          defaultColumns={4}
        />
      </Container>
    </div>
  );
}
