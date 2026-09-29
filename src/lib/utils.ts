import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and custom class names cleanly without conflict.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a monetary integer in cents into a formatted luxury currency string.
 * Example: 2850000 -> "$28,500"
 */
export function formatCurrency(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats standard ISO or Date objects into human-readable luxury dates.
 * Example: "October 14, 2026"
 */
export function formatDate(
  date: Date | string | number,
  locale: string = "en-US"
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Formats SKU or Serial identifier with clean spacing.
 * Example: "ZV-8802-TI-01"
 */
export function formatSku(sku: string): string {
  return sku.toUpperCase();
}

/**
 * Truncates text cleanly for excerpt previews.
 */
export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}
