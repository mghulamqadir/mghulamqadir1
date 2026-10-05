import React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "elevated" | "interactive";
}

export function Surface({
  children,
  className,
  elevation = "flat",
  ...props
}: SurfaceProps) {
  const elevationStyles = {
    flat: "bg-surface border-border",
    elevated: "bg-surface-2 border-border shadow-lg shadow-black/30",
    interactive:
      "bg-surface border-border hover:border-border-strong hover:bg-surface-2 transition-all duration-200 cursor-pointer",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 md:p-8 relative overflow-hidden transition-colors",
        elevationStyles[elevation],
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
