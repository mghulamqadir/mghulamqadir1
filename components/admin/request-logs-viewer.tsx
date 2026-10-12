"use client";

import React, { useState, useTransition, useEffect } from "react";
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
  Filter,
  Trash2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  X,
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

type DeleteModalState =
  | { type: "single-ip"; ip: string }
  | { type: "single-log"; id: string }
  | { type: "selected-ips"; count: number; ips: string[] }
  | { type: "selected-logs"; count: number; ids: string[] }
  | { type: "clear-all" }
  | null;

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

  // Multi-selection states
  const [selectedIps, setSelectedIps] = useState<Set<string>>(new Set());
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Dismiss delete popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && deleteModal && !isDeleting) {
        setDeleteModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteModal, isDeleting]);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage((current) => (current?.text === text ? null : current));
    }, 4500);
  };

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
    setSelectedIps(new Set());
    setSelectedLogIds(new Set());
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

  // Grouped selection helpers
  const toggleSelectIp = (ip: string) => {
    setSelectedIps((prev) => {
      const next = new Set(prev);
      if (next.has(ip)) next.delete(ip);
      else next.add(ip);
      return next;
    });
  };

  const allCurrentIpsSelected =
    initialGroupedLogs.length > 0 &&
    initialGroupedLogs.every((g) => selectedIps.has(g.ip));

  const toggleSelectAllIps = () => {
    if (allCurrentIpsSelected) {
      setSelectedIps((prev) => {
        const next = new Set(prev);
        initialGroupedLogs.forEach((g) => next.delete(g.ip));
        return next;
      });
    } else {
      setSelectedIps((prev) => {
        const next = new Set(prev);
        initialGroupedLogs.forEach((g) => next.add(g.ip));
        return next;
      });
    }
  };

  // Stream selection helpers
  const toggleSelectLog = (id: string) => {
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allCurrentLogsSelected =
    initialLogs.length > 0 &&
    initialLogs.every((l) => selectedLogIds.has(l.id));

  const toggleSelectAllLogs = () => {
    if (allCurrentLogsSelected) {
      setSelectedLogIds((prev) => {
        const next = new Set(prev);
        initialLogs.forEach((l) => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedLogIds((prev) => {
        const next = new Set(prev);
        initialLogs.forEach((l) => next.add(l.id));
        return next;
      });
    }
  };

  // Deletion logic execution
  const performDelete = async (payload: { ids?: string[]; ips?: string[]; all?: boolean }) => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/request-logs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        showStatus("error", data?.error || "Failed to delete request logs.");
        return false;
      }

      const count = data?.deletedCount ?? 0;
      showStatus("success", `Successfully deleted ${count} log record${count === 1 ? "" : "s"}.`);
      setSelectedIps(new Set());
      setSelectedLogIds(new Set());

      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch {
      showStatus("error", "A network error occurred while deleting request logs.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmModalDelete = async () => {
    if (!deleteModal) return;
    let success = false;
    if (deleteModal.type === "single-ip") {
      success = await performDelete({ ips: [deleteModal.ip] });
    } else if (deleteModal.type === "single-log") {
      success = await performDelete({ ids: [deleteModal.id] });
    } else if (deleteModal.type === "selected-ips") {
      success = await performDelete({ ips: deleteModal.ips });
    } else if (deleteModal.type === "selected-logs") {
      success = await performDelete({ ids: deleteModal.ids });
    } else if (deleteModal.type === "clear-all") {
      success = await performDelete({ all: true });
    }

    if (success) {
      setDeleteModal(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toISOString().replace("T", " ").replace("Z", "");
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Global Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#6c9cff]">
            Monitoring &amp; Telemetry
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Visitor &amp; Request Logs</h1>
          <p className="mt-1 text-sm text-[#8590A2]">
            Real-time IP tracking, visitor session journeys, and inbound request history.
          </p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDeleteModal({ type: "clear-all" })}
              disabled={isDeleting || isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-mono font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors disabled:opacity-50"
              title="Permanently remove all recorded request logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Logs</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Notification Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs font-mono border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

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
          {/* Grouped Select-All Toolbar */}
          {initialGroupedLogs.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0f1013] px-5 py-3 text-xs font-mono text-[#a1a1aa]">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allCurrentIpsSelected}
                  onChange={toggleSelectAllIps}
                  className="h-4 w-4 rounded border-white/20 bg-[#090a0d] text-[#5b8cff] focus:ring-[#5b8cff] cursor-pointer accent-[#5b8cff]"
                />
                <span className="text-white font-medium">Select all on this page</span>
                <span className="text-[#64748b]">({initialGroupedLogs.length} visitor IPs)</span>
              </label>

              {selectedIps.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-[#6c9cff] font-medium">
                    {selectedIps.size} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedIps(new Set())}
                    className="text-[#71717a] hover:text-white transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          )}

          {initialGroupedLogs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#121316] p-12 text-center text-[#71717a]">
              No visitor sessions found matching the filter criteria.
            </div>
          ) : (
            initialGroupedLogs.map((group) => {
              const isExpanded = expandedIps.has(group.ip);
              const isSelected = selectedIps.has(group.ip);

              return (
                <div
                  key={group.ip}
                  className={`rounded-2xl border bg-[#121316] overflow-hidden transition-all duration-200 ${
                    isSelected ? "border-[#5b8cff]/50 bg-[#12141c]" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* IP Card Header */}
                  <div
                    onClick={() => toggleIpExpand(group.ip)}
                    className="cursor-pointer p-5 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-[#14151a]"
                  >
                    {/* Left: Checkbox, IP & Location */}
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelectIp(group.ip)}
                        aria-label={`Select IP ${group.ip}`}
                        className="h-4 w-4 rounded border-white/20 bg-[#090a0d] text-[#5b8cff] focus:ring-[#5b8cff] cursor-pointer accent-[#5b8cff] mr-1"
                      />

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
                    <div className="flex items-center gap-3 text-xs font-mono text-[#a1a1aa]">
                      <div className="text-right mr-2">
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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({ type: "single-ip", ip: group.ip });
                        }}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
                        title="Delete all logs for this IP"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>

                      <div className="text-[#71717a] pl-1">
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
                  <th className="w-12 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={allCurrentLogsSelected}
                      onChange={toggleSelectAllLogs}
                      aria-label="Select all request logs on this page"
                      className="h-4 w-4 rounded border-white/20 bg-[#090a0d] text-[#5b8cff] focus:ring-[#5b8cff] cursor-pointer accent-[#5b8cff]"
                    />
                  </th>
                  <th className="px-5 py-3.5">Timestamp (UTC)</th>
                  <th className="px-5 py-3.5">Client IP</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Method &amp; Path</th>
                  <th className="px-5 py-3.5">User Agent</th>
                  <th className="w-16 px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#71717a]">
                      No request logs found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  initialLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    const isSelected = selectedLogIds.has(log.id);

                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-[#5b8cff]/5 hover:bg-[#5b8cff]/10" : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <td
                            className="w-12 px-4 py-3.5 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectLog(log.id)}
                              aria-label={`Select log ${log.id}`}
                              className="h-4 w-4 rounded border-white/20 bg-[#090a0d] text-[#5b8cff] focus:ring-[#5b8cff] cursor-pointer accent-[#5b8cff]"
                            />
                          </td>
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
                          <td
                            className="w-16 px-4 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setDeleteModal({ type: "single-log", id: log.id })}
                              disabled={isDeleting}
                              className="inline-flex items-center justify-center rounded p-1 text-[#71717a] hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 transition-colors"
                              title="Delete this log record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#0b0c0f]">
                            <td colSpan={7} className="px-6 py-4 text-xs font-mono space-y-2 border-y border-white/5">
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

      {/* Floating / Sticky Bulk Action Bar */}
      {((viewMode === "grouped" && selectedIps.size > 0) ||
        (viewMode === "stream" && selectedLogIds.size > 0)) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-white/20 bg-[#14161f]/95 px-6 py-3.5 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 font-mono text-xs text-white whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-[#5b8cff] animate-pulse" />
            <span>
              {viewMode === "grouped"
                ? `${selectedIps.size} IP${selectedIps.size === 1 ? "" : "s"} selected`
                : `${selectedLogIds.size} record${selectedLogIds.size === 1 ? "" : "s"} selected`}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          <button
            type="button"
            onClick={() =>
              viewMode === "grouped"
                ? setSelectedIps(new Set())
                : setSelectedLogIds(new Set())
            }
            disabled={isDeleting}
            className="font-mono text-xs text-[#a1a1aa] hover:text-white transition-colors whitespace-nowrap"
          >
            Deselect
          </button>

          <button
            type="button"
            onClick={() => {
              if (viewMode === "grouped") {
                const ips = Array.from(selectedIps);
                if (ips.length === 0) return;
                setDeleteModal({ type: "selected-ips", count: ips.length, ips });
              } else {
                const ids = Array.from(selectedLogIds);
                if (ids.length === 0) return;
                setDeleteModal({ type: "selected-logs", count: ids.length, ids });
              }
            }}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-red-500 disabled:opacity-50 transition-colors shadow-lg shadow-red-950/50 whitespace-nowrap"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected</span>
              </>
            )}
          </button>
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

      {/* Custom Delete Confirmation Modal (Pop-up instead of browser alert) */}
      {deleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={() => !isDeleting && setDeleteModal(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#14161f] p-6 sm:p-7 shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-150 z-10">
            {/* Close button */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setDeleteModal(null)}
              className="absolute top-5 right-5 rounded-lg p-1.5 text-[#71717a] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              {/* Warning Icon Badge */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="flex-1 pr-6">
                <h3 className="text-lg font-bold text-white">
                  {deleteModal.type === "clear-all"
                    ? "Clear All Visitor & Request Logs"
                    : deleteModal.type === "selected-ips"
                    ? `Delete ${deleteModal.count} Selected IP Sessions`
                    : deleteModal.type === "selected-logs"
                    ? `Delete ${deleteModal.count} Selected Log Records`
                    : deleteModal.type === "single-ip"
                    ? "Delete IP Visitor Logs"
                    : "Delete Request Log Record"}
                </h3>

                <div className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
                  {deleteModal.type === "clear-all" && (
                    <p>
                      Are you sure you want to permanently purge{" "}
                      <span className="font-semibold text-white">ALL visitor and request logs</span> from the database? This action is irreversible and all historical telemetry will be wiped.
                    </p>
                  )}

                  {deleteModal.type === "selected-ips" && (
                    <p>
                      Are you sure you want to delete all logs for the{" "}
                      <span className="font-semibold text-white">{deleteModal.count} selected IP address(es)</span>? All journey history and visited paths under these IPs will be permanently deleted.
                    </p>
                  )}

                  {deleteModal.type === "selected-logs" && (
                    <p>
                      Are you sure you want to delete the{" "}
                      <span className="font-semibold text-white">{deleteModal.count} selected request log record(s)</span>? This action cannot be undone.
                    </p>
                  )}

                  {deleteModal.type === "single-ip" && (
                    <p>
                      Are you sure you want to delete all request logs for IP{" "}
                      <span className="font-mono font-semibold text-white bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        {deleteModal.ip}
                      </span>
                      ? All visited paths recorded for this visitor will be permanently removed.
                    </p>
                  )}

                  {deleteModal.type === "single-log" && (
                    <p>
                      Are you sure you want to permanently delete this log entry? This action cannot be undone.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-7 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModal(null)}
                className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-xs font-mono text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmModalDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-950/40 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>
                      {deleteModal.type === "clear-all"
                        ? "Yes, Clear All Logs"
                        : "Confirm Delete"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
