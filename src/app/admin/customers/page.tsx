"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  Edit3,
  UserCheck,
  DollarSign,
  RefreshCw,
} from "lucide-react";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
  role: "CUSTOMER" | "VIP_CUSTOMER";
  isActive: boolean;
  orderCount: number;
  totalSpending: number;
  latestOrder?: {
    id: string;
    orderNumber: string;
    total: number;
    date: string;
    status: string;
  } | null;
  status: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Selected customer for modal
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [editRole, setEditRole] = React.useState<"CUSTOMER" | "VIP_CUSTOMER">("CUSTOMER");
  const [editPhone, setEditPhone] = React.useState("");
  const [editNotes, setEditNotes] = React.useState("");
  const [notification, setNotification] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.customers) {
        setCustomers(json.customers);
      }
    } catch (err) {
      console.error("Customers error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenEdit = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setEditRole(customer.role);
    setEditPhone(customer.phone || "");
    setEditNotes(customer.notes || "");
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editRole,
          phone: editPhone,
          notes: editNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed");

      setNotification(`Patron profile updated successfully.`);
      setTimeout(() => setNotification(null), 4000);
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving customer");
    } finally {
      setIsUpdating(false);
    }
  };

  // KPIs
  const totalPatrons = customers.length;
  const vipCount = customers.filter((c) => c.role === "VIP_CUSTOMER").length;
  const totalSpendSum = customers.reduce((acc, c) => acc + c.totalSpending, 0);
  const avgSpend = totalPatrons > 0 ? Math.round(totalSpendSum / totalPatrons) : 0;

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter === "VIP") return c.role === "VIP_CUSTOMER";
    if (statusFilter === "ACTIVE") return c.orderCount > 0;
    if (statusFilter === "REGISTERED") return c.orderCount === 0;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-gold" />
            Clientèle & Patron Registry
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Private directory of verified connoisseurs, VIP patrons, and cumulative bespoke acquisitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchCustomers()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Registry
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
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Registered Patrons</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : totalPatrons}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Total active accounts</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">VIP Connoisseurs</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : vipCount}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Crown className="h-3.5 w-3.5 text-gold" />
            Privileged tier access
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Cumulative Spend</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalSpendSum.toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Lifetime customer value</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Avg Spend Per Patron</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `$${avgSpend.toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Mean acquisition size</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patron by name, email, or telephone..."
            className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Patrons" },
            { id: "VIP", label: "VIP Patrons" },
            { id: "ACTIVE", label: "Active Buyers" },
            { id: "REGISTERED", label: "Registered" },
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

      {/* Customers Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
              <tr>
                <th className="py-4 px-6 font-medium">Patron Name</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Tier Status</th>
                <th className="py-4 px-6 font-medium text-center">Acquisitions</th>
                <th className="py-4 px-6 font-medium">Total Spend</th>
                <th className="py-4 px-6 font-medium">Latest Order</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-40" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="py-4 px-6 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No patrons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-white text-xs">{cust.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        Joined {new Date(cust.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                        <Mail className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                        {cust.email}
                      </div>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                          <Phone className="h-3 w-3 text-neutral-500 shrink-0" />
                          {cust.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          cust.role === "VIP_CUSTOMER"
                            ? "bg-gold/10 text-gold border-gold/30"
                            : cust.orderCount > 0
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
                        }`}
                      >
                        {cust.role === "VIP_CUSTOMER" && <Crown className="h-3 w-3" />}
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-medium text-white text-xs">
                      {cust.orderCount}
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-gold text-xs">
                      ${cust.totalSpending.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      {cust.latestOrder ? (
                        <div>
                          <div className="font-mono text-xs text-white">
                            {cust.latestOrder.orderNumber}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            ${cust.latestOrder.total.toLocaleString()} • {new Date(cust.latestOrder.date).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-xs italic">No orders placed</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenEdit(cust)}
                        className="h-8 bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-gold hover:text-black hover:border-gold transition-colors text-xs font-medium"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                        Concierge
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Concierge Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-6 space-y-6 max-w-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-light text-white">Patron Concierge Profile</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Client ID: <span className="font-mono text-neutral-300">{selectedCustomer?.id}</span>
              </p>
            </div>
          </div>

          {selectedCustomer && (
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Client Name:</span>
                  <span className="text-white font-medium">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email Address:</span>
                  <span className="text-white font-mono">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Acquisitions:</span>
                  <span className="text-white font-mono">{selectedCustomer.orderCount} orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Lifetime Spending:</span>
                  <span className="text-gold font-mono font-medium">${selectedCustomer.totalSpending.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Client Tier Classification
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "CUSTOMER" | "VIP_CUSTOMER")}
                  className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                >
                  <option value="CUSTOMER">Standard Patron</option>
                  <option value="VIP_CUSTOMER">VIP Connoisseur / Bespoke Tier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Private Telephone Line
                </label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+41 22 555 0192"
                  className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Concierge & Preference Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Collector preferences, favorite complications, preferred delivery instructions..."
                  rows={4}
                  className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
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
                  disabled={isUpdating}
                  className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-5"
                >
                  {isUpdating ? "Saving..." : "Save Patron Details"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
}
