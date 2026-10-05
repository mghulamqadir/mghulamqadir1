import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "secondary" | "outline" | "success" | "warning";
  font?: "mono" | "sans";
}

export function Badge({
  children,
  className,
  variant = "default",
  font = "mono",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-2 text-text-muted border-border hover:border-border-strong",
    accent: "bg-accent/10 text-accent border-accent/25 hover:border-accent/40",
    secondary: "bg-accent-2/10 text-accent-2 border-accent-2/25 hover:border-accent-2/40",
    outline: "bg-transparent text-text-muted border-border hover:border-border-strong",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  };

  const fontStyles =
    font === "mono" ? "font-mono text-xs" : "font-sans text-xs font-medium";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border tracking-tight transition-colors select-none",
        fontStyles,
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const Tag = Badge;
