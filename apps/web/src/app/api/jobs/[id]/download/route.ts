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

  if (job.status !== "completed" || !job.outputKey) {
    return NextResponse.json(
      { error: "JOB_NOT_COMPLETED", message: `Job is currently in '${job.status}' state.` },
      { status: 400 }
    );
  }

  const storage = getStorageAdapter();
  const downloadUrl = await storage.getDownloadUrl(job.outputKey, job.outputFileName);

  return NextResponse.json({
    id: job.id,
    downloadUrl,
    outputFileName: job.outputFileName,
  });
}

