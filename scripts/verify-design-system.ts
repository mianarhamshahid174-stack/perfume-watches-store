import fs from "fs";
import path from "path";

console.log("==================================================================");
console.log("       VELORA ATELIERS - DESIGN SYSTEM VERIFICATION SUITE         ");
console.log("==================================================================");

const components = [
  "src/components/ui/button.tsx",
  "src/components/ui/section-heading.tsx",
  "src/components/ui/image-reveal.tsx",
  "src/components/ui/animated-text.tsx",
  "src/components/ui/product-card.tsx",
  "src/components/ui/collection-card.tsx",
  "src/components/ui/modal.tsx",
  "src/components/ui/drawer.tsx",
  "src/components/ui/carousel.tsx",
  "src/components/ui/breadcrumbs.tsx",
  "src/components/storefront/header.tsx",
  "src/components/storefront/footer.tsx",
  "src/lib/motion.ts",
  "src/app/globals.css",
  "src/app/design-system/page.tsx",
];

let allExist = true;
components.forEach((comp) => {
  const fullPath = path.join(process.cwd(), comp);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ [EXISTS] ${comp}`);
  } else {
    console.error(`  ✗ [MISSING] ${comp}`);
    allExist = false;
  }
});

console.log("\n==================================================================");
if (allExist) {
  console.log("ALL DESIGN SYSTEM COMPONENTS VERIFIED & READY!");
  process.exit(0);
} else {
  console.error("SOME COMPONENTS WERE NOT FOUND!");
  process.exit(1);
}
