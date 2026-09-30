import { create } from "zustand";

export interface ToastItem { id: number; title: string; description?: string; tone: "success" | "error" | "info" }
interface ToastState { items: ToastItem[]; push: (t: Omit<ToastItem, "id">) => void; dismiss: (id: number) => void }
let n = 0;

export const useToasts = create<ToastState>((set) => ({
  items: [],
  push: (t) => {
    const id = ++n;
    set((s) => ({ items: [...s.items, { ...t, id }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((x) => x.id !== id) })), 5200);
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}));

export const toast = {
  success: (title: string, description?: string) => useToasts.getState().push({ title, description, tone: "success" }),
  error: (title: string, description?: string) => useToasts.getState().push({ title, description, tone: "error" }),
  info: (title: string, description?: string) => useToasts.getState().push({ title, description, tone: "info" }),
};
