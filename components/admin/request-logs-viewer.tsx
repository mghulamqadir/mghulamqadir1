"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  RotateCcw,
  Globe,
  Activity,
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ListFilter,
  Layers,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import type { IpGroupedLog, RequestLog, RequestLogStats } from "@/lib/types";

interface RequestLogsViewerProps {
  viewMode: "grouped" | "stream";
  initialLogs: RequestLog[];
  initialGroupedLogs: IpGroupedLog[];
  total: number;
  stats: RequestLogStats;
  currentPage: number;
  pageSize: number;
  searchIp?: string;
  searchPath?: string;
}

export function RequestLogsViewer({
  viewMode,
  initialLogs,
  initialGroupedLogs,
  total,
  stats,
  currentPage,
  pageSize,
  searchIp = "",
  searchPath = "",
}: RequestLogsViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [ipInput, setIpInput] = useState(searchIp);
  const [pathInput, setPathInput] = useState(searchPath);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [expandedIps, setExpandedIps] = useState<Set<string>>(() => {
    // Default: expand the first 3 IPs in grouped mode for immediate visual clarity
    return new Set(initialGroupedLogs.slice(0, 3).map((g) => g.ip));
  });
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const applyFilters = (
    newIp: string,
    newPath: string,
    newView = viewMode,
    newPage = 1
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newView === "stream") {
      params.set("view", "stream");
    } else {
      params.delete("view"); // "grouped" is default
    }

    if (newIp.trim()) params.set("ip", newIp.trim());
    else params.delete("ip");

    if (newPath.trim()) params.set("path", newPath.trim());
    else params.delete("path");

    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");

    startTransition(() => {
      router.push(`/admin/logs?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(ipInput, pathInput, viewMode, 1);
  };

  const handleReset = () => {
    setIpInput("");
    setPathInput("");
    startTransition(() => {
      router.push(viewMode === "stream" ? "/admin/logs?view=stream" : "/admin/logs");
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    applyFilters(ipInput, pathInput, viewMode, newPage);
  };

  const handleSwitchView = (newView: "grouped" | "stream") => {
    if (newView === viewMode) return;
    applyFilters(ipInput, pathInput, newView, 1);
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const toggleIpExpand = (ip: string) => {
    setExpandedIps((prev) => {
      const next = new Set(prev);
      if (next.has(ip)) next.delete(ip);
      else next.add(ip);
      return next;
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toISOString().replace("T", " ").replace("Z", "");
  };

  const formatTimeOnly = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().slice(11, 19);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#6c9cff]">
            Monitoring &amp; Telemetry
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Visitor &amp; Request Logs</h1>
          <p className="mt-1 text-sm text-[#8590A2]">
            Real-time IP tracking, visitor session journeys, and inbound request history.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#121316] p-5">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs uppercase tracking-wider font-mono">Hits Today</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {stats.totalToday.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#71717a]">UTC Calendar Day</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#121316] p-5">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs uppercase tracking-wider font-mono">Unique IPs Today</span>
            <Users className="h-4 w-4 text-[#6c9cff]" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {stats.uniqueIpsToday.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#71717a]">Distinct Client Addresses</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#121316] p-5">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs uppercase tracking-wider font-mono">Total Recorded</span>
            <Globe className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {stats.totalAllTime.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#71717a]">All-time Log Retention</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#121316] p-5">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs uppercase tracking-wider font-mono">Top Requested Path</span>
            <Compass className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-3 font-mono text-lg font-bold text-white truncate">
            {stats.topPaths[0]?.path || "/"}
          </p>
          <p className="mt-1 text-xs text-[#71717a]">
            {stats.topPaths[0] ? `${stats.topPaths[0].count.toLocaleString()} visits` : "No visits recorded"}
          </p>
        </div>
      </div>

      {/* Top Paths Bar */}
      {stats.topPaths.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#0f1013] p-4 text-xs font-mono">
          <span className="text-[#71717a] mr-3 uppercase font-semibold">Top Destinations:</span>
          <div className="mt-2 flex flex-wrap gap-2 sm:mt-0 sm:inline-flex">
            {stats.topPaths.map((p) => (
              <button
                key={p.path}
                type="button"
                onClick={() => {
                  setPathInput(p.path);
                  applyFilters(ipInput, p.path, viewMode, 1);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#16181e] px-2.5 py-1 text-xs text-[#cbd5e1] hover:border-white/20 hover:text-white"
              >
                <span>{p.path}</span>
                <span className="text-[#64748b]">({p.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => handleSwitchView("grouped")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "grouped"
                ? "bg-[#5b8cff] text-white shadow-sm"
                : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Grouped by IP (Visitor Journeys)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchView("stream")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "stream"
                ? "bg-[#5b8cff] text-white shadow-sm"
                : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
            }`}
          >
            <ListFilter className="h-4 w-4" />
            <span>All Requests (Stream)</span>
          </button>
        </div>

        {/* Filter Inputs */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#121316] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="Search by IP address (e.g. 192.168.1.1)..."
                className="w-full rounded-lg border border-white/10 bg-[#090a0d] py-2 pl-9 pr-3 text-sm text-white placeholder-[#71717a] focus:border-[#5b8cff] focus:outline-none"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
                placeholder="Search by Path (e.g. /projects)..."
                className="w-full rounded-lg border border-white/10 bg-[#090a0d] py-2 pl-9 pr-3 text-sm text-white placeholder-[#71717a] focus:border-[#5b8cff] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#5b8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b7cee] disabled:opacity-50"
            >
              {isPending ? "Filtering…" : "Filter"}
            </button>
            {(searchIp || searchPath) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      {viewMode === "grouped" ? (
        /* GROUPED BY IP VIEW */
        <div className="space-y-4">
          {initialGroupedLogs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#121316] p-12 text-center text-[#71717a]">
              No visitor sessions found matching the filter criteria.
            </div>
          ) : (
            initialGroupedLogs.map((group) => {
              const isExpanded = expandedIps.has(group.ip);

              return (
                <div
                  key={group.ip}
                  className="rounded-2xl border border-white/10 bg-[#121316] overflow-hidden transition-all duration-200 hover:border-white/20"
                >
                  {/* IP Card Header */}
                  <div
                    onClick={() => toggleIpExpand(group.ip)}
                    className="cursor-pointer p-5 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-[#14151a]"
                  >
                    {/* Left: IP & Location */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white">
                          {group.ip}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyIp(group.ip);
                          }}
                          className="text-[#64748b] hover:text-white"
                          title="Copy IP"
                        >
                          {copiedIp === group.ip ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Location Badge */}
                      {group.country ? (
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2.5 py-1 font-mono border border-white/10 text-xs text-[#cbd5e1]">
                          <span>{group.country}</span>
                          {group.city && <span className="text-[#64748b]">• {group.city}</span>}
                        </span>
                      ) : (
                        <span className="rounded bg-white/5 px-2.5 py-1 font-mono text-xs text-[#71717a]">
                          Local / Direct
                        </span>
                      )}

                      {/* Visit Count Badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5b8cff]/10 border border-[#5b8cff]/20 px-3 py-0.5 text-xs font-semibold text-[#6c9cff]">
                        {group.total_requests} {group.total_requests === 1 ? "page visit" : "pages visited"}
                      </span>
                    </div>

                    {/* Right: Timestamp & Actions */}
                    <div className="flex items-center gap-4 text-xs font-mono text-[#a1a1aa]">
                      <div className="text-right">
                        <div>
                          Last active:{" "}
                          <span className="text-white font-medium">
                            {formatDate(group.last_seen)}
                          </span>
                        </div>
                        {group.first_seen !== group.last_seen && (
                          <div className="text-[#71717a] text-[11px] mt-0.5">
                            First seen: {formatDate(group.first_seen)}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIpInput(group.ip);
                          applyFilters(group.ip, pathInput, "grouped", 1);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-xs text-[#cbd5e1] hover:bg-white/5 hover:text-white"
                        title="Filter only this IP"
                      >
                        <Filter className="h-3 w-3" />
                        <span>Filter IP</span>
                      </button>

                      <div className="text-[#71717a]">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Visited Paths Timeline */}
                  {isExpanded && (
                    <div className="border-t border-white/10 bg-[#0c0d10] p-5 sm:p-6">
                      <div className="mb-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#71717a] uppercase font-semibold tracking-wider flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#6c9cff]" />
                          Visited Paths Timeline ({group.visits.length} records)
                        </span>
                        <span className="text-[#52525b]">Order: Chronological (Newest First)</span>
                      </div>

                      {/* Chronological List of Paths */}
                      <div className="space-y-2 font-mono text-xs">
                        {group.visits.map((visit, idx) => (
                          <div
                            key={`${visit.created_at}-${idx}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-white/5 bg-[#14161d] hover:border-white/15 transition-colors"
                          >
                            {/* Path and Method */}
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  visit.method === "GET"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : visit.method === "POST"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {visit.method}
                              </span>
                              <span className="font-semibold text-white">
                                {visit.path}
                              </span>
                              {visit.query && (
                                <span className="text-[#64748b] text-[11px] truncate max-w-[200px]">
                                  {visit.query}
                                </span>
                              )}
                            </div>

                            {/* Exact Timestamp */}
                            <div className="text-right text-[#a1a1aa] text-xs shrink-0 flex items-center gap-3 sm:justify-end">
                              <span className="text-white font-medium">
                                {formatDate(visit.created_at)}
                              </span>
                              <span className="text-[#64748b] text-[11px]">UTC</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* User-Agent footer if available */}
                      {group.user_agent && (
                        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#64748b] truncate">
                          <span className="text-[#71717a] mr-2">Browser / Agent:</span>
                          <span className="text-[#94a3b8]">{group.user_agent}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* RAW REQUEST STREAM TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121316]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-[#0d0e11] font-mono text-xs uppercase text-[#71717a]">
                <tr>
                  <th className="px-5 py-3.5">Timestamp (UTC)</th>
                  <th className="px-5 py-3.5">Client IP</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Method &amp; Path</th>
                  <th className="px-5 py-3.5">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[#71717a]">
                      No request logs found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  initialLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;

                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs text-[#a1a1aa] whitespace-nowrap">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-white whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{log.ip}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyIp(log.ip);
                                }}
                                className="text-[#64748b] hover:text-white"
                                title="Copy IP"
                              >
                                {copiedIp === log.ip ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#cbd5e1] whitespace-nowrap">
                            {log.country ? (
                              <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 font-mono border border-white/10 text-[11px]">
                                <span>{log.country}</span>
                                {log.city && <span className="text-[#64748b]">• {log.city}</span>}
                              </span>
                            ) : (
                              <span className="text-[#52525b] font-mono">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                                  log.method === "GET"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : log.method === "POST"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {log.method}
                              </span>
                              <span className="font-mono text-xs text-white max-w-[280px] truncate" title={log.path}>
                                {log.path}
                              </span>
                              {log.query && (
                                <span className="font-mono text-[11px] text-[#64748b] truncate max-w-[150px]">
                                  {log.query}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#71717a] max-w-[240px] truncate font-mono">
                            {log.user_agent || "—"}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#0b0c0f]">
                            <td colSpan={5} className="px-6 py-4 text-xs font-mono space-y-2 border-y border-white/5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#cbd5e1]">
                                <div>
                                  <span className="text-[#64748b] block mb-1 uppercase text-[10px]">Full User-Agent</span>
                                  <div className="p-2 rounded bg-black/40 border border-white/5 break-all text-[11px] text-[#94a3b8]">
                                    {log.user_agent || "None specified"}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[#64748b] block mb-1 uppercase text-[10px]">HTTP Referer</span>
                                  <div className="p-2 rounded bg-black/40 border border-white/5 break-all text-[11px] text-[#94a3b8]">
                                    {log.referer || "Direct / None"}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-[#71717a]">
        <div>
          Showing{" "}
          <span className="text-white font-semibold">
            {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="text-white font-semibold">
            {Math.min(currentPage * pageSize, total)}
          </span>{" "}
          of <span className="text-white font-semibold">{total.toLocaleString()}</span>{" "}
          {viewMode === "grouped" ? "unique visitor IPs" : "total requests"}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || isPending}
            onClick={() => handlePageChange(currentPage - 1)}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 hover:bg-white/5 text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>
          <span className="px-2 text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => handlePageChange(currentPage + 1)}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 hover:bg-white/5 text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
