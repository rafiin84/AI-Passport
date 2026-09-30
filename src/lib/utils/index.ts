import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Course } from "@/types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Date(iso).toLocaleDateString("en-IN", opts);
}

export function timeAgo(iso: string, now = new Date("2026-09-29T12:00:00Z")) {
  const days = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export function formatPrice(c: Pick<Course, "price" | "priceType" | "provider">) {
  if (c.priceType === "free") return "Free";
  if (c.priceType === "free_audit") return "Free to audit";
  if (c.priceType === "subscription") return "With subscription";
  if (c.price === 0) return "See provider for price";
  return `₹${c.price.toLocaleString("en-IN")}`;
}

export const maskAadhaar = (digits: string) => `XXXX XXXX ${digits.replace(/\D/g, "").slice(-4).padStart(4, "X")}`;

export const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

export const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100));

export const uid = (p = "id") => `${p}-${Math.random().toString(36).slice(2, 9)}`;

export function ageFromDob(dob: string, now = new Date("2026-09-29")) {
  const b = new Date(dob);
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}

export const pluralise = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
