"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye,
  FileText,
  CreditCard,
  MapPin,
  User,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface OrderCustomer {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    notes?: string | null;
  } | null;
}

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  unitPrice: number | string;
  quantity: number;
  total: number | string;
  product?: {
    id: string;
    name: string;
    images?: { url: string }[];
  } | null;
}

interface OrderAddress {
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
}

interface OrderPayment {
  id: string;
  provider: string;
  transactionId?: string | null;
  amount: number | string;
  status: string;
  paymentMethod?: string | null;
}

interface OrderShipment {
  id: string;
  carrier: string;
  trackingNumber?: string | null;
  status: string;
  dispatchedAt?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  guestEmail?: string | null;
  status: string;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  tax: number | string;
  total: number | string;
  paymentMethod?: string | null;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  customer?: OrderCustomer | null;
  shippingAddress?: OrderAddress | null;
  billingAddress?: OrderAddress | null;
  items: OrderItem[];
  payments: OrderPayment[];
  shipments: OrderShipment[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [paymentFilter, setPaymentFilter] = React.useState("ALL");

  // Selected order for detailed drawer/modal
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Form edit state inside order details modal
  const [editStatus, setEditStatus] = React.useState("");
  const [editPaymentStatus, setEditPaymentStatus] = React.useState("");
  const [editTrackingNumber, setEditTrackingNumber] = React.useState("");
  const [editCarrier, setEditCarrier] = React.useState("");
  const [editNotes, setEditNotes] = React.useState("");

  const [notification, setNotification] = React.useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (paymentFilter !== "ALL") params.append("paymentStatus", paymentFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.orders) {
        setOrders(json.orders);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, paymentFilter, searchTerm]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditTrackingNumber(order.trackingNumber || "");
    setEditCarrier(order.shipments?.[0]?.carrier || "Ferrari Secure Armored Logistics");
    setEditNotes(order.notes || "");
    setIsDetailOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          paymentStatus: editPaymentStatus,
          trackingNumber: editTrackingNumber,
          carrier: editCarrier,
          notes: editNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed");

      setNotification(`Order ${selectedOrder.orderNumber} successfully updated.`);
      setTimeout(() => setNotification(null), 4000);
      setIsDetailOpen(false);
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Confirmed":
      case "Processing":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Packed":
      case "Shipped":
      case "OutForDelivery":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
      case "Returned":
      case "Refunded":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "FAILED":
      case "REFUNDED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
  };

