"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductItem } from "@/types/product";
import { useCart } from "./cart-context";

export interface WishlistItemData {
  id?: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  imageUrl: string;
  collectionName?: string | null;
  inStock?: boolean;
}

interface WishlistContextType {
  items: WishlistItemData[];
  itemCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: ProductItem | WishlistItemData) => Promise<void>;
  addItem: (item: WishlistItemData) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToCart: (itemOrId: WishlistItemData | string) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "velora_wishlist_items";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItemData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addToCart } = useCart();

  // 1. Initialize from localStorage and check logged-in DB sync
  useEffect(() => {
    async function initWishlist() {
      let localItems: WishlistItemData[] = [];
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          localItems = JSON.parse(stored);
        }
      } catch (e) {}

      // Try fetching from logged-in DB
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.items) && json.items.length > 0) {
            // Merge with local items
            const mergedMap = new Map<string, WishlistItemData>();
            json.items.forEach((i: WishlistItemData) => mergedMap.set(i.productId, i));
            localItems.forEach((i) => {
              if (!mergedMap.has(i.productId)) mergedMap.set(i.productId, i);
            });
            const merged = Array.from(mergedMap.values());
            setItems(merged);
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(merged));
            setIsInitialized(true);
            return;
          }
        }
      } catch (e) {}

      setItems(localItems);
      setIsInitialized(true);
    }

    initWishlist();
  }, []);

  // 2. Persist to localStorage whenever items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      // Also update the simple array of IDs for components reading velora_wishlist
      const idList = items.map((i) => i.productId);
      localStorage.setItem("velora_wishlist", JSON.stringify(idList));
      window.dispatchEvent(new CustomEvent("velora-wishlist-updated", { detail: items }));
    } catch (e) {}
  }, [items, isInitialized]);

  const isWishlisted = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const toggleWishlist = async (product: any) => {
    const pId = product.productId || product.id;
    const exists = isWishlisted(pId);

    if (exists) {
      await removeFromWishlist(pId);
    } else {
      const primaryImage =
        product.imageUrl ||
        product.images?.[0]?.url ||
        "/images/velora-signature-01.jpg";

      const newItem: WishlistItemData = {
        productId: pId,
        name: product.name,
        slug: product.slug,
        sku: product.sku || "REF. VELORA",
        price: Number(product.price),
        imageUrl: primaryImage,
        collectionName: product.collectionName || product.collections?.[0]?.collection?.name || null,
        inStock: (product.inventory?.quantity ?? 1) > 0,
      };

      setItems((prev) => [...prev, newItem]);

      // If logged in, save to PostgreSQL
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: pId }),
        });
      } catch (e) {}
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    // If logged in, delete from PostgreSQL
    try {
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
    } catch (e) {}
  };

  const addItem = async (item: WishlistItemData) => {
    if (!isWishlisted(item.productId)) {
      await toggleWishlist(item);
    }
  };

  const removeItem = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const moveToCart = async (itemOrId: WishlistItemData | string) => {
    const item =
      typeof itemOrId === "string"
        ? items.find((i) => i.productId === itemOrId)
        : itemOrId;

    if (!item) return;

    // Add to cart
    addToCart(
      {
        id: item.productId,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        price: item.price,
        shortDescription: "",
        description: "",
        status: "PUBLISHED",
        featured: false,
        images: [{ id: "img-1", url: item.imageUrl, sortOrder: 1, isPrimary: true }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      null,
      1
    );

    // Remove from wishlist
    await removeFromWishlist(item.productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isWishlisted,
        toggleWishlist,
        addItem,
        removeItem,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      items: [],
      itemCount: 0,
      isWishlisted: () => false,
      toggleWishlist: async () => {},
      addItem: async () => {},
      removeItem: async () => {},
      removeFromWishlist: async () => {},
      moveToCart: async () => {},
      clearWishlist: () => {},
    };
  }
  return context;
}
