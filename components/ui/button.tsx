import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "link" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex cursor-pointer select-none items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      // Primary: Moonlit Gold fill, dark ink text, subtle gold glow on hover
      primary:
        "bg-accent text-accent-ink font-semibold shadow-sm hover:bg-accent-strong hover:shadow-[0_0_24px_var(--accent-glow)] active:scale-[0.98]",
      // Accent variant behaves as primary for compatibility
      accent:
        "bg-accent text-accent-ink font-semibold shadow-sm hover:bg-accent-strong hover:shadow-[0_0_24px_var(--accent-glow)] active:scale-[0.98]",
      // Secondary: Elevated surface with strong border and soft text
      secondary:
        "border border-border-strong bg-surface text-text hover:bg-surface-2 hover:border-text-muted hover:text-text active:scale-[0.98]",
      // Outline: Subtle hairline border
      outline:
        "border border-border bg-transparent text-text hover:border-border-strong hover:bg-surface-2 active:scale-[0.98]",
      // Ghost: Background-free text button
      ghost:
        "bg-transparent text-text-muted hover:bg-surface-2 hover:text-text active:scale-[0.98]",
      // Link: Accent colored text with underline
      link:
        "bg-transparent text-accent hover:text-accent-strong underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizes = {
      sm: "gap-1.5 px-3 py-1.5 text-xs min-h-[36px]",
      md: "gap-2 px-4 py-2 text-sm min-h-[44px]",
      lg: "gap-2.5 px-6 py-3 text-base min-h-[48px]",
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (href) {
      const anchorProps = props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
      const linkProps = props as Omit<React.ComponentProps<typeof Link>, "href">;
      if (external) {
        return (
          <a
            {...anchorProps}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            aria-disabled={disabled}
          >
            {children}
          </a>
        );
      }
      return (
        <Link {...linkProps} href={href} className={classes} aria-disabled={disabled}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
