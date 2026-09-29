"use client";

import * as React from "react";
import Link from "next/link";
import { STOREFRONT_NAV, BRAND } from "@/lib/constants";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-obsidian/90 backdrop-blur-md border-b border-white/10 py-4 shadow-xl"
          : "bg-obsidian/40 backdrop-blur-sm border-b border-white/5 py-6"
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between">
          {/* Left: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {STOREFRONT_NAV.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-sans font-medium tracking-luxury uppercase text-platinum-300 hover:text-gold-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-sand-50 hover:text-gold-400 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Center: Brand Identity Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-[0.25em] text-sand-50 group-hover:text-gold-300 transition-colors duration-300 block">
                {BRAND.name}
              </span>
              <span className="text-[8px] font-sans tracking-[0.4em] uppercase text-platinum-500 block -mt-1 group-hover:text-gold-400/80 transition-colors">
                Genève • Grasse
              </span>
            </Link>
          </div>

          {/* Right: Secondary Nav & Action Icons */}
          <div className="flex items-center space-x-6 sm:space-x-7">
            <nav className="hidden lg:flex items-center space-x-8">
              {STOREFRONT_NAV.slice(3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] font-sans font-medium tracking-luxury uppercase text-platinum-300 hover:text-gold-400 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4 sm:space-x-5 text-platinum-300">
              <button
                className="p-1.5 hover:text-gold-400 transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                href="/account"
                className="p-1.5 hover:text-gold-400 transition-colors"
                aria-label="Collector Account"
              >
                <User className="h-4 w-4" />
              </Link>

              <Link
                href="/cart"
                className="relative p-1.5 hover:text-gold-400 transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-obsidian">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 mt-4 pt-4 pb-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {STOREFRONT_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-sans font-medium tracking-luxury uppercase text-platinum-200 hover:text-gold-400 py-1 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-platinum-400">
              <Link href="/concierge" onClick={() => setIsMobileMenuOpen(false)}>
                Concierge Desk
              </Link>
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                Atelier Admin
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
