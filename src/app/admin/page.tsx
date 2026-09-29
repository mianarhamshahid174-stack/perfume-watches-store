import prisma from "@/lib/prisma";
import { AdminStatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Clock,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. Query live database metrics from PostgreSQL
  const [totalProducts, totalOrders, orders, vipCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { include: { profile: true } },
        items: true,
        shipments: true,
      },
    }),
    prisma.user.count({ where: { role: "VIP_CUSTOMER" } }),
  ]);

  // Calculate live gross total from orders
  const totalGrossResult = await prisma.order.aggregate({
    _sum: { total: true },
  });
  const grossRevenue = Number(totalGrossResult._sum.total ?? 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 font-mono tracking-tight">
            VELORA Atelier Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status of vault allocations, horological assembly, and high-value orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="h-3.5 w-3.5" />
              Manage Catalog Pieces
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Gross Atelier Orders"
          value={formatCurrency(grossRevenue * 100)}
          trend={{ value: "PostgreSQL Live", isPositive: true }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <AdminStatCard
          title="Active Vault Orders"
          value={totalOrders.toString()}
          subtext="Allocated in database"
          icon={<Package className="h-4 w-4" />}
        />
        <AdminStatCard
          title="Catalog Masterpieces"
          value={totalProducts.toString()}
          subtext="Timepieces & Parfums"
          icon={<Clock className="h-4 w-4" />}
        />
        <AdminStatCard
          title="VIP Patron Collectors"
          value={vipCount.toString()}
          trend={{ value: "High Net-Worth", isPositive: true }}
          icon={<MessageSquare className="h-4 w-4" />}
        />
      </div>

      {/* Recent High-Security Orders */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 font-mono">
              Live Vault Orders & White-Glove Shipments
            </h2>
            <p className="text-xs text-zinc-500">
              Queried directly from PostgreSQL database records.
            </p>
          </div>
          <span className="inline-flex items-center text-xs text-zinc-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-400" />
            Vault Armed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-zinc-500 border-b border-zinc-800/60 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 font-normal">Order #</th>
                <th className="py-2.5 font-normal">Collector</th>
                <th className="py-2.5 font-normal">Piece / Items</th>
                <th className="py-2.5 font-normal">Total</th>
                <th className="py-2.5 font-normal">Status</th>
                <th className="py-2.5 font-normal">Courier / Tracking</th>
                <th className="py-2.5 font-normal text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.length > 0 ? (
                orders.map((ord) => {
                  const clientName = ord.customer?.profile
                    ? `${ord.customer.profile.firstName} ${ord.customer.profile.lastName}`
                    : ord.guestEmail || "Collector";
                  const primaryItem = ord.items[0]?.productName || "Commissioned Piece";
                  const carrier = ord.shipments[0]?.carrier || "Armored Logistics";

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 font-mono font-medium text-zinc-200">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 text-zinc-300">{clientName}</td>
                      <td className="py-3 text-zinc-400 max-w-[200px] truncate">
                        {primaryItem}
                        {ord.items.length > 1 && ` (+${ord.items.length - 1} more)`}
                      </td>
                      <td className="py-3 font-mono font-semibold text-gold-400">
                        {formatCurrency(Number(ord.total) * 100)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            ord.status === "Confirmed"
                              ? "gold"
                              : ord.status === "Delivered"
                              ? "emerald"
                              : "silver"
                          }
                        >
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-zinc-400">
                        {carrier}
                      </td>
                      <td className="py-3 text-right text-zinc-500 font-mono">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-500 font-mono">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
