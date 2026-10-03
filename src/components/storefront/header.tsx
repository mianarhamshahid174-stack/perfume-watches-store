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
  Clock,
  Compass,
} from "lucide-react";
import { BRAND, STOREFRONT_NAV, StorefrontNavItem } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { megaMenuVariants, LUXURY_EASE } from "@/lib/motion";
import { Drawer } from "@/components/ui/drawer";
import { SearchExperience } from "@/components/storefront/search-experience";
import { useCart } from "@/context/cart-context";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { ThemeToggle } from "@/components/storefront/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {
    items: cartItems,
    itemCount,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    removeFromCart,
  } = useCart();
  const [mobileExpandedSection, setMobileExpandedSection] = React.useState<string | null>(null);

  // Scroll listener for transparent-to-solid transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 shadow-lg text-neutral-900 dark:text-ivory"
            : "bg-gradient-to-b from-black/85 via-black/40 to-transparent border-b border-transparent text-ivory"
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <AnnouncementBar />
        <Container size="wide" className={isScrolled ? "py-3.5" : "py-5"}>
          <div className="flex items-center justify-between relative">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 -ml-2 transition-colors ${
                  isScrolled
                    ? "text-neutral-900 dark:text-ivory hover:text-gold-600 dark:hover:text-metallic"
                    : "text-ivory hover:text-metallic"
                }`}
                aria-label="Open Mobile Menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-900 dark:hover:text-ivory"
                    : "text-neutral-stone hover:text-ivory"
                }`}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Desktop Left: Navigation Items */}
            <nav className="hidden lg:flex items-center space-x-3.5 xl:space-x-5 2xl:space-x-6 pr-4">
              {STOREFRONT_NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative py-2"
                  onMouseEnter={() => {
                    if (item.hasMegaMenu) setActiveMegaMenu(item.label);
                    else setActiveMegaMenu(null);
                  }}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-[10.5px] xl:text-[11px] font-sans font-medium uppercase tracking-editorial transition-colors duration-200 ${
                      activeMegaMenu === item.label
                        ? "text-gold-600 dark:text-metallic"
                        : isScrolled
                        ? "text-neutral-700 dark:text-ivory/85 hover:text-gold-600 dark:hover:text-metallic"
                        : "text-ivory/90 hover:text-metallic"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasMegaMenu && (
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-300 opacity-60 ${
                          activeMegaMenu === item.label
                            ? "rotate-180 text-gold-600 dark:text-metallic opacity-100"
                            : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Active Link Indicator */}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-600 dark:bg-metallic rounded-full" />
                  )}
                </div>
              ))}
            </nav>

            {/* Center: Brand Logo */}
            <div className="text-center absolute left-1/2 -translate-x-1/2 ml-3 sm:ml-4 lg:ml-10 xl:ml-12 pointer-events-auto">
              <Link href="/" className="inline-block group text-center select-none">
                <span
                  className={`font-serif-luxury text-2xl sm:text-3xl font-light tracking-[0.28em] pl-[0.28em] transition-colors duration-300 block ${
                    isScrolled
                      ? "text-neutral-900 dark:text-ivory group-hover:text-gold-600 dark:group-hover:text-metallic"
                      : "text-ivory group-hover:text-metallic"
                  }`}
                >
                  {BRAND.name}
                </span>
                <span
                  className={`text-[7.5px] font-sans tracking-[0.26em] uppercase transition-colors block -mt-1 pl-[0.26em] ${
                    isScrolled
                      ? "text-neutral-500 dark:text-neutral-stone group-hover:text-gold-600/80 dark:group-hover:text-metallic/80"
                      : "text-neutral-stone group-hover:text-metallic/80"
                  }`}
                >
                  {BRAND.atelierLocation}
                </span>
              </Link>
            </div>

            {/* Right: Actions (ThemeToggle, Search, Account, Wishlist, Cart) */}
            <div
              className={`flex items-center space-x-2 sm:space-x-3 transition-colors ${
                isScrolled ? "text-neutral-900 dark:text-ivory" : "text-ivory"
              }`}
            >
              {/* Theme Toggle (Light / Dark mode) */}
              <ThemeToggle />

              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`hidden lg:flex items-center gap-1.5 p-2 transition-colors cursor-pointer ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-900 dark:hover:text-ivory"
                    : "text-neutral-stone hover:text-ivory"
                }`}
                aria-label="Search Catalog"
              >
                <Search className="h-4 w-4" />
                <span className="text-[10px] font-sans uppercase tracking-editorial hidden xl:inline">
                  Search
                </span>
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className={`p-2 transition-colors ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-900 dark:hover:text-ivory"
                    : "text-neutral-stone hover:text-ivory"
                }`}
                aria-label="Customer Account"
              >
                <User className="h-4 w-4" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className={`hidden sm:block p-2 transition-colors relative ${
                  isScrolled
                    ? "text-neutral-600 dark:text-neutral-stone hover:text-neutral-900 dark:hover:text-ivory"
                    : "text-neutral-stone hover:text-ivory"
                }`}
                aria-label="Saved Pieces"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className={`p-2 transition-colors relative cursor-pointer ${
                  isScrolled
                    ? "text-neutral-700 dark:text-neutral-stone hover:text-gold-600 dark:hover:text-metallic"
                    : "text-neutral-stone hover:text-metallic"
                }`}
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-500 text-[9px] font-mono font-bold text-black animate-scale-in">
                    {itemCount}
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
              className="hidden lg:block absolute top-full left-0 right-0 w-full bg-charcoal-950/98 border-t border-b border-white/10 backdrop-blur-2xl shadow-2xl py-10"
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <Container size="wide">
                {(() => {
                  const activeItem = STOREFRONT_NAV.find((i) => i.label === activeMegaMenu);
                  if (!activeItem?.megaMenu) return null;

                  return (
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left: Columns of links */}
                      <div className="col-span-8 grid grid-cols-2 gap-8 pr-8 border-r border-white/5">
                        {activeItem.megaMenu.columns.map((col, idx) => (
                          <div key={idx} className="space-y-4">
                            <h4 className="font-sans text-[10px] uppercase tracking-ultra font-semibold text-metallic">
                              {col.title}
                            </h4>
                            <ul className="space-y-3">
                              {col.items.map((sub, sIdx) => (
                                <li key={sIdx}>
                                  <Link
                                    href={sub.href}
                                    className="group/link block space-y-0.5"
                                  >
                                    <div className="font-serif-luxury text-base text-ivory/90 group-hover/link:text-metallic transition-colors">
                                      {sub.label}
                                    </div>
                                    {sub.description && (
                                      <p className="font-sans text-[11px] text-neutral-stone font-light leading-snug">
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
                          className="group block relative aspect-[16/10] overflow-hidden rounded-xl bg-charcoal-900 border border-white/10 hover:border-metallic/50 transition-all duration-500"
                        >
                          <img
                            src={activeItem.megaMenu.featured.imageUrl}
                            alt={activeItem.megaMenu.featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end space-y-1">
                            <span className="text-[9px] font-sans font-semibold uppercase tracking-ultra text-metallic">
                              {activeItem.megaMenu.featured.tag}
                            </span>
                            <h5 className="font-serif-luxury text-lg text-ivory group-hover:text-metallic-light transition-colors">
                              {activeItem.megaMenu.featured.title}
                            </h5>
                            <p className="text-[11px] text-neutral-stone font-light line-clamp-1">
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

      {/* DEDICATED PREMIUM MOBILE NAVIGATION DRAWER */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="left"
        size="md"
        title="VELORA Navigation"
        subtitle="Luxury Watches & Fine Fragrances"
        footer={
          <div className="space-y-3 text-xs text-neutral-stone">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-[11px] font-sans uppercase tracking-wider text-neutral-400">Appearance</span>
              <ThemeToggle showLabel />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gold-400" />
              <span>Pakistan Support: +92 300 1234567</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-ivory">
                Customer Sign In
              </Link>
              <Link href="/concierge" onClick={() => setIsMobileMenuOpen(false)} className="text-gold-400 hover:underline">
                Book Boutique Visit
              </Link>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          {/* Quick Mobile Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-stone" />
            <input
              type="text"
              placeholder="Search luxury watches, perfumes, collections..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }
              }}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-charcoal-900 border border-white/10 text-xs text-ivory placeholder:text-neutral-stone focus:outline-none focus:border-metallic"
            />
          </div>

          {/* Navigation Accordion Links */}
          <div className="divide-y divide-white/5 pt-2">
            {STOREFRONT_NAV.map((item) => (
              <div key={item.label} className="py-2.5">
                {item.hasMegaMenu ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleMobileSection(item.label)}
                      className="w-full flex items-center justify-between text-left py-1 text-base font-serif-luxury font-light text-ivory hover:text-metallic transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-neutral-stone transition-transform duration-300 ${
                          mobileExpandedSection === item.label ? "rotate-180 text-metallic" : ""
                        }`}
                      />
                    </button>

                    {mobileExpandedSection === item.label && item.megaMenu && (
                      <div className="pl-3 pt-2 pb-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {item.megaMenu.columns.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-1.5">
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-ultra text-metallic">
                              {col.title}
                            </span>
                            <ul className="space-y-2 pl-2">
                              {col.items.map((sub, sIdx) => (
                                <li key={sIdx}>
                                  <Link
                                    href={sub.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-xs text-neutral-stone hover:text-ivory py-0.5"
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
                    className="block py-1 text-base font-serif-luxury font-light text-ivory hover:text-metallic transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
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
              className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 search-dialog-modal text-neutral-900 dark:text-sand-50"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400 font-semibold">
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
