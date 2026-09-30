"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit3, Trash2, CheckCircle2, FolderTree, ExternalLink, Image as ImageIcon } from "lucide-react";

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  heroImage?: string | null;
  bannerUrl?: string | null;
  featured: boolean;
  isActive: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  products?: Array<{ product: { id: string; name: string; sku: string; price: number | string } }>;
  createdAt: string;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = React.useState<CollectionItem[]>([]);
  const [allProducts, setAllProducts] = React.useState<Array<{ id: string; name: string; sku: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const defaultForm = {
    name: "",
    slug: "",
    description: "",
    heroImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    bannerUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
    productIds: [] as string[],
  };

  const [formData, setFormData] = React.useState(defaultForm);

  const fetchCollections = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collections");
      const json = await res.json();
      if (json.success && json.collections) {
        setCollections(json.collections);
      }
    } catch (err) {
      console.error("Collections error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductsList = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (json.success && json.products) {
        setAllProducts(json.products);
      }
    } catch (err) {
      console.error("Error fetching products for collection:", err);
    }
  };

  React.useEffect(() => {
    fetchCollections();
    fetchProductsList();
  }, [fetchCollections]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: CollectionItem) => {
    setIsEditing(true);
    setEditingId(col.id);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      heroImage: col.heroImage || "",
      bannerUrl: col.bannerUrl || "",
      featured: col.featured,
      isActive: col.isActive,
      seoTitle: col.seoTitle || "",
      seoDescription: col.seoDescription || "",
      productIds: col.products?.map((p) => p.product.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/collections/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save collection");

      setNotification(isEditing ? "Collection updated." : `Collection "${formData.name}" established.`);
      setIsModalOpen(false);
      fetchCollections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? Linked products will remain in the general catalog.`)) return;
    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification("Collection removed.");
      fetchCollections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting collection");
    }
  };

  const filtered = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight">
            Curated Collections
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Organize timepieces and extraits into editorial storytelling series and seasonal releases.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Create Collection
        </Button>
      </div>

      {notification && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 rounded flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="text-zinc-500 hover:text-zinc-300 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search collections by name or slug..."
            className="w-full h-8 pl-9 pr-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
        <span className="text-xs text-zinc-400 font-mono">Total: {filtered.length}</span>
      </div>

      {/* Grid of Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="border border-zinc-800 rounded-lg p-5 bg-zinc-900/60 space-y-3">
              <Skeleton className="h-32 w-full bg-zinc-800" />
              <Skeleton className="h-6 w-3/4 bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((col) => (
            <div
              key={col.id}
              className="border border-zinc-800 rounded-lg bg-zinc-900/80 overflow-hidden flex flex-col justify-between shadow-sm hover:border-zinc-700 transition-colors"
            >
              <div>
                {/* Banner Preview */}
                <div className="h-32 w-full bg-zinc-950 relative overflow-hidden">
                  {col.bannerUrl ? (
                    <img
                      src={col.bannerUrl}
                      alt={col.name}
                      className="h-full w-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-600">
                      <FolderTree className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {col.featured && <Badge variant="gold">Featured</Badge>}
                    <Badge variant={col.isActive ? "emerald" : "noir"}>
                      {col.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-luxury text-lg text-sand-50 font-normal">
                      {col.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400">/{col.slug}</p>
                  <p className="text-xs text-zinc-400 font-light line-clamp-2">
                    {col.description || "No editorial manifesto specified."}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-mono text-gold-400">
                    <span>{col.products?.length ?? 0} Allocated Pieces</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 text-[10px]">ID: {col.id.slice(-6)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                    title="Edit Collection"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-500 font-mono text-xs">
            No collections found. Click &quot;Create Collection&quot; to configure your first series.
          </div>
        )}
      </div>

      {/* Modal Dialog for Collection Form */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Collection: ${formData.name}` : "Create Editorial Collection"}
        description="Configure banner imagery, active status, SEO parameters, and associated pieces."
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Collection Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: isEditing ? prev.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                }))
              }
              placeholder="The Celestial Complications"
            />
            <Input
              label="URL Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="celestial-complications"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
              Description & Curatorial Story
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-noir-900 border border-white/15 p-2 text-sand-50"
              placeholder="The philosophy, metallurgy, and artisanal inspiration..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hero Image URL"
              value={formData.heroImage}
              onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
              placeholder="https://..."
            />
            <Input
              label="Banner Image URL"
              value={formData.bannerUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, bannerUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="colActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded accent-gold-400"
              />
              <label htmlFor="colActive" className="text-zinc-200">
                Active & Visible in Storefront
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="colFeatured"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded accent-gold-400"
              />
              <label htmlFor="colFeatured" className="text-zinc-200">
                Featured on Homepage
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <p className="text-[11px] text-gold-400 font-semibold uppercase">SEO Optimization</p>
            <Input
              label="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="VELORA Celestial Complications | High Horology Series"
            />
            <Input
              label="SEO Description"
              value={formData.seoDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
              placeholder="Explore the celestial complications hand-finished in Geneva..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? "Save Collection" : "Publish Collection"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
