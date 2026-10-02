import prisma from "../src/lib/prisma";

const HOMEPAGE_SECTIONS = [
  {
    name: "Hero Showcase",
    sectionKey: "hero_main",
    title: "TIME, REFINED.",
    subtitle: "Contemporary timepieces created for moments that matter.",
    sortOrder: 1,
    isActive: true,
    content: {
      badge: "Swiss Craftsmanship",
      ctaText: "DISCOVER THE COLLECTION",
      ctaLink: "/collections/signature",
      secondaryCtaText: "EXPLORE WATCHES",
      secondaryCtaLink: "/watches",
      bgImageUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      videoUrl: "",
    },
  },
  {
    name: "Featured Signature Watch",
    sectionKey: "featured_watch",
    title: "THE SIGNATURE",
    subtitle: "Clean geometric proportions, surgical 904L steel case, and in-house automatic movement.",
    sortOrder: 2,
    isActive: true,
    content: {
      productSlug: "velora-signature-01",
      ctaText: "DISCOVER THE WATCH",
      ctaLink: "/product/velora-signature-01",
      badge: "Featured Timepiece",
      bgImageUrl: "/images/products/watches/velora-signature-01/front.jpg",
    },
  },
  {
    name: "Collection Narrative Story",
    sectionKey: "collection_story",
    title: "DESIGNED BEYOND THE MOMENT.",
    subtitle: "Every watch and fragrance is shaped by a quiet dedication to craft, balance, and pure materials.",
    sortOrder: 3,
    isActive: true,
    content: {
      bgImageUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      ctaText: "READ OUR STORY",
      ctaLink: "/journal",
    },
  },
  {
    name: "Collections Editorial Grid",
    sectionKey: "collections_grid",
    title: "THE COLLECTIONS",
    subtitle: "Explore our original timepieces and fine fragrance collections.",
    sortOrder: 4,
    isActive: true,
    content: {
      collectionSlugs: ["signature", "noir", "classic"],
      ctaText: "EXPLORE COLLECTIONS",
      ctaLink: "/collections",
    },
  },
  {
    name: "Time and Scent Split Showcase",
    sectionKey: "watch_fragrance_split",
    title: "TWO ARTS, ONE PHILOSOPHY",
    subtitle: "Precision Swiss watchmaking and French high perfumery created to complement one another.",
    sortOrder: 5,
    isActive: true,
    content: {
      watchTitle: "TIMEPIECES",
      watchSubtitle: "Original automatic and manual-wind watches crafted in Geneva.",
      watchLink: "/watches",
      watchImage: "/images/products/watches/velora-signature-01/editorial.jpg",
      fragranceTitle: "FRAGRANCES",
      fragranceSubtitle: "Pure extraits de parfum formulated with rare botanical essences in Grasse.",
      fragranceLink: "/fragrances",
      fragranceImage: "/images/products/fragrances/velora-noir-extrait/editorial.jpg",
    },
  },
  {
    name: "Signature Product Section",
    sectionKey: "signature_product",
    title: "VELORA SIGNATURE 01",
    subtitle: "Hand-finished blued steel hands, opaline ivory dial, and sapphire display back.",
    sortOrder: 6,
    isActive: true,
    content: {
      productSlug: "velora-signature-01",
      ctaText: "DISCOVER THE WATCH",
      ctaLink: "/product/velora-signature-01",
    },
  },
  {
    name: "Craftsmanship Gallery",
    sectionKey: "craftsmanship_gallery",
    title: "MADE WITH CARE",
    subtitle: "Every detail is considered, from hand-beveled edges to custom deployant clasps.",
    sortOrder: 7,
    isActive: true,
    content: {
      pillars: [
        { title: "Precision Finishing", description: "Beveled edges and brushed surfaces finished by hand." },
        { title: "Sapphire Crystal", description: "Scratch-resistant double-domed sapphire with anti-reflective coating." },
        { title: "Grasse Extraction", description: "Pure botanical essences distilled for maximum longevity." },
      ],
    },
  },
  {
    name: "High Perfumery Editorial",
    sectionKey: "fragrance_editorial",
    title: "HIGH PERFUMERY",
    subtitle: "Formulated with rare botanical oils at high concentrations for remarkable longevity.",
    sortOrder: 8,
    isActive: true,
    content: {
      ctaText: "EXPLORE FRAGRANCES",
      ctaLink: "/fragrances",
      bgImageUrl: "/images/products/fragrances/velora-noir-extrait/editorial.jpg",
    },
  },
  {
    name: "Gifting & Packaging",
    sectionKey: "gifting_packaging",
    title: "LUXURY PACKAGING",
    subtitle: "Each order arrives in our signature gift box, crafted from fine materials and prepared by hand.",
    sortOrder: 9,
    isActive: true,
    content: {
      bgImageUrl: "/images/products/watches/velora-signature-01/packaging.jpg",
      badge: "Complimentary Insured Delivery",
    },
  },
  {
    name: "Brand Story",
    sectionKey: "brand_story",
    title: "OUR HERITAGE",
    subtitle: "An independent luxury brand dedicated to refined design, pure materials, and lasting craftsmanship.",
    sortOrder: 10,
    isActive: true,
    content: {
      ctaText: "READ OUR STORY",
      ctaLink: "/journal",
    },
  },
  {
    name: "Journal Preview",
    sectionKey: "journal_preview",
    title: "THE JOURNAL",
    subtitle: "Stories on design, craft, and the art of living well.",
    sortOrder: 11,
    isActive: true,
    content: {
      viewAllText: "VIEW ALL ARTICLES",
      viewAllLink: "/journal",
    },
  },
  {
    name: "Newsletter Invitation",
    sectionKey: "newsletter_section",
    title: "STAY CONNECTED",
    subtitle: "Be the first to hear about new timepiece releases, fragrance arrivals, and private events.",
    sortOrder: 12,
    isActive: true,
    content: {
      buttonText: "SUBSCRIBE",
      privacyNotice: "We respect your privacy. You can unsubscribe at any time.",
    },
  },
];

async function main() {
  console.log("Seeding all 12 CMS homepage sections with natural English...");

  for (const sec of HOMEPAGE_SECTIONS) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: {
        name: sec.name,
        title: sec.title,
        subtitle: sec.subtitle,
        sortOrder: sec.sortOrder,
        content: sec.content,
      },
      create: {
        name: sec.name,
        sectionKey: sec.sectionKey,
        title: sec.title,
        subtitle: sec.subtitle,
        sortOrder: sec.sortOrder,
        isActive: true,
        content: sec.content,
      },
    });
  }

  const count = await prisma.homepageSection.count();
  console.log(`✓ Successfully updated ${count} homepage sections with natural English!`);
}

main()
  .catch((e) => {
    console.error("Homepage sections update failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
