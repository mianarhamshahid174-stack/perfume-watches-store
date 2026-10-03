"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Phone,
  Sparkles,
  ShieldCheck,
  Truck,
  HelpCircle,
  Clock,
} from "lucide-react";
import {
  BRAND,
  PRIMARY_STOREFRONT_NAV,
  CLIENT_SERVICES_NAV,
  STOREFRONT_NAV,
  StorefrontNavItem,
} from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { megaMenuVariants, LUXURY_EASE } from "@/lib/motion";
import { Drawer } from "@/components/ui/drawer";
import { SearchExperience } from "@/components/storefront/search-experience";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { ThemeToggle } from "@/components/storefront/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const { itemCount: cartCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [mobileExpandedSection, setMobileExpandedSection] = React.useState<string | null>(null);

  // Scroll listener for dynamic transparent-to-solid transitions
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keyboard shortcut for quick catalog search (⌘K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleMobileSection = (label: string) => {
    setMobileExpandedSection((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-neutral-200/70 dark:border-white/10 text-neutral-900 dark:text-ivory shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-gradient-to-b from-black/75 via-black/35 to-transparent border-b border-transparent text-ivory"
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <AnnouncementBar />

        <Container size="wide" className={isScrolled ? "py-3 lg:py-3.5" : "py-4 lg:py-5"}>
          <div className="flex items-center justify-between relative">
            {/* Mobile Controls (Menu Hamburger & Quick Search) */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "text-neutral-900 dark:text-ivory hover:bg-neutral-100 dark:hover:bg-white/10"
                    : "text-ivory hover:bg-white/10"
                }`}
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-900 dark:hover:text-ivory hover:bg-neutral-100 dark:hover:bg-white/10"
                    : "text-neutral-stone hover:text-ivory hover:bg-white/10"
                }`}
                aria-label="Search Catalog"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Desktop Left: 4 Bespoke Curated Navigation Buttons */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 select-none">
              {PRIMARY_STOREFRONT_NAV.map((item) => {
                const isCurrentActive =
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const isMegaOpen = activeMegaMenu === item.label;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (item.hasMegaMenu) setActiveMegaMenu(item.label);
                      else setActiveMegaMenu(null);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] xl:text-[11.5px] font-sans font-medium uppercase tracking-[0.16em] transition-all duration-300 border ${
                        isMegaOpen
                          ? "bg-gold-500/10 dark:bg-gold-500/15 border-gold-500/40 text-gold-600 dark:text-metallic shadow-[0_2px_12px_rgba(197,168,128,0.2)]"
                          : isCurrentActive
                          ? isScrolled
                            ? "bg-neutral-900/5 dark:bg-white/10 border-gold-500/40 text-gold-600 dark:text-metallic font-semibold shadow-xs"
                            : "bg-white/15 border-gold-400/50 text-gold-300 font-semibold backdrop-blur-sm shadow-xs"
                          : isScrolled
                          ? "border-transparent text-neutral-700 dark:text-ivory/85 hover:text-neutral-950 dark:hover:text-ivory hover:bg-neutral-900/5 dark:hover:bg-white/[0.08] hover:border-neutral-200/80 dark:hover:border-white/10"
                          : "border-transparent text-ivory/90 hover:text-ivory hover:bg-white/10 hover:border-white/20 backdrop-blur-[2px]"
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {item.hasMegaMenu && (
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-300 ${
                            isMegaOpen
                              ? "rotate-180 text-gold-600 dark:text-metallic"
                              : "opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5"
                          }`}
                        />
                      )}

                      {/* Subtle active status indicator */}
                      {isCurrentActive && !isMegaOpen && (
                        <span className="w-1 h-1 rounded-full bg-gold-500 dark:bg-metallic" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Center: Brand Logo (Dead-Center Symmetrical Geometry) */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-auto z-10">
              <Link href="/" className="inline-block group text-center select-none py-1">
                <span
                  className={`font-serif-luxury text-2xl sm:text-3xl lg:text-[28px] font-light tracking-[0.24em] pl-[0.24em] transition-colors duration-300 block ${
                    isScrolled
                      ? "text-neutral-900 dark:text-ivory group-hover:text-gold-600 dark:group-hover:text-metallic"
                      : "text-ivory group-hover:text-metallic"
                  }`}
                >
                  {BRAND.name}
                </span>
                <span
                  className={`text-[8px] font-sans tracking-[0.24em] uppercase transition-colors block -mt-0.5 pl-[0.24em] ${
                    isScrolled
                      ? "text-neutral-400 dark:text-neutral-stone group-hover:text-gold-600/80 dark:group-hover:text-metallic/80"
                      : "text-neutral-stone group-hover:text-metallic/80"
                  }`}
                >
                  {BRAND.atelierLocation}
                </span>
              </Link>
            </div>

            {/* Right: Refined Action Cluster */}
            <div
              className={`flex items-center space-x-1 sm:space-x-1.5 transition-colors ${
                isScrolled ? "text-neutral-900 dark:text-ivory" : "text-ivory"
              }`}
            >
              {/* Theme Toggle (Light / Dark mode) */}
              <ThemeToggle />

              {/* Desktop Search Capsule Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.14em] font-medium transition-all duration-300 border cursor-pointer ${
                  isScrolled
                    ? "border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-stone hover:text-neutral-950 dark:hover:text-ivory hover:bg-neutral-900/5 dark:hover:bg-white/[0.08]"
                    : "border-white/15 text-ivory/80 hover:text-ivory hover:bg-white/10 hover:border-white/25"
                }`}
                aria-label="Search Catalog"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Search</span>
                <kbd
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isScrolled
                      ? "bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
                      : "bg-white/15 text-ivory/70"
                  }`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-950 dark:hover:text-ivory hover:bg-neutral-900/5 dark:hover:bg-white/[0.08]"
                    : "text-ivory/80 hover:text-ivory hover:bg-white/10"
                }`}
                aria-label="Customer Account"
              >
                <User className="h-[18px] w-[18px]" />
              </Link>

              {/* Wishlist Link with Live Counter Badge */}
              <Link
                href="/wishlist"
                className={`hidden sm:flex p-2 sm:p-2.5 rounded-full transition-all duration-300 relative hover:scale-105 ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-950 dark:hover:text-ivory hover:bg-neutral-900/5 dark:hover:bg-white/[0.08]"
                    : "text-ivory/80 hover:text-ivory hover:bg-white/10"
                }`}
                aria-label="Saved Pieces"
              >
                <Heart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-mono font-bold text-black shadow-xs animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger with Gold Quantity Counter */}
              <button
                type="button"
                onClick={openCart}
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 relative cursor-pointer hover:scale-105 ${
                  isScrolled
                    ? "text-neutral-800 dark:text-ivory hover:text-gold-600 dark:hover:text-metallic hover:bg-neutral-900/5 dark:hover:bg-white/[0.08]"
                    : "text-ivory hover:text-metallic hover:bg-white/10"
                }`}
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-mono font-bold text-black shadow-sm shadow-gold-500/40 animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* ELEGANT DESKTOP MEGA MENUS */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              variants={megaMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white/98 dark:bg-charcoal-950/98 border-t border-b border-neutral-200/80 dark:border-white/10 backdrop-blur-2xl shadow-2xl py-12 transition-colors duration-300"
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <Container size="wide">
                {(() => {
                  const activeItem = PRIMARY_STOREFRONT_NAV.find((i) => i.label === activeMegaMenu);
                  if (!activeItem?.megaMenu) return null;

                  return (
                    <div className="grid grid-cols-12 gap-10">
                      {/* Left: Columns of Links */}
                      <div className="col-span-8 grid grid-cols-2 gap-10 pr-10 border-r border-neutral-200/60 dark:border-white/5">
                        {activeItem.megaMenu.columns.map((col, idx) => (
                          <div key={idx} className="space-y-5">
                            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold text-gold-600 dark:text-metallic">
                              {col.title}
                            </h4>
                            <ul className="space-y-4">
                              {col.items.map((sub, sIdx) => (
                                <li key={sIdx}>
                                  <Link
                                    href={sub.href}
                                    className="group/link block space-y-1"
                                    onClick={() => setActiveMegaMenu(null)}
                                  >
                                    <div className="font-serif-luxury text-base text-neutral-900 dark:text-ivory/90 group-hover/link:text-gold-600 dark:group-hover/link:text-metallic transition-colors">
                                      {sub.label}
                                    </div>
                                    {sub.description && (
                                      <p className="font-sans text-[12px] text-neutral-500 dark:text-neutral-stone font-light leading-relaxed">
                                        {sub.description}
                                      </p>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Right: Featured Piece Card */}
                      <div className="col-span-4 pl-4">
                        <Link
                          href={activeItem.megaMenu.featured.href}
                          onClick={() => setActiveMegaMenu(null)}
                          className="group block relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 dark:bg-charcoal-900 border border-neutral-200 dark:border-white/10 hover:border-gold-500/50 dark:hover:border-metallic/50 transition-all duration-500 shadow-md"
                        >
                          <img
                            src={activeItem.megaMenu.featured.imageUrl}
                            alt={activeItem.megaMenu.featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end space-y-1.5">
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-metallic">
                              {activeItem.megaMenu.featured.tag}
                            </span>
                            <h5 className="font-serif-luxury text-lg text-ivory group-hover:text-metallic-light transition-colors">
                              {activeItem.megaMenu.featured.title}
                            </h5>
                            <p className="text-[12px] text-neutral-stone font-light line-clamp-1">
                              {activeItem.megaMenu.featured.subtitle}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* DEDICATED LUXURY MOBILE NAVIGATION DRAWER */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="left"
        size="md"
        title="VELORA Navigation"
        subtitle="Luxury Watches & Fine Fragrances"
        footer={
          <div className="space-y-3 text-xs text-neutral-stone">
            <div className="flex items-center justify-between py-2 border-b border-neutral-200/50 dark:border-white/5">
              <span className="text-[11px] font-sans uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Appearance
              </span>
              <ThemeToggle showLabel />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gold-500 dark:text-gold-400" />
              <a
                href={`tel:${BRAND.phone.replace(/\s+/g, "")}`}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Pakistan Support: {BRAND.phone}
              </a>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-gold-600 dark:hover:text-ivory"
              >
                Customer Sign In
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gold-600 dark:text-gold-400 hover:underline"
              >
                Client Concierge
              </Link>
            </div>
          </div>
        }
      >
        <div className="space-y-6 pt-2">
          {/* Quick Mobile Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-stone" />
            <input
              type="text"
              placeholder="Search timepieces, fragrances..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }
              }}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-neutral-100 dark:bg-charcoal-900 border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-ivory placeholder:text-neutral-stone focus:outline-none focus:border-gold-500 dark:focus:border-metallic"
            />
          </div>

          {/* Section 1: Curated Collections (The 4 Primary Navigation Links) */}
          <div className="space-y-1">
            <div className="px-1 pb-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-metallic">
                Boutique Curations
              </span>
            </div>

            <div className="divide-y divide-neutral-200/50 dark:divide-white/5">
              {PRIMARY_STOREFRONT_NAV.map((item) => (
                <div key={item.label} className="py-2.5">
                  {item.hasMegaMenu ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.label)}
                        className="w-full flex items-center justify-between text-left py-1 text-base font-serif-luxury font-light text-neutral-900 dark:text-ivory hover:text-gold-600 dark:hover:text-metallic transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-neutral-stone transition-transform duration-300 ${
                            mobileExpandedSection === item.label
                              ? "rotate-180 text-gold-600 dark:text-metallic"
                              : ""
                          }`}
                        />
                      </button>

                      {mobileExpandedSection === item.label && item.megaMenu && (
                        <div className="pl-3 pt-3 pb-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {item.megaMenu.columns.map((col, cIdx) => (
                            <div key={cIdx} className="space-y-2">
                              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-metallic">
                                {col.title}
                              </span>
                              <ul className="space-y-2 pl-2 border-l border-neutral-200/60 dark:border-white/10">
                                {col.items.map((sub, sIdx) => (
                                  <li key={sIdx}>
                                    <Link
                                      href={sub.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block text-sm text-neutral-600 dark:text-neutral-stone hover:text-neutral-950 dark:hover:text-ivory py-0.5"
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 text-base font-serif-luxury font-light text-neutral-900 dark:text-ivory hover:text-gold-600 dark:hover:text-metallic transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Client Services & Maison */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/60 dark:border-white/10">
            <div className="px-1 pt-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-stone">
                Client Services
              </span>
            </div>

            <div className="space-y-1">
              {CLIENT_SERVICES_NAV.map((service) => (
                <Link
                  key={service.label}
                  href={service.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-sans text-neutral-700 dark:text-ivory/80 group-hover:text-gold-600 dark:group-hover:text-metallic transition-colors">
                      {service.label}
                    </div>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-stone">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-gold-600 dark:group-hover:text-metallic group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/* SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: LUXURY_EASE }}
              className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 search-dialog-modal text-neutral-900 dark:text-sand-50 rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
                  Search Catalog
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Integrated Search Experience with Live DB Autocomplete */}
              <SearchExperience
                autoFocus
                onSelectResult={() => setIsSearchOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING BAG SLIDE-OUT DRAWER */}
      <CartDrawer />
    </>
  );
}
