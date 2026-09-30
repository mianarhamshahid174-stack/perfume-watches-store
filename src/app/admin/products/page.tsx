"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Copy,
  Archive,
  Watch,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  cost?: string | number | null;
  shortDescription?: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  tags?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  movement?: string | null;
  caseMaterial?: string | null;
  caseDiameter?: string | null;
  powerReserve?: string | null;
  waterResistance?: string | null;
  concentration?: string | null;
  volumeMl?: number | null;
  category?: { id: string; name: string } | null;
  collections?: Array<{ collection: { id: string; name: string } }>;
  images?: Array<{ id?: string; url: string; altText?: string | null; isPrimary: boolean }>;
  variants?: Array<{ id?: string; sku: string; title: string; price: number | string; stock: number }>;
  inventory?: { quantity: number; warehouseLocation?: string | null } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string }>>([]);
  const [collectionsList, setCollectionsList] = React.useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"general" | "pricing" | "specs" | "media" | "seo">("general");

  // Form state
  const defaultFormData = {
    name: "",
    slug: "",
    sku: "",
    shortDescription: "",
    description: "",
    price: 24500,
    compareAtPrice: 0,
    cost: 8500,
    categoryId: "",
    collectionId: "",
    tags: "Horology, Complication",
    status: "PUBLISHED",
    featured: true,
    initialStock: 5,
    warehouseLocation: "Geneva Vault Alpha-1",
    movement: "Calibre VA-920 Flyback Chronograph",
    caseMaterial: "Grade 5 Titanium",
    caseDiameter: "41.0 mm",
    powerReserve: "72 Hours",
    waterResistance: "100m / 10 ATM",
    concentration: "Extrait de Parfum (32%)",
    volumeMl: 100,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    videoUrl: "",
    seoTitle: "",
    seoDescription: "",
  };

  const [formData, setFormData] = React.useState(defaultFormData);

  const fetchProducts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/products?search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter !== "ALL") {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.products) {
        setProducts(json.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  const fetchTaxonomies = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/collections"),
      ]);
      const catJson = await catRes.json();
      const colJson = await colRes.json();
      if (catJson.success) setCategories(catJson.categories);
      if (colJson.success) setCollectionsList(colJson.collections);
    } catch (err) {
      console.error("Error loading taxonomies:", err);
    }
  };

  React.useEffect(() => {
    fetchProducts();
    fetchTaxonomies();
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultFormData);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : 0,
      cost: product.cost ? Number(product.cost) : 0,
      categoryId: product.category?.id || "",
      collectionId: product.collections?.[0]?.collection?.id || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      status: product.status,
      featured: product.featured,
      initialStock: product.inventory?.quantity ?? 1,
      warehouseLocation: product.inventory?.warehouseLocation || "Geneva Vault",
      movement: product.movement || "",
      caseMaterial: product.caseMaterial || "",
      caseDiameter: product.caseDiameter || "",
      powerReserve: product.powerReserve || "",
      waterResistance: product.waterResistance || "",
      concentration: product.concentration || "",
      volumeMl: product.volumeMl || 100,
      imageUrl: product.images?.[0]?.url || "",
      videoUrl: "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        compareAtPrice: formData.compareAtPrice > 0 ? formData.compareAtPrice : null,
        cost: formData.cost > 0 ? formData.cost : null,
      };

      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save product");
      }

      setNotification(isEditing ? `Product updated successfully.` : `New piece "${formData.name}" commissioned.`);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to duplicate");
      setNotification(json.message);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error duplicating product");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/archive`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to toggle archive");
      setNotification(json.message);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error archiving product");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently remove "${name}" from database records?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification(`Product removed from catalog.`);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight">
            Product & Timepiece Management
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Create, duplicate, archive, and manage horological calibres and high perfumery creations.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Create New Product
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by piece name, SKU, calibre..."
            className="w-full h-8 pl-9 pr-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  statusFilter === status
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-400 font-mono border-l border-zinc-800 pl-3">
            Count: {products.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-lg bg-zinc-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
              <tr>
                <th className="py-3 px-4 font-normal">Piece / Timepiece</th>
                <th className="py-3 px-4 font-normal">SKU</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal text-right">Price</th>
                <th className="py-3 px-4 font-normal text-right">Cost</th>
                <th className="py-3 px-4 font-normal text-center">Vault Stock</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="py-4 px-4">
                      <Skeleton className="h-5 w-full bg-zinc-900" />
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-gold-400 shrink-0">
                          <Watch className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-100 font-sans">{p.name}</p>
                          <p className="text-[10px] text-zinc-500">
                            {p.movement || p.concentration || "Swiss Made"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-semibold">{p.sku}</td>
                    <td className="py-3 px-4 text-zinc-400">{p.category?.name || "Unassigned"}</td>
                    <td className="py-3 px-4 text-right font-medium text-gold-400">
                      {formatCurrency(Number(p.price) * 100)}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500">
                      {p.cost ? formatCurrency(Number(p.cost) * 100) : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${p.inventory?.quantity && p.inventory.quantity <= 3 ? "text-amber-400" : "text-zinc-200"}`}>
                        {p.inventory?.quantity ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === "PUBLISHED"
                            ? "emerald"
                            : p.status === "DRAFT"
                            ? "silver"
                            : "noir"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded hover:bg-zinc-800"
                        title="Edit piece"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-gold-400 transition-colors rounded hover:bg-zinc-800"
                        title="Duplicate piece"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleArchive(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors rounded hover:bg-zinc-800"
                        title={p.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded hover:bg-zinc-800"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono">
                    No products found matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Product Create / Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Piece: ${formData.name}` : "Commission New Atelier Piece"}
        description="Configure product specifications, financial pricing, inventory vaulting, and SEO parameters."
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-800 pb-2 gap-2 text-xs">
            {(["general", "pricing", "specs", "media", "seo"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-zinc-800 text-gold-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Product Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: isEditing ? prev.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    }))
                  }
                  placeholder="VELORA Chrono-Astral I"
                />
                <Input
                  label="SKU / Serial Identifier"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  placeholder="VEL-CHRONO-01"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="URL Slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="velora-chrono-astral-i"
                />
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full h-11 bg-noir-900 border border-white/15 px-3 text-sand-50 rounded-none focus:border-gold-400"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Short Description"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Hand-wound flyback chronograph in Grade 5 titanium..."
              />

              <div className="space-y-1">
                <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
                  Full Description & Story
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-noir-900 border border-white/15 p-2 text-sand-50 focus:border-gold-400"
                  placeholder="Detailed architectural description, finishing, and calibre history..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full h-11 bg-noir-900 border border-white/15 px-3 text-sand-50"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <Input
                  label="Tags (Comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="Chronograph, Titanium, Limited"
                />

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 rounded accent-gold-400"
                  />
                  <label htmlFor="featuredCheckbox" className="text-xs text-zinc-300">
                    Featured Masterwork
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & INVENTORY */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Acquisition Price (USD)"
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                />
                <Input
                  label="Compare At Price (USD)"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: Number(e.target.value) }))}
                />
                <Input
                  label="Production Cost (USD)"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cost: Number(e.target.value) }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Input
                  label="Vault Stock Allocation"
                  type="number"
                  value={formData.initialStock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, initialStock: Number(e.target.value) }))}
                />
                <Input
                  label="Warehouse Location"
                  value={formData.warehouseLocation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, warehouseLocation: e.target.value }))}
                  placeholder="Geneva Vault Alpha-1"
                />
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <p className="text-[11px] text-gold-400">Timepiece Technical Specifications</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Movement / Calibre"
                  value={formData.movement}
                  onChange={(e) => setFormData((prev) => ({ ...prev, movement: e.target.value }))}
                />
                <Input
                  label="Power Reserve"
                  value={formData.powerReserve}
                  onChange={(e) => setFormData((prev) => ({ ...prev, powerReserve: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Case Material"
                  value={formData.caseMaterial}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseMaterial: e.target.value }))}
                />
                <Input
                  label="Case Diameter"
                  value={formData.caseDiameter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseDiameter: e.target.value }))}
                />
                <Input
                  label="Water Resistance"
                  value={formData.waterResistance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, waterResistance: e.target.value }))}
                />
              </div>

              <p className="text-[11px] text-gold-400 pt-2 border-t border-zinc-800">
                Fragrance Technical Specifications
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Concentration"
                  value={formData.concentration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, concentration: e.target.value }))}
                  placeholder="Extrait de Parfum (32%)"
                />
                <Input
                  label="Volume (ml)"
                  type="number"
                  value={formData.volumeMl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, volumeMl: Number(e.target.value) }))}
                />
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & VIDEOS */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <Input
                label="Primary Image URL"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
              />

              <Input
                label="Product Demonstration Video URL (Optional)"
                value={formData.videoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://.../video.mp4"
              />

              {formData.imageUrl && (
                <div className="pt-2">
                  <span className="block text-[11px] text-zinc-400 mb-1">Image Preview:</span>
                  <div className="h-28 w-28 border border-zinc-800 rounded overflow-hidden relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <Input
                label="SEO Meta Title"
                value={formData.seoTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="VELORA Chrono-Astral I | Hand-Crafted Flyback Chronograph"
              />
              <div className="space-y-1">
                <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  className="w-full bg-noir-900 border border-white/15 p-2 text-sand-50"
                  placeholder="Discover the VELORA Chrono-Astral I with 72h power reserve..."
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {isEditing ? "Save Product Changes" : "Create Masterpiece"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
