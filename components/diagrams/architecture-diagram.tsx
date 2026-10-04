export function ArchitectureDiagram({ value }: { value: string }) {
  const nodes = value.split(/→|->|\n/).map((node) => node.trim()).filter(Boolean);
  if (!nodes.length) return null;
  return <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0f1012] p-5"><div className="flex min-w-max items-center gap-3">{nodes.map((node, index) => <div key={`${node}-${index}`} className="flex items-center gap-3"><span className="max-w-44 rounded-lg border border-white/10 bg-[#16171a] px-4 py-3 text-center font-mono text-xs text-[#fafafa]">{node}</span>{index < nodes.length - 1 && <span aria-hidden className="font-mono text-[#5b8cff]">→</span>}</div>)}</div></div>;
}
