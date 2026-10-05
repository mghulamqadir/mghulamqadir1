import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-surface-2 p-4 text-text text-sm transition-colors resize-y",
          "placeholder:text-text-faint leading-relaxed",
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

Textarea.displayName = "Textarea";
