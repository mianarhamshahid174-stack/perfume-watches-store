import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { EditorialHeader } from "@/components/storefront/discovery/editorial-header";
import { Container } from "@/components/ui/container";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections | VELORA",
  description:
    "Explore the distinct design collections of VELORA: Signature, Noir, Classic, Celestial, and Nocturne Privé.",
  alternates: {
    canonical: "https://velora-ateliers.com/collections",
  },
  openGraph: {
    title: "Collections | VELORA",
    description: "Explore the distinct design collections of VELORA.",
    images: [{ url: "/images/velora-hero-editorial.jpg" }],
  },
};

import { FALLBACK_COLLECTIONS, FALLBACK_PRODUCTS } from "@/lib/catalog-data";

export default async function CollectionsIndexPage() {
  let collections: any[] = [];
  try {
    collections = await prisma.collection.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: { select: { url: true }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.warn("Could not load collections from DB, using fallback:", err);
  }

  if (collections.length === 0) {
    collections = FALLBACK_COLLECTIONS.map((c) => ({
      ...c,
      products: FALLBACK_PRODUCTS.filter((p) =>
        p.collections?.some((col) => col.collection.slug === c.slug)
      ).map((prod) => ({
        product: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          images: [{ url: prod.images[0]?.url || "/images/velora-signature-01.jpg" }],
        },
      })),
    }));
  }

  const totalProducts = collections.reduce((acc: number, c: any) => acc + (c.products?.length || 0), 0);

  // Fallback banners if not set
  const fallbackBanners: Record<string, string> = {
    signature: "/images/velora-hero-editorial.jpg",
    noir: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
    classic: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    "celestial-complications": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    "nocturne-prive": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85",
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32">
      {/* Editorial Header */}
      <EditorialHeader
        title="The Collections"
        subtitle="Signature Product Lines"
        description="Discover our distinct collections of watches and fragrances. From modern minimalist silhouettes to timeless classic designs, each collection embodies precision craftsmanship and enduring luxury."
        imageUrl="/images/velora-hero-editorial.jpg"
        productCount={totalProducts}
        badge="Collections"
        breadcrumbs={[{ label: "Collections" }]}
      />

      <Container size="wide" className="pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((col: any, idx: number) => {
            const banner =
              col.bannerUrl ||
              col.heroImage ||
              fallbackBanners[col.slug] ||
              "/images/velora-signature-01.jpg";

            return (
              <div
                key={col.id}
                className="group relative flex flex-col bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-gold-500/40 transition-all duration-700 overflow-hidden"
              >
                {/* Large Editorial Visual */}
                <Link
                  href={`/collections/${col.slug}`}
                  className="keep-dark block relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"
                >
                  <img
                    src={banner}
                    alt={col.name}
                    className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-108 group-hover:brightness-[0.88]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                  {/* Index Pill */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10">
                      Collection 0{idx + 1}
                    </span>
                  </div>

                  {/* Count Pill */}
                  <div className="absolute top-6 right-6 z-10">
                    <span className="text-[10px] font-mono tracking-widest text-sand-200 uppercase bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10">
                      {col.products.length} {col.products.length === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                </Link>

                {/* Editorial Content */}
                <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[var(--foreground)] group-hover:text-metallic transition-colors">
                      <Link href={`/collections/${col.slug}`}>
                        {col.name}
                      </Link>
                    </h2>

                    {col.description && (
                      <p className="text-xs sm:text-sm text-[var(--color-neutral-stone)] font-light leading-relaxed max-w-lg">
                        {col.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <Link
                      href={`/collections/${col.slug}`}
                      className="inline-flex items-center text-xs font-mono uppercase tracking-[0.22em] text-[var(--foreground)] group-hover:text-metallic transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <ArrowUpRight className="h-4 w-4 text-[var(--color-neutral-stone)] group-hover:text-metallic transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
