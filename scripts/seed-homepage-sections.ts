import prisma from "../src/lib/prisma";

const HOMEPAGE_SECTIONS = [
  {
    name: "Hero Cinematic Showcase",
    sectionKey: "hero_main",
    title: "TIME, REFINED.",
    subtitle: "Contemporary timepieces created for moments that matter.",
    sortOrder: 1,
    isActive: true,
    content: {
      badge: "Maison Velora Ateliers Geneva",
      ctaText: "DISCOVER THE COLLECTION",
      ctaLink: "/collections/signature",
      secondaryCtaText: "EXPLORE WATCHES",
      secondaryCtaLink: "/watches",
      bgImageUrl: "/images/velora-hero-editorial.jpg",
      videoUrl: "",
    },
  },
  {
    name: "Featured Signature Watch",
    sectionKey: "featured_watch",
    title: "THE SIGNATURE",
    subtitle: "A monolithic titanium case sheltering our caliber 1842 tourbillon with 72-hour reserve.",
    sortOrder: 2,
    isActive: true,
    content: {
      productSlug: "velora-signature-01",
      ctaText: "DISCOVER THE WATCH",
      ctaLink: "/product/velora-signature-01",
      badge: "Geneva Seal Caliber",
      bgImageUrl: "/images/velora-signature-01.jpg",
    },
  },
  {
    name: "Collection Narrative Story",
    sectionKey: "collection_story",
    title: "DESIGNED BEYOND THE MOMENT.",
    subtitle: "Every line, bevel, and reflection is crafted in silent dialogue between human mastery and eternal materials.",
    sortOrder: 3,
    isActive: true,
    content: {
      bgImageUrl: "/images/velora-hero-editorial.jpg",
      ctaText: "OUR ATELIER HERITAGE",
      ctaLink: "/journal",
    },
  },
  {
    name: "Collections Editorial Grid",
    sectionKey: "collections_grid",
    title: "ATELIER EDITIONS",
    subtitle: "Explore our limited architectural timepieces and haute parfumerie collections.",
    sortOrder: 4,
    isActive: true,
    content: {
      collectionSlugs: ["signature", "noir", "classic"],
      ctaText: "EXPLORE ALL EDITIONS",
      ctaLink: "/collections",
    },
  },
  {
    name: "Time and Scent Split Showcase",
    sectionKey: "watch_fragrance_split",
    title: "TIME & ESSENCE",
    subtitle: "Two distinct expressions of singular luxury: Haute Horlogerie & High Perfumery.",
    sortOrder: 5,
    isActive: true,
    content: {
      watchTitle: "HAUTE HORLOGERIE",
      watchSubtitle: "Micro-mechanical sculpture and Geneva precision.",
      watchLink: "/watches",
      watchImage: "/images/velora-signature-01.jpg",
      fragranceTitle: "PARFUMS D'EXCEPTION",
      fragranceSubtitle: "Aged extraits distilled from rare botanicals in Grasse.",
      fragranceLink: "/fragrances",
      fragranceImage: "/images/fragrance-editorial.jpg",
    },
  },
  {
    name: "Signature Product Macro Section",
    sectionKey: "signature_product",
    title: "VELORA SIGNATURE 01",
    subtitle: "Hand-finished internal beveling with titanium crown and sapphire display back.",
    sortOrder: 6,
    isActive: true,
    content: {
      productSlug: "velora-signature-01",
      ctaText: "INSPECT TECHNICAL DOSSIER",
      ctaLink: "/product/velora-signature-01",
    },
  },
  {
    name: "Craftsmanship & Atelier Gallery",
    sectionKey: "craftsmanship_gallery",
    title: "THE ART OF THE HAND",
    subtitle: "Over two hundred hours of hand-finishing per individual timepiece.",
    sortOrder: 7,
    isActive: true,
    content: {
      pillars: [
        { title: "Anglage & Polishing", description: "Beveled bridges mirror-polished with gentian wood paste." },
        { title: "Grand Feu Enameling", description: "Enamel dials fired at 800°C in small kiln batches." },
        { title: "Grasse Distillation", description: "Steam extraction preserving delicate floral volatile essences." },
      ],
    },
  },
  {
    name: "High Perfumery Editorial",
    sectionKey: "fragrance_editorial",
    title: "EXTRAITS D'AUTEUR",
    subtitle: "Sensory compositions created without temporal constraint or compromise.",
    sortOrder: 8,
    isActive: true,
    content: {
      ctaText: "DISCOVER THE PARFUMS",
      ctaLink: "/fragrances",
      bgImageUrl: "/images/fragrance-editorial.jpg",
    },
  },
  {
    name: "Gifting & Bespoke Packaging",
    sectionKey: "gifting_packaging",
    title: "THE MAISON PRESENTATION",
    subtitle: "Arrives in solid lacquer timber cases sealed with tamper-evident security holographic locks.",
    sortOrder: 9,
    isActive: true,
    content: {
      bgImageUrl: "/images/velora-packaging.jpg",
      badge: "Complimentary Armored Delivery",
    },
  },
  {
    name: "Maison Brand Legacy",
    sectionKey: "brand_story",
    title: "BORN IN GENEVA",
    subtitle: "An independent atelier dedicated to contemporary collectors who value rarity over ubiquity.",
    sortOrder: 10,
    isActive: true,
    content: {
      ctaText: "READ OUR CHRONICLES",
      ctaLink: "/journal",
    },
  },
  {
    name: "Journal Chronicles Preview",
    sectionKey: "journal_preview",
    title: "THE CHRONICLES",
    subtitle: "Insights from our horologists, master perfumers, and private viewings.",
    sortOrder: 11,
    isActive: true,
    content: {
      viewAllText: "VIEW ALL CHRONICLES",
      viewAllLink: "/journal",
    },
  },
  {
    name: "Private Salon Newsletter Invitation",
    sectionKey: "newsletter_section",
    title: "THE PRIVATE SALON",
    subtitle: "Receive invitation-only announcements for novelties, limited allocations, and bespoke commissions.",
    sortOrder: 12,
    isActive: true,
    content: {
      buttonText: "REQUEST PRIVILEGES",
      privacyNotice: "We honor your discretion. No promotional frequency.",
    },
  },
];

async function main() {
  console.log("Seeding all 12 CMS homepage sections...");

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
  console.log(`✓ Successfully seeded/updated ${count} homepage sections in PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error("Homepage sections seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
