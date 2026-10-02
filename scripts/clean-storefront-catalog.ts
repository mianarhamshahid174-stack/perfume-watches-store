import prisma from "../src/lib/prisma";

const CANONICAL_SLUGS = [
  "velora-signature-01",
  "velora-signature-02",
  "velora-noir-01",
  "velora-noir-02",
  "velora-classic-01",
  "velora-aurel-01",
  "velora-noir-extrait",
  "velora-aura-extrait",
  "velora-elan-extrait",
  "velora-oud-extrait",
  "velora-sante-extrait",
];

async function cleanStorefrontCatalog() {
  console.log("=== CLEANING STOREFRONT CATALOG ===");
  
  // Archive any products not in the canonical original list
  const archived = await prisma.product.updateMany({
    where: {
      slug: { notIn: CANONICAL_SLUGS },
    },
    data: {
      status: "ARCHIVED",
      featured: false,
    },
  });

  console.log(`Archived ${archived.count} non-canonical / legacy products with external image dependencies.`);

  // Ensure all canonical products are PUBLISHED and featured
  const published = await prisma.product.updateMany({
    where: {
      slug: { in: CANONICAL_SLUGS },
    },
    data: {
      status: "PUBLISHED",
    },
  });

  console.log(`Verified ${published.count} canonical original VELORA products are PUBLISHED.`);

  // List published products
  const activeProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: {
      name: true,
      slug: true,
      images: { select: { url: true, isPrimary: true } },
    },
    orderBy: { slug: "asc" },
  });

  console.log("\nActive Storefront Catalog:");
  for (const p of activeProducts) {
    const primary = p.images.find((i) => i.isPrimary)?.url;
    console.log(`- ${p.name} (${p.slug}): ${p.images.length} images | Primary: ${primary}`);
  }
}

cleanStorefrontCatalog()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
