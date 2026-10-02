import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Share2,
  Sparkles,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.journalPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Story Not Found | VELORA Journal",
      description: "The requested chronicle does not exist in the Maison archives.",
    };
  }

  const title = post.seoTitle || `${post.title} | VELORA Journal`;
  const description =
    post.seoDescription ||
    post.subtitle ||
    post.excerpt ||
    `Read ${post.title} in the Maison Velora horological journal.`;
  const canonicalUrl =
    post.canonicalUrl || `https://velora-ateliers.com/journal/${post.slug}`;
  const ogImageUrl =
    post.ogImage ||
    post.coverImageUrl ||
    "https://velora-ateliers.com/images/velora-hero-editorial.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const post = await prisma.journalPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Fetch real related products assigned to this article
  let relatedProducts: any[] = [];
  if (post.relatedProductIds && post.relatedProductIds.length > 0) {
    relatedProducts = await prisma.product.findMany({
      where: {
        id: { in: post.relatedProductIds },
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });
  }

  // If no related products assigned, fetch 2 flagship pieces as default
  if (relatedProducts.length === 0) {
    relatedProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: 2,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });
  }

  // Adjacent articles for bottom navigation
  const [previousPost, nextPost] = await Promise.all([
    prisma.journalPost.findFirst({
      where: {
        isPublished: true,
        publishedAt: post.publishedAt ? { lt: post.publishedAt } : undefined,
      },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true, coverImageUrl: true },
    }),
    prisma.journalPost.findFirst({
      where: {
        isPublished: true,
        publishedAt: post.publishedAt ? { gt: post.publishedAt } : undefined,
      },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true, coverImageUrl: true },
    }),
  ]);

  const authorDisplayName =
    post.authorName ||
    (post.author
      ? `${post.author.firstName} ${post.author.lastName}`
      : "Maison Velora Editorial Board");

  // Format publication date
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Chronicle Archive";

  // Estimated reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 500;
  const readingTime = Math.max(3, Math.ceil(wordCount / 220));

  // Article JSON-LD Structured Data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.subtitle || post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: authorDisplayName,
    },
    publisher: {
      "@type": "Organization",
      name: "VELORA Ateliers Geneva",
      logo: {
        "@type": "ImageObject",
        url: "https://velora-ateliers.com/images/velora-hero-editorial.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonicalUrl || `https://velora-ateliers.com/journal/${post.slug}`,
    },
  };

  // Convert raw text into nicely formatted editorial paragraphs
  const paragraphs = post.content
    ? post.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  return (
    <article className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top Breadcrumb Bar */}
      <Container size="wide" className="mb-8">
        <Breadcrumbs
          items={[
            { label: "Maison", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: post.category || "Story", href: `/journal?category=${post.category}` },
            { label: post.title },
          ]}
        />
      </Container>

      {/* Article Header & Title */}
      <Container size="narrow" className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-metallic/30 bg-charcoal-900/60 backdrop-blur-md mb-6">
          <BookOpen className="h-3 w-3 text-metallic" />
          <span className="text-[10px] font-sans uppercase tracking-ultra text-metallic">
            {post.category || "Horological Essay"}
          </span>
        </div>

        <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light text-ivory tracking-tight leading-[1.15] mb-6">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="font-serif-luxury text-lg sm:text-2xl font-light italic text-neutral-stone max-w-2xl mx-auto leading-relaxed mb-8">
            {post.subtitle}
          </p>
        )}

        {/* Editorial Metadata Bylines */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-stone font-mono pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-metallic" />
            <span className="text-ivory">{authorDisplayName}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-neutral-slate" />
            <span>{formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-neutral-slate" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </Container>

      {/* Hero Cinematic Cover Image */}
      {post.coverImageUrl && (
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
          <div className="relative h-80 sm:h-[500px] lg:h-[620px] rounded-2xl overflow-hidden bg-charcoal-900 border border-white/10 shadow-2xl">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          {post.excerpt && (
            <p className="text-[11px] text-neutral-slate italic text-center mt-3 max-w-xl mx-auto">
              {post.excerpt}
            </p>
          )}
        </div>
      )}

      {/* Article Body Content */}
      <Container size="narrow">
        <div className="prose prose-invert max-w-none space-y-8 font-light text-sand-200 text-base sm:text-lg leading-relaxed">
          {paragraphs.map((p, idx) => {
            // First paragraph gets luxury drop-cap effect
            if (idx === 0) {
              const firstLetter = p.charAt(0);
              const remainingText = p.slice(1);
              return (
                <p key={idx} className="first-letter:float-left first-letter:text-5xl first-letter:font-serif-luxury first-letter:text-metallic first-letter:mr-3 first-letter:leading-none text-ivory">
                  {firstLetter}
                  {remainingText}
                </p>
              );
            }

            // Paragraphs starting with quote marker or short bold phrases
            if (p.startsWith(">")) {
              return (
                <blockquote
                  key={idx}
                  className="my-10 pl-6 border-l-2 border-metallic font-serif-luxury text-xl sm:text-2xl italic text-metallic leading-relaxed"
                >
                  {p.replace(/^>\s*/, "")}
                </blockquote>
              );
            }

            if (p.startsWith("##")) {
              return (
                <h3
                  key={idx}
                  className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory pt-6 pb-2 tracking-wide border-b border-white/5"
                >
                  {p.replace(/^##\s*/, "")}
                </h3>
              );
            }

            return (
              <p key={idx} className="leading-relaxed text-neutral-stone">
                {p}
              </p>
            );
          })}
        </div>

        {/* Author Bio Card */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-charcoal-950/60 p-6 sm:p-8 rounded-xl border border-white/5">
          <div className="h-16 w-16 rounded-full bg-charcoal-900 border border-metallic/30 flex items-center justify-center shrink-0 text-metallic font-serif-luxury text-2xl font-light">
            {authorDisplayName.charAt(0)}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-sans uppercase tracking-ultra text-metallic">
              Chronicle Author
            </span>
            <h4 className="font-serif-luxury text-xl text-ivory">{authorDisplayName}</h4>
            <p className="text-xs text-neutral-stone font-light leading-relaxed">
              Contributing historian and horological scholar for Maison Velora, examining mechanical calibers, tourbillon dynamics, and olfactory distillation in Switzerland and France.
            </p>
          </div>
        </div>

        {/* Related Products: Masterpieces Featured in this Article */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/10 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-ultra text-metallic">
                Horological Artifacts
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-ivory">
                Masterpieces Featured in this Chronicle
              </h3>
              <p className="text-xs text-neutral-stone font-light max-w-md mx-auto">
                Explore the creations engineered according to the principles discussed above.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {relatedProducts.map((prod) => {
                const primaryImage =
                  prod.images?.[0]?.url || "/images/velora-signature-01.jpg";
                return (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    className="group flex flex-col justify-between rounded-xl bg-charcoal-950/70 border border-white/10 p-5 hover:border-metallic/50 transition-all duration-300"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-charcoal-900 shrink-0 border border-white/5">
                        <img
                          src={primaryImage}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-sans uppercase tracking-ultra text-neutral-slate">
                          {prod.category?.name || "Complication"}
                        </span>
                        <h4 className="font-serif-luxury text-base sm:text-lg text-ivory group-hover:text-metallic transition-colors line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="text-xs font-mono text-metallic">
                          ${Number(prod.price).toLocaleString()} USD
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-stone">
                      <span>View Specifications</span>
                      <ArrowRight className="h-3.5 w-3.5 text-metallic group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Previous / Next Article Continuum */}
        <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {previousPost ? (
            <Link
              href={`/journal/${previousPost.slug}`}
              className="p-5 rounded-xl border border-white/5 bg-charcoal-950/30 hover:border-metallic/40 transition-colors group space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-ultra text-neutral-slate group-hover:text-metallic">
                <ArrowLeft className="h-3 w-3" />
                <span>Previous Chronicle</span>
              </div>
              <h5 className="font-serif-luxury text-base text-ivory line-clamp-1 group-hover:text-metallic">
                {previousPost.title}
              </h5>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link
              href={`/journal/${nextPost.slug}`}
              className="p-5 rounded-xl border border-white/5 bg-charcoal-950/30 hover:border-metallic/40 transition-colors group space-y-2 sm:text-right"
            >
              <div className="flex items-center sm:justify-end gap-2 text-[10px] font-sans uppercase tracking-ultra text-neutral-slate group-hover:text-metallic">
                <span>Next Chronicle</span>
                <ArrowRight className="h-3 w-3" />
              </div>
              <h5 className="font-serif-luxury text-base text-ivory line-clamp-1 group-hover:text-metallic">
                {nextPost.title}
              </h5>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Container>
    </article>
  );
}