  // Computed summary metrics
  const totalGross = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const shippedOrders = orders.filter((o) => o.status === "Shipped" || o.status === "OutForDelivery").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-gold" />
            Order Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track client acquisitions, high-security armored dispatches, and private concierge notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchOrders()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Orders
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
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Orders Found</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : orders.length}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Total matching filter</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Pending Processing</div>
          <div className="text-2xl font-light text-amber-300 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : pendingOrders}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Awaiting allocation
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">In Transit / Armored</div>
          <div className="text-2xl font-light text-sky-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : shippedOrders}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-sky-400" />
            Dispatched orders
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Volume Value</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalGross.toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Selected orders gross</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order number, client name, email, tracking..."
            className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <span className="text-[11px] text-neutral-500 px-2 font-medium uppercase">Status:</span>
            {["ALL", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === s
                    ? "bg-gold text-black font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <span className="text-[11px] text-neutral-500 px-2 font-medium uppercase">Payment:</span>
            {["ALL", "PAID", "PENDING"].map((p) => (
              <button
                key={p}
                onClick={() => setPaymentFilter(p)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  paymentFilter === p
                    ? "bg-neutral-800 text-white font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
              <tr>
                <th className="py-4 px-6 font-medium">Order #</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Client / Patron</th>
                <th className="py-4 px-6 font-medium">Pieces</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium">Payment</th>
                <th className="py-4 px-6 font-medium">Fulfillment</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-36" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No client orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const clientName = order.customer?.profile
                    ? `${order.customer.profile.firstName || ""} ${order.customer.profile.lastName || ""}`.trim()
                    : order.shippingAddress
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                    : order.guestEmail || "Patron";

                  const clientEmail = order.customer?.email || order.guestEmail || "N/A";
                  const itemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-medium text-gold">
                          {order.orderNumber}
                        </span>
                        {order.trackingNumber && (
                          <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                            <Truck className="h-3 w-3" />
                            {order.trackingNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-neutral-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-white text-xs">{clientName}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                          {clientEmail}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-neutral-300">
                        {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                      </td>
                      <td className="py-4 px-6 font-mono font-medium text-white text-xs">
                        ${Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getPaymentBadge(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenDetail(order)}
                          className="h-8 bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-gold hover:text-black hover:border-gold transition-colors text-xs font-medium"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Drawer Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <div className="p-6 space-y-6 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-light text-white">Order {selectedOrder.orderNumber}</h2>
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toUTCString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400">Total Client Invoice</div>
                  <div className="text-2xl font-light text-gold font-mono">
                    ${Number(selectedOrder.total).toLocaleString()} USD
                  </div>
                </div>
              </div>

              {/* Grid: Client & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Card */}
                <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 space-y-2 text-xs">
                  <div className="text-neutral-400 font-medium uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gold" />
                    Patron Profile
                  </div>
                  <div className="text-white font-medium text-sm">
                    {selectedOrder.customer?.profile
                      ? `${selectedOrder.customer.profile.firstName || ""} ${selectedOrder.customer.profile.lastName || ""}`.trim()
                      : selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName}`
                      : "Anonymous Patron"}
                  </div>
                  <div className="text-neutral-300">{selectedOrder.customer?.email || selectedOrder.guestEmail}</div>
                  <div className="text-neutral-400">
                    Phone: {selectedOrder.shippingAddress?.phone || selectedOrder.customer?.profile?.phone || "Not recorded"}
                  </div>
                  {selectedOrder.customer?.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 text-[10px] uppercase font-mono">
                      {selectedOrder.customer.role}
                    </span>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 space-y-2 text-xs">
                  <div className="text-neutral-400 font-medium uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    Delivery Destination
                  </div>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-neutral-300 leading-relaxed">
                      <div className="text-white font-medium">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </div>
                      <div>{selectedOrder.shippingAddress.street1}</div>
                      {selectedOrder.shippingAddress.street2 && <div>{selectedOrder.shippingAddress.street2}</div>}
                      <div>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div className="text-white font-medium mt-1">{selectedOrder.shippingAddress.country}</div>
                    </div>
                  ) : (
                    <div className="text-neutral-500">No physical shipping address provided.</div>
                  )}
                </div>

                {/* Payment Breakdown */}
                <div className="p-4 rounded-xl border border-white/5 bg-neutral-900/60 space-y-2 text-xs">
                  <div className="text-neutral-400 font-medium uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-gold" />
                    Payment Settlement
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Payment Status:</span>
                    <span className="font-mono text-white">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">${Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Discounts:</span>
                    <span className="font-mono text-emerald-400">-${Number(selectedOrder.discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Armored Courier:</span>
                    <span className="font-mono text-white">
                      {Number(selectedOrder.shipping) === 0 ? "Complimentary" : `$${Number(selectedOrder.shipping).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-medium border-t border-white/5 pt-2">
                    <span>Total Amount:</span>
                    <span className="font-mono text-gold">${Number(selectedOrder.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-gold" />
                  Acquired Timepieces & Fragrances ({selectedOrder.items.length})
                </h3>

                <div className="border border-white/5 rounded-xl bg-neutral-900/40 divide-y divide-white/5 overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                          {item.product?.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-neutral-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.productName}</div>
                          <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
                            SKU: {item.productSku}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-white font-medium">
                          ${Number(item.total).toLocaleString()}
                        </div>
                        <div className="text-neutral-500 text-[11px]">
                          {item.quantity} × ${Number(item.unitPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update & Concierge Form */}
              <form onSubmit={handleUpdateOrder} className="border-t border-white/10 pt-5 space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Concierge Status & Logistics Controls
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Order Fulfillment Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing (Vault Allocation)</option>
                      <option value="Packed">Packed in Vault</option>
                      <option value="Shipped">Shipped (Ferrari Courier In Transit)</option>
                      <option value="OutForDelivery">Out For Delivery</option>
                      <option value="Delivered">Delivered & Signed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Payment Settlement Status
                    </label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Armored Courier / Logistics Partner
                    </label>
                    <Input
                      value={editCarrier}
                      onChange={(e) => setEditCarrier(e.target.value)}
                      placeholder="e.g. Ferrari Secure Armored Logistics, Malca-Amit"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Tracking / Waybill Number
                    </label>
                    <Input
                      value={editTrackingNumber}
                      onChange={(e) => setEditTrackingNumber(e.target.value)}
                      placeholder="e.g. FSI-99482-CH, MALCA-88320"
                      className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Private Admin / Concierge Notes
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal client notes, special handling requirements, delivery preferences..."
                    rows={3}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDetailOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-6"
                  >
                    {isUpdating ? "Saving..." : "Save Order Modifications"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
