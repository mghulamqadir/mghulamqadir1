import { randomUUID } from "crypto";
import type { Document, Filter } from "mongodb";
import { collection } from "@/lib/database/mongodb";
import type { IpGroupedLog, PathVisit, RequestLog, RequestLogStats } from "@/lib/types";
import { hasMongo } from "@/lib/env";

export type RequestLogInput = Omit<RequestLog, "id" | "created_at">;

type RequestLogDocument = Document & Omit<RequestLog, "created_at"> & { created_at: Date };
const MAX_VISITS_PER_IP = 100;

export function escapePrefixRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter(searchIp?: string, path?: string): Filter<RequestLogDocument> {
  const filter: Filter<RequestLogDocument> = {};
  if (searchIp?.trim()) filter.ip = { $regex: `^${escapePrefixRegex(searchIp.trim())}` };
  if (path?.trim()) filter.path = { $regex: `^${escapePrefixRegex(path.trim())}` };
  return filter;
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toRequestLog(row: RequestLogDocument): RequestLog {
  const { _id, created_at, ...value } = row;
  void _id;
  return { ...value, created_at: toIso(created_at) } as RequestLog;
}

export async function recordRequestLog(data: RequestLogInput): Promise<void> {
  if (!hasMongo()) return;
  try {
    const col = await collection<RequestLogDocument>("request_logs");
    await col.insertOne({
      id: randomUUID(), ip: data.ip, method: data.method, path: data.path,
      query: data.query || null, user_agent: data.user_agent || null,
      referer: data.referer || null, country: data.country || null,
      city: data.city || null, region: data.region || null, created_at: new Date(),
    });
  } catch (error) {
    console.error("Failed to record request log:", { message: error instanceof Error ? error.message : "unknown" });
  }
}

export async function getRequestLogs(options: { page?: number; limit?: number; searchIp?: string; path?: string } = {}): Promise<{ logs: RequestLog[]; total: number }> {
  if (!hasMongo()) return { logs: [], total: 0 };
  try {
    const { page = 1, limit = 50, searchIp, path } = options;
    const filter = buildFilter(searchIp, path);
    const col = await collection<RequestLogDocument>("request_logs");
    const [total, rows] = await Promise.all([
      col.countDocuments(filter),
      col.find(filter).sort({ created_at: -1 }).skip((Math.max(1, page) - 1) * limit).limit(limit).toArray(),
    ]);
    return { logs: rows.map(toRequestLog), total };
  } catch (error) {
    console.error("Failed to fetch request logs:", { message: error instanceof Error ? error.message : "unknown" });
    return { logs: [], total: 0 };
  }
}

export async function getGroupedRequestLogsByIp(options: { page?: number; limit?: number; searchIp?: string; path?: string } = {}): Promise<{ groups: IpGroupedLog[]; total: number }> {
  if (!hasMongo()) return { groups: [], total: 0 };
  try {
    const { page = 1, limit = 50, searchIp, path } = options;
    const filter = buildFilter(searchIp, path);
    const col = await collection<RequestLogDocument>("request_logs");
    const [summary] = await col.aggregate<{
      metadata: Array<{ total: number }>;
      data: Array<{ _id: string; total_requests: number; first_seen: Date; last_seen: Date; country?: string | null; city?: string | null; region?: string | null; user_agent?: string | null }>;
    }>([
      { $match: filter },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: "$ip", total_requests: { $sum: 1 }, last_seen: { $max: "$created_at" }, first_seen: { $min: "$created_at" },
          country: { $first: "$country" }, city: { $first: "$city" }, region: { $first: "$region" }, user_agent: { $first: "$user_agent" },
        }
      },
      { $sort: { last_seen: -1 } },
      { $facet: { metadata: [{ $count: "total" }], data: [{ $skip: (Math.max(1, page) - 1) * limit }, { $limit: limit }] } },
    ]).toArray();

    const rows = summary?.data ?? [];
    const ips = rows.map((row) => row._id);
    const visitRows = ips.length ? await col.aggregate<RequestLogDocument & { visit_rank: number }>([
      { $match: { ...filter, ip: { $in: ips } } },
      { $setWindowFields: { partitionBy: "$ip", sortBy: { created_at: -1 }, output: { visit_rank: { $documentNumber: {} } } } },
      { $match: { visit_rank: { $lte: MAX_VISITS_PER_IP } } },
      { $sort: { ip: 1, created_at: -1 } },
    ]).toArray() : [];

    const visitsByIp = new Map<string, PathVisit[]>();
    for (const visit of visitRows) {
      const visits = visitsByIp.get(visit.ip) ?? [];
      visits.push({ method: visit.method, path: visit.path, query: visit.query ?? null, created_at: toIso(visit.created_at) });
      visitsByIp.set(visit.ip, visits);
    }

    return {
      total: summary?.metadata?.[0]?.total ?? 0,
      groups: rows.map((row) => ({
        ip: row._id, total_requests: row.total_requests, first_seen: toIso(row.first_seen), last_seen: toIso(row.last_seen),
        country: row.country || null, city: row.city || null, region: row.region || null, user_agent: row.user_agent || null,
        visits: visitsByIp.get(row._id) ?? [], visits_truncated: row.total_requests > MAX_VISITS_PER_IP,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch grouped request logs by IP:", { message: error instanceof Error ? error.message : "unknown" });
    return { groups: [], total: 0 };
  }
}

export async function getRequestLogStats(): Promise<RequestLogStats> {
  if (!hasMongo()) return { totalToday: 0, uniqueIpsToday: 0, totalAllTime: 0, topPaths: [] };
  try {
    const col = await collection<RequestLogDocument>("request_logs");
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const [result] = await col.aggregate<{
      totalAllTime: Array<{ count: number }>;
      today: Array<{ total: number; uniqueIps: string[] }>;
      topPaths: Array<{ _id: string; count: number }>;
    }>([{
      $facet: {
        totalAllTime: [{ $count: "count" }],
        today: [{ $match: { created_at: { $gte: todayStart } } }, { $group: { _id: null, total: { $sum: 1 }, uniqueIps: { $addToSet: "$ip" } } }],
        topPaths: [{ $group: { _id: "$path", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }],
      }
    }]).toArray();
    const today = result?.today?.[0];
    return {
      totalToday: today?.total ?? 0,
      uniqueIpsToday: today?.uniqueIps?.length ?? 0,
      totalAllTime: result?.totalAllTime?.[0]?.count ?? 0,
      topPaths: (result?.topPaths ?? []).map((item) => ({ path: item._id, count: item.count })),
    };
  } catch (error) {
    console.error("Failed to fetch request log stats:", { message: error instanceof Error ? error.message : "unknown" });
    return { totalToday: 0, uniqueIpsToday: 0, totalAllTime: 0, topPaths: [] };
  }
}

export async function deleteRequestLogsByIds(ids: string[]): Promise<number> {
  if (!hasMongo() || !ids.length) return 0;
  try { return (await collection<RequestLogDocument>("request_logs")).deleteMany({ id: { $in: ids } }).then((result) => result.deletedCount ?? 0); }
  catch (error) { console.error("Failed to delete request logs by IDs:", { message: error instanceof Error ? error.message : "unknown" }); return 0; }
}

export async function deleteRequestLogsByIps(ips: string[]): Promise<number> {
  if (!hasMongo() || !ips.length) return 0;
  try { return (await collection<RequestLogDocument>("request_logs")).deleteMany({ ip: { $in: ips } }).then((result) => result.deletedCount ?? 0); }
  catch (error) { console.error("Failed to delete request logs by IPs:", { message: error instanceof Error ? error.message : "unknown" }); return 0; }
}

export async function clearAllRequestLogs(): Promise<number> {
  if (!hasMongo()) return 0;
  try { return (await collection<RequestLogDocument>("request_logs")).deleteMany({}).then((result) => result.deletedCount ?? 0); }
  catch (error) { console.error("Failed to clear all request logs:", { message: error instanceof Error ? error.message : "unknown" }); return 0; }
}
