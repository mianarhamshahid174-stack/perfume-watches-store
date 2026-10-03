/**
 * Currency and localization utility for VELORA Pakistan
 * Primary Market: Pakistan
 * Currency: PKR (Pakistani Rupee - Rs. / ₨)
 */

export const DEFAULT_CURRENCY = "PKR";
export const DEFAULT_CURRENCY_SYMBOL = "Rs.";

/**
 * Format a numeric price as Pakistani Rupee (PKR)
 * Example: 65000 -> "Rs. 65,000"
 */
export function formatPrice(
  amount: number,
  options: { includeCode?: boolean; symbol?: string } = {}
): string {
  const rounded = Math.round(amount || 0);
  const formatted = rounded.toLocaleString("en-PK");

  if (options.includeCode) {
    return `PKR ${formatted}`;
  }
  const symbol = options.symbol || DEFAULT_CURRENCY_SYMBOL;
  return `${symbol} ${formatted}`;
}

/**
 * Format specifically as PKR
 */
export function formatPKR(
  amount: number,
  options: { includeCode?: boolean } = {}
): string {
  return formatPrice(amount, options);
}

/**
 * Legacy conversion helper if needed for calculations
 */
export const USD_TO_PKR_RATE = 280;

export function usdToPKR(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_PKR_RATE);
}

export function formatDualPrice(pkrAmount: number): {
  pkr: string;
  usd: string;
} {
  const usdApprox = Math.round(pkrAmount / USD_TO_PKR_RATE);
  return {
    pkr: formatPrice(pkrAmount),
    usd: `$${usdApprox.toLocaleString("en-US")} USD`,
  };
}

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Islamabad Capital Territory",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

export const MAJOR_PAKISTAN_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Wah Cantt",
  "Gujrat",
  "Jhelum",
  "Rahim Yar Khan",
];

export const PAKISTAN_PAYMENT_METHODS = [
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    subtitle: "Pay cash upon inspecting and receiving your parcel at your doorstep.",
    badge: "Most Popular in Pakistan",
  },
  {
    id: "bank_transfer",
    title: "Direct Bank Transfer / Raast",
    subtitle: "Transfer instantly via Meezan Bank, HBL, Alfalah, or any Raast ID.",
    badge: "Instant Confirmation",
  },
  {
    id: "mobile_wallet",
    title: "JazzCash / EasyPaisa",
    subtitle: "Pay securely via your mobile wallet account.",
    badge: "Fast & Convenient",
  },
  {
    id: "online_card",
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, and UnionPay processed with 3D Secure verification.",
    badge: "100% Encrypted",
  },
];
