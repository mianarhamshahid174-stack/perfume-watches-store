import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/services/product.service";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { ProductInfo } from "@/components/storefront/product/product-info";
import { ProductAccordion } from "@/components/storefront/product/product-accordion";
import { ProductSpecifications } from "@/components/storefront/product/product-specifications";
import { ProductMacroDetails } from "@/components/storefront/product/product-macro-details";
import { ProductStorytelling } from "@/components/storefront/product/product-storytelling";
import { ProductRelated } from "@/components/storefront/product/product-related";
import { StickyAddToCart } from "@/components/storefront/product/sticky-add-to-cart";
import { ProductStructuredData } from "@/components/storefront/product/product-structured-data";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. DYNAMIC SEO METADATA & OPENGRAPH
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | VELORA Ateliers Geneva",
      description: "The requested creation could not be found in the atelier archives.",
    };
  }

  const primaryImage =
    product.images?.[0]?.url || "https://velora-ateliers.com/images/velora-signature-01.jpg";
  const canonicalUrl = `https://velora-ateliers.com/product/${product.slug}`;

  return {
    title: product.seoTitle || `${product.name} | VELORA Ateliers Geneva`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      `Discover ${product.name}. Handcrafted in finite editions in Geneva and Grasse.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: canonicalUrl,
      siteName: "VELORA Haute Horlogerie & Parfum",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 900,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [primaryImage],
    },
  };
}

// 2. PRODUCT DETAIL PAGE
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Real database fetch
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryCategorySlug = product.category?.slug;
  const primaryCollectionSlug = product.collections?.[0]?.collection?.slug;
  const primaryCollectionName = product.collections?.[0]?.collection?.name;

  // Fetch real related products:
  // - You may also like
  // - Complete the look (cross-category pairing)
  // - From the collection
  const related = await getRelatedProducts(
    product.id,
    primaryCategorySlug,
    primaryCollectionSlug
  );

  const canonicalUrl = `https://velora-ateliers.com/product/${product.slug}`;

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pb-20 selection:bg-gold-500 selection:text-black">
      {/* Schema.org Structured Data */}
      <ProductStructuredData product={product} canonicalUrl={canonicalUrl} />

      {/* TOP BREADCRUMBS BAR */}
      <div className="border-b border-white/5 bg-black/40">
        <Container size="wide" className="py-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-sans text-neutral-400">
            <Link href="/" className="hover:text-gold-300 transition-colors">
              Maison
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />

            <Link
              href={primaryCategorySlug === "high-perfumery" ? "/fragrances" : "/watches"}
              className="hover:text-gold-300 transition-colors"
            >
              {product.category?.name || "Horlogerie"}
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />

            {primaryCollectionName && (
              <>
                <Link
                  href={`/collections/${primaryCollectionSlug}`}
                  className="hover:text-gold-300 transition-colors"
                >
                  {primaryCollectionName}
                </Link>
                <ChevronRight className="w-3 h-3 text-neutral-600" />
              </>
            )}

            <span className="text-sand-100 font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </Container>
      </div>

      {/* MAIN PRODUCT DISCOVERY STAGE: 2-COLUMN HERO */}
      <Container size="wide" className="pt-8 sm:pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: Large Image / Video Gallery (Col 7) */}
          <div className="lg:col-span-7 w-full lg:sticky lg:top-24">
            <ProductGallery
              images={product.images}
              videos={product.videos}
              productName={product.name}
            />
          </div>

          {/* RIGHT: Product Information & Purchase Actions (Col 5) */}
          <div className="lg:col-span-5 w-full flex flex-col space-y-8">
            <ProductInfo product={product} />

            {/* In-column Accordion Sections */}
            <div className="pt-4">
              <ProductAccordion product={product} />
            </div>
          </div>
        </div>
      </Container>

      {/* WATCH / ESSENCE SPECIFICATIONS VISUAL SECTION */}
      <ProductSpecifications product={product} />

      {/* "THE DETAILS" MACRO PHOTOGRAPHY SECTION */}
      <ProductMacroDetails product={product} />

      {/* EDITORIAL STORYTELLING ("Every detail is considered.") */}
      <ProductStorytelling product={product} />

      {/* RELATED PRODUCTS (You may also like, Complete the look, From collection) */}
      <ProductRelated
        youMayAlsoLike={related.youMayAlsoLike}
        completeTheLook={related.completeTheLook}
        fromTheCollection={related.fromTheCollection}
        collectionName={primaryCollectionName}
      />

      {/* MOBILE STICKY ADD-TO-CART BAR */}
      <StickyAddToCart product={product} />
    </div>
  );
}
