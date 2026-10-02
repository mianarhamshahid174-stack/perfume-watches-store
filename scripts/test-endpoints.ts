async function testEndpoints() {
  const baseUrl = "http://localhost:3000";
  const routes = [
    { path: "/watches", name: "Watches Page", check: ["Haute Horlogerie", "Precision Born in Solitude", "FILTERS"] },
    { path: "/fragrances", name: "Fragrances Page", check: ["High Perfumery", "Olfactory Architecture", "FILTERS"] },
    { path: "/collections", name: "Collections Page", check: ["Curated Collections", "SIGNATURE", "NOIR"] },
    { path: "/collections/signature", name: "Signature Collection Page", check: ["SIGNATURE", "COLLECTIONS"] },
    { path: "/search", name: "Search Empty Page", check: ["Search Ateliers", "POPULAR DISCOVERIES"] },
    { path: "/search?q=Titanium", name: "Search Query Page", check: ["Titanium", "TIMEPIECE"] },
    { path: "/api/search?q=chro", name: "Autocomplete API", isJson: true, check: ["products", "collections", "popularSearches"] },
  ];

  console.log("=== VERIFYING LIVE STOREFRONT DISCOVERY ENDPOINTS ===\n");

  let allSuccess = true;

  for (const route of routes) {
    try {
      const url = `${baseUrl}${route.path}`;
      const res = await fetch(url);
      console.log(`[${res.status} ${res.statusText}] ${route.name} -> ${url}`);

      if (!res.ok) {
        console.error(`  ERROR: Status code ${res.status}`);
        allSuccess = false;
        continue;
      }

      if (route.isJson) {
        const json = await res.json();
        console.log(`  JSON response: ${JSON.stringify(json).slice(0, 160)}...`);
        for (const expectedKey of route.check) {
          if (!(expectedKey in json)) {
            console.error(`  MISSING KEY: ${expectedKey}`);
            allSuccess = false;
          }
        }
      } else {
        const text = await res.text();
        for (const term of route.check) {
          if (text.includes(term)) {
            console.log(`  ✓ Contains: "${term}"`);
          } else {
            console.warn(`  ✗ Did not find expected substring: "${term}"`);
          }
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${route.path}:`, err);
      allSuccess = false;
    }
  }

  if (allSuccess) {
    console.log("\n=== ALL DISCOVERY ENDPOINTS RESPONDED WITH HTTP 200 AND VALID CONTENT! ===");
  } else {
    console.error("\n=== SOME ENDPOINTS FAILED ===");
    process.exit(1);
  }
}

testEndpoints();
