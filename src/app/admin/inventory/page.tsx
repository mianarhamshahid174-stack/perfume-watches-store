"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Boxes,
  Search,
  SlidersHorizontal,
  History,
  AlertTriangle,
  CheckCircle2,
  PackageX,
  Warehouse,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface RecentTransaction {
  id: string;
  type: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
  adminUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface InventoryItem {
  id: string;
  productId?: string | null;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  isLowStock: boolean;
  status: "HEALTHY" | "LOW_STOCK" | "OUT_OF_STOCK";
  warehouseLocation: string;
  updatedAt: string;
  recentTransactions: RecentTransaction[];
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Adjustment Modal State
  const [isAdjustOpen, setIsAdjustOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = React.useState<number>(0);
  const [adjustReason, setAdjustReason] = React.useState("");
  const [adjustType, setAdjustType] = React.useState<string>("AUDIT_ADJUSTMENT");
  const [adjustReference, setAdjustReference] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // History Modal State
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [historyItem, setHistoryItem] = React.useState<InventoryItem | null>(null);

  const [notification, setNotification] = React.useState<string | null>(null);

  const fetchInventory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const json = await res.json();
      if (json.success && json.inventory) {
        setInventory(json.inventory);
      }
    } catch (err) {
      console.error("Inventory error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustQty(0);
    setAdjustReason("");
    setAdjustType("AUDIT_ADJUSTMENT");
    setAdjustReference(`AUDIT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`);
    setIsAdjustOpen(true);
  };

  const handleOpenHistory = (item: InventoryItem) => {
    setHistoryItem(item);
    setIsHistoryOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || adjustQty === 0 || !adjustReason) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryId: selectedItem.id,
          adjustmentQuantity: adjustQty,
          reason: adjustReason,
          transactionType: adjustType,
          reference: adjustReference,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Adjustment failed");

      setNotification(`Stock updated successfully: ${adjustQty > 0 ? "+" : ""}${adjustQty} units.`);
      setTimeout(() => setNotification(null), 4000);
      setIsAdjustOpen(false);
      fetchInventory();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to record adjustment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats calculation
  const totalStock = inventory.reduce((acc, curr) => acc + curr.currentStock, 0);
  const totalReserved = inventory.reduce((acc, curr) => acc + curr.reservedStock, 0);
  const lowStockCount = inventory.filter((item) => item.status === "LOW_STOCK").length;
  const outOfStockCount = inventory.filter((item) => item.status === "OUT_OF_STOCK").length;

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "LOW_STOCK" && item.status === "LOW_STOCK") ||
      (statusFilter === "OUT_OF_STOCK" && item.status === "OUT_OF_STOCK") ||
      (statusFilter === "HEALTHY" && item.status === "HEALTHY");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Boxes className="h-8 w-8 text-gold" />
            Vault & Inventory Control
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time horological stock, reserve allocations, and immutable ledger audit adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchInventory()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Stock
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
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total In Vault</div>
          <div className="text-2xl font-light text-white mt-2">{isLoading ? <Skeleton className="h-8 w-16" /> : totalStock.toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Warehouse className="h-3.5 w-3.5 text-neutral-500" />
            Active physical units
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Reserved Stock</div>
          <div className="text-2xl font-light text-amber-300 mt-2">{isLoading ? <Skeleton className="h-8 w-16" /> : totalReserved.toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1">Held for pending client orders</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Low Stock Alerts</div>
          <div className="text-2xl font-light text-amber-500 mt-2">{isLoading ? <Skeleton className="h-8 w-16" /> : lowStockCount}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Less than or equal to 3 units
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Out of Stock</div>
          <div className="text-2xl font-light text-rose-400 mt-2">{isLoading ? <Skeleton className="h-8 w-16" /> : outOfStockCount}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <PackageX className="h-3.5 w-3.5 text-rose-400" />
            Zero available units
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search piece, SKU, or vault section..."
            className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Items" },
            { id: "HEALTHY", label: "Healthy" },
            { id: "LOW_STOCK", label: "Low Stock" },
            { id: "OUT_OF_STOCK", label: "Out of Stock" },
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

      {/* Inventory Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
              <tr>
                <th className="py-4 px-6 font-medium">SKU</th>
                <th className="py-4 px-6 font-medium">Piece / Product</th>
                <th className="py-4 px-6 font-medium text-center">Current</th>
                <th className="py-4 px-6 font-medium text-center">Reserved</th>
                <th className="py-4 px-6 font-medium text-center">Available</th>
                <th className="py-4 px-6 font-medium">Vault Location</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-40" /></td>
                    <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No inventory records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gold/90">{item.sku}</td>
                    <td className="py-4 px-6 font-medium text-white">{item.productName}</td>
                    <td className="py-4 px-6 text-center font-mono font-medium text-white">
                      {item.currentStock}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-amber-300/80">
                      {item.reservedStock}
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-emerald-400">
                      {item.availableStock}
                    </td>
                    <td className="py-4 px-6 text-neutral-400 text-xs">
                      {item.warehouseLocation}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.status === "HEALTHY"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.status === "LOW_STOCK"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {item.status === "HEALTHY" && "Healthy"}
                        {item.status === "LOW_STOCK" && "Low Stock"}
                        {item.status === "OUT_OF_STOCK" && "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenHistory(item)}
                          className="h-8 text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                          title="View Audit Ledger"
                        >
                          <History className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenAdjust(item)}
                          className="h-8 bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-gold hover:text-black hover:border-gold transition-colors text-xs font-medium"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                          Adjust
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

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">Stock Adjustment</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Adjusting physical ledger for: <span className="text-gold font-mono">{selectedItem?.sku}</span>
              </p>
            </div>
          </div>

          {selectedItem && (
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="text-neutral-400">Current Vault Quantity</div>
                  <div className="text-lg font-mono text-white font-medium">{selectedItem.currentStock} units</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-400">Projected New Quantity</div>
                  <div className={`text-lg font-mono font-medium ${selectedItem.currentStock + adjustQty < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {selectedItem.currentStock + adjustQty} units
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Adjustment Delta (+/-) *
                  </label>
                  <Input
                    type="number"
                    value={adjustQty || ""}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. +5 or -2"
                    required
                    className="bg-neutral-900 border-neutral-800 text-white font-mono"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Use negative values to deduct units.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Transaction Type *
                  </label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="AUDIT_ADJUSTMENT">Audit Adjustment</option>
                    <option value="PURCHASE_RECEIPT">Purchase Receipt (Atelier Delivery)</option>
                    <option value="RETURN_RESTOCK">Client Return Restock</option>
                    <option value="SALE_DEDUCTION">Manual Sale Allocation</option>
                    <option value="DAMAGED">Damaged / Flawed Piece Removal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Reference Code / Document ID
                </label>
                <Input
                  value={adjustReference}
                  onChange={(e) => setAdjustReference(e.target.value)}
                  placeholder="e.g. AUDIT-2026-Q3, PO-9921"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Reason for Adjustment *
                </label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Provide detailed justification for internal audit logs..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAdjustOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || adjustQty === 0 || selectedItem.currentStock + adjustQty < 0}
                  className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-5"
                >
                  {isSubmitting ? "Recording in Ledger..." : "Commit Stock Adjustment"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Dialog>

      {/* History / Audit Ledger Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <div className="p-6 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                Ledger Audit Trail
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Transaction history for <span className="text-white font-medium">{historyItem?.productName}</span> ({historyItem?.sku})
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {historyItem?.recentTransactions && historyItem.recentTransactions.length > 0 ? (
              historyItem.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-lg border border-white/5 bg-neutral-900/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          tx.quantity > 0
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {tx.quantity > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} units
                      </span>
                      <span className="text-neutral-300 font-mono text-[11px]">{tx.type}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-neutral-400">
                    <span className="text-neutral-500">Reason:</span> {tx.notes || "Standard inventory adjustment"}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-white/5 pt-2">
                    <div>
                      Reference: <span className="font-mono text-neutral-400">{tx.reference || "N/A"}</span>
                    </div>
                    <div>
                      Authorized by:{" "}
                      <span className="text-neutral-300">
                        {tx.adminUser
                          ? `${tx.adminUser.firstName} ${tx.adminUser.lastName}`
                          : "System Master"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-neutral-500 text-xs">
                No recent transactions recorded for this item.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button
              variant="outline"
              onClick={() => setIsHistoryOpen(false)}
              className="border-neutral-800 text-neutral-300 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
