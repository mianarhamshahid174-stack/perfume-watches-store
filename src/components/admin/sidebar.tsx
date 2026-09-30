"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PackageCheck,
  Watch,
  FolderTree,
  Tags,
  Boxes,
  Users,
  Percent,
  MessageSquareQuote,
  LayoutTemplate,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: Array<{ label: string; href: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: PackageCheck },
  { label: "Products", href: "/admin/products", icon: Watch },
  { label: "Collections", href: "/admin/collections", icon: FolderTree },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Discounts", href: "/admin/discounts", icon: Percent },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote },
  {
    label: "Content",
    href: "/admin/content",
    icon: LayoutTemplate,
    subItems: [
      { label: "Homepage", href: "/admin/homepage" },
      { label: "Journal", href: "/admin/journal" },
    ],
  },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [contentOpen, setContentOpen] = React.useState(
    pathname.startsWith("/admin/homepage") || pathname.startsWith("/admin/journal")
  );
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full bg-zinc-950 text-zinc-100 select-none">
      <div>
        {/* Brand Admin Badge */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-zinc-100 uppercase">
                VELORA ATELIER OS
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              Production Operations v2.0
            </p>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-210px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.subItems) {
              const isSubActive = item.subItems.some((sub) => pathname.startsWith(sub.href));

              return (
                <div key={item.label} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setContentOpen(!contentOpen)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer",
                      isSubActive
                        ? "text-zinc-100 font-semibold bg-zinc-900"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200",
                        contentOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {contentOpen && (
                    <div className="pl-7 pr-1 space-y-0.5 py-1">
                      {item.subItems.map((sub) => {
                        const isThisSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "block px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors",
                              isThisSubActive
                                ? "bg-zinc-800 text-gold-400 font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                            )}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-gold-400" : "text-zinc-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront link & Logout */}
      <div className="p-3 border-t border-zinc-800/80 space-y-1.5 bg-zinc-950">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            Live Storefront
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Online</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isLoggingOut ? "Ending Session..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Trigger Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 hover:text-white shadow-lg"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-zinc-800 bg-zinc-950 flex-col justify-between h-screen sticky top-0 shrink-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 max-w-full h-full border-r border-zinc-800 bg-zinc-950 z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
