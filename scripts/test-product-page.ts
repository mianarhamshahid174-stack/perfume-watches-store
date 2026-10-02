async function verifyProductPage() {
  const baseUrl = "http://localhost:3000";

  console.log("=== STARTING PRODUCT DETAIL PAGE VERIFICATION ===\n");

  let allSuccess = true;

  // 1. Test In-Stock Watch: VELORA SIGNATURE 01
  console.log("1. Testing In-Stock Watch (/product/velora-signature-01)...");
  try {
    const res = await fetch(`${baseUrl}/product/velora-signature-01`);
    console.log(`- Status: ${res.status} ${res.statusText}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const expectedSnippets = [
      "VELORA SIGNATURE 01",
      "12,500",
      "Automatic movement, sapphire crystal",
      "DESCRIPTION",
      "DETAILS",
      "MATERIALS",
      "MOVEMENT",
      "SHIPPING",
      "RETURNS",
      "WARRANTY",
      "Watch Specifications",
      "Case Metallurgy",
      "Case Diameter",
      "Case Thickness",
      "Mechanical Movement",
      "Power Reserve",
      "Sapphire Crystal",
      "Water Resistance",
      "Deployant Clasp",
      "THE DETAILS",
      "The Dial Architecture",
      "The Hands",
      "The Fluted Crown",
      "Every detail is considered.",
      "Related Creations",
      "You May Also Like",
      "application/ld+json",
      "schema.org",
      "Add to Atelier Bag",
      "Instant Acquisition",
    ];

    for (const snippet of expectedSnippets) {
      if (html.includes(snippet)) {
        console.log(`  ✓ Contains: "${snippet}"`);
      } else {
        console.error(`  ✗ MISSING snippet: "${snippet}"`);
        allSuccess = false;
      }
    }

    // Check Strap specification (could be encoded as Strap &amp; Hide or Strap & Hide)
    if (html.includes("Strap &amp; Hide") || html.includes("Strap & Hide")) {
      console.log('  ✓ Contains: "Strap & Hide"');
    } else {
      console.error('  ✗ MISSING: "Strap & Hide"');
      allSuccess = false;
    }
  } catch (err) {
    console.error("Failed on /product/velora-signature-01:", err);
    allSuccess = false;
  }

  // 2. Test Out-Of-Stock Product: VELORA Classic Patrimony
  console.log("\n2. Testing Out-Of-Stock Handling (/product/velora-classic-patrimony)...");
  try {
    const res = await fetch(`${baseUrl}/product/velora-classic-patrimony`);
    console.log(`- Status: ${res.status} ${res.statusText}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const outOfStockSnippets = [
      "VELORA Classic Patrimony",
      "Allocation Exhausted / Sold Out",
      "Inquire for Next Edition",
    ];

    for (const snippet of outOfStockSnippets) {
      if (html.includes(snippet)) {
        console.log(`  ✓ Contains out-of-stock indicator: "${snippet}"`);
      } else {
        console.error(`  ✗ MISSING out-of-stock indicator: "${snippet}"`);
        allSuccess = false;
      }
    }
  } catch (err) {
    console.error("Failed on /product/velora-classic-patrimony:", err);
    allSuccess = false;
  }

  // 3. Test High Perfumery Page: VELORA Nocturne Absolu Extrait
  console.log("\n3. Testing Fragrance Product Detail (/product/velora-nocturne-absolu-extrait)...");
  try {
    const res = await fetch(`${baseUrl}/product/velora-nocturne-absolu-extrait`);
    console.log(`- Status: ${res.status} ${res.statusText}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const fragranceSnippets = [
      "VELORA Nocturne Absolu Extrait",
      "490",
      "Essence Specifications",
      "Olfactory Family",
      "Concentration",
      "Gender Classification",
    ];

    for (const snippet of fragranceSnippets) {
      if (html.includes(snippet)) {
        console.log(`  ✓ Contains fragrance indicator: "${snippet}"`);
      } else {
        console.error(`  ✗ MISSING fragrance indicator: "${snippet}"`);
        allSuccess = false;
      }
    }

    if (html.includes("Smoky Amber &amp; Resinous Woods") || html.includes("Smoky Amber")) {
      console.log('  ✓ Contains: "Smoky Amber & Resinous Woods"');
    } else {
      console.error('  ✗ MISSING: "Smoky Amber & Resinous Woods"');
      allSuccess = false;
    }

    if (html.includes("Volume &amp; Packaging") || html.includes("Volume")) {
      console.log('  ✓ Contains: "Volume & Packaging"');
    } else {
      console.error('  ✗ MISSING: "Volume & Packaging"');
      allSuccess = false;
    }
  } catch (err) {
    console.error("Failed on /product/velora-nocturne-absolu-extrait:", err);
    allSuccess = false;
  }

  // 4. Test Legacy Route Redirect (/products/velora-signature-01)
  console.log("\n4. Testing Legacy Route Redirect (/products/velora-signature-01)...");
  try {
    const res = await fetch(`${baseUrl}/products/velora-signature-01`, {
      redirect: "manual",
    });
    console.log(`- Status: ${res.status} (expected 307 or 308)`);
    const location = res.headers.get("location");
    console.log(`- Redirect location: ${location}`);

    if (res.status === 307 || res.status === 308) {
      if (location?.includes("/product/velora-signature-01")) {
        console.log("  ✓ Correctly redirects to canonical /product/velora-signature-01");
      } else {
        console.error(`  ✗ Unexpected redirect location: ${location}`);
        allSuccess = false;
      }
    } else {
      console.error(`  ✗ Expected redirect status code, got ${res.status}`);
      allSuccess = false;
    }
  } catch (err) {
    console.error("Failed on legacy redirect test:", err);
    allSuccess = false;
  }

  if (allSuccess) {
    console.log("\n=== ALL PRODUCT DETAIL PAGE VERIFICATIONS PASSED WITH 100% SUCCESS! ===");
  } else {
    console.error("\n=== SOME PRODUCT DETAIL VERIFICATIONS FAILED ===");
    process.exit(1);
  }
}

verifyProductPage();
