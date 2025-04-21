import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatCurrencyOptions extends Intl.NumberFormatOptions {}
interface FormatPercentOptions extends Intl.NumberFormatOptions {}
interface FormatNumberOptions extends Intl.NumberFormatOptions {}

/**
 * Format currency values
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  options: FormatCurrencyOptions = {}
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    ...options,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercent(
  value: number,
  options: FormatPercentOptions = {}
): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value / 100);
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {}
): string {
  const formatter = new Intl.NumberFormat("en-US", options);

  if (Math.abs(value) >= 1_000_000_000) {
    return formatter.format(value / 1_000_000_000) + "B";
  } else if (Math.abs(value) >= 1_000_000) {
    return formatter.format(value / 1_000_000) + "M";
  } else if (Math.abs(value) >= 1_000) {
    return formatter.format(value / 1_000) + "K";
  }

  return formatter.format(value);
}
