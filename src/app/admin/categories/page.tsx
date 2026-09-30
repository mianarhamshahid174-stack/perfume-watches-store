"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit3, Trash2, CheckCircle2, Tags } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { products: number; children: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
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
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    parentId: "",
  };

  const [formData, setFormData] = React.useState(defaultForm);

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success && json.categories) {
        setCategories(json.categories);
      }
    } catch (err) {
      console.error("Categories error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      parentId: cat.parent?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save category");

      setNotification(isEditing ? "Category updated." : `Category "${formData.name}" initialized.`);
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification("Category removed.");
      fetchCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting category");
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight">
            Department & Category Taxonomies
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Define hierarchical divisions for Haute Horlogerie, High Perfumery, and Accessories.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Add Category
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
            placeholder="Search categories..."
            className="w-full h-8 pl-9 pr-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
        <span className="text-xs text-zinc-400 font-mono">Count: {filtered.length}</span>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-lg bg-zinc-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
              <tr>
                <th className="py-3 px-4 font-normal">Department / Category</th>
                <th className="py-3 px-4 font-normal">Slug</th>
                <th className="py-3 px-4 font-normal">Parent</th>
                <th className="py-3 px-4 font-normal text-center">Products Linked</th>
                <th className="py-3 px-4 font-normal">Description</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-4">
                      <Skeleton className="h-5 w-full bg-zinc-900" />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                          <Tags className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold text-zinc-100">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono">/{cat.slug}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{cat.parent?.name || "Root"}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-gold-400">
                      {cat._count?.products ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-[240px] truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                        title="Edit Category"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Category Form */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Category: ${formData.name}` : "Create Taxonomy Category"}
        description="Establish catalog department classifications."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Category Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: isEditing ? prev.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                }))
              }
              placeholder="Haute Horlogerie"
            />
            <Input
              label="URL Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="haute-horlogerie"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-noir-900 border border-white/15 p-2 text-sand-50"
              placeholder="Classification details..."
            />
          </div>

          <Input
            label="Banner / Cover Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
          />

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400">
              Parent Category (Optional)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
              className="w-full h-11 bg-noir-900 border border-white/15 px-3 text-sand-50"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => c.id !== editingId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? "Save Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
