import React from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
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
        "text-xs md:text-sm font-mono tracking-wider uppercase flex items-center gap-2",
        accent ? "text-[#6c9cff]" : "text-[#71717a]",
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#5b8cff] inline-block" />
      {children}
    </p>
  );
}
