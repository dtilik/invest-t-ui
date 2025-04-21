import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names with Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values
 */
export function formatCurrency(value, currency = "USD", options = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    ...options,
  }).format(value)
}

/**
 * Format percentage values
 */
export function formatPercent(value, options = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value / 100)
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(value, options = {}) {
  const formatter = new Intl.NumberFormat("en-US", options)
  
  if (Math.abs(value) >= 1_000_000_000) {
    return formatter.format(value / 1_000_000_000) + "B"
  }
  
  if (Math.abs(value) >= 1_000_000) {
    return formatter.format(value / 1_000_000) + "M"
  }
  
  if (Math.abs(value) >= 1_000) {
    return formatter.format(value / 1_000) + "K"
  }
  
  return formatter.format(value)
}
