async function testNewCatalogPages() {
  const baseUrl = "http://localhost:3000";
  console.log("=== TESTING STOREFRONT PAGES WITH NEW CATALOG ===");

  const routes = [
    "/watches",
    "/fragrances",
    "/collections/signature",
    "/collections/noir",
    "/collections/classic",
    "/product/velora-signature-01",
    "/product/velora-signature-02",
    "/product/velora-noir-01",
    "/product/velora-noir-02",
    "/product/velora-classic-01",
    "/product/velora-aurel-01",
    "/product/velora-noir-extrait",
    "/product/velora-aura-extrait",
    "/product/velora-elan-extrait",
    "/product/velora-oud-extrait",
    "/product/velora-sante-extrait",
  ];

  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      const resp = await fetch(url, { headers: { "User-Agent": "Velora-Validator" } });
      const html = await resp.text();

      if (resp.status === 200) {
        // Check if page contains expected products or assets
        const hasAsset = html.includes("/images/products/");
        const hasPlaceholder = html.includes("placeholder-watch") || html.includes("placeholder-perfume");
        console.log(`✅ [${resp.status}] ${route} (${html.length} bytes) - Has Products: ${hasAsset} - Has Old Placeholders: ${hasPlaceholder}`);
        passed++;
      } else {
        console.error(`❌ [${resp.status}] ${route}`);
        failed++;
      }
    } catch (e: any) {
      console.error(`❌ FAILED ${route}: ${e.message}`);
      failed++;
    }
  }

  console.log("\n=======================================================");
  console.log(`Passed: ${passed}/${routes.length} | Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

testNewCatalogPages().catch(console.error);
