"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Package,
  Clock,
  Users,
  CheckCircle2,
  TrendingUp,
  Percent,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type DateRange = "today" | "7d" | "30d" | "90d" | "year" | "custom";

interface DashboardData {
  kpis: {
    totalRevenue: number;
    todayRevenue: number;
    monthlyRevenue: number;
    rangeRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    customers: number;
    aov: number;
    conversionRate: number;
  };
  timeSeries: Array<{ date: string; revenue: number; orders: number }>;
  topSelling: Array<{ id: string; name: string; sku: string; units: number; revenue: number }>;
  lowStock: Array<{
    id: string;
    productName: string;
    sku: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    warehouseLocation: string;
  }>;
  productPerformance: Array<{ name: string; revenue: number; share: number }>;
}

export default function AdminDashboardPage() {
  const [range, setRange] = React.useState<DateRange>("30d");
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchMetrics = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/dashboard?range=${range}`;
      if (range === "custom" && customFrom && customTo) {
        url += `&from=${encodeURIComponent(customFrom)}&to=${encodeURIComponent(customTo)}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [range, customFrom, customTo]);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-8">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-mono text-zinc-100 tracking-tight">
            Atelier Executive Overview
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Real-time financial telemetry, order velocity, and horological allocation data.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {(["today", "7d", "30d", "90d", "year", "custom"] as DateRange[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                range === tab
                  ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "today"
                ? "Today"
                : tab === "7d"
                ? "7 Days"
                : tab === "30d"
                ? "30 Days"
                : tab === "90d"
                ? "90 Days"
                : tab === "year"
                ? "This Year"
                : "Custom"}
            </button>
          ))}

          <button
            onClick={fetchMetrics}
            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Custom Date Inputs if selected */}
      {range === "custom" && (
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">From:</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">To:</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <button
            onClick={fetchMetrics}
            className="px-3 py-1 bg-zinc-200 text-zinc-950 rounded font-semibold text-xs"
          >
            Apply Range
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Revenue */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Revenue</span>
            <DollarSign className="h-3.5 w-3.5 text-gold-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-28 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-zinc-100">
              {formatCurrency(Number(data?.kpis.totalRevenue ?? 0) * 100)}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">All-time settled</p>
        </div>

        {/* Today's Revenue */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Today&apos;s Revenue</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-24 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-emerald-400">
              {formatCurrency(Number(data?.kpis.todayRevenue ?? 0) * 100)}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Since 00:00 UTC</p>
        </div>

        {/* Monthly Revenue */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Monthly Revenue</span>
            <Calendar className="h-3.5 w-3.5 text-blue-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-24 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-zinc-100">
              {formatCurrency(Number(data?.kpis.monthlyRevenue ?? 0) * 100)}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Last 30 days trailing</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Orders</span>
            <Package className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-zinc-100">
              {data?.kpis.totalOrders ?? 0}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">In selected window</p>
        </div>

        {/* Pending Orders */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Orders</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-amber-300">
              {data?.kpis.pendingOrders ?? 0}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Awaiting dispatch</p>
        </div>

        {/* Delivered Orders */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Delivered Orders</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-zinc-100">
              {data?.kpis.deliveredOrders ?? 0}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Completed logistics</p>
        </div>

        {/* Customers */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Customers</span>
            <Users className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-zinc-100">
              {data?.kpis.customers ?? 0}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Patron collectors</p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Avg Order Value</span>
            <TrendingUp className="h-3.5 w-3.5 text-gold-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-gold-400">
              {formatCurrency(Number(data?.kpis.aov ?? 0) * 100)}
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Per commission</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Conversion Rate</span>
            <Percent className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16 bg-zinc-800" />
          ) : (
            <div className="text-xl font-bold font-mono text-emerald-400">
              {data?.kpis.conversionRate ?? 0}%
            </div>
          )}
          <p className="text-[10px] text-zinc-500 font-mono">Session to acquisition</p>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Orders Over Time (Area Chart) */}
        <div className="lg:col-span-2 p-5 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold font-mono text-zinc-100">
                Revenue & Order Velocity Over Time
              </h2>
              <p className="text-[11px] text-zinc-500 font-mono">
                Daily settled volume based on active timeframe ({range.toUpperCase()})
              </p>
            </div>
            <span className="text-xs font-mono text-gold-400 font-medium">
              Window Total: {formatCurrency(Number(data?.kpis.rangeRevenue ?? 0) * 100)}
            </span>
          </div>

          {/* SVG Chart */}
          <div className="h-64 w-full flex flex-col justify-end pt-4">
            {isLoading ? (
              <Skeleton className="h-full w-full bg-zinc-800" />
            ) : data && data.timeSeries.length > 0 ? (
              (() => {
                const maxRev = Math.max(...data.timeSeries.map((t) => t.revenue), 1000);
                const points = data.timeSeries
                  .map((t, idx) => {
                    const x = (idx / Math.max(data.timeSeries.length - 1, 1)) * 100;
                    const y = 90 - (t.revenue / maxRev) * 75;
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <div className="relative h-full w-full flex flex-col justify-between">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="h-48 w-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c5a059" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#c5a059" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <polygon
                        points={`0,90 ${points} 100,90`}
                        fill="url(#revGrad)"
                      />
                      {/* Line */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#c5a059"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* X-Axis Dates */}
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800">
                      <span>{data.timeSeries[0]?.date}</span>
                      <span>{data.timeSeries[Math.floor(data.timeSeries.length / 2)]?.date}</span>
                      <span>{data.timeSeries[data.timeSeries.length - 1]?.date}</span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                No orders recorded in the specified timeframe.
              </div>
            )}
          </div>
        </div>

        {/* Product Performance / Department Breakdown */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-4">
          <div className="border-b border-zinc-800/80 pb-3">
            <h2 className="text-sm font-semibold font-mono text-zinc-100">
              Department Performance
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono">
              Share of gross atelier acquisitions
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {data?.productPerformance.map((dep) => (
              <div key={dep.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-200">{dep.name}</span>
                  <span className="text-gold-400 font-medium">{dep.share}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                    style={{ width: `${dep.share}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-mono text-right">
                  {formatCurrency(dep.revenue * 100)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Low-Stock Products & Top-Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low-Stock Products */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold font-mono text-zinc-100">
                Low-Stock Products & Complications
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-[11px] font-mono text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-zinc-500 border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-2">Product</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2 text-center">Current</th>
                  <th className="py-2 text-center">Available</th>
                  <th className="py-2 text-right">Warehouse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="py-2.5">
                        <Skeleton className="h-5 w-full bg-zinc-800" />
                      </td>
                    </tr>
                  ))
                ) : data && data.lowStock.length > 0 ? (
                  data.lowStock.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 text-zinc-200 font-medium">{item.productName}</td>
                      <td className="py-2.5 text-zinc-400 text-[11px]">{item.sku}</td>
                      <td className="py-2.5 text-center text-amber-400 font-bold">
                        {item.currentStock}
                      </td>
                      <td className="py-2.5 text-center text-zinc-300">
                        {item.availableStock}
                      </td>
                      <td className="py-2.5 text-right text-zinc-500 text-[11px]">
                        {item.warehouseLocation}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-zinc-500">
                      All vault allocations meet security reserve thresholds.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling Masterpieces */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-gold-400" />
              <h2 className="text-sm font-semibold font-mono text-zinc-100">
                Top-Selling Masterpieces
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-[11px] font-mono text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>All Orders</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-zinc-500 border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-2">Piece</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2 text-center">Units Sold</th>
                  <th className="py-2 text-right">Settled Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="py-2.5">
                        <Skeleton className="h-5 w-full bg-zinc-800" />
                      </td>
                    </tr>
                  ))
                ) : data && data.topSelling.length > 0 ? (
                  data.topSelling.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 text-zinc-200 font-medium">{item.name}</td>
                      <td className="py-2.5 text-zinc-400 text-[11px]">{item.sku}</td>
                      <td className="py-2.5 text-center text-emerald-400 font-bold">
                        {item.units}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-gold-400">
                        {formatCurrency(Number(item.revenue) * 100)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500">
                      No sales recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
