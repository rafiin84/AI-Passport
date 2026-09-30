"use client";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition-[transform,background-color,box-shadow,color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-fg shadow-card hover:brightness-110",
        saffron: "bg-saffron text-[#1a1000] shadow-card hover:brightness-105",
        secondary: "bg-surface text-fg border border-line hover:bg-surface-2",
        ghost: "text-fg hover:bg-surface-2",
        soft: "bg-brand-soft text-brand hover:brightness-95",
        danger: "bg-danger text-[var(--danger-fg)] hover:brightness-110",
      },
      size: { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-[0.95rem]", lg: "h-14 px-7 text-base", icon: "size-11" },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

type Common = VariantProps<typeof buttonStyles> & { loading?: boolean };
type BtnProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, BtnProps | LinkProps>(function Button(props, ref) {
  const { variant, size, block, loading, className, children, ...rest } = props as Common & { className?: string; children?: React.ReactNode } & Record<string, unknown>;
  const cls = cn(buttonStyles({ variant, size, block }), className);
  if ("href" in props && props.href) {
    const { href, external, ...a } = rest as unknown as LinkProps;
    if (external) return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} target="_blank" rel="noopener noreferrer" className={cls} {...a}>{children}</a>;
    return <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...a}>{children}</Link>;
  }
  const b = rest as unknown as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={b.type ?? "button"} className={cls} aria-busy={loading || undefined} {...b} disabled={b.disabled || loading}>
      {loading && <CircleNotch className="size-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
