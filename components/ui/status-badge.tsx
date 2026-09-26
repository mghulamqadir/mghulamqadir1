import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
  available?: boolean;
}

export function StatusBadge({
  status = "Available for select opportunities",
  available = true,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#121316] border border-white/10 text-xs font-mono text-[#a1a1aa] shadow-inner",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {available && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            available ? "bg-emerald-500" : "bg-zinc-500"
          )}
        ></span>
      </span>
      <span>{status}</span>
    </div>
  );
}
