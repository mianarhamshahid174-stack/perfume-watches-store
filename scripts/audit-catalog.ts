import prisma from "../src/lib/prisma";

async function auditCatalog() {
  console.log("=== AUDITING STOREFRONT CATALOG PRODUCTS ===");
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      featured: true,
      category: { select: { slug: true, name: true } },
      collections: { select: { collection: { select: { slug: true, name: true } } } },
      images: { select: { url: true, isPrimary: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
      macroDetails: true,
      movement: true,
      caseMaterial: true,
      concentration: true,
      olfactiveFamily: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Total Products: ${products.length}\n`);
  for (const p of products) {
    const primary = p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url;
    console.log(`[${p.status}] ${p.name} (${p.slug})`);
    console.log(`  Category: ${p.category?.name || "None"}`);
    console.log(`  Collections: ${p.collections.map((c) => c.collection.name).join(", ")}`);
    console.log(`  Images: ${p.images.length} views`);
    console.log(`  Primary: ${primary}`);
    console.log(`  Has Macro Details: ${Boolean(p.macroDetails)}`);
  }
}

auditCatalog()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
