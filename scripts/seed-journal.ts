import prisma from "../src/lib/prisma";

async function seedJournal() {
  console.log("Seeding Maison Velora Journal Chronicles...");

  const admin = await prisma.adminUser.findFirst();
  const authorId = admin ? admin.id : null;

  const articles = [
    {
      title: "The Architecture of the Free-Sprung Balance Wheel",
      slug: "architecture-of-the-free-sprung-balance-wheel",
      subtitle: "Why variable inertia balances define high-precision Geneva chronometry",
      excerpt:
        "An exploration of variable inertia balances, thermal compensation curves, and how Maison Velora achieves 72 hours of uninterrupted isochronism.",
      category: "Horology",
      authorName: "Jean-Luc Vaneau, Master Watchmaker",
      coverImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
      isPublished: true,
      publishedAt: new Date("2026-08-15T10:00:00Z"),
      seoTitle: "Architecture of Free-Sprung Balance Wheels | VELORA Journal",
      seoDescription:
        "Discover the micromechanical physics behind Maison Velora's variable inertia balance wheels and high-precision chronometry.",
      ogImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
      canonicalUrl: "https://velora-ateliers.com/journal/architecture-of-the-free-sprung-balance-wheel",
      relatedProductIds: [
        "cmur3om6h000leq5o0bf1cmg8", // velora-signature-01
        "cmur3omt8000yeq5om1v7wco7", // velora-tourbillon-grand-feu
      ],
      content: `At the apex of haute horlogerie, time is not merely counted; it is disciplined. Among the myriad components residing within an openworked caliber, none exerts greater authority over chronometric precision than the regulating organ—specifically, the balance wheel and hairspring assembly.

In traditional watchmaking, regulation is frequently accomplished via an index-regulated curb pin that alters the active length of the hairspring. While expedient, this method introduces micro-friction and subtle asymmetry across positional shifts. Maison Velora rejects this compromise entirely in favor of the free-sprung balance.

> "A free-sprung balance wheel does not constrain the breath of the spring. It relies on inertia weights tuned by hand to within one-hundredth of a milligram."

By utilizing four gold inertial micro-screws countersunk along the rim of the Glucydur balance, our master horologists adjust poise and rate without ever touching the active length of the terminal Breguet overcoil. The result is pure, uninterrupted isochronism that remains impervious to daily shocks and thermal gradients.

## Hand-Finished Anglage and Internal Angles

Beyond mathematical physics, mechanical excellence requires tactile artistry. Every bridge securing our regulating organ is mirror-polished using gentian wood pegs and diamond paste. Sharp internal angles—the quintessential hallmark that no automated CNC machine can replicate—are hand-carved with gravers under 40x magnification.

When observing the heartbeat of Caliber V-101 through the sapphire caseback, one does not merely observe a machine. One witnesses two centuries of Geneva savoir-faire beating at 28,800 vibrations per hour.`,
    },
    {
      title: "Nocturne: The Dark Art of 35% Extrait Extraction",
      slug: "nocturne-dark-art-of-extraction",
      subtitle: "Subcritical CO2 extraction of rare Grasse botanicals and smoked labdanum",
      excerpt:
        "Inside our Grasse compounding laboratory: extracting volatile floral absolutes under high pressure to preserve delicate olfactory facets.",
      category: "Perfumery",
      authorName: "Élodie Martineau, Nez Principal",
      coverImageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1600&q=85",
      isPublished: true,
      publishedAt: new Date("2026-07-28T14:30:00Z"),
      seoTitle: "Nocturne: 35% Extrait de Parfum Extraction | VELORA Journal",
      seoDescription:
        "Learn how Maison Velora compounds rare 35% pure extraits in Grasse using subcritical CO2 botanical extraction.",
      ogImage: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=85",
      canonicalUrl: "https://velora-ateliers.com/journal/nocturne-dark-art-of-extraction",
      relatedProductIds: [
        "cmur3onak0016eq5oj7yz7c11", // velora-nocturne-absolu-extrait
        "cmur3onhm001deq5osway5ftv", // velora-santal-royal-extrait
      ],
      content: `In the hills overlooking the Mediterranean, dawn arrives with a damp chill that settles across the terraced fields of Grasse. It is during these precise pre-dawn hours that Centifolia rose petals and night-blooming jasmine must be hand-harvested before the morning sun evaporates their volatile aromatic compounds.

Most contemporary luxury houses dilute fragrances to 12% or 18% concentration. Maison Velora operates strictly within the rarefied realm of High Extrait—formulating exclusively at 35% concentration.

> "At 35% pure oil concentration, an extrait does not shout. It hovers close to the skin with an intimate, velvet sillage that endures for twenty-four hours."

## Subcritical Fluid Technology

Traditional steam distillation subjects fragile botanical molecules to extreme heat, destroying delicate top notes. To circumvent this, our laboratory employs subcritical fluid carbon dioxide extraction at controlled temperatures below 31°C. This allows us to capture the exact olfactory signature of living blossoms and aged smoked agarwood without thermal degradation.

The extracted absolute is then left to macerate for 120 days in temperature-controlled oak casks, allowing the complex resins to marry harmoniously before being hand-bottled in frosted flacons.`,
    },
    {
      title: "Monochrome & Metallurgy: The Obsidian DLC Titanium Study",
      slug: "monochrome-and-metallurgy-dlc-titanium",
      subtitle: "Engineering Grade 5 titanium cases with diamond-like carbon physical vapor deposition",
      excerpt:
        "Combining aerospace-grade lightness with scratch-resistant obsidian aesthetics for the modern collector.",
      category: "Atelier",
      authorName: "Marc Renggli, Materials Director",
      coverImageUrl: "https://images.unsplash.com/photo-1547996160-71dfabb1d0a5?auto=format&fit=crop&w=1600&q=85",
      isPublished: true,
      publishedAt: new Date("2026-06-12T09:15:00Z"),
      seoTitle: "Obsidian DLC Titanium Metallurgy | VELORA Journal",
      seoDescription:
        "An in-depth study into Maison Velora's aerospace Grade 5 titanium cases treated with Diamond-Like Carbon (DLC).",
      ogImage: "https://images.unsplash.com/photo-1547996160-71dfabb1d0a5?auto=format&fit=crop&w=1200&q=85",
      canonicalUrl: "https://velora-ateliers.com/journal/monochrome-and-metallurgy-dlc-titanium",
      relatedProductIds: [
        "cmur3on1i0012eq5ope5kjp4r", // velora-noir-chronometre
        "cmur3omii000seq5o6z126mny", // velora-chrono-astral-i
      ],
      content: `The quest for the ultimate luxury watch case has historically centered upon noble metals: 18k yellow, white, and rose gold. Yet modern connoisseurs demand an alloy that delivers unyielding resilience alongside sublime wrist comfort.

Enter Grade 5 Titanium (Ti-6Al-4V). Twice as light as steel yet possessing superior tensile strength, Grade 5 titanium presents extraordinary challenges to the hand-finisher due to its hardness and low thermal conductivity.

> "Polishing Grade 5 titanium requires specialized ceramic laps and quadruple the labor of traditional gold, yielding an enigmatic, subterranean luster."

## Diamond-Like Carbon (DLC) Vapor Deposition

To achieve our signature Obsidian Noir hue, each finished case module enters a high-vacuum plasma chamber where carbon atoms are ionized and accelerated onto the metal surface. The resulting coating mimics the tetrahedral crystalline lattice of natural diamonds, yielding a surface hardness in excess of 3,500 Vickers.

The outcome is a timepiece virtually immune to the abrasions of modern life, offering an uncompromising monochrome aesthetic that transcends fleeting horological trends.`,
    },
  ];

  for (const art of articles) {
    const existing = await prisma.journalPost.findUnique({
      where: { slug: art.slug },
    });

    if (existing) {
      console.log(`Updating existing article: ${art.title}`);
      await prisma.journalPost.update({
        where: { slug: art.slug },
        data: {
          title: art.title,
          subtitle: art.subtitle,
          excerpt: art.excerpt,
          category: art.category,
          authorName: art.authorName,
          coverImageUrl: art.coverImageUrl,
          content: art.content,
          isPublished: art.isPublished,
          publishedAt: art.publishedAt,
          seoTitle: art.seoTitle,
          seoDescription: art.seoDescription,
          ogImage: art.ogImage,
          canonicalUrl: art.canonicalUrl,
          relatedProductIds: art.relatedProductIds,
        },
      });
    } else {
      console.log(`Creating new article: ${art.title}`);
      await prisma.journalPost.create({
        data: {
          title: art.title,
          slug: art.slug,
          subtitle: art.subtitle,
          excerpt: art.excerpt,
          category: art.category,
          authorName: art.authorName,
          coverImageUrl: art.coverImageUrl,
          content: art.content,
          isPublished: art.isPublished,
          publishedAt: art.publishedAt,
          seoTitle: art.seoTitle,
          seoDescription: art.seoDescription,
          ogImage: art.ogImage,
          canonicalUrl: art.canonicalUrl,
          relatedProductIds: art.relatedProductIds,
          authorId: authorId,
        },
      });
    }
  }

  console.log("Journal articles successfully seeded!");
}

seedJournal()
  .catch((e) => {
    console.error("Journal seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
