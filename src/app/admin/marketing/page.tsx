"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone,
  Tag,
  Crown,
  DollarSign,
  TrendingUp,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  RefreshCw,
  Award,
} from "lucide-react";

interface CampaignItem {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  redemptions: number;
  usageLimit?: number | null;
  revenueGenerated: number;
  discountGranted: number;
  isActive: boolean;
  expiresAt?: string | null;
}

interface MarketingData {
  campaignStats: CampaignItem[];
  vipPatronsCount: number;
  standardPatronsCount: number;
  featuredTestimonialsCount: number;
}

export default function AdminMarketingPage() {
  const [data, setData] = React.useState<MarketingData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchMarketing = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/marketing");
      const json = await res.json();
      if (json.success && json.marketing) {
        setData(json.marketing);
      }
    } catch (err) {
      console.error("Marketing fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMarketing();
  }, [fetchMarketing]);

  const totalCampaignRevenue =
    data?.campaignStats.reduce((sum, c) => sum + c.revenueGenerated, 0) || 0;
  const totalDiscountsGranted =
    data?.campaignStats.reduce((sum, c) => sum + c.discountGranted, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-gold" />
            Marketing & VIP Connoisseur Campaigns
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track private invitation redemptions, campaign gross yield, and private viewing salon invitations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchMarketing()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/discounts">
            <Button className="bg-gold hover:bg-gold-light text-black font-medium">
              <Tag className="h-4 w-4 mr-2" />
              Configure Vouchers
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Campaign Gross Volume</div>
          <div className="text-2xl font-light text-gold mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalCampaignRevenue.toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Generated via promotional codes</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Concessions Incurred</div>
          <div className="text-2xl font-light text-white mt-2">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `$${totalDiscountsGranted.toLocaleString()}`}
          </div>
          <div className="text-xs text-neutral-400 mt-1">Total patron value conceded</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">VIP Patron Cohort</div>
          <div className="text-2xl font-light text-amber-300 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : data?.vipPatronsCount || 0}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Crown className="h-3.5 w-3.5 text-amber-300" />
            Privileged connoisseur members
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          <div className="text-xs tracking-wider uppercase text-neutral-500 font-medium">Featured Proofs</div>
          <div className="text-2xl font-light text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-8 w-16" /> : data?.featuredTestimonialsCount || 0}
          </div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Spotlighted editorial reviews
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden space-y-4 p-6">
        <h2 className="text-lg font-light text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          Active Promotion & Invitation Code Yield
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase tracking-wider text-neutral-400 border-b border-white/5">
              <tr>
                <th className="py-4 px-4 font-medium">Campaign / Code</th>
                <th className="py-4 px-4 font-medium">Type</th>
                <th className="py-4 px-4 font-medium text-center">Redemptions</th>
                <th className="py-4 px-4 font-medium">Revenue Generated</th>
                <th className="py-4 px-4 font-medium">Discounts Given</th>
                <th className="py-4 px-4 font-medium">Yield Multiple</th>
                <th className="py-4 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="py-4 px-4 text-right"><Skeleton className="h-6 w-16 ml-auto rounded-full" /></td>
                  </tr>
                ))
              ) : !data?.campaignStats || data.campaignStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No marketing campaigns configured yet.
                  </td>
                </tr>
              ) : (
                data.campaignStats.map((camp) => {
                  const multiple =
                    camp.discountGranted > 0
                      ? (camp.revenueGenerated / camp.discountGranted).toFixed(1)
                      : camp.revenueGenerated > 0
                      ? "∞"
                      : "—";

                  return (
                    <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm font-medium text-gold">{camp.code}</div>
                        <div className="text-[11px] text-neutral-400">{camp.description}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-neutral-300">
                        {camp.discountType}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-xs">
                        <span className="text-white font-medium">{camp.redemptions}</span>
                        <span className="text-neutral-500"> / {camp.usageLimit || "∞"}</span>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-white text-xs">
                        ${camp.revenueGenerated.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono text-amber-300/90 text-xs">
                        -${camp.discountGranted.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-xs">
                        {multiple !== "—" ? `${multiple}×` : multiple}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            camp.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-neutral-800 text-neutral-400 border-neutral-700"
                          }`}
                        >
                          {camp.isActive ? "Active" : "Paused"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Salons & Concierge Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-gold font-mono">Salon Geneva</span>
            <Award className="h-4 w-4 text-gold" />
          </div>
          <h3 className="text-white font-medium text-sm">Rue du Rhône Private Suite</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            By-appointment private viewing room for Grand Complications and custom fragrance bespoke blending.
          </p>
          <div className="text-[11px] text-neutral-500 pt-2 border-t border-white/5">
            Active Connoisseurs Booked: 14 this month
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-gold font-mono">Salon London</span>
            <Compass className="h-4 w-4 text-gold" />
          </div>
          <h3 className="text-white font-medium text-sm">Mayfair Collector Lounge</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Quarterly private preview showings for UK and European patrons ahead of global reference releases.
          </p>
          <div className="text-[11px] text-neutral-500 pt-2 border-t border-white/5">
            Upcoming Salon: Autumn Horology Gathering
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-neutral-950/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-gold font-mono">Armored Dispatch</span>
            <Users className="h-4 w-4 text-gold" />
          </div>
          <h3 className="text-white font-medium text-sm">Bespoke Concierge Delivery</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Hand-carried delivery by bonded courier directly to private residences, yachts, and family offices worldwide.
          </p>
          <div className="text-[11px] text-neutral-500 pt-2 border-t border-white/5">
            Standard on all orders &gt; $10,000 USD
          </div>
        </div>
      </div>
    </div>
  );
}
