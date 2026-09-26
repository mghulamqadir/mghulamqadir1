import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatMonthYear(date: string): string {
  const [year, month] = date.split("-").map(Number);
  if (!year || !month) return date;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatExperienceDateRange(
  startDate: string,
  endDate: string | null | undefined,
  currentRole: boolean,
): string {
  const endLabel = currentRole ? "Present" : endDate ? formatMonthYear(endDate) : "";
  return endLabel ? `${formatMonthYear(startDate)} — ${endLabel}` : formatMonthYear(startDate);
}

