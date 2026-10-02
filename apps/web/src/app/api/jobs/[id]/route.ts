import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs/store";
import { getStorageAdapter } from "@/lib/storage/local-adapter";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const storage = getStorageAdapter();
  const downloadUrl =
    job.status === "completed" && job.outputKey
      ? await storage.getDownloadUrl(job.outputKey)
      : undefined;

  return NextResponse.json({
    id: job.id,
    status: job.status,
    toolSlug: job.toolSlug,
    error: job.error,
    downloadUrl,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  });
}
