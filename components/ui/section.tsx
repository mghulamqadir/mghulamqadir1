import React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "default" | "compact" | "spacious";
}

export function Section({
  children,
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  const spacingClasses = {
    compact: "py-12 sm:py-16 md:py-20",
    default: "py-16 sm:py-24 md:py-28 lg:py-32",
    spacious: "py-24 sm:py-32 md:py-36 lg:py-40",
  };

  return (
    <section className={cn(spacingClasses[spacing], "relative w-full", className)} {...props}>
      {children}
    </section>
  );
}
