import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
  available?: boolean;
}

export function StatusBadge({
  status = "Engineering Portfolio",
  available = false,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-mono text-text-muted shadow-sm select-none",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {available && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            available ? "bg-emerald-500" : "bg-accent"
          )}
        />
      </span>
      <span>{status}</span>
    </div>
  );
}
