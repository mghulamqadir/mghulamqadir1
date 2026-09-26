"use client";

import React from "react";
import { Server, Database, Bot, Cpu, Zap } from "lucide-react";

export function HeroSystemDiagram() {
  return (
    <div className="w-full relative rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 lg:p-8 overflow-hidden shadow-2xl">
      {/* Background glow and subtle dot grid */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5b8cff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#6edaff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal / Diagram Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6 font-mono text-xs text-[#71717a]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40 inline-block" />
          <span className="ml-2 text-[#a1a1aa] font-medium">architecture_topology.sys</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Pipeline</span>
        </div>
      </div>

      {/* System Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative">
        {/* Step 1: Ingress / Client API */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#5b8cff]" />
            <span>01 Ingress & Routing</span>
          </div>
          <div className="p-4 rounded-xl bg-[#121316] border border-white/10 hover:border-[#5b8cff]/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white">API Gateway</span>
              <span className="text-[10px] font-mono text-[#a1a1aa] bg-white/5 px-2 py-0.5 rounded">Node / Edge</span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Rate limiting, JWT auth verification, and schema validation.
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#71717a]">
              <span>p99: &lt; 28ms</span>
              <span className="text-emerald-400">200 OK</span>
            </div>
          </div>
        </div>

        {/* Step 2: Processing & Core Logic */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#6c9cff]" />
            <span>02 Processing Engine</span>
          </div>
          <div className="p-4 rounded-xl bg-[#16171a] border border-[#5b8cff]/30 shadow-lg shadow-[#5b8cff]/5 relative">
            <div className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5b8cff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5b8cff]" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#5b8cff]" />
                Event Orchestrator
              </span>
              <span className="text-[10px] font-mono text-[#6c9cff] bg-[#5b8cff]/10 px-2 py-0.5 rounded">Worker</span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Sequential pipeline stages with context passing and retry queues.
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#71717a]">
              <span>7 Stages</span>
              <span className="text-[#6c9cff]">Async Task</span>
            </div>
          </div>
        </div>

        {/* Step 3: AI & Persistence Layer */}
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>03 Intelligence & Data</span>
          </div>

          <div className="space-y-2.5">
            {/* AI Node */}
            <div className="p-3 rounded-lg bg-[#121316] border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-[#6edaff]" />
                <div>
                  <div className="text-xs font-medium text-white">AI / RAG Pipeline</div>
                  <div className="text-[10px] font-mono text-[#71717a]">Perplexity & Vector Search</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Streamed</span>
            </div>

            {/* DB Node */}
            <div className="p-3 rounded-lg bg-[#121316] border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <div>
                  <div className="text-xs font-medium text-white">PostgreSQL / Supabase</div>
                  <div className="text-[10px] font-mono text-[#71717a]">ACID • RLS Protected</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">Indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric footer strip */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xs text-[#71717a] font-mono">Architecture</div>
          <div className="text-sm font-semibold text-white mt-0.5">Distributed / Event</div>
        </div>
        <div>
          <div className="text-xs text-[#71717a] font-mono">Data Validation</div>
          <div className="text-sm font-semibold text-white mt-0.5">Strict Zod / RLS</div>
        </div>
        <div>
          <div className="text-xs text-[#71717a] font-mono">AI Execution</div>
          <div className="text-sm font-semibold text-white mt-0.5">Multi-Stage RAG</div>
        </div>
        <div>
          <div className="text-xs text-[#71717a] font-mono">Reliability</div>
          <div className="text-sm font-semibold text-emerald-400 mt-0.5">99.9% Fault-Tolerant</div>
        </div>
      </div>
    </div>
  );
}
