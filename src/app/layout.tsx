import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { SITE } from "@/constants/site";

const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: { default: "AI Passport — AI skills badhao. India ko aage badhao.", template: "%s · AI Passport" },
  description: "Find your AI level, learn the skills that matter, prove what you know and show India what you built.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" },
  applicationName: SITE.name,
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FAF8F4" }, { media: "(prefers-color-scheme: dark)", color: "#080E1D" }], width: "device-width", initialScale: 1 };

// Applies saved theme/text-size before paint to avoid a flash.
const noFlash = `try{var s=JSON.parse(localStorage.getItem('ai-passport-ui')||'{}').state||{};var d=s.theme==='dark'||((!s.theme||s.theme==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';if(s.textScale)r.style.fontSize=s.textScale+'%';if(s.highContrast)r.dataset.contrast='high';if(s.language)r.lang=s.language;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: noFlash }} /></head>
      <body className="min-h-dvh font-sans">
        <a href="#main" className="fixed left-3 top-3 z-[200] -translate-y-24 rounded-full bg-brand px-5 py-3 font-semibold text-brand-fg focus:translate-y-0">Skip to main content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
