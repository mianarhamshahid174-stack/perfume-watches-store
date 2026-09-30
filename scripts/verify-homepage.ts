import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyHomepage() {
  console.log("=================================================");
  console.log("🔍 AUDITING HOMEPAGE ARCHITECTURE & CMS SECTIONS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Check HomepageSection count and order
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    assert(sections.length >= 12, `At least 12 CMS homepage sections exist (found: ${sections.length})`);

    const sectionKeys = sections.map((s) => s.sectionKey);
    const expectedKeys = [
      "hero_main",
      "featured_watch",
      "collection_story",
      "collections_grid",
      "watch_fragrance_split",
      "signature_product",
      "craftsmanship_gallery",
      "fragrance_editorial",
      "gifting_packaging",
      "brand_story",
      "journal_preview",
      "newsletter_section",
    ];

    expectedKeys.forEach((key) => {
      assert(sectionKeys.includes(key), `Section key "${key}" is present in CMS database`);
    });

    // 2. Section 1 Hero Validation
    const hero = sections.find((s) => s.sectionKey === "hero_main");
    assert(hero !== undefined, "Section 1 Hero exists");
    assert(hero?.title === "TIME, REFINED.", `Hero title is "TIME, REFINED." (found: "${hero?.title}")`);
    assert(
      hero?.subtitle === "Contemporary timepieces created for moments that matter.",
      `Hero subtitle matches user prompt (found: "${hero?.subtitle}")`
    );
    const heroContent = hero?.content as any;
    assert(heroContent?.ctaText === "DISCOVER THE COLLECTION", "Hero primary button is 'DISCOVER THE COLLECTION'");
    assert(heroContent?.secondaryCtaText === "EXPLORE WATCHES", "Hero secondary button is 'EXPLORE WATCHES'");

    // 3. Section 2 Featured Watch Validation
    const featWatch = sections.find((s) => s.sectionKey === "featured_watch");
    assert(featWatch?.title === "THE SIGNATURE", `Featured Watch title is "THE SIGNATURE" (found: "${featWatch?.title}")`);
    const featContent = featWatch?.content as any;
    assert(featContent?.ctaText === "DISCOVER THE WATCH", "Featured watch CTA is 'DISCOVER THE WATCH'");

    // 4. Section 3 Collection Story Validation
    const story = sections.find((s) => s.sectionKey === "collection_story");
    assert(
      story?.title === "DESIGNED BEYOND THE MOMENT.",
      `Collection Story title is "DESIGNED BEYOND THE MOMENT." (found: "${story?.title}")`
    );

    // 5. Section 4 Collections Validation
    const colGrid = sections.find((s) => s.sectionKey === "collections_grid");
    const colGridContent = colGrid?.content as any;
    assert(
      Array.isArray(colGridContent?.collectionSlugs) &&
        colGridContent.collectionSlugs.includes("signature") &&
        colGridContent.collectionSlugs.includes("noir") &&
        colGridContent.collectionSlugs.includes("classic"),
      "Collections section config includes SIGNATURE, NOIR, CLASSIC"
    );

    const dbCollections = await prisma.collection.findMany({
      where: { slug: { in: ["signature", "noir", "classic"] } },
    });
    assert(dbCollections.length === 3, `All 3 required collections exist in DB (found: ${dbCollections.length})`);

    // 6. Section 5 Watch + Fragrance Split Validation
    const split = sections.find((s) => s.sectionKey === "watch_fragrance_split");
    const splitContent = split?.content as any;
    assert(splitContent?.timeTitle === "TIME", "Split screen has 'TIME' side");
    assert(splitContent?.scentTitle === "SCENT", "Split screen has 'SCENT' side");

    // 7. Section 6 Signature Product Validation
    const sigProductSec = sections.find((s) => s.sectionKey === "signature_product");
    assert(
      sigProductSec?.title === "VELORA SIGNATURE 01",
      `Signature Product section title is "VELORA SIGNATURE 01" (found: "${sigProductSec?.title}")`
    );
    const sigContent = sigProductSec?.content as any;
    assert(
      Array.isArray(sigContent?.features) &&
        sigContent.features.includes("Automatic movement") &&
        sigContent.features.includes("Sapphire crystal") &&
        sigContent.features.includes("Stainless steel"),
      "Signature Product specs include Automatic movement, Sapphire crystal, Stainless steel"
    );
    assert(sigContent?.ctaText === "DISCOVER", "Signature Product CTA is 'DISCOVER'");

    const sigProductDb = await prisma.product.findUnique({
      where: { slug: "velora-signature-01" },
      include: { images: true },
    });
    assert(sigProductDb !== null, "Product 'velora-signature-01' exists in database");
    assert(sigProductDb?.images.length! > 0, "Product 'velora-signature-01' has images");

    // 8. Section 7 Craftsmanship Validation
    const craft = sections.find((s) => s.sectionKey === "craftsmanship_gallery");
    const craftContent = craft?.content as any;
    const detailKeys = craftContent?.details?.map((d: any) => d.key) || [];
    const expectedDetails = ["dial", "hands", "crown", "case", "strap", "clasp"];
    expectedDetails.forEach((d) => {
      assert(detailKeys.includes(d), `Craftsmanship detail "${d}" is present in gallery`);
    });

    // 9. Section 8 Fragrance Editorial Validation
    const fragrance = sections.find((s) => s.sectionKey === "fragrance_editorial");
    assert(
      fragrance?.title === "A SCENT THAT BECOMES YOUR SIGNATURE.",
      `Fragrance title is "A SCENT THAT BECOMES YOUR SIGNATURE." (found: "${fragrance?.title}")`
    );

    // 10. Section 9 Gifting Validation
    const gifting = sections.find((s) => s.sectionKey === "gifting_packaging");
    assert(
      gifting?.title === "MADE TO BE REMEMBERED.",
      `Gifting title is "MADE TO BE REMEMBERED." (found: "${gifting?.title}")`
    );

    // 11. Section 10 Brand Story Validation
    const brandStory = sections.find((s) => s.sectionKey === "brand_story");
    assert(brandStory !== undefined, "Brand Story section exists");

    // 12. Section 11 Journal Validation
    const journalPosts = await prisma.journalPost.findMany({
      where: { isPublished: true },
      take: 3,
    });
    assert(journalPosts.length >= 3, `Database has at least 3 published journal articles (found: ${journalPosts.length})`);

    // 13. Section 12 Newsletter Validation
    const newsletter = sections.find((s) => s.sectionKey === "newsletter_section");
    assert(
      newsletter?.title === "ENTER THE WORLD OF VELORA.",
      `Newsletter title is "ENTER THE WORLD OF VELORA." (found: "${newsletter?.title}")`
    );

    console.log("\n=================================================");
    console.log(`TOTAL AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Audit error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyHomepage();
