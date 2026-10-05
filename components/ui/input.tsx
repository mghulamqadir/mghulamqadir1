import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full min-h-[48px] rounded-lg border bg-surface-2 px-4 py-3 text-text text-sm transition-colors",
          "placeholder:text-text-faint",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          error
            ? "border-danger focus-visible:ring-danger"
            : "border-border-strong hover:border-text-muted focus-visible:border-accent",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
