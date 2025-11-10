import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale: string, currency: string) {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(amount);
}

export function formatDate(date: Date, locale: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}
