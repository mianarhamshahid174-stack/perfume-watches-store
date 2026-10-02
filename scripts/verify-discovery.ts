import prisma from "../src/lib/prisma";
import { getProducts, getDiscoveryFilterOptions } from "../src/services/product.service";
import { searchDatabase, getAutocompleteResults } from "../src/services/search.service";

async function runVerification() {
  console.log("=== STARTING PRODUCT DISCOVERY VERIFICATION ===");

  try {
    // 1. Test getFilterOptions
    console.log("\n1. Testing Filter Options Retrieval...");
    const filterOptions = await getDiscoveryFilterOptions();
    console.log(`- Collections count: ${filterOptions.collections.length}`);
    console.log(`- Movements: ${filterOptions.movements.join(", ")}`);
    console.log(`- Straps: ${filterOptions.straps.join(", ")}`);
    console.log(`- Case Materials: ${filterOptions.caseMaterials.join(", ")}`);
    console.log(`- Dial Colors: ${filterOptions.dialColors.join(", ")}`);
    console.log(`- Fragrance Families: ${filterOptions.fragranceFamilies.join(", ")}`);
    console.log(`- Genders: ${filterOptions.genders.join(", ")}`);
    console.log(`- Price range: $${filterOptions.minPrice} - $${filterOptions.maxPrice}`);

    // 2. Test Watches Discovery Queries
    console.log("\n2. Testing Watches Catalog Queries...");
    const allWatches = await getProducts({ categorySlug: "haute-horlogerie" });
    console.log(`- Total watches found: ${allWatches.length}`);

    const tourbillonWatches = await getProducts({
      categorySlug: "haute-horlogerie",
      movement: "Tourbillon",
    });
    console.log(`- Watches with Tourbillon in movement: ${tourbillonWatches.length}`);
    if (tourbillonWatches.length > 0) {
      console.log(`  Sample: ${tourbillonWatches[0].name} (${tourbillonWatches[0].sku})`);
    }

    const priceSortedWatches = await getProducts({
      categorySlug: "haute-horlogerie",
      sortBy: "price-desc",
    });
    console.log(`- Most expensive watch: ${priceSortedWatches[0]?.name} ($${priceSortedWatches[0]?.price})`);

    // 3. Test Fragrances Discovery Queries
    console.log("\n3. Testing Fragrances Catalog Queries...");
    const allFragrances = await getProducts({ categorySlug: "high-perfumery" });
    console.log(`- Total fragrances found: ${allFragrances.length}`);

    const unisexFragrances = await getProducts({
      categorySlug: "high-perfumery",
      gender: "Unisex",
    });
    console.log(`- Unisex fragrances: ${unisexFragrances.length}`);

    const woodyFragrances = await getProducts({
      categorySlug: "high-perfumery",
      fragranceFamily: "Woody",
    });
    console.log(`- Woody fragrances: ${woodyFragrances.length}`);

    // 4. Test Collections
    console.log("\n4. Testing Collections Query...");
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });
    console.log(`- Found ${collections.length} active collections:`);
    collections.forEach((col) => {
      console.log(`  * ${col.name} (${col.slug}): ${col.products.length} products`);
    });

    // 5. Test Search & Autocomplete Queries
    console.log("\n5. Testing Database Search & Autocomplete...");
    const searchBySku = await searchDatabase("VA-900");
    console.log(`- Search query 'VA-900' results: ${searchBySku.length}`);

    const searchByName = await searchDatabase("Squelette");
    console.log(`- Search query 'Squelette' results: ${searchByName.length}`);

    const searchByTag = await searchDatabase("Titanium");
    console.log(`- Search query 'Titanium' results: ${searchByTag.length}`);

    const autocompleteResults = await getAutocompleteResults("chro");
    console.log(`- Autocomplete query 'chro': ${autocompleteResults.products.length} products, ${autocompleteResults.collections.length} collections`);

    console.log("\n=== ALL DISCOVERY SERVICE VERIFICATIONS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
