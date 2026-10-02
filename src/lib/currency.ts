/**
 * Currency and localization utility for VELORA Ateliers
 * Primary Market: Pakistan
 * Currency: PKR (Pakistani Rupee)
 */

export const USD_TO_PKR_RATE = 280;

/**
 * Convert USD amount to PKR
 */
export function usdToPKR(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_PKR_RATE);
}

/**
 * Format a number as Pakistani Rupee (PKR)
 * Example: 3500000 -> "₨ 3,500,000" or "PKR 3,500,000"
 */
export function formatPKR(
  amount: number,
  options: { includeCode?: boolean; fromUSD?: boolean } = {}
): string {
  const pkrValue = options.fromUSD ? usdToPKR(amount) : Math.round(amount);
  const formatted = pkrValue.toLocaleString("en-PK");

  if (options.includeCode) {
    return `PKR ${formatted}`;
  }
  return `₨ ${formatted}`;
}

/**
 * Dual price display helper (PKR with subtle USD reference)
 */
export function formatDualPrice(usdAmount: number): {
  pkr: string;
  usd: string;
} {
  return {
    pkr: formatPKR(usdAmount, { fromUSD: true }),
    usd: `$${usdAmount.toLocaleString("en-US")} USD`,
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
  "Karachi",
  "Lahore",
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
];
