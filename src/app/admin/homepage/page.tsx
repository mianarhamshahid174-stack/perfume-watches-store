"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutTemplate,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  Package,
} from "lucide-react";

interface HomepageSectionItem {
  id: string;
  name: string;
  sectionKey: string;
  title?: string | null;
  subtitle?: string | null;
  content?: any;
  sortOrder: number;
  isActive: boolean;
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
}

interface CollectionOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminHomepagePage() {
  const [sections, setSections] = React.useState<HomepageSectionItem[]>([]);
  const [products, setProducts] = React.useState<ProductOption[]>([]);
  const [collections, setCollections] = React.useState<CollectionOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const defaultForm = {
    name: "",
    sectionKey: "",
    title: "",
    subtitle: "",
    ctaText: "Discover Pieces",
    ctaLink: "/collections/watches",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    bgImageUrl: "",
    videoUrl: "",
    productSlug: "",
    collectionSlugs: [] as string[],
    badge: "",
    sortOrder: 1,
    isActive: true,
  };

  const [formData, setFormData] = React.useState(defaultForm);

  const fetchSections = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      const json = await res.json();
      if (json.success && json.sections) {
        setSections(json.sections);
      }
    } catch (err) {
      console.error("Homepage sections error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDependencies = React.useCallback(async () => {
    try {
      const [prodRes, colRes] = await Promise.all([
        fetch("/api/admin/products?limit=50"),
        fetch("/api/admin/collections"),
      ]);
      const prodJson = await prodRes.json();
      const colJson = await colRes.json();
      if (prodJson.success && prodJson.products) {
        setProducts(prodJson.products);
      }
      if (colJson.success && colJson.collections) {
        setCollections(colJson.collections);
      }
    } catch (err) {
      console.error("Failed to load products/collections for homepage CMS:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchSections();
    fetchDependencies();
  }, [fetchSections, fetchDependencies]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ...defaultForm,
      sortOrder: sections.length + 1,
      sectionKey: `section_${Date.now().toString().slice(-4)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec: HomepageSectionItem) => {
    setIsEditing(true);
    setEditingId(sec.id);
    const content = sec.content || {};
    setFormData({
      name: sec.name,
      sectionKey: sec.sectionKey,
      title: sec.title || "",
      subtitle: sec.subtitle || "",
      ctaText: content.ctaText || "",
      ctaLink: content.ctaLink || "",
      secondaryCtaText: content.secondaryCtaText || "",
      secondaryCtaLink: content.secondaryCtaLink || "",
      bgImageUrl: content.bgImageUrl || content.imageUrl || "",
      videoUrl: content.videoUrl || "",
      productSlug: content.productSlug || "",
      collectionSlugs: Array.isArray(content.collectionSlugs) ? content.collectionSlugs : [],
      badge: content.badge || content.tagline || "",
      sortOrder: sec.sortOrder,
      isActive: sec.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleCollection = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.collectionSlugs.includes(slug);
      return {
        ...prev,
        collectionSlugs: exists
          ? prev.collectionSlugs.filter((s) => s !== slug)
          : [...prev.collectionSlugs, slug],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Find existing content to preserve any custom nested structures (e.g. details, pillars)
      const existingSec = sections.find((s) => s.id === editingId);
      const existingContent = existingSec?.content || {};

      const content = {
        ...existingContent,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        secondaryCtaText: formData.secondaryCtaText,
        secondaryCtaLink: formData.secondaryCtaLink,
        bgImageUrl: formData.bgImageUrl,
        imageUrl: formData.bgImageUrl,
        videoUrl: formData.videoUrl,
        productSlug: formData.productSlug,
        collectionSlugs: formData.collectionSlugs,
        badge: formData.badge,
      };

      const payload = {
        name: formData.name,
        sectionKey: formData.sectionKey,
        title: formData.title,
        subtitle: formData.subtitle,
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
        content,
      };

      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/homepage/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save section");

      setNotification(`Homepage section "${formData.name}" saved successfully.`);
      setTimeout(() => setNotification(null), 3500);
      setIsModalOpen(false);
      fetchSections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (sec: HomepageSectionItem) => {
    try {
      const res = await fetch(`/api/admin/homepage/${sec.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !sec.isActive }),
      });
      if (res.ok) fetchSections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    setSections(newSections);

    try {
      const orderPayload = newSections.map((s, idx) => ({ id: s.id, sortOrder: idx + 1 }));
      await fetch("/api/admin/homepage/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: orderPayload }),
      });
      fetchSections();
    } catch (err) {
      console.error("Reorder failed:", err);
      fetchSections();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete section "${name}" from homepage layout?`)) return;
    try {
      const res = await fetch(`/api/admin/homepage/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification(`Section deleted.`);
      setTimeout(() => setNotification(null), 3500);
      fetchSections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <LayoutTemplate className="h-8 w-8 text-gold" />
            Homepage Architecture & CMS Control
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Curate hero banners, brand storytelling, editorial watch showcases, collections, craftsmanship galleries, and newsletter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              fetchSections();
              fetchDependencies();
            }}
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
            Add Block
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
          ))
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 rounded-xl border border-white/5 bg-neutral-950/40">
            No sections currently configured. Click "Add Block" to create your first visual section.
          </div>
        ) : (
          sections.map((sec, index) => {
            const content = sec.content || {};
            const previewImg = content.bgImageUrl || content.imageUrl;
            const hasProduct = Boolean(content.productSlug);
            const hasCollections = Array.isArray(content.collectionSlugs) && content.collectionSlugs.length > 0;

            return (
              <div
                key={sec.id}
                className={`p-5 rounded-xl border transition-all ${
                  sec.isActive
                    ? "border-white/10 bg-neutral-950/80 hover:border-gold/30"
                    : "border-white/5 bg-neutral-950/40 opacity-55"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Re-order controls */}
                    <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, "up")}
                        className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500"
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-mono text-gold font-semibold">{sec.sortOrder}</span>
                      <button
                        disabled={index === sections.length - 1}
                        onClick={() => handleMove(index, "down")}
                        className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500"
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Section Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white text-base">{sec.name}</span>
                        <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                          {sec.sectionKey}
                        </span>
                        {hasProduct && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-300 bg-gold-950/40 border border-gold-500/20 px-2 py-0.5 rounded">
                            <Package className="h-3 w-3" />
                            {content.productSlug}
                          </span>
                        )}
                        {hasCollections && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                            <Tag className="h-3 w-3" />
                            {content.collectionSlugs.join(", ")}
                          </span>
                        )}
                      </div>

                      {sec.title && (
                        <div className="text-sm font-serif-luxury text-gold-300">
                          "{sec.title}"
                        </div>
                      )}

                      {sec.subtitle && (
                        <p className="text-xs text-neutral-400 max-w-2xl line-clamp-2">
                          {sec.subtitle}
                        </p>
                      )}

                      {/* CTA & Image Link metadata */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-neutral-500">
                        {content.ctaText && (
                          <span className="text-neutral-300">
                            CTA: <strong className="text-gold font-normal">{content.ctaText}</strong> → {content.ctaLink}
                          </span>
                        )}
                        {content.secondaryCtaText && (
                          <span className="text-neutral-400">
                            2nd CTA: <strong className="text-neutral-200 font-normal">{content.secondaryCtaText}</strong> → {content.secondaryCtaLink}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Media Thumbnail + Actions */}
                  <div className="flex items-center gap-4 self-end lg:self-center shrink-0">
                    {previewImg && (
                      <div className="relative h-14 w-24 rounded border border-white/10 overflow-hidden bg-neutral-900 hidden sm:block">
                        <img
                          src={previewImg}
                          alt={sec.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(sec)}
                        className={`h-8 text-xs ${
                          sec.isActive
                            ? "text-emerald-400 hover:bg-emerald-500/10"
                            : "text-neutral-500 hover:bg-neutral-800"
                        }`}
                      >
                        {sec.isActive ? (
                          <>
                            <Eye className="h-3.5 w-3.5 mr-1" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5 mr-1" /> Hidden
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(sec)}
                        className="h-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(sec.id, sec.name)}
                        className="h-8 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-6 space-y-6 max-w-2xl max-h-[90vh] overflow-y-auto bg-black text-white rounded-xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white font-serif-luxury">
                {isEditing ? `Edit: ${formData.name}` : "Create Homepage Block"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure content, typography, media URLs, products, and collection linkages.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Section Label *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hero Showcase, Featured Watch"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Section Key (Unique ID) *
                </label>
                <Input
                  value={formData.sectionKey}
                  onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value })}
                  placeholder="e.g. hero_main, featured_watch"
                  required
                  disabled={isEditing}
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Headline / Editorial Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. TIME, REFINED."
                className="bg-neutral-900 border-neutral-800 text-white text-xs font-serif-luxury text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Editorial Subtitle / Paragraph Description
              </label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Editorial narrative describing this section..."
                rows={3}
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Primary CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Primary CTA Label
                </label>
                <Input
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="e.g. DISCOVER THE COLLECTION"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Primary CTA Link
                </label>
                <Input
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/collections/signature"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Secondary CTA Label (Optional)
                </label>
                <Input
                  value={formData.secondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  placeholder="e.g. EXPLORE WATCHES"
                  className="bg-neutral-900 border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Secondary CTA Link (Optional)
                </label>
                <Input
                  value={formData.secondaryCtaLink}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                  placeholder="/watches"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Product & Collection Links */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                Database Relationships & Selections
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Select Database Product (e.g. for Hero / Signature / Featured Watch)
                  </label>
                  <select
                    value={formData.productSlug}
                    onChange={(e) => setFormData({ ...formData, productSlug: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                  >
                    <option value="">-- No specific product selected --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} ({p.sku}) - ${Number(p.price).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Badge / Tagline (Optional)
                  </label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Flagship Edition No. 01"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs"
                  />
                </div>
              </div>

              {/* Collections Multi-Select */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Select Associated Collections (for Collections Grid)
                </label>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => {
                    const isSelected = formData.collectionSlugs.includes(col.slug);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleToggleCollection(col.slug)}
                        className={`text-xs px-3 py-1.5 rounded border transition-all ${
                          isSelected
                            ? "bg-gold text-black font-medium border-gold"
                            : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {col.name} ({col.slug})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Media Image & Video URL */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Background / Section Image URL
                </label>
                <Input
                  value={formData.bgImageUrl}
                  onChange={(e) => setFormData({ ...formData, bgImageUrl: e.target.value })}
                  placeholder="/images/velora-hero-editorial.jpg or https://images.unsplash.com/..."
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Background / Hero Video URL (Optional MP4 / WebM)
                </label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://assets.mixkit.co/videos/... or /videos/hero-reel.mp4"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  If provided, background video plays in cinematic loop with the background image as poster.
                </p>
              </div>
            </div>

            {/* Publication & Order Controls */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 items-center">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Sort Order (1 to N)
                </label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="bg-neutral-900 border-neutral-800 text-white text-xs w-24"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="secActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                />
                <label htmlFor="secActive" className="text-xs text-neutral-300 font-medium cursor-pointer">
                  Published on live homepage
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
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
                className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-6"
              >
                {isSubmitting ? "Saving Changes..." : "Save Block"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
