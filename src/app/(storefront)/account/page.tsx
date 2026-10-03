"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { formatPKR, usdToPKR, PAKISTAN_PROVINCES, MAJOR_PAKISTAN_CITIES } from "@/lib/currency";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  Banknote,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  X,
  ShoppingBag,
} from "lucide-react";

type AccountTab = "overview" | "orders" | "wishlist" | "addresses" | "profile" | "settings";

interface OrderDetailModalData {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  trackingNumber?: string;
  shippingAddress?: any;
  notes?: string;
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPriceUSD: number;
    unitPricePKR: number;
    totalPriceUSD: number;
    totalPricePKR: number;
    variantTitle?: string;
    imageUrl?: string;
  }>;
  pricing: {
    formattedTotalPKR: string;
    formattedSubtotalPKR: string;
    formattedDiscountPKR: string;
    formattedShippingPKR: string;
    totalUSD: number;
  };
  payment: {
    method: string;
    status: string;
    amountPKR: string;
    amountUSD: string;
    isCOD: boolean;
  };
  timeline: Array<{
    step: string;
    status: string;
    description: string;
    isDone: boolean;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") as AccountTab;

  const [activeTab, setActiveTab] = useState<AccountTab>(requestedTab || "overview");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailModalData | null>(null);
  const [orderModalLoading, setOrderModalLoading] = useState(false);

  // Wishlist context
  const { items: wishlistItems, removeItem: removeWishlistItem, moveToCart, clearWishlist } = useWishlist();
  const { openCart } = useCart();

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    street1: "",
    street2: "",
    city: "Karachi",
    state: "Sindh",
    postalCode: "74000",
    phone: "",
    isDefault: true,
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    preferredCurrency: "PKR",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Copy tracking helper
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Guest Order Tracking State
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestTrackError, setGuestTrackError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("velora_recent_orders") || "[]");
      setRecentOrders(stored);
    } catch {}
  }, []);

  // Load account
  const loadAccount = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setUserData(null);
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        setProfileForm({
          firstName: data.user.profile?.firstName || "",
          lastName: data.user.profile?.lastName || "",
          phone: data.user.profile?.phone || "",
          preferredCurrency: data.user.profile?.preferredCurrency || "PKR",
        });
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.warn("Account fetch notice (guest mode active):", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Open Full Order Details
  const handleViewOrderDetails = async (orderIdOrNumber: string) => {
    try {
      setOrderModalLoading(true);
      const res = await fetch(`/api/orders/${orderIdOrNumber}`);
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      console.error("Failed to load order details:", err);
    } finally {
      setOrderModalLoading(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess(true);
        loadAccount();
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSubmitting(true);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddressModal(false);
        loadAccount();
        setNewAddress({
          firstName: "",
          lastName: "",
          street1: "",
          street2: "",
          city: "Karachi",
          state: "Sindh",
          postalCode: "74000",
          phone: "",
          isDefault: false,
        });
      }
    } catch (err) {
      console.error("Address error:", err);
    } finally {
      setAddressSubmitting(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery sanctuary?")) return;
    try {
      await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
      loadAccount();
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const copyTrackingToClipboard = (trk: string) => {
    navigator.clipboard.writeText(trk);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-foreground pt-36 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-600 dark:text-gold-300">
            Loading account details...
          </p>
        </div>
      </div>
    );
  }

  // GUEST CUSTOMER PORTAL (When not logged in)
  if (!userData) {
    return (
      <div className="min-h-screen bg-obsidian text-foreground pt-28 pb-24 transition-colors duration-300">
        <Container size="wide">
          {/* Guest Header Banner */}
          <div className="bg-card border border-border p-6 sm:p-10 mb-8 rounded-none shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-sans font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guest Mode Active • No Login Required</span>
                  </span>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-foreground font-light">
                  Customer Order Center
                </h1>
                <p className="text-xs sm:text-sm text-neutral-stone font-light max-w-2xl">
                  At VELORA Pakistan, you can freely browse, place orders with Cash on Delivery (COD), and track courier dispatches without having to log in or create an account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/watches"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Watches</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-gold-500 text-xs font-mono uppercase tracking-wider text-foreground transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold-500" />
                  <span>Member Sign In</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Track Order Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400">
                  <Truck className="w-5 h-5" />
                  <h3 className="font-serif-luxury text-xl text-foreground font-medium">
                    Track Your Order
                  </h3>
                </div>
                <p className="text-xs text-neutral-stone font-light">
                  Enter your VELORA order reference number (e.g. <span className="font-mono text-gold-600 dark:text-gold-400">VEL-PK-2026-XXXX</span>) to view real-time delivery status, courier tracking, and parcel verification.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!guestOrderNumber.trim()) {
                      setGuestTrackError("Please enter your order reference number.");
                      return;
                    }
                    router.push(`/order-confirmation/${guestOrderNumber.trim().toUpperCase()}`);
                  }}
                  className="space-y-3 pt-2"
                >
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-stone">
                      Order Reference Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VEL-PK-2026-1234"
                      value={guestOrderNumber}
                      onChange={(e) => {
                        setGuestOrderNumber(e.target.value);
                        setGuestTrackError(null);
                      }}
                      className="w-full h-11 bg-background border border-border px-4 text-sm text-foreground placeholder:text-neutral-400 focus:outline-none focus:border-gold-500 font-mono"
                    />
                    {guestTrackError && (
                      <p className="text-xs text-rose-500 mt-1">{guestTrackError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-metallic hover:bg-gold-500 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Track Shipment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-neutral-stone">
                  <span>Courier Partners: TCS, Leopard, Trax</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open-Parcel Delivery</span>
                </div>
              </div>

              {/* Customer Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-card border border-border space-y-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold-500" />
                  <h4 className="text-xs font-semibold text-foreground">5-Year Official Warranty</h4>
                  <p className="text-[11px] text-neutral-stone font-light leading-relaxed">
                    Every timepiece comes with an authorized warranty card valid across Pakistan.
                  </p>
                </div>
                <div className="p-4 bg-card border border-border space-y-1.5">
                  <Banknote className="w-4 h-4 text-gold-500" />
                  <h4 className="text-xs font-semibold text-foreground">Cash on Delivery</h4>
                  <p className="text-[11px] text-neutral-stone font-light leading-relaxed">
                    Pay only after inspecting your parcel upon arrival at your doorstep.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Recent Orders & Saved Wishlist */}
            <div className="lg:col-span-6 space-y-6">
              {recentOrders.length > 0 ? (
                <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400">
                      <Clock className="w-4 h-4" />
                      <h3 className="font-serif-luxury text-xl text-foreground font-medium">
                        Recent Orders on this Device
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-neutral-stone">
                      {recentOrders.length} {recentOrders.length === 1 ? "Order" : "Orders"}
                    </span>
                  </div>

                  <div className="divide-y divide-border space-y-2">
                    {recentOrders.map((ord: any, idx: number) => (
                      <div key={idx} className="pt-3 pb-2 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-semibold text-gold-600 dark:text-gold-400 block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-neutral-stone block">
                            {new Date(ord.createdAt).toLocaleDateString("en-PK", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })} • {ord.paymentMethod || "COD"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-semibold text-foreground block">
                            Rs. {Number(ord.totalPKR || 0).toLocaleString()}
                          </span>
                          <Link
                            href={`/order-confirmation/${ord.orderNumber}`}
                            className="text-[10px] font-mono uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400">
                    <Heart className="w-5 h-5" />
                    <h3 className="font-serif-luxury text-xl text-foreground font-medium">
                      Saved Wishlist Pieces
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-stone font-light">
                    {wishlistItems.length > 0
                      ? `You have ${wishlistItems.length} saved piece(s) in your personal collection.`
                      : "You have not saved any watches or fragrances yet."}
                  </p>
                  {wishlistItems.length > 0 ? (
                    <div className="pt-2">
                      <Link
                        href="/wishlist"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-background hover:bg-muted border border-border text-xs font-mono uppercase tracking-wider text-foreground transition-colors"
                      >
                        <span>View Wishlist ({wishlistItems.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Link
                        href="/watches"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:underline"
                      >
                        <span>Browse Watches</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Direct WhatsApp Concierge Help */}
              <div className="bg-card border border-border p-6 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold block">
                  Need Assistance?
                </span>
                <p className="text-xs text-neutral-stone font-light leading-relaxed">
                  Our Pakistan concierge is on standby to assist with order status, customization, or private showroom visits in Lahore, Karachi, and Islamabad.
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    <span>WhatsApp: +92 300 1234567</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const isVip = userData.role === "VIP_CUSTOMER";
  const ordersList = userData.orders || [];
  const defaultAddress = userData.addresses?.find((a: any) => a.isDefault) || userData.addresses?.[0];

  const tabs: Array<{ id: AccountTab; label: string; icon: any; count?: number }> = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package, count: ordersList.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "addresses", label: "Addresses", icon: MapPin, count: userData.addresses?.length },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-foreground pt-28 pb-24 selection:bg-gold-500/20 selection:text-gold-200 transition-colors duration-300">
      <Container size="wide">
        {/* Account Header */}
        <div className="bg-card border border-border p-6 sm:p-10 mb-8 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-400">
                  VELORA Account #VEL-{userData.id.slice(-6).toUpperCase()}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-gold-950 border border-gold-500/40 text-gold-300 rounded-full">
                  {isVip ? "VIP Member" : "Registered Member"}
                </span>
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl text-sand-50 font-light">
                Welcome, {userData.profile?.firstName || "Member"}{" "}
                {userData.profile?.lastName || ""}
              </h1>
              <p className="text-xs text-neutral-400 font-light">
                Email: <span className="text-sand-100 font-mono">{userData.email}</span> • Currency: PKR (₨)
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-gold-400 text-xs font-mono uppercase tracking-wider text-sand-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-gold-400" />
              <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* 6 Tabs Navigation Bar */}
        <div className="border-b border-white/10 mb-10 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-6 min-w-max pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? "border-gold-400 text-gold-300 font-semibold"
                      : "border-transparent text-neutral-400 hover:text-sand-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-gold-400 text-obsidian font-bold"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Total Orders
                </span>
                <div className="font-mono text-2xl text-sand-50 font-light">
                  {ordersList.length}
                </div>
                <span className="text-[11px] text-neutral-500 font-light">
                  All-time orders placed
                </span>
              </div>

              <div className="p-6 bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block">
                  Active Orders
                </span>
                <div className="font-mono text-2xl text-gold-300 font-light">
                  {ordersList.filter((o: any) => o.status !== "Delivered").length}
                </div>
                <span className="text-[11px] text-neutral-500 font-light">
                  In transit across Pakistan
                </span>
              </div>

              <div className="p-6 bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Wishlist
                </span>
                <div className="font-mono text-2xl text-sand-50 font-light">
                  {wishlistItems.length}
                </div>
                <span className="text-[11px] text-neutral-500 font-light">
                  Saved items
                </span>
              </div>

              <div className="p-6 bg-neutral-950 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Default Address
                </span>
                <div className="font-serif-luxury text-base text-sand-50 truncate">
                  {defaultAddress ? `${defaultAddress.city}, Pakistan` : "None Saved"}
                </div>
                <span className="text-[11px] text-neutral-500 font-light truncate block">
                  {defaultAddress ? defaultAddress.street1 : "Add a delivery address"}
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-xl text-sand-50">
                    Recent Orders
                  </h3>
                  <p className="text-xs text-neutral-400 font-light">
                    Check order status, tracking numbers, and delivery details.
                  </p>
                </div>
                {ordersList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-mono text-gold-400 hover:text-gold-300 uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>View All ({ordersList.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {ordersList.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <Package className="w-10 h-10 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400 font-light">
                    You have not placed any orders yet.
                  </p>
                  <Link
                    href="/watches"
                    className="inline-block px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersList.slice(0, 3).map((ord: any) => {
                    const totalUSD = Number(ord.total);
                    const totalPKR = usdToPKR(totalUSD);

                    return (
                      <div
                        key={ord.id}
                        className="p-5 bg-neutral-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-gold-300 font-semibold">
                              {ord.orderNumber}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-gold-950 text-gold-400 border border-gold-500/20 rounded-full">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} Item(s)
                          </p>
                          {ord.trackingNumber && (
                            <span className="text-[10px] font-mono text-neutral-500 block">
                              Tracking: {ord.trackingNumber}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-mono text-base text-sand-50 font-medium">
                              {formatPKR(totalPKR)}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              ${totalUSD.toLocaleString()} USD
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleViewOrderDetails(ord.orderNumber || ord.id)}
                            className="px-4 py-2 border border-white/20 hover:border-gold-400 text-xs font-mono uppercase tracking-wider text-sand-200 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS (WITH FULL ORDER DETAILS MODAL / DRAWER) */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-serif-luxury text-2xl text-sand-50">
                  Your Orders
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  View your complete order history, payment status, and delivery tracking across Pakistan.
                </p>
              </div>
            </div>

            {ordersList.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 border border-white/10 space-y-4">
                <Package className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-serif-luxury text-lg text-sand-100">No Orders Found</h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  You haven't ordered any watches or fragrances yet.
                </p>
                <div className="pt-2">
                  <Link
                    href="/watches"
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider inline-block"
                  >
                    Shop Watches
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.map((ord: any) => {
                  const totalUSD = Number(ord.total);
                  const totalPKR = usdToPKR(totalUSD);

                  return (
                    <div
                      key={ord.id}
                      className="bg-neutral-950 border border-white/10 p-6 space-y-4 hover:border-gold-500/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base text-gold-300 font-semibold tracking-wide">
                              {ord.orderNumber}
                            </span>
                            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-gold-500/10 text-gold-300 border border-gold-500/30 rounded-sm">
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            Placed: {new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-mono text-lg text-sand-50 font-semibold">
                              {formatPKR(totalPKR)}
                            </div>
                            <div className="text-xs font-mono text-neutral-500">
                              Approx. ${totalUSD.toLocaleString()} USD
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleViewOrderDetails(ord.orderNumber || ord.id)}
                            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-sand-100 border border-white/20 hover:border-gold-400 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View Order Details
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2 text-xs">
                        {ord.items?.map((it: any) => (
                          <div key={it.id} className="flex justify-between items-center text-neutral-300">
                            <span>
                              {it.productName}{" "}
                              <span className="text-neutral-500 font-mono text-[10px]">
                                (x{it.quantity})
                              </span>
                            </span>
                            <span className="font-mono text-neutral-400">
                              {formatPKR(usdToPKR(Number(it.unitPrice) * it.quantity))}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Quick Waybill note */}
                      {ord.trackingNumber && (
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-gold-400" />
                            <span>Tracking: {ord.trackingNumber}</span>
                          </div>
                          <span className="text-emerald-400 text-[11px]">
                            Tracked Express Delivery
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WISHLIST (CONNECTED WITH useWishlist()) */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-serif-luxury text-2xl text-sand-50">
                  My Wishlist
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Saved pieces are synchronized with your account across all your devices.
                </p>
              </div>

              {wishlistItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs font-mono text-neutral-500 hover:text-rose-400 uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>

            {wishlistItems.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 border border-white/10 space-y-4">
                <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-serif-luxury text-lg text-sand-100">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  Click the heart icon on any timepiece or extrait de parfum to save it for your private collection.
                </p>
                <div className="pt-2">
                  <Link
                    href="/watches"
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider inline-block"
                  >
                    Explore Watches
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => {
                  const itemPricePKR = usdToPKR(item.price);

                  return (
                    <div
                      key={item.id}
                      className="bg-neutral-950 border border-white/10 group flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <button
                          type="button"
                          onClick={() => removeWishlistItem(item.productId)}
                          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-rose-950 text-neutral-300 hover:text-rose-300 border border-white/10 transition-colors"
                          title="Remove from Wishlist"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-gold-400">
                            REF. {item.sku}
                          </span>
                          <h4 className="font-serif-luxury text-base text-sand-50 truncate">
                            {item.name}
                          </h4>
                          <div className="pt-1">
                            <span className="font-mono text-gold-300 text-sm font-semibold">
                              {formatPKR(itemPricePKR)}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500 ml-2">
                              ${item.price.toLocaleString()} USD
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              moveToCart(item.productId);
                              openCart();
                            }}
                            className="flex-1 h-10 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Bag</span>
                          </button>

                          <Link
                            href={`/product/${item.slug || item.productId}`}
                            className="px-3 h-10 border border-white/20 hover:border-white/40 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                            title="Inspect Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-serif-luxury text-2xl text-sand-50">
                  Delivery Addresses (Pakistan)
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Manage your saved delivery locations across Karachi, Lahore, Islamabad, and all cities in Pakistan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {(!userData.addresses || userData.addresses.length === 0) ? (
              <div className="p-12 text-center bg-neutral-950 border border-white/10 space-y-4">
                <MapPin className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-serif-luxury text-lg text-sand-100">
                  No Saved Addresses
                </h3>
                <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
                  Add your shipping address in Pakistan for faster order checkout.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="px-6 py-2.5 border border-gold-400 text-gold-300 hover:bg-gold-500/10 text-xs font-mono uppercase tracking-wider inline-block cursor-pointer"
                  >
                    + Add Address
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.addresses.map((addr: any) => (
                  <div
                    key={addr.id}
                    className="p-6 bg-neutral-950 border border-white/10 space-y-4 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold-400" />
                        <span className="font-mono text-xs uppercase tracking-wider text-sand-50 font-semibold">
                          {addr.type} Address
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-gold-950 border border-gold-500/30 text-gold-300 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1 text-neutral-300">
                      <p className="text-sand-100 font-medium">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p>{addr.street1}</p>
                      {addr.street2 && <p>{addr.street2}</p>}
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-neutral-400">{addr.country}</p>
                      {addr.phone && (
                        <p className="text-neutral-500 font-mono pt-1">Tel: {addr.phone}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-serif-luxury text-2xl text-sand-50">Profile Details</h2>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Update your personal information and contact details.
              </p>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profile details updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, firstName: e.target.value })
                    }
                    className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, lastName: e.target.value })
                    }
                    className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Direct Email Address (Non-editable)
                </label>
                <input
                  type="email"
                  disabled
                  value={userData.email}
                  className="w-full h-11 bg-neutral-900/50 border border-white/5 px-4 text-sm text-neutral-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Telephone Contact (Pakistan)
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Preferred Currency
                </label>
                <select
                  value={profileForm.preferredCurrency}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, preferredCurrency: e.target.value })
                  }
                  className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-xs text-sand-50 focus:outline-none focus:border-gold-400"
                >
                  <option value="PKR">Pakistani Rupee (PKR - ₨)</option>
                  <option value="USD">United States Dollar (USD - $)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-8 h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  {profileSaving ? "Preserving Changes..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-8">
            {/* Security Section */}
            <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Lock className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif-luxury text-xl text-sand-50">Account Security</h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <p className="text-neutral-400 font-light leading-relaxed">
                  Your session is protected with 256-bit SSL encryption. To update your password, request a secure reset link.
                </p>
                <Link
                  href="/forgot-password"
                  className="inline-block px-5 py-2.5 border border-white/20 hover:border-gold-400 text-xs font-mono uppercase tracking-wider text-sand-200 transition-colors"
                >
                  Request Password Reset Link
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif-luxury text-xl text-sand-50">Notification Preferences</h3>
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center justify-between p-3 bg-neutral-900 border border-white/10">
                  <span className="text-sand-100">SMS Delivery Updates (Pakistan)</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-gold-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-neutral-900 border border-white/10">
                  <span className="text-sand-100">Email Newsletters & Release Announcements</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-gold-500"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* FULL ORDER DETAILS MODAL / TIMELINE POPUP */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-neutral-950 border border-gold-500/30 p-6 sm:p-8 my-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400">
                      Order Details
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-gold-950 text-gold-300 border border-gold-500/20 rounded-full">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-2xl text-sand-50 font-light mt-1">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 6-Stage Timeline */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Delivery Timeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {selectedOrder.timeline?.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-3 border text-xs space-y-1 ${
                        step.isDone
                          ? "bg-gold-950/20 border-gold-500/40"
                          : "bg-neutral-900/40 border-white/5 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-gold-400">0{sIdx + 1}</span>
                        {step.isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-neutral-600" />
                        )}
                      </div>
                      <div className="font-serif-luxury text-sand-100 text-[11px] leading-snug">
                        {step.step}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-light line-clamp-2">
                        {step.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Products */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Order Items ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-white/10 border-t border-b border-white/10">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="py-3 flex gap-4 text-xs items-center">
                      <div className="w-16 h-20 bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                        <img
                          src={it.imageUrl || "/images/velora-signature-01.jpg"}
                          alt={it.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <span className="text-[9px] font-mono text-gold-400">
                          REF. {it.productSku}
                        </span>
                        <h4 className="font-serif-luxury text-sm text-sand-50 truncate">
                          {it.productName}
                        </h4>
                        {it.variantTitle && (
                          <p className="text-[10px] text-neutral-400">{it.variantTitle}</p>
                        )}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-neutral-400 font-mono text-[10px]">
                            Qty: {it.quantity}
                          </span>
                          <span className="font-mono text-gold-300 font-medium">
                            {formatPKR(it.totalPricePKR)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2-Column: Destination & Safe Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Shipping & Tracking */}
                <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-gold-400">
                    <MapPin className="w-4 h-4" />
                    <span className="font-serif-luxury text-sand-100 text-sm">
                      Shipping Address
                    </span>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div className="text-neutral-300 text-[11px] space-y-0.5 font-sans">
                      <div>
                        {selectedOrder.shippingAddress.firstName}{" "}
                        {selectedOrder.shippingAddress.lastName}
                      </div>
                      <div>{selectedOrder.shippingAddress.street1}</div>
                      <div>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div className="text-neutral-400 font-mono">
                        {selectedOrder.shippingAddress.country}
                      </div>
                    </div>
                  )}

                  {selectedOrder.trackingNumber && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Tracking Number
                      </span>
                      <div className="flex items-center justify-between p-2 bg-neutral-950 border border-white/10">
                        <span className="font-mono text-xs text-gold-300 font-semibold truncate mr-2">
                          {selectedOrder.trackingNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyTrackingToClipboard(selectedOrder.trackingNumber!)}
                          className="text-neutral-400 hover:text-gold-300 p-1"
                        >
                          {copiedTracking ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500">
                        Express Courier Logistics (Pakistan)
                      </span>
                    </div>
                  )}
                </div>

                {/* Safe Payment Information */}
                <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-gold-400">
                    <Banknote className="w-4 h-4" />
                    <span className="font-serif-luxury text-sand-100 text-sm">
                      Payment Details
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] font-sans">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Method:</span>
                      <span className="text-sand-100 font-mono uppercase font-semibold">
                        {selectedOrder.payment.method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Status:</span>
                      <span className="text-emerald-400 font-mono">
                        {selectedOrder.payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total:</span>
                      <span className="text-gold-300 font-mono font-semibold text-xs">
                        {selectedOrder.pricing.formattedTotalPKR}
                      </span>
                    </div>
                    {selectedOrder.payment.isCOD && (
                      <div className="p-2 bg-gold-950/30 border border-gold-500/20 text-[10px] text-neutral-300">
                        Cash on Delivery: Payment due upon physical delivery of parcel.
                      </div>
                    )}
                    <div className="text-[9px] text-neutral-500 pt-1 border-t border-white/5">
                      No card numbers, CVVs, or secret payment credentials stored.
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-sand-100 border border-white/20 text-xs font-mono uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD ADDRESS MODAL */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-neutral-950 border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-serif-luxury text-xl text-sand-50">
                  Add Delivery Address (Pakistan)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.firstName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, firstName: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.lastName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, lastName: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Province *
                    </label>
                    <select
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    >
                      {PAKISTAN_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      City *
                    </label>
                    <select
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    >
                      {MAJOR_PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Street Address & Area / Phase *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14-C, Khayaban-e-Tanzeem, Phase 5, DHA"
                    value={newAddress.street1}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street1: e.target.value })
                    }
                    className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="74000"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="w-full h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, isDefault: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-gold-500"
                    />
                    <span>Set as default delivery address</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSubmitting}
                    className="px-6 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-wider"
                  >
                    {addressSubmitting ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
