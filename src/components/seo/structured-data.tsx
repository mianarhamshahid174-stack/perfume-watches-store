import React from "react";

export function GlobalStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VELORA Ateliers Geneva",
    legalName: "Maison Velora SA",
    url: "https://velora-ateliers.com",
    logo: "https://velora-ateliers.com/images/velora-hero-editorial.jpg",
    description:
      "Contemporary luxury horology and high extraction perfumery compounded in Geneva and Grasse.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue du Rhône 42",
      addressLocality: "Genève",
      postalCode: "1204",
      addressCountry: "CH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Private Concierge & Salon Services",
      email: "concierge@velora-ateliers.com",
    },
    sameAs: [
      "https://instagram.com/velorawatches",
      "https://x.com/velorawatches",
      "https://facebook.com/velorawatches",
      "https://youtube.com/@velorawatches",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VELORA | Haute Horlogerie & High Perfumery",
    url: "https://velora-ateliers.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://velora-ateliers.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
