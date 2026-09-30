"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Globe2,
  PieChart,
  Percent,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface CategoryStat {
  name: string;
  revenue: number;
  units: number;
}

interface CountryStat {
  country: string;
  count: number;
  revenue: number;
}

interface AnalyticsData {
  grossRevenue: number;
  netRevenue: number;
  totalDiscounts: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  repeatPatronRate: number;
  categoryBreakdown: CategoryStat[];
  countryBreakdown: CountryStat[];
  statusCounts: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.success && json.analytics) {
        setData(json.analytics);
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-gold" />
            Financial & Horological Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time balance ledger, department margins, geographic client distribution, and patron loyalty metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchAnalytics()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-aggregate
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Gross Revenue</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${(data?.grossRevenue || 0).toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Total invoiced client volume</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Net Revenue</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${(data?.netRevenue || 0).toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">After privilege concessions</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Avg Order Value (AOV)</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `$${(data?.averageOrderValue || 0).toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Mean transaction basket</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Repeat Patron Rate</div>
          <div className="text-2xl font-light text-sky-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : `${data?.repeatPatronRate || 0}%`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Multi-acquisition clients</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Total Concessions</div>
          <div className="text-2xl font-light text-amber-300 mt-2">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `$${(data?.totalDiscounts || 0).toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Voucher savings granted</div>
        </div>
      </div>

      {/* Main Grid: Category & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-light text-white flex items-center gap-2">
              <PieChart className="h-5 w-5 text-gold" />
              Department Volume Contribution
            </h2>
            <span className="text-xs text-neutral-400">By Gross Value</span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : !data?.categoryBreakdown || data.categoryBreakdown.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">No orders recorded yet.</div>
            ) : (
              data.categoryBreakdown.map((cat) => {
                const totalRev = data.grossRevenue || 1;
                const percentage = Math.round((cat.revenue / totalRev) * 100);

                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-white">{cat.name}</span>
                      <div className="space-x-2">
                        <span className="text-neutral-400 font-mono">{cat.units} pieces</span>
                        <span className="text-gold font-mono font-medium">${cat.revenue.toLocaleString()}</span>
                        <span className="text-neutral-500 font-mono">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="p-6 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-light text-white flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-gold" />
              Global Patron Territories
            </h2>
            <span className="text-xs text-neutral-400">Armored Delivery Hubs</span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 bg-neutral-900/40 rounded-lg flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : !data?.countryBreakdown || data.countryBreakdown.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">No shipping locations recorded.</div>
            ) : (
              data.countryBreakdown.map((loc) => (
                <div
                  key={loc.country}
                  className="p-3 bg-neutral-900/40 border border-white/5 rounded-lg flex items-center justify-between text-xs hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                    <span className="text-white font-medium">{loc.country}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-neutral-400">{loc.count} dispatches</span>
                    <span className="text-gold font-medium">${loc.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Orders Lifecycle Breakdown */}
      <div className="p-6 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-5">
        <h2 className="text-lg font-light text-white flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-gold" />
          Acquisition Fulfillment Lifecycle Distribution
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
            const count = data?.statusCounts?.[status] || 0;
            return (
              <div key={status} className="p-4 rounded-lg bg-neutral-900/50 border border-white/5 text-center">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">{status}</div>
                <div className="text-2xl font-light text-white mt-1 font-mono">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
