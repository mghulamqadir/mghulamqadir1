"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-6"><h2 className="font-semibold">Admin workspace error</h2><p className="mt-2 text-sm text-[#a1a1aa]">The request could not be completed. Your data has not been changed.</p><button type="button" onClick={reset} className="mt-4 rounded-md border border-white/20 px-3 py-2 text-sm">Try again</button></div>;
}
