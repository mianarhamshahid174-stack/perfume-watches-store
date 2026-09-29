"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Filter, Trash2, Edit3, Watch, CheckCircle2 } from "lucide-react";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  status: string;
  featured: boolean;
  category?: { name: string } | null;
  inventory?: { quantity: number } | null;
  movement?: string | null;
  concentration?: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // New product form state
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    sku: "",
    shortDescription: "",
    description: "",
    price: 15000,
    status: "PUBLISHED",
    featured: true,
    initialStock: 5,
    movement: "Calibre VA-800 Hand-wound",
    caseMaterial: "Grade 5 Titanium",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
  });

  const fetchProducts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`);
      const json = await res.json();
      if (json.success && json.products) {
        setProducts(json.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create product");
      }

      setNotification(`Masterpiece "${formData.name}" added to catalog.`);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the active catalog?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete");
      }
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
          <h1 className="text-xl font-semibold font-mono text-zinc-100">
            Catalog & Vault Allocations
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Manage high-complication timepieces, extraits de parfum, and warehouse stock.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Commission New Piece
        </Button>
      </div>

      {notification && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 rounded flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {notification}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
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
            placeholder="Search by name, SKU, or calibre..."
            className="w-full h-8 pl-9 pr-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-zinc-400 font-mono">
          <Filter className="h-3.5 w-3.5" />
          <span>Total Records: {products.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-lg bg-zinc-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-normal">Piece / Timepiece</th>
                <th className="py-3 px-4 font-normal">SKU</th>
                <th className="py-3 px-4 font-normal">Category</th>
                <th className="py-3 px-4 font-normal">Price</th>
                <th className="py-3 px-4 font-normal">Stock</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="py-4 px-4">
                      <Skeleton className="h-5 w-full bg-zinc-900" />
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                          <Watch className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-100">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            {p.movement || p.concentration || "Hand-crafted"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{p.sku}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{p.category?.name || "General"}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-gold-400">
                      {formatCurrency(Number(p.price) * 100)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {p.inventory?.quantity ?? 0} in vault
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.status === "PUBLISHED" ? "emerald" : "noir"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded hover:bg-zinc-800"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono">
                    No catalog records match the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Modal Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Commission New Catalog Piece"
        description="Enter the specifications to initialize a new horological piece or fragrance in the PostgreSQL database."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              }))
            }
            placeholder="VELORA Chrono-Astral II"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU"
              required
              value={formData.sku}
              onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
              placeholder="VEL-CHRONO-02"
            />
            <Input
              label="Price (USD)"
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
              }
            />
          </div>

          <Input
            label="Short Description"
            required
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
            }
            placeholder="Hand-wound flyback chronograph in rose gold..."
          />

          <div className="space-y-1">
            <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
              Full Atelier Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full bg-noir-900 border border-white/15 p-2 text-sand-50 focus:border-gold-400 outline-none"
              placeholder="Comprehensive horological specifications and movement architecture..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Movement / Calibre"
              value={formData.movement}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, movement: e.target.value }))
              }
            />
            <Input
              label="Initial Vault Stock"
              type="number"
              value={formData.initialStock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  initialStock: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
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
              Record in Database
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
