import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api-auth";
import { audit } from "@/lib/repositories/audit";
import {
  deleteRequestLogsByIds,
  deleteRequestLogsByIps,
  clearAllRequestLogs,
} from "@/lib/repositories/request-logs";
import { deleteRequestLogsSchema } from "@/lib/schema";

export async function DELETE(request: Request) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = deleteRequestLogsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid delete request payload" },
      { status: 400 }
    );
  }

  const { ids, ips, all } = parsed.data;
  let deletedCount = 0;

  if (all) {
    deletedCount = await clearAllRequestLogs();
    await audit(auth.user.id, "request_logs.cleared_all", "request_logs");
  } else if (ips && ips.length > 0) {
    deletedCount = await deleteRequestLogsByIps(ips);
    await audit(
      auth.user.id,
      "request_logs.deleted_by_ips",
      "request_logs",
      ips.slice(0, 10).join(", ") + (ips.length > 10 ? ` (+${ips.length - 10} more)` : "")
    );
  } else if (ids && ids.length > 0) {
    deletedCount = await deleteRequestLogsByIds(ids);
    await audit(
      auth.user.id,
      "request_logs.deleted_by_ids",
      "request_logs",
      ids.slice(0, 10).join(", ") + (ids.length > 10 ? ` (+${ids.length - 10} more)` : "")
    );
  }

  revalidatePath("/admin/logs");

  return NextResponse.json({ ok: true, deletedCount });
}
