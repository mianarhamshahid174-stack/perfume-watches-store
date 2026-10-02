"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Calendar,
  Globe,
  FileText,
  User,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Tag,
  Package,
} from "lucide-react";

interface JournalItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  authorName?: string | null;
  category?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  relatedProductIds: string[];
  createdAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
}

export default function AdminJournalPage() {
  const [posts, setPosts] = React.useState<JournalItem[]>([]);
  const [products, setProducts] = React.useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [activeTab, setActiveTab] = React.useState<"general" | "content" | "relations" | "seo">("general");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const defaultForm = {
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    content: "",
    coverImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    authorName: "Maison Velora Editorial Board",
    category: "Horology",
    publishedAt: new Date().toISOString().slice(0, 10),
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
    canonicalUrl: "",
    relatedProductIds: [] as string[],
  };

  const [formData, setFormData] = React.useState(defaultForm);

  const fetchPosts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/journal");
      const json = await res.json();
      if (json.success && json.posts) {
        setPosts(json.posts);
      }
    } catch (err) {
      console.error("Journal error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products?limit=50");
      const json = await res.json();
      if (json.success && json.products) {
        setProducts(json.products);
      }
    } catch (err) {
      console.error("Failed to load products for journal:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, [fetchPosts, fetchProducts]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: JournalItem) => {
    setIsEditing(true);
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || "",
      excerpt: post.excerpt || "",
      content: post.content,
      coverImageUrl: post.coverImageUrl || "",
      authorName: post.authorName || "Maison Velora Editorial Board",
      category: post.category || "Horology",
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      isPublished: post.isPublished,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      ogImage: post.ogImage || "",
      canonicalUrl: post.canonicalUrl || "",
      relatedProductIds: Array.isArray(post.relatedProductIds) ? post.relatedProductIds : [],
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEditing
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug,
      seoTitle: !isEditing && !prev.seoTitle ? `${val} | VELORA Journal` : prev.seoTitle,
    }));
  };

  const handleToggleProduct = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.relatedProductIds.includes(productId);
      return {
        ...prev,
        relatedProductIds: exists
          ? prev.relatedProductIds.filter((id) => id !== productId)
          : [...prev.relatedProductIds, productId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        ogImage: formData.ogImage || formData.coverImageUrl,
        canonicalUrl: formData.canonicalUrl || `https://velora-ateliers.com/journal/${formData.slug}`,
      };

      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/journal/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save article");

      setNotification(`Article "${formData.title}" saved successfully.`);
      setTimeout(() => setNotification(null), 3500);
      setIsModalOpen(false);
      fetchPosts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (post: JournalItem) => {
    try {
      const res = await fetch(`/api/admin/journal/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/journal/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification(`Article deleted successfully.`);
      setTimeout(() => setNotification(null), 3500);
      fetchPosts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === "PUBLISHED") return matchesSearch && p.isPublished;
    if (statusFilter === "DRAFT") return matchesSearch && !p.isPublished;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-gold text-black font-medium shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-gold" />
            Maison Journal & Editorial Chronicles
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Author horological essays, savoir-faire expositions, and link featured timepieces for collector immersion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/journal"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-800 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Journal
          </a>

          <Button
            onClick={handleOpenCreate}
            className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose Article
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950/60 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stories, topics, authors..."
            className="pl-9 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "PUBLISHED", "DRAFT"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3.5 py-1.5 rounded-md transition-colors ${
                statusFilter === status
                  ? "bg-white/10 text-gold font-medium border border-gold/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchPosts()}
            className="text-neutral-400 hover:text-white ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-neutral-900/40 space-y-3">
              <Skeleton className="h-44 w-full rounded-lg bg-neutral-800" />
              <Skeleton className="h-5 w-3/4 bg-neutral-800" />
              <Skeleton className="h-4 w-1/2 bg-neutral-800" />
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-950/40">
            <BookOpen className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No journal articles match your query.</p>
            <Button
              onClick={handleOpenCreate}
              variant="outline"
              size="sm"
              className="mt-4 border-neutral-700 text-neutral-300 hover:text-white"
            >
              Compose First Chronicle
            </Button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col justify-between rounded-xl border border-white/5 bg-neutral-950/60 overflow-hidden hover:border-gold/30 transition-all duration-300"
            >
              <div>
                {/* Hero Thumbnail */}
                <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-gold border border-gold/30">
                      {post.category || "Horology"}
                    </span>
                    {post.isPublished ? (
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                    <Calendar className="h-3 w-3 text-gold" />
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unscheduled"}
                    </span>
                    <span>•</span>
                    <User className="h-3 w-3 text-neutral-500" />
                    <span className="truncate max-w-[130px]">{post.authorName || "Maison Velora"}</span>
                  </div>

                  <h3 className="font-serif-luxury text-lg font-light text-white group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.subtitle && (
                    <p className="text-xs text-neutral-400 font-light italic line-clamp-1">
                      {post.subtitle}
                    </p>
                  )}

                  {post.excerpt && (
                    <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Related products badge */}
                  {post.relatedProductIds && post.relatedProductIds.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-gold/80">
                      <Package className="h-3.5 w-3.5" />
                      <span>{post.relatedProductIds.length} Linked Masterpieces</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
                <a
                  href={`/journal/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Read Story
                </a>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublish(post)}
                    className="h-8 text-xs text-neutral-400 hover:text-white"
                  >
                    {post.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEdit(post)}
                    className="h-8 text-neutral-400 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(post.id, post.title)}
                    className="h-8 text-neutral-400 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-6 space-y-6 max-w-3xl max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">
                {isEditing ? "Edit Journal Article" : "Compose Journal Article"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure editorial narrative, author credentials, hero imagery, related timepieces, and SEO.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: "general", label: "General & Hero", icon: FileText },
              { id: "content", label: "Story Content", icon: BookOpen },
              { id: "relations", label: "Related Products", icon: Package },
              { id: "seo", label: "SEO Metadata", icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-gold text-gold"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* TAB 1: General & Hero */}
            {activeTab === "general" && (
              <div className="space-y-4 animate-in fade-in-50">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Article Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Architecture of the Free-Sprung Balance Wheel"
                    required
                    className="bg-neutral-900 border-neutral-800 text-white text-xs font-serif-luxury text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      URL Slug *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="free-sprung-balance-wheel"
                      required
                      className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Editorial Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                    >
                      <option value="Horology">Horology & Calibers</option>
                      <option value="Perfumery">Haute Parfumerie</option>
                      <option value="Atelier">Atelier & Savoir-Faire</option>
                      <option value="Heritage">Geneva Heritage</option>
                      <option value="Exhibitions">Salons & Architecture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Subtitle / Deck *
                  </label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Why variable inertia balances define high-precision chronometry"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Author Byline
                    </label>
                    <Input
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="e.g. Jean-Luc Vaneau, Master Watchmaker"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Publication Date
                    </label>
                    <Input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Hero Cover Image */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Hero Cover Image URL *
                  </label>
                  <Input
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /images/journal-hero.jpg"
                    required
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                  {formData.coverImageUrl && (
                    <div className="mt-2 relative h-36 w-full rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img
                        src={formData.coverImageUrl}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Brief Abstract / Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="A brief summary for previews and social link cards..."
                    rows={2}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="postPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                  />
                  <label htmlFor="postPublished" className="text-xs text-neutral-300 font-medium">
                    Publish immediately on live storefront journal
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: Story Content */}
            {activeTab === "content" && (
              <div className="space-y-4 animate-in fade-in-50">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Complete Editorial Text / Story Body *
                  </label>
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Accepts paragraphs, blockquotes, and headings. Separate paragraphs with double line breaks.
                  </p>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write the full luxury chronicle here..."
                    rows={16}
                    required
                    className="w-full p-4 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Related Products */}
            {activeTab === "relations" && (
              <div className="space-y-4 animate-in fade-in-50">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Select Related Masterpieces
                  </label>
                  <p className="text-[11px] text-neutral-500 mb-3">
                    These timepieces and scents will be featured in the "Masterpieces Featured in this Chronicle" showcase on the article page.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {products.map((p) => {
                      const isSelected = formData.relatedProductIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleProduct(p.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-gold/10 border-gold text-white"
                              : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="text-xs font-medium text-white truncate">{p.name}</div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              {p.sku} • ${Number(p.price).toLocaleString()}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SEO Metadata */}
            {activeTab === "seo" && (
              <div className="space-y-4 animate-in fade-in-50">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    SEO Meta Title
                  </label>
                  <Input
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g. Free-Sprung Balance Wheels | VELORA Horological Journal"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Recommended 50–60 characters</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Search engine summary preview..."
                    rows={3}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Recommended 120–160 characters</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    OpenGraph Share Image URL
                  </label>
                  <Input
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="https://... or defaults to Hero Cover Image"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Canonical URL Override
                  </label>
                  <Input
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder={`https://velora-ateliers.com/journal/${formData.slug || "slug"}`}
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-white/10">
              <div className="flex gap-2">
                {activeTab !== "general" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (activeTab === "seo") setActiveTab("relations");
                      else if (activeTab === "relations") setActiveTab("content");
                      else if (activeTab === "content") setActiveTab("general");
                    }}
                    className="border-neutral-800 text-neutral-300 hover:text-white text-xs"
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "seo" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (activeTab === "general") setActiveTab("content");
                      else if (activeTab === "content") setActiveTab("relations");
                      else if (activeTab === "relations") setActiveTab("seo");
                    }}
                    className="border-neutral-800 text-neutral-300 hover:text-white text-xs"
                  >
                    Next Tab
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-6"
                >
                  {isSubmitting ? "Saving..." : "Save Story"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
