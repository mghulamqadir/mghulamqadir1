import { ArrowUpRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return <section className="relative py-20 md:py-28"><Container><div className="mb-16 max-w-2xl space-y-4"><Eyebrow>Endorsements</Eyebrow><h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">What collaborators say</h2></div><div className="grid gap-6 md:grid-cols-3">{testimonials.map((item) => <article key={item.id} className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0f1012] p-6"><div><Quote className="mb-4 h-5 w-5 text-[#5b8cff] opacity-75" /><p className="mb-6 text-sm italic leading-relaxed text-[#a1a1aa]">“{item.testimonial}”</p></div><div className="flex items-center justify-between border-t border-white/[0.06] pt-4"><div><h3 className="text-sm font-semibold tracking-tight text-white">{item.name}</h3><p className="font-mono text-xs text-[#71717a]">{[item.job_title, item.company].filter(Boolean).join(" • ")}</p></div>{item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="rounded p-1.5 text-[#71717a] hover:text-white" aria-label={`Open ${item.name}'s source`}><ArrowUpRight className="h-4 w-4" /></a>}</div></article>)}</div></Container></section>;
}
