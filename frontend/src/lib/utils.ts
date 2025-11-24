import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | bigint,
  locale: string,
  currency: string
) {
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

export function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export function setCookie(
  name: string,
  value: string,
  days: number = 30
): void {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}`;
}
