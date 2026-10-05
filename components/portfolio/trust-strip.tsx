import React from "react";
import { Container } from "@/components/ui/container";

export function TrustStrip() {
  const products = [
    { name: "CrowdAxis", domain: "AI Event Intelligence" },
    { name: "Klippify", domain: "Creator Platform & Billing" },
    { name: "Alevo", domain: "AI Coaching Assistant" },
    { name: "CampGenie", domain: "Marketplace & Stripe Connect" },
  ];

  return (
    <div className="w-full border-y border-border bg-bg-elevated/60 py-6 sm:py-8">
      <Container>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Engineered Deployments
            </span>
            <span className="text-sm text-text-faint font-medium mt-0.5">
              Event Pipelines • High-Throughput APIs • Stripe Connect • LLM Orchestration
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {products.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-sm font-semibold text-text tracking-tight">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-text-faint">
                  {item.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
