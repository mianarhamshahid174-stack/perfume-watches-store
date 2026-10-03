import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { VipWelcomePopup } from "@/components/storefront/vip-welcome-popup";
import { WhatsAppConcierge } from "@/components/storefront/whatsapp-concierge";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden selection:bg-gold-500/20 selection:text-gold-600 dark:selection:bg-gold-500 dark:selection:text-black transition-colors duration-300">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <VipWelcomePopup />
          <WhatsAppConcierge />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
