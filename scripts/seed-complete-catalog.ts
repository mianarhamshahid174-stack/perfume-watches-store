import { PrismaClient, ProductStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCompleteCatalog() {
  console.log("\n=======================================================");
  console.log("  SEEDING COMPLETE ORIGINAL VELORA LUXURY CATALOG");
  console.log("=======================================================\n");

  // Ensure categories exist
  const catHorlogerie = await prisma.category.upsert({
    where: { slug: "haute-horlogerie" },
    update: {
      name: "Haute Horlogerie",
      description: "Mechanical complications hand-crafted by master watchmakers with original architectural symmetry.",
      imageUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      ogImage: "/images/products/watches/velora-signature-01/front.jpg",
    },
    create: {
      name: "Haute Horlogerie",
      slug: "haute-horlogerie",
      description: "Mechanical complications hand-crafted by master watchmakers with original architectural symmetry.",
      imageUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      ogImage: "/images/products/watches/velora-signature-01/front.jpg",
    },
  });

  const catParfumerie = await prisma.category.upsert({
    where: { slug: "high-perfumery" },
    update: {
      name: "High Perfumery",
      description: "Pure extraits de parfum formulated in Grasse using rare resins and aged absolutes in crystal flacons.",
      imageUrl: "/images/products/fragrances/velora-noir-extrait/editorial.jpg",
      ogImage: "/images/products/fragrances/velora-noir-extrait/bottle-front.jpg",
    },
    create: {
      name: "High Perfumery",
      slug: "high-perfumery",
      description: "Pure extraits de parfum formulated in Grasse using rare resins and aged absolutes in crystal flacons.",
      imageUrl: "/images/products/fragrances/velora-noir-extrait/editorial.jpg",
      ogImage: "/images/products/fragrances/velora-noir-extrait/bottle-front.jpg",
    },
  });

  // Ensure collections exist
  const colSignature = await prisma.collection.upsert({
    where: { slug: "signature" },
    update: {
      name: "SIGNATURE",
      description: "The definitive archetype of modern horological restraint and mechanical purity.",
      heroImage: "/images/products/watches/velora-signature-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
    create: {
      name: "SIGNATURE",
      slug: "signature",
      description: "The definitive archetype of modern horological restraint and mechanical purity.",
      heroImage: "/images/products/watches/velora-signature-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-signature-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
  });

  const colNoir = await prisma.collection.upsert({
    where: { slug: "noir" },
    update: {
      name: "NOIR",
      description: "Monochromatic mastery forged in DLC-coated titanium and shadowed ruthenium.",
      heroImage: "/images/products/watches/velora-noir-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-noir-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
    create: {
      name: "NOIR",
      slug: "noir",
      description: "Monochromatic mastery forged in DLC-coated titanium and shadowed ruthenium.",
      heroImage: "/images/products/watches/velora-noir-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-noir-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
  });

  const colClassic = await prisma.collection.upsert({
    where: { slug: "classic" },
    update: {
      name: "CLASSIC",
      description: "Enduring proportions, Grand Feu enamel, and heritage complications refined for eternity.",
      heroImage: "/images/products/watches/velora-classic-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-classic-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
    create: {
      name: "CLASSIC",
      slug: "classic",
      description: "Enduring proportions, Grand Feu enamel, and heritage complications refined for eternity.",
      heroImage: "/images/products/watches/velora-classic-01/editorial.jpg",
      bannerUrl: "/images/products/watches/velora-classic-01/editorial.jpg",
      featured: true,
      isActive: true,
    },
  });

  const colNocturne = await prisma.collection.upsert({
    where: { slug: "nocturne-prive" },
    update: {
      name: "Nocturne Privé",
      description: "Intimate olfactory creations formulated exclusively for evening and contemplative wear.",
      heroImage: "/images/products/fragrances/velora-noir-extrait/lifestyle.jpg",
      bannerUrl: "/images/products/fragrances/velora-noir-extrait/lifestyle.jpg",
      featured: true,
      isActive: true,
    },
    create: {
      name: "Nocturne Privé",
      slug: "nocturne-prive",
      description: "Intimate olfactory creations formulated exclusively for evening and contemplative wear.",
      heroImage: "/images/products/fragrances/velora-noir-extrait/lifestyle.jpg",
      bannerUrl: "/images/products/fragrances/velora-noir-extrait/lifestyle.jpg",
      featured: true,
      isActive: true,
    },
  });

  // -------------------------------------------------------------
  // 6 ORIGINAL WATCH MODELS
  // -------------------------------------------------------------
  const watchesData = [
    {
      name: "VELORA SIGNATURE 01",
      slug: "velora-signature-01",
      sku: "VEL-SIG-01",
      shortDescription: "Original 39mm architecture in surgical 904L steel, opaline ivory dial, hand-flamed blued steel hands, and saddle-stitched Epsom calfskin.",
      description: "The VELORA SIGNATURE 01 is the founding cornerstone of the Maison. Conceived as a study in pure horological symmetry, the 39mm case is sculptured from cryogenic-hardened 904L stainless steel, alternating between mirror-polished anglage and micro-vertical brushwork. The double-domed sapphire crystal has internal multi-layer anti-reflective treatment, hovering above an opaline warm ivory dial. Applied faceted baton indexes in 18k rose gold catch the ambient light, while leaf-shaped blued hands trace the passage of time driven by the in-house Calibre VA-01 automatic movement with 68 hours of reserve.",
      price: 14500,
      compareAtPrice: 16000,
      cost: 4800,
      categoryId: catHorlogerie.id,
      collectionIds: [colSignature.id, colClassic.id],
      tags: ["Automatic", "Sapphire", "904L Steel", "Signature", "Iconic", "In-House"],
      movement: "In-House Calibre VA-01 Automatic (28,800 vph)",
      powerReserve: "68 Hours",
      caseMaterial: "Cryogenic-Hardened 904L Stainless Steel",
      caseDiameter: "39.0 mm",
      caseThickness: "9.2 mm",
      crystal: "Double-Domed Sapphire with 5x Anti-Reflective Coating",
      waterResistance: "50m / 5 ATM",
      dialColor: "Warm Opaline Ivory with Rose Gold Batons",
      strapMaterial: "Cognac French Epsom Calfskin, Artisanal Saddle Stitch",
      clasp: "Custom Micro-Adjustable 904L Deployant",
      featured: true,
      variants: [
        { sku: "VEL-SIG-01-COG", title: "Cognac Epsom Calfskin Strap", price: 14500, stock: 12 },
        { sku: "VEL-SIG-01-NOIR", title: "Midnight Black Alligator Strap", price: 15200, stock: 8 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Opaline Ivory Dial",
          subtitle: "Galvanic Micro-Texture & Rose Gold Batons",
          description: "Subtle velvet ivory dial surface with applied diamond-faceted 18k rose gold baton indices.",
          imageUrl: "/images/products/watches/velora-signature-01/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "The Leaf Hands",
          subtitle: "Flame-Blued Tempered Steel",
          description: "Heat-tempered blued steel feuille hands balanced to sub-milligram tolerances.",
          imageUrl: "/images/products/watches/velora-signature-01/front.jpg",
        },
        {
          part: "crown",
          title: "The Knurled Crown",
          subtitle: "Dual-Gasket Ergonomics",
          description: "Precision-fluted winding crown engineered with dual internal O-rings for tactile winding response.",
          imageUrl: "/images/products/watches/velora-signature-01/crown-macro.jpg",
        },
        {
          part: "case",
          title: "The 904L Steel Architecture",
          subtitle: "Vertical Satin & Mirror Anglage",
          description: "Cryogenically treated 904L steel with hand-lapped polished chamfers contrasting fine satin flanks.",
          imageUrl: "/images/products/watches/velora-signature-01/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Artisanal Saddle-Stitched Leather",
          subtitle: "French Epsom Grain",
          description: "Full-grain vegetable-tanned Epsom calfskin hand-stitched with waxed linen thread.",
          imageUrl: "/images/products/watches/velora-signature-01/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "Micro-Adjustable Deployant",
          subtitle: "Engineered Solid Steel",
          description: "Patented double-folding clasp providing 4mm of instant tool-free micro-adjustment.",
          imageUrl: "/images/products/watches/velora-signature-01/strap-clasp.jpg",
        },
      ],
    },
    {
      name: "VELORA SIGNATURE 02",
      slug: "velora-signature-02",
      sku: "VEL-SIG-02",
      shortDescription: "39mm 18K Rose Gold (4N) case framing a fumé slate charcoal dial with hand-applied 18k gold faceted batons and slate matte alligator.",
      description: "A nocturnal evolution of our signature silhouette. Machined from solid, sustainably mined 18K Rose Gold (4N), the SIGNATURE 02 pairs warm architectural gold with a mesmerising fumé charcoal sunburst dial that deepens from warm graphite at the center to pure obsidian at the perimeter. The sapphire crystal exhibition caseback reveals the hand-finished Calibre VA-01G with circular Côtes de Genève and a skeletonized rose gold tungsten rotor.",
      price: 26800,
      compareAtPrice: 29500,
      cost: 9200,
      categoryId: catHorlogerie.id,
      collectionIds: [colSignature.id],
      tags: ["Automatic", "Rose Gold", "Fumé Dial", "Signature", "Limited Run"],
      movement: "In-House Calibre VA-01G Rose Gold Automatic (28,800 vph)",
      powerReserve: "68 Hours",
      caseMaterial: "Solid 18K Rose Gold (4N)",
      caseDiameter: "39.0 mm",
      caseThickness: "9.2 mm",
      crystal: "Double-Domed Sapphire with Internal Anti-Reflective Treatment",
      waterResistance: "50m / 5 ATM",
      dialColor: "Fumé Slate Charcoal Sunburst",
      strapMaterial: "Hand-Cut Matte Slate Mississippi Alligator",
      clasp: "Solid 18K Rose Gold Pin-Buckle & Deployant",
      featured: true,
      variants: [
        { sku: "VEL-SIG-02-SLT", title: "Matte Slate Alligator Strap", price: 26800, stock: 5 },
        { sku: "VEL-SIG-02-BRN", title: "Espresso Matte Alligator Strap", price: 26800, stock: 4 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Fumé Charcoal Dial",
          subtitle: "Degradé Sunburst Radiance",
          description: "Radial galvanic brushing that darkens gently toward the outer minute track.",
          imageUrl: "/images/products/watches/velora-signature-02/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "18K Gold Faceted Hands",
          subtitle: "Mirror-Polished Anglage",
          description: "Solid 18k rose gold hands diamond-chamfered along each facet edge.",
          imageUrl: "/images/products/watches/velora-signature-02/front.jpg",
        },
        {
          part: "crown",
          title: "The Fluted 18K Crown",
          subtitle: "Direct-Drive Winding",
          description: "Deeply fluted 18K gold crown offering silky winding resistance.",
          imageUrl: "/images/products/watches/velora-signature-02/crown-macro.jpg",
        },
        {
          part: "case",
          title: "Solid 18K Rose Gold Case",
          subtitle: "4N Warmth Alloy",
          description: "Subtle copper-palladium alloy formulation preventing color degradation over decades.",
          imageUrl: "/images/products/watches/velora-signature-02/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Matte Slate Alligator",
          subtitle: "Large Square Scales",
          description: "Hand-selected Mississippiensis alligator finished with seamless rolled edges.",
          imageUrl: "/images/products/watches/velora-signature-02/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "18K Rose Gold Deployant",
          subtitle: "Ergonomic Sculpting",
          description: "Solid gold blade clasp contoured precisely to wrist curvature.",
          imageUrl: "/images/products/watches/velora-signature-02/strap-clasp.jpg",
        },
      ],
    },
    {
      name: "VELORA NOIR 01",
      slug: "velora-noir-01",
      sku: "VEL-NOIR-01",
      shortDescription: "Monolithic 40mm Grade 5 DLC Titanium timepiece with a light-absorbing velvet black dial and dark ruthenium accents.",
      description: "Forged from Grade 5 Titanium and shielded with diamond-like carbon (DLC) coating, the VELORA NOIR 01 explores the absolute boundaries of stealth luxury. The dial features an ultra-matte velvet black surface that absorbs 99.2% of incident reflections, juxtaposed against polished anthracite-ruthenium indexes and luminescent hour pointers. Paired with a seamless textured FKM vulcanized rubber strap engineered for all-climate ergonomics.",
      price: 17200,
      compareAtPrice: 19000,
      cost: 5600,
      categoryId: catHorlogerie.id,
      collectionIds: [colNoir.id],
      tags: ["Titanium", "DLC Coating", "Noir", "Stealth Luxury", "Automatic"],
      movement: "In-House Calibre VA-02T DLC Automatic",
      powerReserve: "72 Hours",
      caseMaterial: "Micro-Blasted Grade 5 Titanium with Diamond-Like Carbon (DLC)",
      caseDiameter: "40.0 mm",
      caseThickness: "9.6 mm",
      crystal: "Curved Sapphire Crystal with Dual Smoked Anti-Glare Treatment",
      waterResistance: "100m / 10 ATM",
      dialColor: "Ultra-Matte Velvet Noir with Ruthenium Batons",
      strapMaterial: "Textured FKM High-Performance Elastomer",
      clasp: "Black DLC Titanium Safety Folding Clasp",
      featured: true,
      variants: [
        { sku: "VEL-NOIR-01-FKM", title: "Textured Obsidian FKM Strap", price: 17200, stock: 10 },
        { sku: "VEL-NOIR-01-ALC", title: "Black Alcantara Technical Strap", price: 17800, stock: 6 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Velvet Black Void",
          subtitle: "Light-Absorbing Micro-Structure",
          description: "Specialized coating creating high-contrast depth against ruthenium-plated batons.",
          imageUrl: "/images/products/watches/velora-noir-01/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "Ruthenium Shadow Hands",
          subtitle: "Anthracite Satin Bevels",
          description: "Deep gunmetal hands inlaid with custom charcoal Super-LumiNova.",
          imageUrl: "/images/products/watches/velora-noir-01/front.jpg",
        },
        {
          part: "crown",
          title: "Stealth DLC Crown",
          subtitle: "Screw-Down 100m Architecture",
          description: "Tactile knurled titanium crown coated in high-adhesion DLC with double seal.",
          imageUrl: "/images/products/watches/velora-noir-01/crown-macro.jpg",
        },
        {
          part: "case",
          title: "Grade 5 DLC Titanium",
          subtitle: "Micro-Blasted Monolith",
          description: "Weightless 64-gram case structure offering extraordinary tensile strength and scratch immunity.",
          imageUrl: "/images/products/watches/velora-noir-01/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Textured FKM Elastomer",
          subtitle: "UV & Sweat Resistant",
          description: "Custom geometric underside channeling airflow for supreme wrist breathability.",
          imageUrl: "/images/products/watches/velora-noir-01/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "DLC Safety Deployant",
          subtitle: "Dual Push-Button Security",
          description: "Micro-machined titanium mechanism locking firmly with satisfying acoustic feedback.",
          imageUrl: "/images/products/watches/velora-noir-01/strap-clasp.jpg",
        },
      ],
    },
    {
      name: "VELORA NOIR 02",
      slug: "velora-noir-02",
      sku: "VEL-NOIR-02",
      shortDescription: "Openworked architectural skeleton in satin black zirconium ceramic with smoked sapphire dial and crimson sweep seconds.",
      description: "A radical vision of transparency and mechanical tension. The NOIR 02 strips away unnecessary mass to reveal the multi-tiered Calibre VA-SKEL in motion. Encased in high-density zirconium ceramic that is virtually impervious to scratches, the smoked sapphire dial suspends floating ruthenium hour markers, punctuated by a hand-lacquered crimson seconds needle. Each bridge is hand-beveled with mirror anglage by master artisans.",
      price: 34000,
      compareAtPrice: 38000,
      cost: 12500,
      categoryId: catHorlogerie.id,
      collectionIds: [colNoir.id],
      tags: ["Skeleton", "Ceramic", "High Horology", "Noir", "Openworked"],
      movement: "Calibre VA-SKEL Openworked Skeleton Movement (Hand-Finished)",
      powerReserve: "70 Hours",
      caseMaterial: "High-Tech Black Zirconium Ceramic",
      caseDiameter: "41.0 mm",
      caseThickness: "10.1 mm",
      crystal: "Triple-Anti-Reflective Flat Sapphire Crystal Front & Back",
      waterResistance: "50m / 5 ATM",
      dialColor: "Openworked Smoked Sapphire with Crimson Accent",
      strapMaterial: "Ballistic Weave Technical Rubber with Calf Lining",
      clasp: "Ceramic & Titanium Dual Deployant",
      featured: true,
      variants: [
        { sku: "VEL-NOIR-02-BAL", title: "Ballistic Weave Technical Rubber", price: 34000, stock: 4 },
        { sku: "VEL-NOIR-02-CER", title: "Full Matte Ceramic Link Bracelet", price: 39500, stock: 3 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Openworked Calibre",
          subtitle: "Hand-Beveled Ruthenium Bridges",
          description: "Internal gear train, balance wheel, and mainspring barrel fully exposed through smoked sapphire.",
          imageUrl: "/images/products/watches/velora-noir-02/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "Skeleton Dauphine Hands",
          subtitle: "Crimson Sweep Pointer",
          description: "Openworked geometric hands counterbalanced with a surgical red lacquered needle.",
          imageUrl: "/images/products/watches/velora-noir-02/front.jpg",
        },
        {
          part: "crown",
          title: "Ceramic Fluted Crown",
          subtitle: "Smooth Wind Geometry",
          description: "Sintered ceramic crown body resistant to wear with integrated rubber grip ring.",
          imageUrl: "/images/products/watches/velora-noir-02/crown-macro.jpg",
        },
        {
          part: "case",
          title: "Zirconium Oxide Ceramic",
          subtitle: "Diamond-Hard Enclosure",
          description: "Sintered at 1,500°C for absolute surface hardness exceeding 1,500 Vickers.",
          imageUrl: "/images/products/watches/velora-noir-02/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Hybrid Ballistic Textile",
          subtitle: "Water-Resistant Calf Lining",
          description: "Military-grade Cordura surface bonded to supple French calfskin underside.",
          imageUrl: "/images/products/watches/velora-noir-02/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "Dual-Spring Ceramic Deployant",
          subtitle: "Zero-Wear Mechanism",
          description: "Deployant blades constructed from high-tensile titanium with black ceramic outer cap.",
          imageUrl: "/images/products/watches/velora-noir-02/strap-clasp.jpg",
        },
      ],
    },
    {
      name: "VELORA CLASSIC 01",
      slug: "velora-classic-01",
      sku: "VEL-CLS-01",
      shortDescription: "Ultra-slim 38mm dress watch in mirror-polished 316L steel with a pristine cold-lacquered porcelain white dial and blued hands.",
      description: "Timeless proportion reimagined for modern formal attire. Measuring just 7.9mm in height, the VELORA CLASSIC 01 slips effortlessly beneath a double cuff. Its multi-layer cold-lacquered porcelain dial achieves a deep glassy luster, decorated with slender bespoke serif Roman numerals and heat-tempered blued steel feuille hands. Driven by the manual-wind Calibre VA-03M with 60 hours of smooth winding reserve.",
      price: 11800,
      compareAtPrice: 13000,
      cost: 3900,
      categoryId: catHorlogerie.id,
      collectionIds: [colClassic.id],
      tags: ["Manual-Wind", "Ultra-Slim", "Porcelain Dial", "Classic", "Dress Watch"],
      movement: "In-House Calibre VA-03M Manual-Wind Ultra-Thin",
      powerReserve: "60 Hours",
      caseMaterial: "Mirror-Polished 316L Surgical Stainless Steel",
      caseDiameter: "38.0 mm",
      caseThickness: "7.9 mm",
      crystal: "Box-Domed Sapphire Crystal with Internal Anti-Reflective Treatment",
      waterResistance: "30m / 3 ATM",
      dialColor: "Porcelain White Multi-Layer Cold Lacquer",
      strapMaterial: "Genuine Shell Cordovan in Cognac Brown",
      clasp: "Polished Stainless Steel Pin Buckle with Engraved Monogram",
      featured: true,
      variants: [
        { sku: "VEL-CLS-01-COG", title: "Cognac Horween Shell Cordovan", price: 11800, stock: 9 },
        { sku: "VEL-CLS-01-NOIR", title: "Noir Horween Shell Cordovan", price: 11800, stock: 7 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Porcelain Lacquer Dial",
          subtitle: "Seven-Layer High-Gloss Enamel Luster",
          description: "Immaculate cold enamel surface cured and polished by hand to a vitreous depth.",
          imageUrl: "/images/products/watches/velora-classic-01/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "Tempered Feuille Hands",
          subtitle: "Traditional Flame Blueing",
          description: "Graceful leaf hands thermally treated to a deep royal blue at 295°C.",
          imageUrl: "/images/products/watches/velora-classic-01/front.jpg",
        },
        {
          part: "crown",
          title: "The Ultra-Slim Onion Crown",
          subtitle: "Classic Horological Heritage",
          description: "Subtle vintage winding crown providing effortless engagement for manual daily ritual.",
          imageUrl: "/images/products/watches/velora-classic-01/crown-macro.jpg",
        },
        {
          part: "case",
          title: "Ultra-Thin 7.9mm Profile",
          subtitle: "Three-Piece Stepped Bezel",
          description: "Slender stepped case profile designed to sit completely flush against the wrist.",
          imageUrl: "/images/products/watches/velora-classic-01/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Genuine Shell Cordovan",
          subtitle: "Equine Leather of Unrivaled Longevity",
          description: "Naturally vegetable-tanned equine leather prized for its non-creasing mirror surface.",
          imageUrl: "/images/products/watches/velora-classic-01/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "Engraved Pin Buckle",
          subtitle: "Classic Formal Elegance",
          description: "Slender stainless steel ardillon buckle subtly engraved with the VELORA seal.",
          imageUrl: "/images/products/watches/velora-classic-01/strap-clasp.jpg",
        },
      ],
    },
    {
      name: "VELORA AUREL 01",
      slug: "velora-aurel-01",
      sku: "VEL-AUR-01",
      shortDescription: "Sculptural 39.5mm timepiece in 18K Champagne Yellow Gold with integrated brick-link bracelet and warm satin champagne dial.",
      description: "The embodiment of modern Mediterranean radiance. Cast in VELORA's proprietary 18K Champagne Yellow Gold alloy—softer and more nuanced than conventional yellow gold—the AUREL 01 features a seamless integrated multi-row brick-link bracelet that drapes fluidly on the wrist. The warm satin-brushed champagne dial is elevated by baguette-cut gold indices and polished sword hands powered by the Calibre VA-04 Golden Reserve automatic movement.",
      price: 42500,
      compareAtPrice: 46000,
      cost: 16000,
      categoryId: catHorlogerie.id,
      collectionIds: [colSignature.id, colClassic.id],
      tags: ["Champagne Gold", "Integrated Bracelet", "Haute Horlogerie", "Jewelry Watch"],
      movement: "In-House Calibre VA-04 Golden Reserve Automatic",
      powerReserve: "65 Hours",
      caseMaterial: "Proprietary 18K Champagne Yellow Gold",
      caseDiameter: "39.5 mm",
      caseThickness: "8.8 mm",
      crystal: "Double-Domed Scratch-Proof Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      dialColor: "Vertical Satin Champagne Gold with Baguette Indexes",
      strapMaterial: "Solid 18K Champagne Gold Integrated Brick-Link Bracelet",
      clasp: "Concealed Butterfly Clasp in 18K Gold",
      featured: true,
      variants: [
        { sku: "VEL-AUR-01-BRC", title: "Solid 18K Brick-Link Bracelet", price: 42500, stock: 3 },
        { sku: "VEL-AUR-01-LEA", title: "Honey Suede Alligator with 18K Clasp", price: 34500, stock: 4 },
      ],
      macroDetails: [
        {
          part: "dial",
          title: "The Satin Champagne Dial",
          subtitle: "Sunburst Texture & Baguette Facets",
          description: "Warm golden dial with vertical satin graining catching natural light reflections.",
          imageUrl: "/images/products/watches/velora-aurel-01/dial-macro.jpg",
        },
        {
          part: "hands",
          title: "Solid 18K Sword Hands",
          subtitle: "Mirrored Facets",
          description: "Hand-polished champagne gold hands offering pristine legibility.",
          imageUrl: "/images/products/watches/velora-aurel-01/front.jpg",
        },
        {
          part: "crown",
          title: "Integrated Gold Crown",
          subtitle: "Cabochon Setting",
          description: "Subtly recessed into the case flank with an inlaid natural onyx cabochon.",
          imageUrl: "/images/products/watches/velora-aurel-01/crown-macro.jpg",
        },
        {
          part: "case",
          title: "18K Champagne Gold Case",
          subtitle: "Proprietary Alloy",
          description: "Formulated with 75% pure gold, silver, and palladium for an understated pale yellow brilliance.",
          imageUrl: "/images/products/watches/velora-aurel-01/case-macro.jpg",
        },
        {
          part: "strap",
          title: "Integrated Brick-Link Bracelet",
          subtitle: "Articulated Fluidity",
          description: "Over 140 individually hand-finished gold links articulating seamlessly over the wrist.",
          imageUrl: "/images/products/watches/velora-aurel-01/strap-clasp.jpg",
        },
        {
          part: "clasp",
          title: "Concealed Butterfly Clasp",
          subtitle: "Invisible Closure",
          description: "Dual spring-loaded blades disappearing cleanly beneath the continuous bracelet links.",
          imageUrl: "/images/products/watches/velora-aurel-01/strap-clasp.jpg",
        },
      ],
    },
  ];

  // -------------------------------------------------------------
  // 5 ORIGINAL FRAGRANCE RELEASES
  // -------------------------------------------------------------
  const fragrancesData = [
    {
      name: "VELORA NOIR",
      slug: "velora-noir-extrait",
      sku: "VEL-FRG-NOIR",
      shortDescription: "A dark nocturnal tapestry of Cade oil, birch tar, smoked leather, and wild Indonesian agarwood aged in dark oak casks.",
      description: "VELORA NOIR is an olfactory study of shadow, mineral silence, and sensual fire. Opening with crisp cracked black pepper and Italian bergamot, the core unfurls into dark smoked leather, Atlas cedarwood, and resinous frankincense. The drydown reveals an addictive foundation of wild Indonesian agarwood and vetiver bourbon, housed in our monolithic smoked obsidian flacon crowned with a heavy brushed gunmetal cap.",
      price: 420,
      compareAtPrice: 480,
      cost: 95,
      categoryId: catParfumerie.id,
      collectionIds: [colNoir.id, colNocturne.id],
      tags: ["Extrait de Parfum", "Smoked Leather", "Agarwood", "Noir", "Unisex"],
      concentration: "Extrait de Parfum (32% Concentration)",
      olfactiveFamily: "Smoked Leather & Rare Wood",
      gender: "Unisex / Contemplative",
      volumeMl: 100,
      featured: true,
      variants: [
        { sku: "VEL-FRG-NOIR-100", title: "100ml Heavyweight Crystal Flacon", price: 420, stock: 24 },
        { sku: "VEL-FRG-NOIR-50", title: "50ml Travel Flacon with Leather Sheath", price: 280, stock: 18 },
      ],
      macroDetails: [
        {
          part: "flacon",
          title: "The Smoked Obsidian Flacon",
          subtitle: "Hand-Cut French Crystal (480g)",
          description: "Heavyweight dark smoked glass designed to shield volatile resin molecules from UV rays.",
          imageUrl: "/images/products/fragrances/velora-noir-extrait/bottle-front.jpg",
        },
        {
          part: "cap",
          title: "The Gunmetal Cap",
          subtitle: "Machined Magnetic Shield",
          description: "Solid brass cap coated in dark brushed ruthenium with satisfying magnetic snap closure.",
          imageUrl: "/images/products/fragrances/velora-noir-extrait/bottle-angle.jpg",
        },
        {
          part: "packaging",
          title: "The Presentation Vault",
          subtitle: "Textured Linen & Black Velvet",
          description: "Handcrafted rigid presentation box lined in deep black velvet with certificate of provenance.",
          imageUrl: "/images/products/fragrances/velora-noir-extrait/box.jpg",
        },
        {
          part: "lifestyle",
          title: "The Nocturnal Sillage",
          subtitle: "Over 14 Hours Longevity",
          description: "High molecular weight resins ensuring an intimate, magnetic trail that evolves throughout the night.",
          imageUrl: "/images/products/fragrances/velora-noir-extrait/lifestyle.jpg",
        },
        {
          part: "notes",
          title: "Wild Indonesian Agarwood",
          subtitle: "Cold-Extracted Resins",
          description: "Aged agarwood chips slow-distilled at low temperature to preserve balsamic notes.",
          imageUrl: "/images/products/fragrances/velora-noir-extrait/ingredient-notes.jpg",
        },
      ],
    },
    {
      name: "VELORA AURA",
      slug: "velora-aura-extrait",
      sku: "VEL-FRG-AURA",
      shortDescription: "Luminous Calabrian bergamot, solar jasmine sambac, warm white ambergris, and sun-drenched coastal cedar.",
      description: "An olfactory ode to golden hour on the Mediterranean cliffside. VELORA AURA sparkles with solar Italian citrus and sheer white florals before resting into a radiant heart of jasmine sambac and creamy neroli. The drydown leaves an intoxicating warmth of white ambergris, golden musk, and cashmere wood. Housed in a crystalline frosted flacon that captures and diffracts golden rays.",
      price: 380,
      compareAtPrice: 420,
      cost: 85,
      categoryId: catParfumerie.id,
      collectionIds: [colSignature.id],
      tags: ["Extrait de Parfum", "Solar Citrus", "Jasmine", "Amber", "Luminous"],
      concentration: "Extrait de Parfum (30% Concentration)",
      olfactiveFamily: "Solar Floral & Golden Amber",
      gender: "Unisex / Luminous",
      volumeMl: 100,
      featured: true,
      variants: [
        { sku: "VEL-FRG-AURA-100", title: "100ml Frosted Crystal Flacon", price: 380, stock: 30 },
        { sku: "VEL-FRG-AURA-50", title: "50ml Travel Flacon with Gold Sheath", price: 250, stock: 15 },
      ],
      macroDetails: [
        {
          part: "flacon",
          title: "The Frosted Solar Flacon",
          subtitle: "Semi-Matte Champagne Glass",
          description: "Soft satin-frosted French glass diffusing natural sunlight with a warm golden inner glow.",
          imageUrl: "/images/products/fragrances/velora-aura-extrait/bottle-front.jpg",
        },
        {
          part: "cap",
          title: "The 18K Champagne Cap",
          subtitle: "Polished Gold Finish",
          description: "Heavyweight gold-tone stopper engraved with the minimalist VELORA crest.",
          imageUrl: "/images/products/fragrances/velora-aura-extrait/bottle-angle.jpg",
        },
        {
          part: "packaging",
          title: "The Ivory Gift Box",
          subtitle: "Gold Foil Monogram",
          description: "Premium warm ivory rigid box with gold hot-stamped typography and satin pull ribbon.",
          imageUrl: "/images/products/fragrances/velora-aura-extrait/box.jpg",
        },
        {
          part: "lifestyle",
          title: "Radiant Golden Hour Trail",
          subtitle: "Solar Diffusion",
          description: "Effortlessly elegant daytime projection leaving a clean, sun-warmed amber impression.",
          imageUrl: "/images/products/fragrances/velora-aura-extrait/lifestyle.jpg",
        },
        {
          part: "notes",
          title: "Calabrian Bergamot & Jasmine",
          subtitle: "Hand-Picked at Sunrise",
          description: "Cold-pressed citrus rind harmonized with night-blooming Grasse jasmine petals.",
          imageUrl: "/images/products/fragrances/velora-aura-extrait/ingredient-notes.jpg",
        },
      ],
    },
    {
      name: "VELORA ÉLAN",
      slug: "velora-elan-extrait",
      sku: "VEL-FRG-ELAN",
      shortDescription: "Highland juniper berry, fresh green cypress, crushed violet leaves, and damp Haitian vetiver.",
      description: "Crisp, sharp, and invigorating. VELORA ÉLAN captures the aristocratic vitality of alpine forests and morning mist. Top notes of wild juniper and crushed peppermint give way to powdery violet leaves and Siberian pine needle. The finish is anchored by noble Haitian vetiver roots and clean white cedarwood, housed in deep emerald glass with a polished palladium stopper.",
      price: 395,
      compareAtPrice: 440,
      cost: 88,
      categoryId: catParfumerie.id,
      collectionIds: [colClassic.id],
      tags: ["Extrait de Parfum", "Aromatic Green", "Vetiver", "Fresh Luxury", "Unisex"],
      concentration: "Extrait de Parfum (30% Concentration)",
      olfactiveFamily: "Green Aromatic & Noble Woods",
      gender: "Unisex / Fresh Aristocratic",
      volumeMl: 100,
      featured: true,
      variants: [
        { sku: "VEL-FRG-ELAN-100", title: "100ml Forest Emerald Flacon", price: 395, stock: 20 },
        { sku: "VEL-FRG-ELAN-50", title: "50ml Travel Flacon with Silver Sheath", price: 260, stock: 12 },
      ],
      macroDetails: [
        {
          part: "flacon",
          title: "The Forest Emerald Flacon",
          subtitle: "Deep Pine Mineral Tint",
          description: "Bespoke glass tinted with natural copper minerals yielding a rich forest emerald translucence.",
          imageUrl: "/images/products/fragrances/velora-elan-extrait/bottle-front.jpg",
        },
        {
          part: "cap",
          title: "The Palladium Cap",
          subtitle: "Mirror-Polished Noble Metal",
          description: "Solid brass coated in precious palladium for lifetime resistance against tarnish.",
          imageUrl: "/images/products/fragrances/velora-elan-extrait/bottle-angle.jpg",
        },
        {
          part: "packaging",
          title: "The Botanical Box",
          subtitle: "Forest Green Textured Paperboard",
          description: "Forest green presentation box debossed with microscopic botanical leaf patterns.",
          imageUrl: "/images/products/fragrances/velora-elan-extrait/box.jpg",
        },
        {
          part: "lifestyle",
          title: "Crisp Alpine Sillage",
          subtitle: "Invigorating Scent Architecture",
          description: "Clean, fresh, and remarkably enduring without synthetic harshness.",
          imageUrl: "/images/products/fragrances/velora-elan-extrait/lifestyle.jpg",
        },
        {
          part: "notes",
          title: "Highland Juniper & Vetiver",
          subtitle: "Steam-Distilled Botanical Essences",
          description: "Wild-harvested juniper berries distilled at high altitude for exceptional aromatic clarity.",
          imageUrl: "/images/products/fragrances/velora-elan-extrait/ingredient-notes.jpg",
        },
      ],
    },
    {
      name: "VELORA OUD",
      slug: "velora-oud-extrait",
      sku: "VEL-FRG-OUD",
      shortDescription: "Rare wild Cambodian agarwood, Persian saffron threads, Taif rose absolute, and warm balsamic myrrh.",
      description: "The crown jewel of VELORA's High Perfumery atelier. Formulated at an exceptional 35% oil concentration, VELORA OUD uses ethically harvested wild Cambodian agarwood naturally matured for fifteen years. Layered with crimson threads of hand-picked Persian saffron, royal Taif rose petals, and smoldering amber resins. Encased in a heavyweight cognac-amber crystal flacon with a solid fluted bronze cap.",
      price: 550,
      compareAtPrice: 620,
      cost: 140,
      categoryId: catParfumerie.id,
      collectionIds: [colNocturne.id],
      tags: ["Extrait de Parfum", "Cambodian Oud", "Taif Rose", "Saffron", "Opulent"],
      concentration: "Extrait de Parfum (35% Concentration)",
      olfactiveFamily: "Orientale Boisé & Spice",
      gender: "Unisex / Opulent",
      volumeMl: 100,
      featured: true,
      variants: [
        { sku: "VEL-FRG-OUD-100", title: "100ml Cognac Crystal Flacon", price: 550, stock: 15 },
        { sku: "VEL-FRG-OUD-50", title: "50ml Travel Flacon with Bronze Sheath", price: 340, stock: 10 },
      ],
      macroDetails: [
        {
          part: "flacon",
          title: "The Amber Cognac Crystal",
          subtitle: "Hand-Blown Heavy Crystal",
          description: "Warm amber-tinted crystal reflecting liquid gold hues under candlelight.",
          imageUrl: "/images/products/fragrances/velora-oud-extrait/bottle-front.jpg",
        },
        {
          part: "cap",
          title: "The Fluted Bronze Cap",
          subtitle: "Antiqued Bronze Finish",
          description: "Cast bronze cap featuring classical vertical fluting and monogram seal.",
          imageUrl: "/images/products/fragrances/velora-oud-extrait/bottle-angle.jpg",
        },
        {
          part: "packaging",
          title: "The Royal Lacquered Box",
          subtitle: "Cognac Satin & Bronze Foil",
          description: "Opulent presentation box featuring bronze metallic foil and velvet-padded flacon bed.",
          imageUrl: "/images/products/fragrances/velora-oud-extrait/box.jpg",
        },
        {
          part: "lifestyle",
          title: "The 24-Hour Imperial Trail",
          subtitle: "Exceptional Concentration",
          description: "A profound, hypnotic trail that lingers gracefully on fabric and skin for over 24 hours.",
          imageUrl: "/images/products/fragrances/velora-oud-extrait/lifestyle.jpg",
        },
        {
          part: "notes",
          title: "15-Year Aged Cambodian Oud",
          subtitle: "Rare Wild Harvest",
          description: "Rich, animalic, yet remarkably smooth agarwood aged to perfection in Grasse vaults.",
          imageUrl: "/images/products/fragrances/velora-oud-extrait/ingredient-notes.jpg",
        },
      ],
    },
    {
      name: "VELORA SANTÉ",
      slug: "velora-sante-extrait",
      sku: "VEL-FRG-SANTE",
      shortDescription: "Delicate Imperial white tea, crisp Bartlett pear, dewy Damask rosewater, and mineral crystalline musk.",
      description: "A tranquil breath of serenity and graceful restraint. VELORA SANTÉ opens with dewy white peach, sparkling Bartlett pear, and steepings of rare silver needle white tea. As it warms against the skin, tender Damask rose petals and iris powder bloom over a whisper-soft base of mineral musks and blond sandalwood. Housed in a fluted glass column with a warm rose gold collar.",
      price: 360,
      compareAtPrice: 400,
      cost: 75,
      categoryId: catParfumerie.id,
      collectionIds: [colSignature.id],
      tags: ["Extrait de Parfum", "White Tea", "Pear", "Damask Rose", "Ethereal"],
      concentration: "Extrait de Parfum (28% Concentration)",
      olfactiveFamily: "Soft Floral & Mineral Tea",
      gender: "Unisex / Ethereal",
      volumeMl: 100,
      featured: true,
      variants: [
        { sku: "VEL-FRG-SANTE-100", title: "100ml Fluted Glass Column Flacon", price: 360, stock: 22 },
        { sku: "VEL-FRG-SANTE-50", title: "50ml Travel Flacon with Rose Gold Sheath", price: 240, stock: 14 },
      ],
      macroDetails: [
        {
          part: "flacon",
          title: "The Fluted Glass Column",
          subtitle: "Classical Architectural Grooves",
          description: "Slender fluted glass column creating prismatic light reflections.",
          imageUrl: "/images/products/fragrances/velora-sante-extrait/bottle-front.jpg",
        },
        {
          part: "cap",
          title: "The Rose Gold Collar",
          subtitle: "Delicate Blush Metallic",
          description: "Subtle 18k rose gold plated collar and cap with blush silk tassel accent.",
          imageUrl: "/images/products/fragrances/velora-sante-extrait/bottle-angle.jpg",
        },
        {
          part: "packaging",
          title: "The Ivory & Blush Box",
          subtitle: "Rose Gold Foil Detailing",
          description: "Minimalist cream presentation box featuring understated rose gold lettering.",
          imageUrl: "/images/products/fragrances/velora-sante-extrait/box.jpg",
        },
        {
          part: "lifestyle",
          title: "Whisper-Soft Intimate Aura",
          subtitle: "Clean & Serene",
          description: "A second-skin fragrance providing a cocoon of pure tranquility.",
          imageUrl: "/images/products/fragrances/velora-sante-extrait/lifestyle.jpg",
        },
        {
          part: "notes",
          title: "Imperial Silver Needle Tea",
          subtitle: "Spring Harvest Buds",
          description: "Rare first-flush white tea buds extracted using supercritical CO2 for pure essence.",
          imageUrl: "/images/products/fragrances/velora-sante-extrait/ingredient-notes.jpg",
        },
      ],
    },
  ];

  // -------------------------------------------------------------
  // EXECUTE UPSERTS AND IMAGE ASSOCIATIONS
  // -------------------------------------------------------------

  // 1. Process Watches
  for (const w of watchesData) {
    console.log(`Processing Watch: ${w.name} (${w.slug})...`);
    
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug: w.slug },
      include: { images: true, variants: true, collections: true },
    });

    const primaryImgUrl = `/images/products/watches/${w.slug}/front.jpg`;
    
    const watchImages = [
      { url: `/images/products/watches/${w.slug}/front.jpg`, altText: `${w.name} Studio Front View`, sortOrder: 1, isPrimary: true },
      { url: `/images/products/watches/${w.slug}/angle.jpg`, altText: `${w.name} 45-Degree Angle Perspective`, sortOrder: 2, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/side.jpg`, altText: `${w.name} Side Profile View`, sortOrder: 3, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/dial-macro.jpg`, altText: `${w.name} Dial Macro Detail`, sortOrder: 4, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/crown-macro.jpg`, altText: `${w.name} Crown Macro Detail`, sortOrder: 5, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/case-macro.jpg`, altText: `${w.name} Case Macro Architecture`, sortOrder: 6, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/strap-clasp.jpg`, altText: `${w.name} Strap & Clasp Detail`, sortOrder: 7, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/wrist-lifestyle.jpg`, altText: `${w.name} On-Wrist Lifestyle Photography`, sortOrder: 8, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/editorial.jpg`, altText: `${w.name} Cinematic Editorial Campaign`, sortOrder: 9, isPrimary: false },
      { url: `/images/products/watches/${w.slug}/packaging.jpg`, altText: `${w.name} Presentation Box & Packaging`, sortOrder: 10, isPrimary: false },
    ];

    let productId = existing?.id;

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          name: w.name,
          slug: w.slug,
          sku: w.sku,
          shortDescription: w.shortDescription,
          description: w.description,
          price: new Prisma.Decimal(w.price),
          compareAtPrice: new Prisma.Decimal(w.compareAtPrice),
          cost: new Prisma.Decimal(w.cost),
          categoryId: w.categoryId,
          tags: w.tags,
          status: ProductStatus.PUBLISHED,
          featured: w.featured,
          seoTitle: `${w.name} | Original Luxury Swiss Horology | VELORA`,
          seoDescription: w.shortDescription,
          ogImage: primaryImgUrl,
          movement: w.movement,
          powerReserve: w.powerReserve,
          caseMaterial: w.caseMaterial,
          caseDiameter: w.caseDiameter,
          caseThickness: w.caseThickness,
          crystal: w.crystal,
          waterResistance: w.waterResistance,
          dialColor: w.dialColor,
          strapMaterial: w.strapMaterial,
          clasp: w.clasp,
          macroDetails: w.macroDetails as any,
          collections: {
            create: w.collectionIds.map((cId, idx) => ({
              collectionId: cId,
              displayOrder: idx + 1,
            })),
          },
          images: {
            create: watchImages,
          },
          variants: {
            create: w.variants.map((v) => ({
              sku: v.sku,
              title: v.title,
              price: new Prisma.Decimal(v.price),
              stock: v.stock,
              attributes: { strap: v.title },
            })),
          },
          inventory: {
            create: {
              quantity: w.variants.reduce((acc, v) => acc + v.stock, 0),
              warehouseLocation: "Geneva Vault Alpha-1",
            },
          },
        },
      });
      productId = created.id;
      console.log(`  [CREATED] ${w.name} with 10 original assets`);
    } else {
      // Update existing product fields
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: w.name,
          sku: w.sku,
          shortDescription: w.shortDescription,
          description: w.description,
          price: new Prisma.Decimal(w.price),
          compareAtPrice: new Prisma.Decimal(w.compareAtPrice),
          cost: new Prisma.Decimal(w.cost),
          categoryId: w.categoryId,
          tags: w.tags,
          status: ProductStatus.PUBLISHED,
          featured: w.featured,
          seoTitle: `${w.name} | Original Luxury Swiss Horology | VELORA`,
          seoDescription: w.shortDescription,
          ogImage: primaryImgUrl,
          movement: w.movement,
          powerReserve: w.powerReserve,
          caseMaterial: w.caseMaterial,
          caseDiameter: w.caseDiameter,
          caseThickness: w.caseThickness,
          crystal: w.crystal,
          waterResistance: w.waterResistance,
          dialColor: w.dialColor,
          strapMaterial: w.strapMaterial,
          clasp: w.clasp,
          macroDetails: w.macroDetails as any,
        },
      });

      // Refresh images
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: watchImages.map((img) => ({
          ...img,
          productId: existing.id,
        })),
      });

      console.log(`  [UPDATED] ${w.name} with 10 original assets`);
    }
  }

  // 2. Process Fragrances
  for (const f of fragrancesData) {
    console.log(`Processing Fragrance: ${f.name} (${f.slug})...`);

    const existing = await prisma.product.findUnique({
      where: { slug: f.slug },
      include: { images: true, variants: true, collections: true },
    });

    const primaryImgUrl = `/images/products/fragrances/${f.slug}/bottle-front.jpg`;

    const fragranceImages = [
      { url: `/images/products/fragrances/${f.slug}/bottle-front.jpg`, altText: `${f.name} Flacon Front Studio View`, sortOrder: 1, isPrimary: true },
      { url: `/images/products/fragrances/${f.slug}/bottle-angle.jpg`, altText: `${f.name} Flacon 45-Degree Angle Perspective`, sortOrder: 2, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/box.jpg`, altText: `${f.name} Presentation Box Packaging`, sortOrder: 3, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/bottle-box.jpg`, altText: `${f.name} Flacon with Presentation Box`, sortOrder: 4, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/lifestyle.jpg`, altText: `${f.name} Atmospheric Lifestyle Photography`, sortOrder: 5, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/editorial.jpg`, altText: `${f.name} Cinematic Editorial Campaign`, sortOrder: 6, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/ingredient-notes.jpg`, altText: `${f.name} Botanical Ingredient Notes Visual`, sortOrder: 7, isPrimary: false },
      { url: `/images/products/fragrances/${f.slug}/gift-set.jpg`, altText: `${f.name} Maison Gifting Set Photography`, sortOrder: 8, isPrimary: false },
    ];

    if (!existing) {
      await prisma.product.create({
        data: {
          name: f.name,
          slug: f.slug,
          sku: f.sku,
          shortDescription: f.shortDescription,
          description: f.description,
          price: new Prisma.Decimal(f.price),
          compareAtPrice: new Prisma.Decimal(f.compareAtPrice),
          cost: new Prisma.Decimal(f.cost),
          categoryId: f.categoryId,
          tags: f.tags,
          status: ProductStatus.PUBLISHED,
          featured: f.featured,
          seoTitle: `${f.name} | High Perfumery Extrait de Parfum | VELORA`,
          seoDescription: f.shortDescription,
          ogImage: primaryImgUrl,
          concentration: f.concentration,
          olfactiveFamily: f.olfactiveFamily,
          gender: f.gender,
          volumeMl: f.volumeMl,
          macroDetails: f.macroDetails as any,
          collections: {
            create: f.collectionIds.map((cId, idx) => ({
              collectionId: cId,
              displayOrder: idx + 1,
            })),
          },
          images: {
            create: fragranceImages,
          },
          variants: {
            create: f.variants.map((v) => ({
              sku: v.sku,
              title: v.title,
              price: new Prisma.Decimal(v.price),
              stock: v.stock,
              attributes: { size: v.title },
            })),
          },
          inventory: {
            create: {
              quantity: f.variants.reduce((acc, v) => acc + v.stock, 0),
              warehouseLocation: "Grasse Atelier Vault 3",
            },
          },
        },
      });
      console.log(`  [CREATED] ${f.name} with 8 original assets`);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: f.name,
          sku: f.sku,
          shortDescription: f.shortDescription,
          description: f.description,
          price: new Prisma.Decimal(f.price),
          compareAtPrice: new Prisma.Decimal(f.compareAtPrice),
          cost: new Prisma.Decimal(f.cost),
          categoryId: f.categoryId,
          tags: f.tags,
          status: ProductStatus.PUBLISHED,
          featured: f.featured,
          seoTitle: `${f.name} | High Perfumery Extrait de Parfum | VELORA`,
          seoDescription: f.shortDescription,
          ogImage: primaryImgUrl,
          concentration: f.concentration,
          olfactiveFamily: f.olfactiveFamily,
          gender: f.gender,
          volumeMl: f.volumeMl,
          macroDetails: f.macroDetails as any,
        },
      });

      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: fragranceImages.map((img) => ({
          ...img,
          productId: existing.id,
        })),
      });

      console.log(`  [UPDATED] ${f.name} with 8 original assets`);
    }
  }

  console.log("\n[CATALOG SEED COMPLETED SUCCESSFULLY: 11 PRODUCTS FULLY CONFIGURED WITH 100 ORIGINAL ASSETS]");
}

seedCompleteCatalog()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
