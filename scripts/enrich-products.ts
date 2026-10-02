import prisma from "../src/lib/prisma";

async function enrichProducts() {
  console.log("=== ENRICHING VELORA PRODUCTS WITH DETAILED SPECS, MACRO DETAILS & OUT-OF-STOCK CASE ===");

  const watchMacroDetails = (name: string, dialDesc: string, caseDesc: string, strapDesc: string, claspDesc: string) => [
    {
      part: "dial",
      title: "The Dial Architecture",
      subtitle: "Galvanic Finish & Dimensional Indexes",
      description: dialDesc,
      imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "hands",
      title: "The Hands",
      subtitle: "Diamond-Faceted Chamfering",
      description: "Hand-blued and diamond-polished hands with 45° mirror-polished chamfers that glide with frictionless poise.",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "crown",
      title: "The Fluted Crown",
      subtitle: "Dual-Gasket Ergonomics",
      description: "Tactile knurled winding crown with twin internal gasket o-rings, set with a hand-polished natural cabochon.",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "case",
      title: "The Case Metallurgy",
      subtitle: "Vertical Satin & Hand Anglage",
      description: caseDesc,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "strap",
      title: "The Leather Strap",
      subtitle: "Artisanal Saddle Stitching",
      description: strapDesc,
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "clasp",
      title: "The Clasp",
      subtitle: "Micro-Adjustable Deployant",
      description: claspDesc,
      imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  const fragranceMacroDetails = (name: string, flaconDesc: string, capDesc: string, rawDesc: string) => [
    {
      part: "flacon",
      title: "The Crystalline Flacon",
      subtitle: "Hand-Polished Heavyweight French Glass",
      description: flaconDesc,
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "cap",
      title: "The Magnetic Monogram Cap",
      subtitle: "Brushed Ruthenium Alloy",
      description: capDesc,
      imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "atomizer",
      title: "The Precision Nebulizer",
      subtitle: "Micro-Mist Diffusion (0.07ml)",
      description: "Calibrated micro-mist pump distributing an ethereal vapor cloud that maximizes projection while preserving high-concentration botanical absolutes.",
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=85",
    },
    {
      part: "maceration",
      title: "The Botanical Maceration",
      subtitle: "180-Day Maturation in Grasse",
      description: rawDesc,
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  // 1. VELORA SIGNATURE 01
  const sig01 = await prisma.product.update({
    where: { slug: "velora-signature-01" },
    data: {
      caseThickness: "9.8 mm",
      crystal: "Double-domed sapphire crystal with 5 layers of internal anti-reflective coating",
      clasp: "Triple-blade folding deployant clasp in 316L stainless steel with micro-adjustment",
      macroDetails: watchMacroDetails(
        "VELORA SIGNATURE 01",
        "Opaline ivory galvanic treatment with circular satin-finished outer track, diamond-cut faceted hour markers, and sunken subsidiary seconds dial.",
        "Sculpted 316L stainless steel case with vertical brushed flanks juxtaposed against high-gloss mirror-polished bevelled lugs.",
        "Hand-selected full-grain French alligator assembled with tone-on-tone beeswax saddle stitching and supple anti-allergenic calf lining.",
        "Triple-blade folding deployant buckle with spring-loaded dual pushers and laser-engraved VELORA Geneva atelier coat of arms."
      ),
    },
  });
  console.log("✓ Enriched VELORA SIGNATURE 01");

  // Ensure video exists for Signature 01
  await prisma.productVideo.deleteMany({ where: { productId: sig01.id } });
  await prisma.productVideo.create({
    data: {
      productId: sig01.id,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Atelier Assembly in Geneva",
      posterUrl: "/images/velora-signature-01.jpg",
      sortOrder: 1,
    },
  });

  // 2. VELORA Chrono-Astral I
  const chrono = await prisma.product.update({
    where: { slug: "velora-chrono-astral-i" },
    data: {
      caseThickness: "11.2 mm",
      crystal: "Box-shaped sapphire crystal with internal anti-glare coating",
      clasp: "Micro-blasted Grade 5 Titanium deployant clasp",
      macroDetails: watchMacroDetails(
        "VELORA Chrono-Astral I",
        "Anthracite dial with snailed 30-minute and 12-hour sub-registers, ruthenium galvanic plating, and Super-LumiNova Grade X1 accents.",
        "Grade 5 aerospace titanium case micro-blasted to 15 microns with hand-satin bevels that shed ambient light.",
        "Water-resistant Horween noir hide with moisture-sealed edges and reinforced Kevlar stitch bars.",
        "Titanium skeletonized folding clasp with quick-release push buttons and 3mm micro-extension."
      ),
    },
  });
  console.log("✓ Enriched VELORA Chrono-Astral I");

  await prisma.productVideo.deleteMany({ where: { productId: chrono.id } });
  await prisma.productVideo.create({
    data: {
      productId: chrono.id,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "Flyback Chronograph Complication",
      posterUrl: "/images/velora-hero-editorial.jpg",
      sortOrder: 1,
    },
  });

  // 3. VELORA Tourbillon Grand Feu
  await prisma.product.update({
    where: { slug: "velora-tourbillon-grand-feu" },
    data: {
      caseThickness: "10.4 mm",
      crystal: "Double-curved sapphire crystal with scratch-resistant coating",
      clasp: "18K Rose Gold (4N) folding clasp",
      macroDetails: watchMacroDetails(
        "VELORA Tourbillon Grand Feu",
        "Eight-layer Grand Feu enamel dial fired at 800°C for an eternal, unblemished vitreous luster with hand-painted enamel Breguet numerals.",
        "Warm 18K 4N rose gold case with concave bezel and stepped lugs, polished entirely by hand with boxwood pegging.",
        "Dark Havana patinated Mississippi alligator leather with handmade saddle stitch.",
        "Solid 18K rose gold deployant clasp with engraved guilloché atelier monogram."
      ),
    },
  });
  console.log("✓ Enriched VELORA Tourbillon Grand Feu");

  // 4. VELORA Noir Chronomètre
  await prisma.product.update({
    where: { slug: "velora-noir-chronometre" },
    data: {
      caseThickness: "10.8 mm",
      crystal: "Cambered sapphire crystal with anti-glare coating",
      clasp: "DLC-coated Grade 5 Titanium deployant clasp",
      macroDetails: watchMacroDetails(
        "VELORA Noir Chronomètre",
        "Matte onyx dial with shadow ruthenium hour batons, laser-etched minute markers, and stealth grey indices.",
        "Diamond-like carbon (DLC) surface treatment delivering 4,000 Vickers hardness over a lightweight titanium monobloc architecture.",
        "Vulcanized high-performance FKM noir rubber strap with textured geometric micro-grid pattern.",
        "Matte DLC-treated titanium deployant buckle with dual safety pushers."
      ),
    },
  });
  console.log("✓ Enriched VELORA Noir Chronomètre");

  // 5. VELORA Classic Patrimony (OUT OF STOCK TEST CASE)
  const patrimony = await prisma.product.update({
    where: { slug: "velora-classic-patrimony" },
    data: {
      caseThickness: "7.8 mm",
      crystal: "Ultra-thin box sapphire crystal with hard AR coating",
      clasp: "Polished 316L pin buckle with engraved atelier monogram",
      macroDetails: watchMacroDetails(
        "VELORA Classic Patrimony",
        "Silver sunray dial with polished faceted hour batons and discreet railway minute track.",
        "Ultra-slim 7.8mm profilature engineered to slide effortlessly beneath bespoke shirt cuffs.",
        "Espresso French calfskin with tone-on-tone French stitching.",
        "316L surgical stainless steel pin buckle with hand-bevelled edges."
      ),
    },
  });

  // Set inventory to 0 for Classic Patrimony to test out-of-stock state!
  await prisma.inventory.upsert({
    where: { productId: patrimony.id },
    create: {
      productId: patrimony.id,
      quantity: 0,
      reserved: 0,
      warehouseLocation: "Geneva Vault Alpha-1",
    },
    update: {
      quantity: 0,
      reserved: 0,
    },
  });

  // Also set variant stock to 0 if variants exist
  await prisma.productVariant.updateMany({
    where: { productId: patrimony.id },
    data: { stock: 0 },
  });
  console.log("✓ Enriched VELORA Classic Patrimony (CONFIGURED AS OUT-OF-STOCK FOR VERIFICATION)");

  // 6. Fragrances Enrichment
  await prisma.product.update({
    where: { slug: "velora-nocturne-absolu-extrait" },
    data: {
      macroDetails: fragranceMacroDetails(
        "VELORA Nocturne Absolu",
        "Hand-blown 300g crystal glass flacon featuring deep smoke gradient graduation and laser-etched numbered base.",
        "Solid brass cap electroplated in brushed dark ruthenium with 4-point magnetic precision closure.",
        "Aged Cambodian agarwood and Damascene rose aged in French oak casks over two full seasonal equinoxes."
      ),
    },
  });

  await prisma.product.update({
    where: { slug: "velora-santal-royal-extrait" },
    data: {
      macroDetails: fragranceMacroDetails(
        "VELORA Santal Royal",
        "Clear monolithic flacon refracting warm amber hues through thick optical-grade base crystal.",
        "Solid brushed gold cap weighted to 120 grams with velvet-smooth magnetic snap.",
        "Wild Mysore sandalwood harvested sustainably, steam-distilled and cold-filtered to 28% concentration."
      ),
    },
  });

  console.log("=== ENRICHMENT COMPLETE! ALL SPECIFICATIONS STORED IN POSTGRESQL ===");
}

enrichProducts()
  .catch((err) => {
    console.error("Enrichment failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
