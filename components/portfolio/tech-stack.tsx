import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Technology } from "@/lib/types";

export function TechStack({ technologies }: { technologies: Technology[] }) {
  const groups = technologies.reduce<Record<string, Technology[]>>((result, technology) => { (result[technology.category] ??= []).push(technology); return result; }, {});
  if (!Object.keys(groups).length) return null;
  return <section className="relative border-y border-white/[0.06] bg-[#0c0d10] py-20 md:py-28"><Container><div className="mb-16 max-w-2xl space-y-4"><Eyebrow>Technical practice</Eyebrow><h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tools I work with</h2><p className="text-base leading-relaxed text-[#a1a1aa] sm:text-lg">Technologies selected for dependable delivery, useful constraints, and maintainable systems.</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Object.entries(groups).map(([category, items]) => <section key={category} className="rounded-xl border border-white/[0.08] bg-[#121316] p-6"><h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#6c9cff]">{category}</h3><div className="flex flex-wrap gap-2">{items.map((item) => <span key={item.id ?? item.name} className="rounded-md border border-white/5 bg-[#16171a] px-2.5 py-1 font-mono text-xs text-[#fafafa]">{item.name}</span>)}</div></section>)}</div></Container></section>;
}
