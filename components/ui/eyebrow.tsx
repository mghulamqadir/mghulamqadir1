import React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  accent?: boolean;
}

export function Eyebrow({
  children,
  className,
  accent = false,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-mono tracking-wider uppercase flex items-center gap-2",
        accent ? "text-accent" : "text-text-muted",
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" aria-hidden="true" />
      {children}
    </p>
  );
}
