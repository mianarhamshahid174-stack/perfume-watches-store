"use client";

import * as React from "react";
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
} from "lucide-react";

interface JournalItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  category?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function AdminJournalPage() {
  const [posts, setPosts] = React.useState<JournalItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const defaultForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    category: "Horology",
    isPublished: true,
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

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: JournalItem) => {
    setIsEditing(true);
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImageUrl: post.coverImageUrl || "",
      category: post.category || "Horology",
      isPublished: post.isPublished,
    });
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
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/journal/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
    if (!confirm(`Delete journal article "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/journal/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification(`Article deleted.`);
      setTimeout(() => setNotification(null), 3500);
      fetchPosts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && p.isPublished) ||
      (statusFilter === "DRAFT" && !p.isPublished);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-gold" />
            Maison Journal & Editorial
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Author horological chronicles, olfactive philosophy, and behind-the-bench atelier stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchPosts()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gold hover:bg-gold-light text-black font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Write Story
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Stories</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : posts.length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Chronicles written</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Published</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : posts.filter((p) => p.isPublished).length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Live in journal</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Drafts</div>
          <div className="text-2xl font-light text-amber-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : posts.filter((p) => !p.isPublished).length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Under editorial polish</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Topic Categories</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : new Set(posts.map((p) => p.category)).size}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Thematic branches</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search article headline, topic, or excerpts..."
            className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Stories" },
            { id: "PUBLISHED", label: "Published" },
            { id: "DRAFT", label: "Drafts" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? "bg-gold text-black shadow-sm"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 space-y-3">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-neutral-500 rounded-xl border border-white/5 bg-neutral-950/40">
            No journal articles found. Click "Write Story" to publish your first piece.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md overflow-hidden hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="h-48 w-full bg-neutral-900 relative overflow-hidden group">
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md text-gold border border-white/10">
                    {post.category || "Horology"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border ${
                      post.isPublished
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 space-y-2.5">
                <h3 className="text-base font-medium text-white line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed font-light">
                  {post.excerpt || post.content.slice(0, 120) + "..."}
                </p>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Slug: /{post.slug}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/5 bg-neutral-900/30 flex items-center justify-between text-xs">
                <div className="text-neutral-500 text-[11px]">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
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

      {/* Create / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-6 space-y-6 max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">
                {isEditing ? "Edit Journal Story" : "Compose Journal Story"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Editorial authoring for the Maison Velora Journal.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Story Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Architecture of the Free-Sprung Balance Wheel"
                required
                className="bg-neutral-900 border-neutral-800 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="Atelier">Atelier & Craft</option>
                  <option value="Heritage">Geneva Heritage</option>
                  <option value="Exhibitions">Salons & Salons QP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Cover Image URL
              </label>
              <Input
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Abstract / Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary for previews and social link cards..."
                rows={2}
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Story Content (Full Editorial Text / Markdown) *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the complete chronicle..."
                rows={8}
                required
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold font-mono"
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
                Publish immediately to Maison Journal
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-5"
              >
                {isSubmitting ? "Saving..." : "Save Story"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
