"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings,
  Building,
  Coins,
  Truck,
  CreditCard,
  Receipt,
  Mail,
  Share2,
  Search,
  Bell,
  CheckCircle2,
  Save,
  RefreshCw,
} from "lucide-react";

type SettingsTab =
  | "brand"
  | "currency"
  | "shipping"
  | "payment"
  | "tax"
  | "email"
  | "social"
  | "seo"
  | "notifications";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("brand");
  const [settings, setSettings] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  const fetchSettings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.settings) {
        setSettings(json.settings);
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Save failed");

      setNotification("All Atelier configurations committed to database successfully.");
      setTimeout(() => setNotification(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "brand", label: "Brand Identity", icon: Building },
    { id: "currency", label: "Currency & FX", icon: Coins },
    { id: "shipping", label: "Shipping & Vault", icon: Truck },
    { id: "payment", label: "Payment Gateways", icon: CreditCard },
    { id: "tax", label: "Tax & Customs", icon: Receipt },
    { id: "email", label: "Email Dispatch", icon: Mail },
    { id: "social", label: "Social Presence", icon: Share2 },
    { id: "seo", label: "SEO & Metadata", icon: Search },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-gold" />
            Global Atelier Configuration
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Configure global brand parameters, multi-currency valuations, armored logistics, and automated concierge routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchSettings()}
            className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gold hover:bg-gold-light text-black font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Persisting..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs and Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gold text-black shadow-md font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-neutral-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-white/5 bg-neutral-950/60 backdrop-blur-md">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* BRAND SETTINGS */}
              {activeTab === "brand" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Brand & Atelier Identity</h3>
                    <p className="text-xs text-neutral-400">Official luxury maison registration and client contact points.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Maison Brand Name</label>
                      <Input
                        value={settings.brand_name || ""}
                        onChange={(e) => handleChange("brand_name", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Maison Tagline</label>
                      <Input
                        value={settings.brand_tagline || ""}
                        onChange={(e) => handleChange("brand_tagline", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Geneva Workshop Address</label>
                    <Input
                      value={settings.brand_address || ""}
                      onChange={(e) => handleChange("brand_address", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Concierge Email</label>
                      <Input
                        value={settings.brand_support_email || ""}
                        onChange={(e) => handleChange("brand_support_email", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Private Client Phone</label>
                      <Input
                        value={settings.brand_phone || ""}
                        onChange={(e) => handleChange("brand_phone", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CURRENCY SETTINGS */}
              {activeTab === "currency" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Currency & FX Management</h3>
                    <p className="text-xs text-neutral-400">Baseline valuation currency and supported international exchange rates.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Primary Base Currency</label>
                      <select
                        value={settings.currency_primary || "USD"}
                        onChange={(e) => handleChange("currency_primary", e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs focus:ring-1 focus:ring-gold"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="CHF">CHF (CHF) - Swiss Franc</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="AED">AED (AED) - UAE Dirham</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Currency Symbol</label>
                      <Input
                        value={settings.currency_symbol || "$"}
                        onChange={(e) => handleChange("currency_symbol", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Supported Storefront Currencies (Comma-separated)</label>
                    <Input
                      value={settings.currency_supported || "USD,EUR,CHF,GBP,AED,JPY"}
                      onChange={(e) => handleChange("currency_supported", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* SHIPPING SETTINGS */}
              {activeTab === "shipping" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Logistics & Armored Courier</h3>
                    <p className="text-xs text-neutral-400">Secure transport partners, complimentary thresholds, and vault dispatches.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Default Armored Courier Partner</label>
                    <Input
                      value={settings.shipping_default_carrier || ""}
                      onChange={(e) => handleChange("shipping_default_carrier", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Complimentary Courier Threshold ($)</label>
                      <Input
                        type="number"
                        value={settings.shipping_free_threshold || "5000"}
                        onChange={(e) => handleChange("shipping_free_threshold", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Standard Secure Rate ($)</label>
                      <Input
                        type="number"
                        value={settings.shipping_standard_rate || "150"}
                        onChange={(e) => handleChange("shipping_standard_rate", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Direct Hand-Carry Vault Rate ($)</label>
                      <Input
                        type="number"
                        value={settings.shipping_armored_vault_rate || "450"}
                        onChange={(e) => handleChange("shipping_armored_vault_rate", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT SETTINGS */}
              {activeTab === "payment" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Payment Gateways & Escrow</h3>
                    <p className="text-xs text-neutral-400">High-value payment settlement methods and private wire facilities.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "payment_stripe_enabled", label: "Stripe & Private Credit Lines (Amex Centurion, Visa Infinite)" },
                      { key: "payment_wire_transfer", label: "Swiss Bank Wire Transfer / Geneva Escrow Account" },
                      { key: "payment_crypto_concierge", label: "Crypto Concierge Settlement (USDC, BTC, ETH via BitPay)" },
                      { key: "payment_escrow_service", label: "Third-Party Horological Inspection Escrow" },
                    ].map((p) => (
                      <div key={p.key} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
                        <input
                          type="checkbox"
                          id={p.key}
                          checked={settings[p.key] === "true"}
                          onChange={(e) => handleChange(p.key, e.target.checked ? "true" : "false")}
                          className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                        />
                        <label htmlFor={p.key} className="text-xs text-neutral-200 font-medium">
                          {p.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAX SETTINGS */}
              {activeTab === "tax" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Tax, VAT & Customs Duties</h3>
                    <p className="text-xs text-neutral-400">Duty-paid shipping and Swiss VAT collection rules.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Standard Swiss VAT Rate (%)</label>
                      <Input
                        value={settings.tax_vat_rate || "7.7"}
                        onChange={(e) => handleChange("tax_vat_rate", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="pt-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="tax_included"
                          checked={settings.tax_included_in_price === "true"}
                          onChange={(e) => handleChange("tax_included_in_price", e.target.checked ? "true" : "false")}
                          className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                        />
                        <label htmlFor="tax_included" className="text-xs text-neutral-300">
                          Prices displayed include all taxes and duties
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL SETTINGS */}
              {activeTab === "email" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Concierge Email Dispatch</h3>
                    <p className="text-xs text-neutral-400">Automated order receipts, dispatch waybills, and patron communications.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Sender Display Name</label>
                      <Input
                        value={settings.email_sender_name || ""}
                        onChange={(e) => handleChange("email_sender_name", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">From Email Address</label>
                      <Input
                        value={settings.email_from_address || ""}
                        onChange={(e) => handleChange("email_from_address", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL SETTINGS */}
              {activeTab === "social" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Social Presence & Channels</h3>
                    <p className="text-xs text-neutral-400">Official links displayed in luxury storefront footer and journal.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Instagram Profile</label>
                      <Input
                        value={settings.social_instagram || ""}
                        onChange={(e) => handleChange("social_instagram", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">X / Twitter</label>
                      <Input
                        value={settings.social_twitter || ""}
                        onChange={(e) => handleChange("social_twitter", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">YouTube Atelier Channel</label>
                      <Input
                        value={settings.social_youtube || ""}
                        onChange={(e) => handleChange("social_youtube", e.target.value)}
                        className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SEO SETTINGS */}
              {activeTab === "seo" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">SEO & Global Metadata</h3>
                    <p className="text-xs text-neutral-400">Search engine title tags, rich snippets, and meta descriptions.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Default Meta Title</label>
                    <Input
                      value={settings.seo_meta_title || ""}
                      onChange={(e) => handleChange("seo_meta_title", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Meta Description</label>
                    <textarea
                      value={settings.seo_meta_description || ""}
                      onChange={(e) => handleChange("seo_meta_description", e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Global SEO Keywords</label>
                    <Input
                      value={settings.seo_keywords || ""}
                      onChange={(e) => handleChange("seo_keywords", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS SETTINGS */}
              {activeTab === "notifications" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-lg font-light text-white">Automated Alerts & Telemetry</h3>
                    <p className="text-xs text-neutral-400">Low stock alerts, order notifications, and concierge alerts.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Low-Stock Alert Vault Threshold (Units)</label>
                    <Input
                      type="number"
                      value={settings.notifications_low_stock_threshold || "3"}
                      onChange={(e) => handleChange("notifications_low_stock_threshold", e.target.value)}
                      className="bg-neutral-900 border-neutral-800 text-white text-xs font-mono max-w-xs"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">Triggers low stock warnings when piece inventory drops to this level or below.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="order_alerts"
                        checked={settings.notifications_order_alerts === "true"}
                        onChange={(e) => handleChange("notifications_order_alerts", e.target.checked ? "true" : "false")}
                        className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                      />
                      <label htmlFor="order_alerts" className="text-xs text-neutral-300 font-medium">
                        Send instant administrative alert on new client order placement
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="vip_alerts"
                        checked={settings.notifications_vip_inquiries === "true"}
                        onChange={(e) => handleChange("notifications_vip_inquiries", e.target.checked ? "true" : "false")}
                        className="h-4 w-4 rounded bg-neutral-900 border-neutral-700 text-gold focus:ring-gold"
                      />
                      <label htmlFor="vip_alerts" className="text-xs text-neutral-300 font-medium">
                        Direct priority routing for VIP Connoisseur inquiries
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold hover:bg-gold-light text-black font-medium text-xs px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving Configuration..." : "Commit Settings"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
