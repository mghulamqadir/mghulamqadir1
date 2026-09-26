import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "default" | "compact" | "spacious";
}

export function Section({
  children,
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  const spacingClasses = {
    compact: "py-12 sm:py-16",
    default: "py-20 sm:py-28 lg:py-32",
    spacious: "py-28 sm:py-36 lg:py-40",
  };

  return (
    <section className={cn(spacingClasses[spacing], "relative", className)} {...props}>
      {children}
    </section>
  );
}
