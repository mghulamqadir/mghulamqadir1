import React from "react";

export function ArchitectureDiagram({ value }: { value: string }) {
  const nodes = value
    .split(/→|->|\n/)
    .map((node) => node.trim())
    .filter(Boolean);

  if (!nodes.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {/* Screen reader text alternative */}
      <ol className="sr-only">
        {nodes.map((node, index) => (
          <li key={`sr-${node}-${index}`}>
            Step {index + 1}: {node}
          </li>
        ))}
      </ol>

      {/* Visual node flow */}
      <div className="flex min-w-max items-center gap-3" aria-hidden="true">
        {nodes.map((node, index) => (
          <div key={`${node}-${index}`} className="flex items-center gap-3">
            <span className="max-w-52 rounded-xl border border-border bg-surface-2 px-4 py-3 text-center font-mono text-xs text-text shadow-sm hover:border-border-strong transition-colors">
              {node}
            </span>
            {index < nodes.length - 1 && (
              <span className="font-mono text-accent text-sm select-none font-bold">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
