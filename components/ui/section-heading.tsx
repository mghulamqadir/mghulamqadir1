import React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-10 md:mb-14",
        align === "center" ? "items-center text-center mx-auto" : "items-start",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-heading-2 text-text tracking-tight font-semibold">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-body-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
