import React from "react";
import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="py-20 md:py-28 animate-pulse">
      <Container>
        {/* Skeleton Eyebrow & Title */}
        <div className="max-w-2xl space-y-4 mb-16">
          <div className="h-4 w-32 bg-surface-2 rounded-full border border-border" />
          <div className="h-12 w-3/4 bg-surface-2 rounded-xl border border-border" />
          <div className="h-5 w-full bg-surface rounded-lg border border-border" />
        </div>

        {/* Skeleton Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-7 space-y-5 h-64 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-8 w-8 rounded-lg bg-surface-2" />
                <div className="h-6 w-2/3 bg-surface-2 rounded" />
                <div className="h-4 w-full bg-surface-2/60 rounded" />
              </div>
              <div className="h-4 w-1/3 bg-surface-2 rounded" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
