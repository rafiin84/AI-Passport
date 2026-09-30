"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useUi } from "@/store/ui";
import { Toaster } from "@/components/ui/toaster";

function UiSync() {
  const { theme, textScale, highContrast, reduceMotion, language } = useUi();
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => { document.documentElement.style.fontSize = `${textScale}%`; }, [textScale]);
  useEffect(() => { document.documentElement.dataset.contrast = highContrast ? "high" : "normal"; }, [highContrast]);
  useEffect(() => { document.documentElement.classList.toggle("reduce-motion", reduceMotion); }, [reduceMotion]);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return null;
}

function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}

function NetworkBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return <div role="status" className="fixed inset-x-0 top-0 z-[120] bg-saffron px-4 py-2 text-center text-sm font-semibold text-[#1a1000]">You're offline. Saved progress on this device is safe — reconnect to continue.</div>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const reduceMotion = useUi((s) => s.reduceMotion);
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false, retry: 1 } } }));
  return (
    <QueryClientProvider client={client}>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        <UiSync /><ServiceWorker /><NetworkBanner />
        {children}
        <Toaster />
      </MotionConfig>
    </QueryClientProvider>
  );
}
