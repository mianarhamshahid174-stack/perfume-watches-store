import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { VipWelcomePopup } from "@/components/storefront/vip-welcome-popup";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-obsidian text-sand-100 overflow-x-hidden selection:bg-gold-500 selection:text-black">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <VipWelcomePopup />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
