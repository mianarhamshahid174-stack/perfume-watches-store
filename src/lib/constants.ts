export const BRAND = {
  name: "ZAVEN",
  tagline: "Haute Horlogerie & High Perfumery",
  subtitle: "Maison de Création Horlogère & Olfactive",
  founded: "2024",
  atelierLocation: "Geneva & Grasse",
  currency: "USD",
  email: "concierge@zaven-atelier.com",
  phone: "+41 22 819 00 00",
} as const;

export const STOREFRONT_NAV = [
  { label: "Haute Horlogerie", href: "/watches" },
  { label: "High Perfumery", href: "/fragrances" },
  { label: "Collections", href: "/collections" },
  { label: "The Maison", href: "/maison" },
  { label: "Private Concierge", href: "/concierge" },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Catalog & Timepieces", href: "/admin/products", icon: "Watch" },
  { label: "Orders & Vault", href: "/admin/orders", icon: "PackageCheck" },
  { label: "Collector Inquiries", href: "/admin/inquiries", icon: "MessageSquareQuote" },
  { label: "Atelier Settings", href: "/admin/settings", icon: "Sliders" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Payment Verification", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  PAYMENT_CONFIRMED: { label: "Payment Secured", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  IN_ATELIER_ASSEMBLY: { label: "Atelier Crafting", color: "text-gold-400 bg-gold-400/10 border-gold-400/20" },
  DISPATCHED_SECURE_COURIER: { label: "Armored Transit", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  DELIVERED: { label: "Hand Delivered", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  CANCELLED: { label: "Cancelled", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
  REFUNDED: { label: "Refunded", color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20" },
};
