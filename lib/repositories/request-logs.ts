import { randomUUID } from "crypto";
import type { Document } from "mongodb";
import { collection } from "@/lib/database/mongodb";
import { withoutMongoId, type RecordWithId } from "@/lib/database/documents";
import type { IpGroupedLog, PathVisit, RequestLog, RequestLogStats } from "@/lib/types";
import { hasMongo } from "@/lib/env";

export type RequestLogInput = Omit<RequestLog, "id" | "created_at">;

export async function recordRequestLog(data: RequestLogInput): Promise<void> {
  if (!hasMongo()) return;
  try {
    const col = await collection<RecordWithId>("request_logs");
    await col.insertOne({
      id: randomUUID(),
      ip: data.ip,
      method: data.method,
      path: data.path,
      query: data.query || null,
      user_agent: data.user_agent || null,
      referer: data.referer || null,
      country: data.country || null,
      city: data.city || null,
      region: data.region || null,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Non-blocking catch to ensure database errors never impact client requests
    console.error("Failed to record request log:", {
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}

export async function getRequestLogs(options: {
  page?: number;
  limit?: number;
  searchIp?: string;
  path?: string;
} = {}): Promise<{ logs: RequestLog[]; total: number }> {
  if (!hasMongo()) return { logs: [], total: 0 };
  try {
    const { page = 1, limit = 50, searchIp, path } = options;
    const filter: Record<string, unknown> = {};

    if (searchIp) {
      filter.ip = { $regex: searchIp.trim(), $options: "i" };
    }
    if (path) {
      filter.path = { $regex: path.trim(), $options: "i" };
    }

    const col = await collection<RecordWithId>("request_logs");
    const [total, rows] = await Promise.all([
      col.countDocuments(filter),
      col
        .find(filter)
        .sort({ created_at: -1 })
        .skip((Math.max(1, page) - 1) * limit)
        .limit(limit)
        .toArray(),
    ]);

    const logs = rows.map(withoutMongoId) as unknown as RequestLog[];
    return { logs, total };
  } catch (error) {
    console.error("Failed to fetch request logs:", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return { logs: [], total: 0 };
  }
}

export async function getGroupedRequestLogsByIp(options: {
  page?: number;
  limit?: number;
  searchIp?: string;
  path?: string;
} = {}): Promise<{ groups: IpGroupedLog[]; total: number }> {
  if (!hasMongo()) return { groups: [], total: 0 };
  try {
    const { page = 1, limit = 50, searchIp, path } = options;
    const filter: Record<string, unknown> = {};

    if (searchIp) {
      filter.ip = { $regex: searchIp.trim(), $options: "i" };
    }
    if (path) {
      filter.path = { $regex: path.trim(), $options: "i" };
    }

    const col = await collection<RecordWithId>("request_logs");
    const pipeline: Document[] = [];

    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    pipeline.push(
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: "$ip",
          total_requests: { $sum: 1 },
          last_seen: { $max: "$created_at" },
          first_seen: { $min: "$created_at" },
          country: { $first: "$country" },
          city: { $first: "$city" },
          region: { $first: "$region" },
          user_agent: { $first: "$user_agent" },
          visits: {
            $push: {
              method: "$method",
              path: "$path",
              query: "$query",
              created_at: "$created_at",
            },
          },
        },
      },
      { $sort: { last_seen: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: (Math.max(1, page) - 1) * limit },
            { $limit: limit },
          ],
        },
      }
    );

    const [result] = await col.aggregate(pipeline).toArray();
    const total = (result?.metadata?.[0] as { total?: number })?.total ?? 0;
    const groups: IpGroupedLog[] = ((result?.data ?? []) as Array<{
      _id: string;
      total_requests: number;
      first_seen: string;
      last_seen: string;
      country?: string | null;
      city?: string | null;
      region?: string | null;
      user_agent?: string | null;
      visits?: PathVisit[];
    }>).map((item) => ({
      ip: item._id,
      total_requests: item.total_requests,
      first_seen: item.first_seen,
      last_seen: item.last_seen,
      country: item.country || null,
      city: item.city || null,
      region: item.region || null,
      user_agent: item.user_agent || null,
      visits: (item.visits || []).map((v) => ({
        method: v.method,
        path: v.path,
        query: v.query || null,
        created_at: v.created_at,
      })),
    }));

    return { groups, total };
  } catch (error) {
    console.error("Failed to fetch grouped request logs by IP:", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return { groups: [], total: 0 };
  }
}

export async function getRequestLogStats(): Promise<RequestLogStats> {
  if (!hasMongo()) {
    return {
      totalToday: 0,
      uniqueIpsToday: 0,
      totalAllTime: 0,
      topPaths: [],
    };
  }

  try {
    const col = await collection<RecordWithId>("request_logs");
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const [totalAllTime, totalToday, uniqueIpsTodayResult, topPathsResult] =
      await Promise.all([
        col.countDocuments({}),
        col.countDocuments({ created_at: { $gte: todayIso } }),
        col
          .aggregate([
            { $match: { created_at: { $gte: todayIso } } },
            { $group: { _id: "$ip" } },
            { $count: "count" },
          ])
          .toArray(),
        col
          .aggregate<{ _id: string; count: number }>([
            { $group: { _id: "$path", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ])
          .toArray(),
      ]);

    const uniqueIpsToday = (uniqueIpsTodayResult[0] as { count?: number })?.count ?? 0;
    const topPaths = topPathsResult.map((item) => ({
      path: item._id,
      count: item.count,
    }));

    return {
      totalToday,
      uniqueIpsToday,
      totalAllTime,
      topPaths,
    };
  } catch (error) {
    console.error("Failed to fetch request log stats:", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return {
      totalToday: 0,
      uniqueIpsToday: 0,
      totalAllTime: 0,
      topPaths: [],
    };
  }
}
