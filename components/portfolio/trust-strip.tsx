import React from "react";
import { Container } from "@/components/ui/container";

export function TrustStrip() {
  const products = [
    { name: "CrowdAxis", domain: "AI Intelligence" },
    { name: "Klippify", domain: "Creator Platform" },
    { name: "Alevo", domain: "AI Coaching" },
    { name: "CampGenie", domain: "Marketplace & Booking" },
  ];

  return (
    <div className="w-full border-y border-white/[0.06] bg-[#0c0d10]/50 py-8">
      <Container>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
              Production Engineering
            </span>
            <span className="text-sm text-[#a1a1aa] font-medium mt-0.5">
              AI Pipelines • Scalable SaaS • Marketplaces • Stripe Payments
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {products.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-sm font-semibold text-white tracking-tight">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-[#71717a]">
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
