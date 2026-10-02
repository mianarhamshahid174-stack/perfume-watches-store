import prisma from "../src/lib/prisma";

async function verifyCMS() {
  console.log("==================================================");
  console.log("  VELORA CMS & STOREFRONT INTEGRATION VERIFICATION ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  const BASE_URL = "http://localhost:3000";

  // 1. Verify Homepage CMS & DB Binding
  console.log("\n--- 1. Testing Homepage CMS Database Sections ---");
  const homepageSections = await prisma.homepageSection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  assert(homepageSections.length >= 10, `Found ${homepageSections.length} homepage sections in DB (expected >= 10)`);

  const heroSection = homepageSections.find((s) => s.sectionKey === "hero_main");
  assert(heroSection !== undefined, "Found 'hero_main' section in DB");
  assert(heroSection?.isActive === true, "'hero_main' is active");

  // Test atomic reordering transaction
  const firstTwo = homepageSections.slice(0, 2);
  if (firstTwo.length === 2) {
    const reordered = await prisma.$transaction([
      prisma.homepageSection.update({
        where: { id: firstTwo[0].id },
        data: { sortOrder: 2 },
      }),
      prisma.homepageSection.update({
        where: { id: firstTwo[1].id },
        data: { sortOrder: 1 },
      }),
    ]);
    assert(reordered.length === 2, "Atomic transaction reordering successful");

    // Revert back
    await prisma.$transaction([
      prisma.homepageSection.update({
        where: { id: firstTwo[0].id },
        data: { sortOrder: 1 },
      }),
      prisma.homepageSection.update({
        where: { id: firstTwo[1].id },
        data: { sortOrder: 2 },
      }),
    ]);
  }

  // 2. Verify Journal System (Admin & Storefront)
  console.log("\n--- 2. Testing Journal CMS & Storefront ---");
  const journalPosts = await prisma.journalPost.findMany({
    where: { isPublished: true },
  });
  assert(journalPosts.length >= 3, `Found ${journalPosts.length} published journal articles in DB`);

  const sampleArticle = journalPosts[0];
  assert(Boolean(sampleArticle?.title), `Article title: "${sampleArticle?.title}"`);
  assert(Boolean(sampleArticle?.slug), `Article slug: "${sampleArticle?.slug}"`);
  assert(Boolean(sampleArticle?.subtitle), `Article subtitle: "${sampleArticle?.subtitle}"`);
  assert(Boolean(sampleArticle?.authorName), `Article author: "${sampleArticle?.authorName}"`);
  assert(Boolean(sampleArticle?.category), `Article category: "${sampleArticle?.category}"`);
  assert(Boolean(sampleArticle?.coverImageUrl), "Article has hero cover image");
  assert(Boolean(sampleArticle?.seoTitle), `Article SEO title: "${sampleArticle?.seoTitle}"`);
  assert(sampleArticle?.relatedProductIds.length > 0, `Article links ${sampleArticle?.relatedProductIds.length} related products`);

  // Verify /journal HTTP response
  const journalRes = await fetch(`${BASE_URL}/journal`);
  assert(journalRes.status === 200, `GET /journal responded ${journalRes.status}`);

  // Verify /journal/[slug] HTTP response
  const articleRes = await fetch(`${BASE_URL}/journal/${sampleArticle.slug}`);
  assert(articleRes.status === 200, `GET /journal/${sampleArticle.slug} responded ${articleRes.status}`);
  const articleHtml = await articleRes.text();
  assert(articleHtml.includes(sampleArticle.title), "Article page HTML contains the article title");
  assert(articleHtml.includes("application/ld+json"), "Article page HTML contains JSON-LD structured data");

  // 3. Verify Marketing CMS (SiteSetting & Storefront API)
  console.log("\n--- 3. Testing Marketing CMS & Storefront Bindings ---");
  const testAnnouncementText = `Live Ateliers Test ${Date.now()}`;
  const testMarketingPayload = {
    announcementBar: {
      enabled: true,
      text: testAnnouncementText,
      badge: "VERIFIED",
      linkText: "Explore",
      linkUrl: "/watches",
      theme: "gold",
    },
    homepagePromotions: {
      enabled: true,
      headline: "EXCLUSIVE VERIFIED PROMOTION",
      subheadline: "Private Salon Allocation",
      promoCode: "PRIVILEGE15",
      discountText: "15% VIP",
      ctaText: "Discover Pieces",
      ctaLink: "/watches",
    },
    featuredProducts: [sampleArticle.relatedProductIds[0]],
    featuredCollections: ["signature"],
    newsletter: {
      enabled: true,
      title: "Private Collector Circle",
      subtitle: "Join confidential viewings and allocations.",
      incentiveText: "Privilege code granted upon admission",
      disclaimer: "Discretion guaranteed.",
    },
    popup: {
      enabled: true,
      delaySeconds: 3,
      title: "WELCOME COLLECTOR",
      subtitle: "Exclusive inaugural privilege allocation.",
      badge: "VIP CIRCLE",
      couponCode: "PRIVILEGE15",
      discountText: "15% Concession",
      imageUrl: "/images/velora-signature-01.jpg",
      ctaText: "CLAIM ALLOCATION",
    },
    socialLinks: {
      instagram: "https://instagram.com/velorawatches",
      x: "https://x.com/velorawatches",
      facebook: "https://facebook.com/velorawatches",
      pinterest: "https://pinterest.com/velorawatches",
      youtube: "https://youtube.com/@velorawatches",
      linkedin: "https://linkedin.com/company/velora-geneva",
    },
  };

  // Upsert into SiteSetting
  await prisma.siteSetting.upsert({
    where: { key: "marketing_config" },
    update: { value: JSON.stringify(testMarketingPayload) },
    create: {
      key: "marketing_config",
      value: JSON.stringify(testMarketingPayload),
      type: "json",
      description: "Storefront marketing settings",
    },
  });

  // Verify public storefront marketing endpoint returns the updated setting
  const marketingRes = await fetch(`${BASE_URL}/api/marketing/settings`);
  assert(marketingRes.status === 200, `GET /api/marketing/settings responded ${marketingRes.status}`);
  const marketingData = await marketingRes.json();
  assert(marketingData.success === true, "Marketing API responded success: true");
  assert(
    marketingData.config?.announcementBar?.text === testAnnouncementText,
    "Marketing API returns the exact live announcement text updated via CMS"
  );
  assert(
    marketingData.config?.popup?.couponCode === "PRIVILEGE15",
    "Marketing API returns updated VIP popup couponCode"
  );

  // 4. Verify Media Library
  console.log("\n--- 4. Testing Media Library Vault ---");
  const mediaCount = await prisma.media.count();
  assert(mediaCount >= 6, `Found ${mediaCount} media assets in DB (expected >= 6)`);

  const videoAsset = await prisma.media.findFirst({
    where: { mimeType: { startsWith: "video/" } },
  });
  assert(videoAsset !== null, `Video asset found: "${videoAsset?.filename}" (${videoAsset?.duration}s duration)`);

  // 5. Verify SEO Generation (sitemap.xml, robots.txt, structured data)
  console.log("\n--- 5. Testing SEO Generation (sitemap, robots, structured data) ---");
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  assert(sitemapRes.status === 200, `GET /sitemap.xml responded ${sitemapRes.status}`);
  const sitemapXml = await sitemapRes.text();
  assert(sitemapXml.includes("<urlset"), "sitemap.xml contains valid <urlset>");
  assert(sitemapXml.includes("/product/"), "sitemap.xml indexes products");
  assert(sitemapXml.includes("/journal/"), "sitemap.xml indexes journal chronicles");

  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  assert(robotsRes.status === 200, `GET /robots.txt responded ${robotsRes.status}`);
  const robotsTxt = await robotsRes.text();
  assert(robotsTxt.includes("Disallow: /admin"), "robots.txt protects /admin routes");
  assert(robotsTxt.includes("sitemap.xml"), "robots.txt references sitemap.xml");

  // Verify Homepage HTML for SEO structured data
  const homeRes = await fetch(`${BASE_URL}`);
  assert(homeRes.status === 200, `GET / responded ${homeRes.status}`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes("Organization"), "Storefront root contains Organization structured data");
  assert(homeHtml.includes("WebSite"), "Storefront root contains WebSite structured data");

  console.log("\n==================================================");
  console.log(`  VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

verifyCMS()
  .catch((e) => {
    console.error("Verification script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
