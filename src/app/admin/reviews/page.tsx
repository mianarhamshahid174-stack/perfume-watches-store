"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  EyeOff,
  Star,
  Trash2,
  ShieldCheck,
  Package,
  User,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  createdAt: string;
  user: {
    id: string;
    email: string;
    profile?: { firstName?: string | null; lastName?: string | null } | null;
  };
  product: {
    id: string;
    name: string;
    sku: string;
    images?: { url: string }[];
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const fetchReviews = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.reviews) {
        setReviews(json.reviews);
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT" | "HIDE" | "FEATURE" | "UNFEATURE") => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Action failed");

      setNotification(`Review updated: ${action.toLowerCase()}.`);
      setTimeout(() => setNotification(null), 3500);
      fetchReviews();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error moderating review");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");

      setNotification("Review deleted permanently.");
      setTimeout(() => setNotification(null), 3500);
      fetchReviews();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting review");
    }
  };

  // KPIs
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const featuredCount = reviews.filter((r) => r.isFeatured).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "HIDDEN":
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-gold" />
            Client Reviews & Testimonials
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Moderate connoisseur impressions, curate featured editorial testimonials, and audit feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchReviews()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Reviews</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : totalReviews}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Client impressions</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Pending Moderation</div>
          <div className="text-2xl font-light text-amber-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : pendingCount}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Awaiting editorial review</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Approved & Live</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : approvedCount}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Published on storefront</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Featured Testimonials</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : featuredCount}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Highlighted on homepage
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
            placeholder="Search comment, headline, piece, or patron email..."
            className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-gold/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Reviews" },
            { id: "PENDING", label: "Pending" },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
            { id: "HIDDEN", label: "Hidden" },
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

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 rounded-xl border border-white/5 bg-neutral-950/40">
            No client reviews found matching this filter.
          </div>
        ) : (
          reviews.map((r) => {
            const authorName = r.user.profile
              ? `${r.user.profile.firstName || ""} ${r.user.profile.lastName || ""}`.trim() || r.user.email
              : r.user.email;

            return (
              <div
                key={r.id}
                className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md hover:border-white/10 transition-colors space-y-4"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                      {r.product.images?.[0]?.url ? (
                        <img
                          src={r.product.images[0].url}
                          alt={r.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-neutral-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white text-xs">{r.product.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">SKU: {r.product.sku}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gold/15 text-gold border border-gold/30">
                        <Sparkles className="h-3 w-3" />
                        Featured Spotlight
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating & Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < r.rating ? "text-gold fill-gold" : "text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium text-xs">"{r.title}"</span>
                    {r.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Acquisition
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {r.comment}
                  </p>
                </div>

                {/* Footer & Moderation Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                  <div className="text-neutral-500 flex items-center gap-1.5 text-[11px]">
                    <User className="h-3.5 w-3.5 text-neutral-600" />
                    Patron: <span className="text-neutral-300 font-medium">{authorName}</span>
                  </div>

                  {/* Actions: approve, reject, hide, feature */}
                  <div className="flex items-center gap-2">
                    {r.status !== "APPROVED" && (
                      <Button
                        size="sm"
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleAction(r.id, "APPROVE")}
                        className="h-7 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                    )}

                    {r.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleAction(r.id, "REJECT")}
                        className="h-7 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    )}

                    {r.status !== "HIDDEN" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={actionLoadingId === r.id}
                        onClick={() => handleAction(r.id, "HIDE")}
                        className="h-7 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800"
                      >
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Hide
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={actionLoadingId === r.id}
                      onClick={() => handleAction(r.id, r.isFeatured ? "UNFEATURE" : "FEATURE")}
                      className={`h-7 text-xs ${
                        r.isFeatured
                          ? "text-gold bg-gold/10 hover:bg-gold/20"
                          : "text-neutral-400 hover:text-gold hover:bg-neutral-800"
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 mr-1 ${r.isFeatured ? "fill-gold" : ""}`} />
                      {r.isFeatured ? "Unfeature" : "Feature"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                      className="h-7 text-xs text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
