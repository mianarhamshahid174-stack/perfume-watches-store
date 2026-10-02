"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductItem, ProductVariantItem } from "@/types/product";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  sku: string;
  price: number;
  imageUrl: string;
  quantity: number;
  variantTitle?: string | null;
  attributes?: Record<string, string> | null;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: ProductItem,
    variant?: ProductVariantItem | null,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "velora_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Initial sample luxury reservation for realistic demo
        setItems([
          {
            id: "cart-init-1",
            productId: "seed-prod-1",
            name: "VELORA SIGNATURE 01",
            slug: "velora-signature-01",
            sku: "VEL-SIG-01-BLK",
            price: 12500,
            imageUrl: "/images/velora-signature-01.jpg",
            quantity: 1,
            variantTitle: "Horween Noir Alligator Strap",
            attributes: { strap: "Horween Noir", case: "316L Stainless Steel" },
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to parse cart storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent("velora-cart-updated", { detail: items }));
    } catch (e) {
      console.error("Failed to sync cart storage:", e);
    }
  }, [items, isInitialized]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    product: ProductItem,
    variant?: ProductVariantItem | null,
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const targetSku = variant ? variant.sku : product.sku;
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          (variant ? item.variantId === variant.id : !item.variantId)
      );

      const primaryImage =
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        "/images/velora-signature-01.jpg";

      const effectivePrice = variant ? Number(variant.price) : Number(product.price);

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId: product.id,
          variantId: variant ? variant.id : null,
          name: product.name,
          slug: product.slug,
          sku: targetSku,
          price: effectivePrice,
          imageUrl: primaryImage,
          quantity,
          variantTitle: variant?.title || null,
          attributes: variant?.attributes || null,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      isCartOpen: false,
      openCart: () => {},
      closeCart: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    };
  }
  return context;
}
