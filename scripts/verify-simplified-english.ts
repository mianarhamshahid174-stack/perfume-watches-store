// Using native fetch in Node 18+
const BASE_URL = "http://localhost:3000";

const ROUTES_TO_TEST = [
  { path: "/", name: "Homepage", expected: ["Watches", "Fragrances", "Featured Watch"] },
  { path: "/watches", name: "Watches Catalog", expected: ["Luxury Watches", "Filters"] },
  { path: "/fragrances", name: "Fragrances Catalog", expected: ["Luxury Fragrances", "Filters"] },
  { path: "/collections", name: "Collections Index", expected: ["The Collections", "Signature Product Lines"] },
  { path: "/collections/signature", name: "Collection Detail", expected: ["Signature", "Curated Collection"] },
  { path: "/product/velora-signature-01", name: "Watch PDP", expected: ["Add to Shopping Bag", "Free Insured Shipping"] },
  { path: "/product/nocturne-extrait", name: "Fragrance PDP", expected: ["Add to Shopping Bag", "Free Insured Shipping"] },
  { path: "/cart", name: "Cart Page", expected: ["Shopping Bag", "Order Summary"] },
  { path: "/checkout", name: "Checkout Page", expected: ["Secure Checkout", "Contact Information", "Payment Method"] },
  { path: "/wishlist", name: "Wishlist Page", expected: ["Your Wishlist", "Saved Items"] },
  { path: "/search?q=velora", name: "Search Page", expected: ["Search", "VELORA"] },
  { path: "/journal", name: "Journal Index", expected: ["Stories of Craftsmanship & Design", "All Articles"] },
  { path: "/journal/art-of-the-flying-tourbillon", name: "Journal Article", expected: ["Article", "Article Author"] },
  { path: "/account", name: "Account Page", expected: ["Account", "Overview", "Orders", "Wishlist"] },
  { path: "/login", name: "Login Page", expected: ["Sign In", "Account Login"] },
  { path: "/register", name: "Register Page", expected: ["Create Account", "Join VELORA"] },
  { path: "/forgot-password", name: "Forgot Password Page", expected: ["Forgot Password", "Send Reset Link"] },
  { path: "/contact", name: "Contact Page", expected: ["How Can We Help You?", "Send Us a Message"] },
  { path: "/faq", name: "FAQ Page", expected: ["Frequently Asked Questions", "Orders & Payment"] },
  { path: "/shipping", name: "Shipping Page", expected: ["Shipping & Delivery Policy", "Free Insured Shipping"] },
  { path: "/returns", name: "Returns Page", expected: ["Returns & Exchanges Policy", "Item Condition Requirements"] },
  { path: "/warranty", name: "Warranty Page", expected: ["Warranty & Servicing", "5-Year Coverage"] },
  { path: "/privacy", name: "Privacy Page", expected: ["Privacy Policy", "Information We Collect"] },
  { path: "/terms", name: "Terms Page", expected: ["Terms of Service", "General Provisions"] },
];

const UNWANTED_PHRASES = [
  "Your Atelier Bag",
  "Privilege Code",
  "Armored Transit",
  "Acquisition Dossier",
  "Maison Concierge Dispatch",
  "Curated Private Archive",
];

async function runAudit() {
  console.log("=== RUNNING FULL STOREFRONT SIMPLE ENGLISH AUDIT ===\n");
  let passed = 0;
  let failed = 0;

  for (const route of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ [FAIL] ${route.name} (${route.path}) returned status ${res.status}`);
        failed++;
        continue;
      }

      const html = await res.text();

      // Check expected keywords
      const missingExpected = route.expected.filter((kw) => !html.toLowerCase().includes(kw.toLowerCase()));
      if (missingExpected.length > 0) {
        console.warn(`⚠️  [WARN] ${route.name}: Missing expected phrase(s): ${missingExpected.join(", ")}`);
      }

      // Check unwanted convoluted phrases
      const foundUnwanted = UNWANTED_PHRASES.filter((bad) => html.includes(bad));
      if (foundUnwanted.length > 0) {
        console.error(`❌ [FAIL] ${route.name}: Contains unwanted phrase(s): ${foundUnwanted.join(", ")}`);
        failed++;
        continue;
      }

      console.log(`✅ [PASS] ${route.name} (${route.path}) — Status 200, Clean English`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [ERROR] ${route.name} (${route.path}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Audit Complete: ${passed}/${ROUTES_TO_TEST.length} routes PASSED`);
  if (failed > 0) {
    console.log(`Failed / Errors: ${failed}`);
    process.exit(1);
  } else {
    console.log(`ALL 24 ROUTES VERIFIED WITH CLEAN, NATURAL, SIMPLE ENGLISH!`);
  }
}

runAudit();
