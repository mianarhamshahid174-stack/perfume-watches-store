import React from "react";
import { ProductItem } from "@/types/product";

interface ProductStructuredDataProps {
  product: ProductItem;
  canonicalUrl: string;
}

export function ProductStructuredData({ product, canonicalUrl }: ProductStructuredDataProps) {
  const primaryImage =
    product.images?.[0]?.url || "https://velora-ateliers.com/images/velora-signature-01.jpg";

  const allImages = product.images?.map((img) =>
    img.url.startsWith("http") ? img.url : `https://velora-ateliers.com${img.url}`
  ) || [primaryImage];

  const inStock = (product.inventory?.quantity ?? 0) > 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: allImages,
    description: product.shortDescription || product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: "VELORA Ateliers Geneva",
    },
    category: product.category?.name || "Haute Horlogerie",
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "VELORA Ateliers Geneva",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Maison",
        item: "https://velora-ateliers.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category?.name || "Watches",
        item: `https://velora-ateliers.com/${
          product.category?.slug === "high-perfumery" ? "fragrances" : "watches"
        }`,
      },
      ...(product.collections?.[0]?.collection
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.collections[0].collection.name,
              item: `https://velora-ateliers.com/collections/${product.collections[0].collection.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
