"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Calendar,
  Percent,
  DollarSign,
  Truck,
  Copy,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface DiscountItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number | string;
  minOrderAmount?: number | string | null;
  maxDiscountAmount?: number | string | null;
  targetType: "ALL" | "PRODUCTS" | "COLLECTIONS";
  productIds: string[];
  collectionIds: string[];
  startsAt: string;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  _count?: { usages: number };
}

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = React.useState<DiscountItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const defaultForm = {
    code: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
    discountValue: 10,
    minOrderAmount: "",
    maxDiscountAmount: "",
    targetType: "ALL" as "ALL" | "PRODUCTS" | "COLLECTIONS",
    productIdsInput: "",
    collectionIdsInput: "",
    expiresAt: "",
    usageLimit: "",
    isActive: true,
  };

  const [formData, setFormData] = React.useState(defaultForm);

  const fetchCoupons = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/discounts");
      const json = await res.json();
      if (json.success && json.coupons) {
        setCoupons(json.coupons);
      }
    } catch (err) {
      console.error("Discounts error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: DiscountItem) => {
    setIsEditing(true);
    setEditingId(c.id);
    setFormData({
      code: c.code,
      description: c.description || "",
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: c.minOrderAmount ? String(c.minOrderAmount) : "",
      maxDiscountAmount: c.maxDiscountAmount ? String(c.maxDiscountAmount) : "",
      targetType: c.targetType,
      productIdsInput: c.productIds.join(", "),
      collectionIdsInput: c.collectionIds.join(", "),
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 16) : "",
      usageLimit: c.usageLimit ? String(c.usageLimit) : "",
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        targetType: formData.targetType,
        productIds: formData.productIdsInput
          ? formData.productIdsInput.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        collectionIds: formData.collectionIdsInput
          ? formData.collectionIdsInput.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        isActive: formData.isActive,
      };

      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/discounts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save discount");

      setNotification(`Voucher ${formData.code} ${isEditing ? "updated" : "created"} successfully.`);
      setTimeout(() => setNotification(null), 4000);
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving discount");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you wish to delete voucher code ${code}?`)) return;
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      setNotification(`Voucher ${code} deleted.`);
      setTimeout(() => setNotification(null), 4000);
      fetchCoupons();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting");
    }
  };

  const handleToggleActive = async (c: DiscountItem) => {
    try {
      const res = await fetch(`/api/admin/discounts/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (res.ok) fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Tag className="h-8 w-8 text-gold" />
            Privilege Vouchers & Promotions
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure private client invitation codes, percentage concessions, and bespoke acquisition perks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchCoupons()}
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
            Issue Voucher
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
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Vouchers</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : coupons.length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Promotional privileges</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Active Codes</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : coupons.filter((c) => c.isActive).length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Ready for redemption</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Redemptions</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : coupons.reduce((acc, c) => acc + c.usageCount, 0)}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Orders with discounts</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Free Shipping Codes</div>
          <div className="text-2xl font-light text-sky-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : coupons.filter((c) => c.discountType === "FREE_SHIPPING").length}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-sky-400" />
            Armored delivery waivers
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search voucher code or campaign..."
          className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
              <tr>
                <th className="py-4 px-6 font-medium">Voucher Code</th>
                <th className="py-4 px-6 font-medium">Benefit / Concession</th>
                <th className="py-4 px-6 font-medium">Scope</th>
                <th className="py-4 px-6 font-medium">Threshold</th>
                <th className="py-4 px-6 font-medium text-center">Redemptions</th>
                <th className="py-4 px-6 font-medium">Expiration</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No privilege vouchers configured yet.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm font-medium text-gold flex items-center gap-1.5">
                        {c.code}
                      </div>
                      {c.description && (
                        <div className="text-[11px] text-neutral-500 mt-0.5 max-w-[200px] truncate">
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-white text-xs">
                        {c.discountType === "PERCENTAGE" && `${c.discountValue}% Off`}
                        {c.discountType === "FIXED_AMOUNT" && `$${Number(c.discountValue).toLocaleString()} Flat Off`}
                        {c.discountType === "FREE_SHIPPING" && "Complimentary Armored Courier"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-400">
                      {c.targetType === "ALL" && <span className="text-neutral-300">Entire Atelier</span>}
                      {c.targetType === "PRODUCTS" && (
                        <span className="text-amber-300/90">{c.productIds.length} Specified Pieces</span>
                      )}
                      {c.targetType === "COLLECTIONS" && (
                        <span className="text-sky-300/90">{c.collectionIds.length} Collections</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-400">
                      {c.minOrderAmount ? `$${Number(c.minOrderAmount).toLocaleString()} Min` : "No Min"}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      <span className="text-white font-medium">{c.usageCount}</span>
                      <span className="text-neutral-500"> / {c.usageLimit ? c.usageLimit : "∞"}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-400">
                      {c.expiresAt ? (
                        <span className={new Date(c.expiresAt) < new Date() ? "text-rose-400" : ""}>
                          {new Date(c.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-neutral-500">Perpetual</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          c.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(c)}
                          className="h-8 text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(c.id, c.code)}
                          className="h-8 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-6 space-y-6 max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">
                {isEditing ? "Edit Privilege Voucher" : "Create Privilege Voucher"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure promotional rules and target parameters.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Voucher Code *
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP2026, ATELIER10"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Concession Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Dollar ($)</option>
                  <option value="FREE_SHIPPING">Free Armored Shipping</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Description / Campaign Name
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Exclusive Salon QP Invitation Concession"
                className="bg-neutral-900 border-neutral-800 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Discount Value *
                </label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Min Order ($)
                </label>
                <Input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Max Cap ($)
                </label>
                <Input
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                  placeholder="e.g. 2000"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Target Scope *
                </label>
                <select
                  value={formData.targetType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetType: e.target.value as "ALL" | "PRODUCTS" | "COLLECTIONS",
                    })
                  }
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="ALL">All Pieces in Atelier</option>
                  <option value="PRODUCTS">Specific Product IDs</option>
                  <option value="COLLECTIONS">Specific Collection IDs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Total Usage Limit
                </label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="e.g. 100 (blank = unlimited)"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {formData.targetType === "PRODUCTS" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Product IDs (Comma-separated)
                </label>
                <Input
                  value={formData.productIdsInput}
                  onChange={(e) => setFormData({ ...formData, productIdsInput: e.target.value })}
                  placeholder="prod_id_1, prod_id_2"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            )}

            {formData.targetType === "COLLECTIONS" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Collection IDs (Comma-separated)
                </label>
                <Input
                  value={formData.collectionIdsInput}
                  onChange={(e) => setFormData({ ...formData, collectionIdsInput: e.target.value })}
                  placeholder="col_id_1, col_id_2"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Expiration Date & Time (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="bg-neutral-900 border-neutral-800 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
              />
              <label htmlFor="isActive" className="text-xs text-neutral-300 font-medium">
                Voucher is active and ready for client redemption
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
                {isSubmitting ? "Saving..." : isEditing ? "Save Voucher" : "Create Voucher"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
