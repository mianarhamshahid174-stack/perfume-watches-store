import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal | VELORA",
  description:
    "Read stories and articles on fine mechanical watchmaking, perfumery, and craftsmanship from VELORA.",
  alternates: {
    canonical: "https://velora-ateliers.com/journal",
  },
  openGraph: {
    title: "Journal | VELORA",
    description:
      "Read stories and articles on fine mechanical watchmaking and rare perfumery.",
    images: [{ url: "/images/velora-hero-editorial.jpg" }],
  },
};

interface JournalPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function JournalIndexPage({ searchParams }: JournalPageProps) {
  const { category } = await searchParams;

  const whereClause: any = {
    isPublished: true,
  };

  if (category && category !== "ALL") {
    whereClause.category = {
      contains: category,
      mode: "insensitive",
    };
  }

  const posts = await prisma.journalPost.findMany({
    where: whereClause,
    orderBy: { publishedAt: "desc" },
    include: {
      author: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  const featuredPost = posts[0] || null;
  const remainingPosts = posts.slice(1);

  const categories = [
    { id: "ALL", label: "All Articles" },
    { id: "Horology", label: "Watches & Movements" },
    { id: "Perfumery", label: "Fragrances" },
    { id: "Atelier", label: "Craftsmanship" },
    { id: "Heritage", label: "Heritage" },
  ];

  // Blog / Collection Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "VELORA Journal",
    description: "Stories on fine watchmaking and artisanal fragrance creation.",
    url: "https://velora-ateliers.com/journal",
    publisher: {
      "@type": "Organization",
      name: "VELORA",
      logo: {
        "@type": "ImageObject",
        url: "https://velora-ateliers.com/images/velora-hero-editorial.jpg",
      },
    },
  };

  return (
    <div className="bg-obsidian min-h-screen text-sand-100 pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="wide">
        {/* Navigation Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Journal" },
            ]}
          />
        </div>

        {/* Editorial Header */}
        <div className="border-b border-white/10 pb-12 mb-12">
          <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-ultra text-metallic mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>VELORA Journal</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-light text-ivory tracking-tight max-w-4xl">
            Stories of Craftsmanship & Design
          </h1>
          <p className="text-sm sm:text-base text-neutral-stone font-light max-w-2xl mt-4 leading-relaxed">
            Explore articles and behind-the-scenes insights into our watches, fragrances, and dedicated artisans.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-8 pt-4">
            {categories.map((cat) => {
              const isActive = (!category && cat.id === "ALL") || category === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={cat.id === "ALL" ? "/journal" : `/journal?category=${cat.id}`}
                  className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                    isActive
                      ? "bg-metallic text-black font-semibold border-metallic shadow-lg"
                      : "bg-charcoal-900/50 text-neutral-stone border-white/10 hover:border-white/20 hover:text-ivory"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Lead Featured Article */}
        {featuredPost && (
          <div className="mb-20">
            <Link
              href={`/journal/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-charcoal-950/60 border border-white/10 rounded-2xl overflow-hidden hover:border-metallic/40 transition-all duration-500"
            >
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden bg-charcoal-900">
                {featuredPost.coverImageUrl && (
                  <img
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-sans uppercase tracking-ultra px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-metallic border border-metallic/30">
                    Featured Article
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 lg:pl-4 space-y-4">
                <div className="flex items-center gap-3 text-xs text-neutral-stone font-mono">
                  <span>{featuredPost.category || "Horology"}</span>
                  <span>•</span>
                  <span>
                    {featuredPost.publishedAt
                      ? new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-ivory group-hover:text-metallic transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                {featuredPost.subtitle && (
                  <p className="text-sm text-neutral-stone font-light italic leading-relaxed">
                    {featuredPost.subtitle}
                  </p>
                )}

                {featuredPost.excerpt && (
                  <p className="text-xs sm:text-sm text-neutral-stone/80 font-light leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="text-xs text-neutral-stone">
                    By{" "}
                    <span className="text-ivory font-medium">
                      {featuredPost.authorName ||
                        (featuredPost.author
                          ? `${featuredPost.author.firstName} ${featuredPost.author.lastName}`
                          : "VELORA")}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial font-semibold text-metallic group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Editorial Articles Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-serif-luxury text-2xl font-light text-ivory">
              All Articles
            </h3>
            <span className="text-xs font-mono text-neutral-stone">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"}
            </span>
          </div>

          {remainingPosts.length === 0 && !featuredPost ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <BookOpen className="h-10 w-10 text-neutral-stone mx-auto mb-3" />
              <p className="text-neutral-stone text-sm">
                No articles found in this category. Check back soon for new releases.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="group flex flex-col justify-between rounded-xl bg-charcoal-950/40 border border-white/10 overflow-hidden hover:border-metallic/40 transition-all duration-300"
                >
                  <div>
                    <div className="relative h-56 w-full bg-charcoal-900 overflow-hidden">
                      {post.coverImageUrl && (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-sans uppercase tracking-ultra px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-metallic border border-metallic/30">
                          {post.category || "Horology"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="text-[11px] font-mono text-neutral-stone">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Undated"}
                      </div>

                      <h4 className="font-serif-luxury text-xl font-light text-ivory group-hover:text-metallic transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>

                      {post.subtitle && (
                        <p className="text-xs text-neutral-stone font-light italic line-clamp-1">
                          {post.subtitle}
                        </p>
                      )}

                      {post.excerpt && (
                        <p className="text-xs text-neutral-stone/80 font-light leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
                    <span className="text-[11px] text-neutral-stone truncate max-w-[150px]">
                      {post.authorName || "VELORA"}
                    </span>
                    <span className="text-xs font-semibold text-metallic flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Article <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
