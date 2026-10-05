import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
  interactive?: boolean;
}

export function Card({
  children,
  className,
  featured = false,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-200 relative",
        featured
          ? "border-signature-gradient bg-surface shadow-2xl shadow-black/60"
          : "bg-surface border border-border shadow-sm",
        interactive &&
          "hover:border-border-strong hover:bg-surface-2 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Subtle top-lit gradient illumination */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
