import React from "react";
import { cn } from "@/lib/utils";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "elevated" | "interactive";
}

export function Surface({
  children,
  className,
  elevation = "flat",
  ...props
}: SurfaceProps) {
  const elevationStyles = {
    flat: "bg-[#121316] border-white/[0.08]",
    elevated: "bg-[#16171a] border-white/[0.12] shadow-lg shadow-black/20",
    interactive:
      "bg-[#121316] border-white/[0.08] hover:border-white/20 hover:bg-[#16171a] transition-all duration-200 cursor-pointer",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 md:p-8 relative overflow-hidden",
        elevationStyles[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
