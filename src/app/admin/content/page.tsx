"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutTemplate,
  BookOpen,
  Image as ImageIcon,
  Megaphone,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Plus,
} from "lucide-react";

interface ContentOverviewData {
  homepageSectionsCount: number;
  activeSectionsCount: number;
  journalPostsCount: number;
  publishedPostsCount: number;
  mediaAssetsCount: number;
  marketingAnnouncementsActive: boolean;
  recentArticles: Array<{
    id: string;
    title: string;
    slug: string;
    category?: string | null;
    publishedAt?: string | null;
    isPublished: boolean;
  }>;
  recentSections: Array<{
    id: string;
    name: string;
    sectionKey: string;
    isActive: boolean;
    sortOrder: number;
  }>;
}

export default function AdminContentHubPage() {
  const [data, setData] = React.useState<ContentOverviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchOverview = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [secRes, postRes, mediaRes, mktRes] = await Promise.all([
        fetch("/api/admin/homepage"),
        fetch("/api/admin/journal"),
        fetch("/api/admin/media?limit=10"),
        fetch("/api/admin/marketing"),
      ]);

      const secJson = await secRes.json();
      const postJson = await postRes.json();
      const mediaJson = await mediaRes.json();
      const mktJson = await mktRes.json();

      const sections = secJson.sections || [];
      const posts = postJson.posts || [];
      const media = mediaJson.media || [];
      const marketing = mktJson.settings || {};

      setData({
        homepageSectionsCount: sections.length,
        activeSectionsCount: sections.filter((s: any) => s.isActive).length,
        journalPostsCount: posts.length,
        publishedPostsCount: posts.filter((p: any) => p.isPublished).length,
        mediaAssetsCount: media.length,
        marketingAnnouncementsActive: Boolean(marketing.announcement_bar?.enabled),
        recentArticles: posts.slice(0, 4),
        recentSections: sections.slice(0, 5),
      });
    } catch (err) {
      console.error("Failed to load content hub data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const cmsModules = [
    {
      title: "Homepage CMS",
      href: "/admin/homepage",
      description: "Manage 12 cinematic sections, hero videos, collection cards, and product highlights.",
      icon: LayoutTemplate,
      metric: isLoading ? "..." : `${data?.activeSectionsCount || 0} / ${data?.homepageSectionsCount || 0} Active`,
      badge: "Storefront Core",
    },
    {
      title: "Journal & Chronicles",
      href: "/admin/journal",
      description: "Publish editorial horology articles, perfume dossiers, author bylines, and related pieces.",
      icon: BookOpen,
      metric: isLoading ? "..." : `${data?.publishedPostsCount || 0} Published Articles`,
      badge: "Editorial Archive",
    },
    {
      title: "Media Vault",
      href: "/admin/media",
      description: "Asset library for high-resolution macro photography, 4K horological videos, and folders.",
      icon: ImageIcon,
      metric: isLoading ? "..." : `${data?.mediaAssetsCount || 0}+ Media Assets`,
      badge: "Digital Assets",
    },
    {
      title: "Marketing & Promos",
      href: "/admin/marketing",
      description: "Control announcement bar, VIP salon popups, newsletter incentives, and social channels.",
      icon: Megaphone,
      metric: isLoading ? "..." : (data?.marketingAnnouncementsActive ? "Announcement Live" : "Announcement Inactive"),
      badge: "Patron Conversion",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold block mb-1">
            Maison Atelier Management
          </span>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Layers className="h-8 w-8 text-gold" />
            Content Management Hub
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Direct real-time editorial controls for homepage sections, horological chronicles, media library, and storefront marketing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchOverview}
            disabled={isLoading}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link href="/" target="_blank">
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Storefront
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary CMS Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cmsModules.map((mod) => {
          const Icon = mod.icon;

          return (
            <Link
              key={mod.title}
              href={mod.href}
              className="p-6 bg-neutral-950/60 border border-white/10 hover:border-gold/50 rounded-xl transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-neutral-400 rounded-full">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white group-hover:text-gold transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gold-light font-medium">
                  {mod.metric}
                </span>
                <span className="text-xs text-neutral-400 group-hover:text-white flex items-center gap-1">
                  Manage <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Editorial & Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Recent Journal Articles */}
        <div className="p-6 bg-neutral-950/60 border border-white/5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <BookOpen className="h-4 w-4 text-gold" />
              <span>Recent Journal Articles</span>
            </div>
            <Link
              href="/admin/journal"
              className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
            >
              All Articles <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !data?.recentArticles || data.recentArticles.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No journal articles created yet.{" "}
              <Link href="/admin/journal" className="text-gold underline">
                Write first article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.recentArticles.map((art) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-mono text-gold uppercase tracking-wider block">
                      {art.category || "Horology"}
                    </span>
                    <h4 className="text-xs font-medium text-white truncate max-w-sm">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      /{art.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border ${
                        art.isPublished
                          ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
                          : "bg-neutral-800 text-neutral-400 border-white/10"
                      }`}
                    >
                      {art.isPublished ? "Published" : "Draft"}
                    </span>

                    <Link
                      href={`/journal/${art.slug}`}
                      target="_blank"
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="View Article"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Homepage Sections Summary */}
        <div className="p-6 bg-neutral-950/60 border border-white/5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <LayoutTemplate className="h-4 w-4 text-gold" />
              <span>Core Homepage Sections Order</span>
            </div>
            <Link
              href="/admin/homepage"
              className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
            >
              Configure Flow <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !data?.recentSections || data.recentSections.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No homepage sections found.{" "}
              <Link href="/admin/homepage" className="text-gold underline">
                Initialize sections
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.recentSections.map((sec, idx) => (
                <div key={sec.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gold-light/60 w-5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-medium text-white">{sec.name}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Key: {sec.sectionKey}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border ${
                      sec.isActive
                        ? "bg-gold/10 text-gold border-gold/30"
                        : "bg-neutral-800 text-neutral-500 border-white/10"
                    }`}
                  >
                    {sec.isActive ? "Live on Storefront" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
