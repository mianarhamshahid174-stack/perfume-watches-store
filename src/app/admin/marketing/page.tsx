"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone,
  Tag,
  CheckCircle2,
  RefreshCw,
  Bell,
  Sparkles,
  Layers,
  Mail,
  Share2,
  Package,
  Layers2,
  ExternalLink,
  Save,
  Eye,
  Sliders,
  Compass,
} from "lucide-react";
import { DEFAULT_MARKETING_CONFIG } from "@/app/api/marketing/settings/route";

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: string | number;
}

interface CollectionOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminMarketingPage() {
  const [config, setConfig] = React.useState(DEFAULT_MARKETING_CONFIG);
  const [products, setProducts] = React.useState<ProductOption[]>([]);
  const [collections, setCollections] = React.useState<CollectionOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "announcement" | "promotions" | "products" | "collections" | "newsletter" | "popup" | "social"
  >("announcement");

  const fetchMarketingData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/marketing");
      const json = await res.json();
      if (json.success) {
        if (json.config) setConfig(json.config);
        if (json.products) setProducts(json.products);
        if (json.collections) setCollections(json.collections);
      }
    } catch (err) {
      console.error("Marketing fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMarketingData();
  }, [fetchMarketingData]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save marketing configuration");
      }

      setNotification("Marketing configurations published to live storefront!");
      setTimeout(() => setNotification(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving marketing settings");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeaturedProduct = (id: string) => {
    setConfig((prev) => {
      const current = prev.featuredProducts || [];
      const exists = current.includes(id);
      return {
        ...prev,
        featuredProducts: exists ? current.filter((x) => x !== id) : [...current, id],
      };
    });
  };

  const toggleFeaturedCollection = (slug: string) => {
    setConfig((prev) => {
      const current = prev.featuredCollections || [];
      const exists = current.includes(slug);
      return {
        ...prev,
        featuredCollections: exists ? current.filter((x) => x !== slug) : [...current, slug],
      };
    });
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg bg-gold text-black font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-gold" />
            Marketing & Storefront Conversion CMS
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time control over header announcement bar, VIP allocation popups, campaigns, social channels, and featured curations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchMarketingData()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="bg-gold hover:bg-gold-light text-black font-semibold px-5 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Publishing..." : "Publish Live Changes"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: "announcement", label: "Announcement Bar", icon: Bell },
          { id: "promotions", label: "Homepage Promotions", icon: Sparkles },
          { id: "products", label: "Featured Products", icon: Package },
          { id: "collections", label: "Featured Collections", icon: Layers2 },
          { id: "popup", label: "VIP Allocation Popup", icon: Eye },
          { id: "newsletter", label: "Newsletter Circle", icon: Mail },
          { id: "social", label: "Social Media Links", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-gold text-black font-semibold shadow-md"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-1/3 bg-neutral-800" />
          <Skeleton className="h-40 w-full bg-neutral-800" />
        </div>
      ) : (
        <div className="bg-neutral-950/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* TAB 1: ANNOUNCEMENT BAR */}
          {activeTab === "announcement" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-light text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gold" />
                    Top Announcement Bar
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Renders across the very pinnacle of every storefront page.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.announcementBar.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                  Live Header Preview
                </span>
                <div
                  className={`p-3 rounded-lg text-center text-xs flex items-center justify-center gap-3 transition-colors ${
                    config.announcementBar.theme === "gold"
                      ? "bg-gold text-black font-medium"
                      : config.announcementBar.theme === "charcoal"
                      ? "bg-neutral-900 text-neutral-200 border border-neutral-800"
                      : "bg-black text-gold border-b border-gold/30"
                  }`}
                >
                  {config.announcementBar.badge && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 font-bold">
                      {config.announcementBar.badge}
                    </span>
                  )}
                  <span>{config.announcementBar.text}</span>
                  {config.announcementBar.linkText && (
                    <span className="underline cursor-pointer ml-1 font-semibold">
                      {config.announcementBar.linkText} →
                    </span>
                  )}
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Announcement Text
                    </label>
                    <textarea
                      value={config.announcementBar.text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            text: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Highlight Badge
                    </label>
                    <Input
                      value={config.announcementBar.badge || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            badge: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. VIP COMPLIMENTARY"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Action Link Label
                    </label>
                    <Input
                      value={config.announcementBar.linkText || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            linkText: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. View Masterpieces"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Action Link URL
                    </label>
                    <Input
                      value={config.announcementBar.linkUrl || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            linkUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="/watches or /collections"
                      className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Visual Palette Theme
                    </label>
                    <select
                      value={config.announcementBar.theme}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcementBar: {
                            ...config.announcementBar,
                            theme: e.target.value as any,
                          },
                        })
                      }
                      className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                    >
                      <option value="gold">Maison Gold Accent (High Visibility)</option>
                      <option value="black">Deep Obsidian & Gold Border (Editorial)</option>
                      <option value="charcoal">Charcoal Neutral (Subtle Luxury)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE PROMOTIONS */}
          {activeTab === "promotions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-light text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gold" />
                    Homepage Promotions & Special Invitations
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Highlighted marquee or VIP invitation banner displayed to incoming collectors.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.homepagePromotions.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          homepagePromotions: {
                            ...config.homepagePromotions,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Promotion Headline
                  </label>
                  <Input
                    value={config.homepagePromotions.headline}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        homepagePromotions: {
                          ...config.homepagePromotions,
                          headline: e.target.value,
                        },
                      })
                    }
                    placeholder="PRIVATE SALON INVITATION"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs font-serif-luxury text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Promotion Voucher Code
                  </label>
                  <Input
                    value={config.homepagePromotions.promoCode}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        homepagePromotions: {
                          ...config.homepagePromotions,
                          promoCode: e.target.value.toUpperCase(),
                        },
                      })
                    }
                    placeholder="VELORA10"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs uppercase"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Subheadline Narrative / Description
                  </label>
                  <textarea
                    value={config.homepagePromotions.subheadline}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        homepagePromotions: {
                          ...config.homepagePromotions,
                          subheadline: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Discount Callout Badge
                  </label>
                  <Input
                    value={config.homepagePromotions.discountText}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        homepagePromotions: {
                          ...config.homepagePromotions,
                          discountText: e.target.value,
                        },
                      })
                    }
                    placeholder="10% VIP Concession"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      CTA Button Text
                    </label>
                    <Input
                      value={config.homepagePromotions.ctaText}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          homepagePromotions: {
                            ...config.homepagePromotions,
                            ctaText: e.target.value,
                          },
                        })
                      }
                      placeholder="Discover Masterpieces"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      CTA Link URL
                    </label>
                    <Input
                      value={config.homepagePromotions.ctaLink}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          homepagePromotions: {
                            ...config.homepagePromotions,
                            ctaLink: e.target.value,
                          },
                        })
                      }
                      placeholder="/watches"
                      className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURED PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-light text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Featured Marketing Products
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select which timepieces and extraits are highlighted across promotional modules and marketing showcases.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                {products.map((p) => {
                  const isSelected = (config.featuredProducts || []).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleFeaturedProduct(p.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-gold/10 border-gold text-white shadow-md"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="text-xs font-medium text-white truncate">{p.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {p.sku} • ${Number(p.price).toLocaleString()}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FEATURED COLLECTIONS */}
          {activeTab === "collections" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-light text-white flex items-center gap-2">
                  <Layers2 className="h-5 w-5 text-gold" />
                  Featured Marketing Collections
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Choose which collections receive primary placement in navigation and landing spotlights.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {collections.map((col) => {
                  const isSelected = (config.featuredCollections || []).includes(col.slug);
                  return (
                    <div
                      key={col.id}
                      onClick={() => toggleFeaturedCollection(col.slug)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-gold/10 border-gold text-white shadow-md"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium text-white">{col.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500">/{col.slug}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: VIP POPUP */}
          {activeTab === "popup" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-light text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gold" />
                    VIP Welcome Allocation Popup
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Private collector welcome modal triggered on first visitor arrival.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Enable Popup:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.popup.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          popup: {
                            ...config.popup,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Delay (Seconds after arrival)
                  </label>
                  <Input
                    type="number"
                    value={config.popup.delaySeconds}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          delaySeconds: Number(e.target.value),
                        },
                      })
                    }
                    className="bg-neutral-900 border-neutral-800 text-white text-xs w-32"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Allocation Badge
                  </label>
                  <Input
                    value={config.popup.badge}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          badge: e.target.value,
                        },
                      })
                    }
                    placeholder="PRIVATE CIRCLE ALLOCATION"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Modal Title
                  </label>
                  <Input
                    value={config.popup.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          title: e.target.value,
                        },
                      })
                    }
                    className="bg-neutral-900 border-neutral-800 text-white font-serif-luxury text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Coupon Code
                  </label>
                  <Input
                    value={config.popup.couponCode}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          couponCode: e.target.value.toUpperCase(),
                        },
                      })
                    }
                    placeholder="VELORA10"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs uppercase"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Subtitle / Invitation Copy
                  </label>
                  <textarea
                    value={config.popup.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Feature Image URL
                  </label>
                  <Input
                    value={config.popup.imageUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          imageUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="/images/velora-signature-01.jpg"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    CTA Button Label
                  </label>
                  <Input
                    value={config.popup.ctaText}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        popup: {
                          ...config.popup,
                          ctaText: e.target.value,
                        },
                      })
                    }
                    placeholder="CLAIM COLLECTOR ALLOCATION"
                    className="bg-neutral-900 border-neutral-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NEWSLETTER */}
          {activeTab === "newsletter" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-light text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gold" />
                    Newsletter & Private Salon Admissions
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Configure collector lead capture modules throughout the footer and journal.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Enable Newsletter:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.newsletter.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          newsletter: {
                            ...config.newsletter,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Newsletter Headline
                  </label>
                  <Input
                    value={config.newsletter.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        newsletter: {
                          ...config.newsletter,
                          title: e.target.value,
                        },
                      })
                    }
                    className="bg-neutral-900 border-neutral-800 text-white font-serif-luxury text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Invitation Subtitle
                  </label>
                  <textarea
                    value={config.newsletter.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        newsletter: {
                          ...config.newsletter,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Incentive Tagline
                    </label>
                    <Input
                      value={config.newsletter.incentiveText}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          newsletter: {
                            ...config.newsletter,
                            incentiveText: e.target.value,
                          },
                        })
                      }
                      placeholder="Privilege code granted upon admission"
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Privacy Disclaimer
                    </label>
                    <Input
                      value={config.newsletter.disclaimer}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          newsletter: {
                            ...config.newsletter,
                            disclaimer: e.target.value,
                          },
                        })
                      }
                      placeholder="Discretion guaranteed. No spam. You may withdraw at any time."
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SOCIAL MEDIA LINKS */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-light text-white flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gold" />
                  Official Social Channels & Salon Profiles
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct links shown in the storefront footer, product shares, and concierge dialogs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Instagram URL
                  </label>
                  <Input
                    value={config.socialLinks.instagram}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/velorawatches"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    X (formerly Twitter) URL
                  </label>
                  <Input
                    value={config.socialLinks.x}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          x: e.target.value,
                        },
                      })
                    }
                    placeholder="https://x.com/velorawatches"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Facebook URL
                  </label>
                  <Input
                    value={config.socialLinks.facebook}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="https://facebook.com/velorawatches"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Pinterest URL
                  </label>
                  <Input
                    value={config.socialLinks.pinterest}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          pinterest: e.target.value,
                        },
                      })
                    }
                    placeholder="https://pinterest.com/velorawatches"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    YouTube URL
                  </label>
                  <Input
                    value={config.socialLinks.youtube}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          youtube: e.target.value,
                        },
                      })
                    }
                    placeholder="https://youtube.com/@velorawatches"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    LinkedIn Official URL
                  </label>
                  <Input
                    value={config.socialLinks.linkedin}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: {
                          ...config.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="https://linkedin.com/company/velora-geneva"
                    className="bg-neutral-900 border-neutral-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/10">
            <span className="text-xs text-neutral-500">
              Changes apply instantly to the active storefront upon publishing.
            </span>
            <Button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="bg-gold hover:bg-gold-light text-black font-semibold text-xs px-6 shadow-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Publishing..." : "Publish Live Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
