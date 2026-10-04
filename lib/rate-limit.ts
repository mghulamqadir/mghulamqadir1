const entries = new Map<string, number>();

export function isRateLimited(key: string, windowMs: number, maxEntries = 1_000) {
  const now = Date.now();
  for (const [entry, timestamp] of entries) if (now - timestamp > windowMs) entries.delete(entry);
  if (entries.has(key)) return true;
  if (entries.size >= maxEntries) {
    const oldest = entries.keys().next().value;
    if (oldest) entries.delete(oldest);
  }
  entries.set(key, now);
  return false;
}
