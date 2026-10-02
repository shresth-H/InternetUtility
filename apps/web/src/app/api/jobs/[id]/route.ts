import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs/store";
import { getStorageAdapter } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "NOT_FOUND", message: "Job not found." }, { status: 404 });
  }

  const storage = getStorageAdapter();
  let downloadUrl: string | undefined = undefined;

  if (job.status === "completed" && job.outputKey) {
    downloadUrl = await storage.getDownloadUrl(job.outputKey, job.outputFileName);
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress ?? (job.status === "completed" ? 100 : job.status === "processing" ? 50 : 0),
    toolSlug: job.toolSlug,
    fileName: job.fileName,
    outputFileName: job.outputFileName,
    error: job.error,
    downloadUrl,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    completedAt: job.completedAt,
  });
}

