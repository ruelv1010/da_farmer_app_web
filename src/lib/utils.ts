import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Format a number as a currency string.
 * @param amount The number to format
 * @param currency The currency to use for formatting. Defaults to 'PHP'.
 * @returns A string representing the formatted amount.
 */
export function currencyFormat(amount: number, currency: 'PHP' | 'USD' = 'PHP') {
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return currencyFormat;
}

/**
 * Calculate age based on a given date of birth.
 * @param dateOfBirth A string representing the date of birth (e.g., '1990-01-01').
 * @returns The calculated age in years as a number.
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}