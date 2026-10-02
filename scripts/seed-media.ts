import prisma from "../src/lib/prisma";

async function seedMediaAndEnrichJournal() {
  console.log("Seeding Media Vault and Enriching All Journal Articles...");

  // 1. Media Assets
  const assets = [
    {
      filename: "velora-tourbillon-escapement-reel.mp4",
      url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-luxury-watch-mechanism-42845-large.mp4",
      mimeType: "video/mp4",
      sizeInBytes: 8400000,
      altText: "Macro video of tourbillon cage rotating at 60 seconds",
      folder: "products",
      width: 1920,
      height: 1080,
      duration: 15,
      metadata: { codec: "h264", frameRate: 60, aspectRatio: "16:9", quality: "1080p High" },
    },
    {
      filename: "geneva-atelier-craftsmanship.mp4",
      url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-craftsman-assembling-a-watch-42846-large.mp4",
      mimeType: "video/mp4",
      sizeInBytes: 12500000,
      altText: "Master horologist hand-bevelling steel bridges under microscope",
      folder: "journal",
      width: 1920,
      height: 1080,
      duration: 24,
      metadata: { codec: "h264", frameRate: 30, aspectRatio: "16:9", quality: "4K Master" },
    },
    {
      filename: "velora-chronograph-black-dial.jpg",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
      mimeType: "image/jpeg",
      sizeInBytes: 1420000,
      altText: "Velora Chronographe Squelette Grand Complication in Grade 5 Titanium",
      folder: "products",
      width: 1920,
      height: 1080,
      metadata: { colorSpace: "sRGB", camera: "Phase One IQ4", lens: "Schneider 120mm Macro" },
    },
    {
      filename: "velora-tourbillon-rose-gold.jpg",
      url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
      mimeType: "image/jpeg",
      sizeInBytes: 1850000,
      altText: "Tourbillon Celestial 18K Rose Gold with aventurine dial",
      folder: "products",
      width: 1920,
      height: 1280,
      metadata: { colorSpace: "AdobeRGB", resolution: "300 DPI" },
    },
    {
      filename: "velora-celeste-oud-parfum.jpg",
      url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
      mimeType: "image/jpeg",
      sizeInBytes: 1100000,
      altText: "Céleste Oud Pure Parfum Extrait Flacon in hand-cut crystal",
      folder: "products",
      width: 1400,
      height: 1400,
      metadata: { lighting: "Studio Diffused", background: "Black Obsidian" },
    },
    {
      filename: "geneva-atelier-benchwork.jpg",
      url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
      mimeType: "image/jpeg",
      sizeInBytes: 2300000,
      altText: "Geneva horologist assembling tourbillon escapement bridge",
      folder: "journal",
      width: 2400,
      height: 1600,
    },
    {
      filename: "maison-velora-hero-editorial.jpg",
      url: "https://images.unsplash.com/photo-1547996160-71dfabb19286?auto=format&fit=crop&w=1600&q=85",
      mimeType: "image/jpeg",
      sizeInBytes: 2900000,
      altText: "Maison Velora Geneva Atelier Brand Signature Banner",
      folder: "banners",
      width: 2560,
      height: 1440,
    },
  ];

  for (const item of assets) {
    const existing = await prisma.media.findFirst({ where: { filename: item.filename } });
    if (!existing) {
      await prisma.media.create({ data: item });
      console.log(`Created media asset: ${item.filename}`);
    } else {
      await prisma.media.update({
        where: { id: existing.id },
        data: item,
      });
      console.log(`Updated media asset: ${item.filename}`);
    }
  }

  // 2. Fetch products to link to any unlinked journal posts
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true },
    take: 3,
  });
  const defaultProductIds = products.map((p) => p.id);

  // 3. Ensure ALL journal posts have subtitle, authorName, seoTitle, seoDescription, relatedProductIds
  const allPosts = await prisma.journalPost.findMany();
  for (const p of allPosts) {
    await prisma.journalPost.update({
      where: { id: p.id },
      data: {
        subtitle: p.subtitle || "A critical study in mechanical precision and artisanal excellence",
        authorName: p.authorName || "Maison Velora Editorial Board",
        seoTitle: p.seoTitle || `${p.title} | VELORA Journal`,
        seoDescription: p.seoDescription || p.excerpt || `Read ${p.title} in the Maison Velora journal.`,
        relatedProductIds: p.relatedProductIds && p.relatedProductIds.length > 0 ? p.relatedProductIds : defaultProductIds,
      },
    });
    console.log(`Enriched journal article: ${p.title}`);
  }

  console.log("Seeding & enrichment complete!");
}

seedMediaAndEnrichJournal()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
