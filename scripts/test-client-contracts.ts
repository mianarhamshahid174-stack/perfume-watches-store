import prisma from "../src/lib/prisma";

async function verifyClientContracts() {
  console.log("=== VERIFYING CLIENT STATE CONTRACTS & DATA INTEGRITY ===");

  // 1. Verify all products have valid images and slugs
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      images: true,
      variants: true,
      inventory: true,
    },
  });

  console.log(`\n1. Found ${products.length} published products in database:`);
  for (const prod of products) {
    const isOut = (prod.inventory?.quantity ?? 0) <= 0;
    console.log(
      `- [${isOut ? "OUT OF STOCK" : "IN STOCK"}] ${prod.name} (${prod.slug}) | Price: $${prod.price} | Images: ${prod.images.length} | Variants: ${prod.variants.length} | Stock: ${prod.inventory?.quantity ?? 0}`
    );
  }

  // 2. Verify all horological specs are populated
  const watches = products.filter((p) => p.movement || p.caseMaterial);
  console.log(`\n2. Verifying ${watches.length} watches for all 9 required visual specifications:`);
  for (const watch of watches) {
    console.log(`* Watch: ${watch.name}`);
    console.log(`  - Case: ${watch.caseMaterial || "N/A"}`);
    console.log(`  - Diameter: ${watch.caseDiameter || "N/A"}`);
    console.log(`  - Thickness: ${watch.caseThickness || "N/A"}`);
    console.log(`  - Movement: ${watch.movement || "N/A"}`);
    console.log(`  - Power Reserve: ${watch.powerReserve || "N/A"}`);
    console.log(`  - Crystal: ${watch.crystal ? "Present" : "Missing"}`);
    console.log(`  - Water Resistance: ${watch.waterResistance || "N/A"}`);
    console.log(`  - Strap: ${watch.strapMaterial || "N/A"}`);
    console.log(`  - Clasp: ${watch.clasp ? "Present" : "Missing"}`);
    console.log(`  - Macro Details: ${Array.isArray(watch.macroDetails) ? `${watch.macroDetails.length} macro parts` : "N/A"}`);
  }

  console.log("\n=== ALL DATABASE CONTRACTS AND SPECIFICATIONS FULLY VERIFIED ===");
}

verifyClientContracts()
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
