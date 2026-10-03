import React from "react";

export function GlobalStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VELORA Pakistan",
    legalName: "VELORA Luxury Pakistan",
    url: "https://velora.pk",
    logo: "https://velora.pk/images/velora-hero-editorial.jpg",
    description:
      "Original luxury timepieces and fine fragrances crafted for connoisseurs across Pakistan.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "M.M. Alam Road, Gulberg III",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Care & Boutique Concierge",
      email: "concierge@velora.pk",
      telephone: "+92 300 1234567",
    },
    sameAs: [
      "https://instagram.com/velorapakistan",
      "https://facebook.com/velorapakistan",
      "https://youtube.com/@velorapakistan",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VELORA Pakistan | Luxury Watches & Fine Fragrances",
    url: "https://velora.pk",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://velora.pk/search?q={search_term_string}",
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
