"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Watch,
  PackageCheck,
  MessageSquareQuote,
  Sliders,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Timepieces & Parfums", href: "/admin/products", icon: Watch },
  { label: "Orders & Fulfillment", href: "/admin/orders", icon: PackageCheck },
  { label: "Collector Inquiries", href: "/admin/inquiries", icon: MessageSquareQuote },
  { label: "Atelier Settings", href: "/admin/settings", icon: Sliders },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Admin Badge */}
        <div className="p-6 border-b border-zinc-800/80">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-wider text-zinc-100 uppercase">
              ZAVEN ATELIER OS
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">
            Production Management v1.0
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            View Storefront
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Live</span>
        </Link>

        <div className="px-3 py-2 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
          <span>Role: Concierge / Admin</span>
        </div>
      </div>
    </aside>
  );
}
