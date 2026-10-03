"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getFirebaseAnalytics, logAnalyticsEvent } from "@/lib/firebase";

export function FirebaseAnalyticsProvider() {
  const pathname = usePathname();

  // Initialize analytics once on mount
  useEffect(() => {
    getFirebaseAnalytics().then((analytics) => {
      if (analytics) {
        logAnalyticsEvent("app_open", {
          brand: "VELORA Pakistan",
          platform: "Web",
        });
      }
    });
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!pathname) return;

    logAnalyticsEvent("page_view", {
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : pathname,
      brand: "VELORA Pakistan",
    });
  }, [pathname]);

  // Listen for custom e-commerce events dispatched in application
  useEffect(() => {
    const handleCartEvent = (event: CustomEvent) => {
      const items = event.detail;
      logAnalyticsEvent("cart_updated", {
        item_count: Array.isArray(items) ? items.length : 0,
      });
    };

    window.addEventListener("velora-cart-updated" as any, handleCartEvent);
    return () => {
      window.removeEventListener("velora-cart-updated" as any, handleCartEvent);
    };
  }, []);

  return null;
}
