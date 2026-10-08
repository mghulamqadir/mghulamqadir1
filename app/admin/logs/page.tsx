import React from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getRequestLogs, getRequestLogStats } from "@/lib/repositories/request-logs";
import { RequestLogsViewer } from "@/components/admin/request-logs-viewer";

export const metadata: Metadata = {
  title: "Visitor & Request Logs | Admin CMS",
  robots: { index: false, follow: false },
};

interface AdminLogsPageProps {
  searchParams: Promise<{
    page?: string;
    ip?: string;
    path?: string;
  }>;
}

export default async function AdminLogsPage({ searchParams }: AdminLogsPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const searchIp = params.ip || "";
  const searchPath = params.path || "";
  const pageSize = 50;

  const [{ logs, total }, stats] = await Promise.all([
    getRequestLogs({
      page,
      limit: pageSize,
      searchIp,
      path: searchPath,
    }),
    getRequestLogStats(),
  ]);

  return (
    <RequestLogsViewer
      initialLogs={logs}
      total={total}
      stats={stats}
      currentPage={page}
      pageSize={pageSize}
      searchIp={searchIp}
      searchPath={searchPath}
    />
  );
}
