"use client";

import React from "react";
import { Server, Database, Bot, Cpu, Zap } from "lucide-react";

export function HeroSystemDiagram() {
  return (
    <div className="w-full relative rounded-2xl border border-border bg-surface p-6 lg:p-7 overflow-hidden shadow-xl shadow-black/40">
      {/* Screen reader accessible text alternative */}
      <div className="sr-only">
        System architecture diagram illustrating a three-stage event processing pipeline:
        Stage 1: Ingress &amp; Routing via Node.js API Gateway handling rate limiting and authentication (p99 latency under 28ms).
        Stage 2: Processing Engine via Event Orchestrator worker executing sequential pipeline stages with retry queues.
        Stage 3: Intelligence &amp; Data layer connecting to AI/RAG vector search and MongoDB Atlas indexed document persistence.
      </div>

      {/* Terminal / Diagram Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6 font-mono text-xs text-text-faint" aria-hidden="true">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong border border-border inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong border border-border inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong border border-border inline-block" />
          <span className="ml-2 text-text-muted font-medium">pipeline_topology.sys</span>
        </div>
        <div className="flex items-center gap-1.5 text-accent text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Active Pipeline</span>
        </div>
      </div>

      {/* System Flow Diagram (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 relative" aria-hidden="true">
        {/* Step 1: Ingress / Client API */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>01 Ingress & Routing</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-border hover:border-border-strong transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text">API Gateway</span>
              <span className="text-[10px] font-mono text-text-muted bg-surface px-2 py-0.5 rounded border border-border">Edge / Node</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Rate limiting, JWT token verification, and strict Zod schema validation.
            </p>
            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-faint">
              <span>p99: &lt; 28ms</span>
              <span className="text-emerald-400 font-medium">200 OK</span>
            </div>
          </div>
        </div>

        {/* Step 2: Processing & Core Logic */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-accent-2" />
            <span>02 Processing Engine</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-border hover:border-border-strong transition-colors relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-accent" />
                Event Orchestrator
              </span>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">Worker</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Sequential pipeline execution with context passing, retry queues, and telemetry.
            </p>
            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-faint">
              <span>Staged Pipeline</span>
              <span className="text-accent-2 font-medium">Async Queue</span>
            </div>
          </div>
        </div>

        {/* Step 3: AI & Persistence Layer */}
        <div className="flex flex-col gap-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span>03 Intelligence & Data</span>
          </div>

          <div className="space-y-2.5">
            {/* AI Node */}
            <div className="p-3 rounded-lg bg-surface-2 border border-border hover:border-border-strong transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-accent-2" />
                <div>
                  <div className="text-xs font-medium text-text">AI / RAG Pipeline</div>
                  <div className="text-[10px] font-mono text-text-faint">Perplexity & Vector Search</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Streamed</span>
            </div>

            {/* DB Node */}
            <div className="p-3 rounded-lg bg-surface-2 border border-border hover:border-border-strong transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-accent" />
                <div>
                  <div className="text-xs font-medium text-text">Document Database</div>
                  <div className="text-[10px] font-mono text-text-faint">MongoDB Atlas Cluster</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-accent-2 bg-accent-2/10 px-2 py-0.5 rounded">Indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric footer strip */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center" aria-hidden="true">
        <div>
          <div className="text-xs text-text-faint font-mono">Architecture</div>
          <div className="text-sm font-semibold text-text mt-0.5">Distributed / Event</div>
        </div>
        <div>
          <div className="text-xs text-text-faint font-mono">Data Validation</div>
          <div className="text-sm font-semibold text-text mt-0.5">Strict Zod / RLS</div>
        </div>
        <div>
          <div className="text-xs text-text-faint font-mono">AI Execution</div>
          <div className="text-sm font-semibold text-text mt-0.5">Multi-Stage RAG</div>
        </div>
        <div>
          <div className="text-xs text-text-faint font-mono">Fault Tolerance</div>
          <div className="text-sm font-semibold text-accent mt-0.5">Exponential Backoff</div>
        </div>
      </div>
    </div>
  );
}
