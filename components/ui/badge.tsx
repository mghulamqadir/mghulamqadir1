import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "success";
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
    default: "bg-[#16171a] text-[#a1a1aa] border-white/10 hover:border-white/20",
    accent: "bg-[#5b8cff]/10 text-[#6c9cff] border-[#5b8cff]/30",
    outline: "bg-transparent text-[#a1a1aa] border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const fontStyles = font === "mono" ? "font-mono text-xs" : "font-sans text-xs font-medium";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border tracking-tight transition-colors",
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
