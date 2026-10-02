import prisma from "../src/lib/prisma";
import fs from "fs";
import path from "path";

async function verifyCatalogAssets() {
  console.log("=== COMPREHENSIVE VERIFICATION OF CATALOG ASSETS ===");
  const publicDir = path.resolve(process.cwd(), "public");

  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      collections: { include: { collection: true } },
    },
    orderBy: { slug: "asc" },
  });

  let totalImages = 0;
  let missingImages = 0;

  for (const product of products) {
    console.log(`\nChecking [${product.category?.name}] ${product.name} (${product.slug}):`);
    console.log(`  Collections: ${product.collections.map((c) => c.collection.name).join(", ")}`);
    console.log(`  Registered Images in DB: ${product.images.length}`);

    for (const img of product.images) {
      totalImages++;
      // Clean path leading slash
      const relativePath = img.url.startsWith("/") ? img.url.slice(1) : img.url;
      const fullPath = path.join(publicDir, relativePath);

      if (!fs.existsSync(fullPath)) {
        console.error(`  ❌ MISSING FILE: ${img.url} -> ${fullPath}`);
        missingImages++;
      } else {
        const stats = fs.statSync(fullPath);
        if (stats.size < 1000) {
          console.error(`  ⚠️ SUSPICIOUS FILE SIZE (<1KB): ${img.url} (${stats.size} bytes)`);
          missingImages++;
        } else {
          console.log(`  ✅ [${img.sortOrder}] ${img.isPrimary ? "(PRIMARY) " : ""}${img.url} (${Math.round(stats.size / 1024)} KB)`);
        }
      }
    }

    // Verify macro details
    if (product.macroDetails && Array.isArray(product.macroDetails)) {
      console.log(`  Macro Details (${product.macroDetails.length} parts):`);
      for (const m of product.macroDetails as any[]) {
        const relMacro = m.imageUrl?.startsWith("/") ? m.imageUrl.slice(1) : m.imageUrl;
        const fullMacro = path.join(publicDir, relMacro);
        if (!fs.existsSync(fullMacro)) {
          console.error(`    ❌ MISSING MACRO IMAGE: ${m.imageUrl}`);
          missingImages++;
        } else {
          console.log(`    ✅ Macro '${m.part}': ${m.title} (${m.imageUrl})`);
        }
      }
    }
  }

  console.log("\n=======================================================");
  console.log(`Total Verified Assets Checked: ${totalImages}`);
  console.log(`Missing / Corrupt Assets: ${missingImages}`);
  if (missingImages === 0) {
    console.log("🎉 ALL STOREFRONT PRODUCT ASSETS ARE 100% VALIDATED & ACCESSIBLE");
  } else {
    console.error("❌ ERRORS DETECTED IN CATALOG ASSETS");
    process.exit(1);
  }
}

verifyCatalogAssets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
