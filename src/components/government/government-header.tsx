import Link from "next/link";
import { StateEmblemPlaceholder } from "./emblem";
import { TricolourAccent } from "./tricolour";
import { LanguageSwitcher } from "./language-switcher";
import { AccessibilityControls } from "./accessibility-controls";
import { SITE } from "@/constants/site";

/** Slim government identity bar shown on every page. */
export function GovernmentHeader() {
  return (
    <div role="region" aria-label="Government of India identity" className="no-print border-b border-line bg-surface">
      <TricolourAccent />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6">
        <Link href="/" className="flex min-h-9 items-center gap-2.5" aria-label="Government of India — AI Praman home">
          <StateEmblemPlaceholder size={34} />
          <span className="leading-tight">
            <span lang="hi" className="block text-[0.8rem] font-bold text-fg">भारत सरकार</span>
            <span className="block text-[0.7rem] font-medium uppercase tracking-wide text-muted">Government of India</span>
          </span>
        </Link>
        <p className="order-3 hidden basis-full text-center text-xs text-muted md:order-none md:block md:basis-auto">
          {SITE.officialBannerAuthorised ? SITE.officialInitiativeBanner : "Prototype — official identity, emblem and copy pending approval"}
        </p>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AccessibilityControls />
        </div>
      </div>
    </div>
  );
}
