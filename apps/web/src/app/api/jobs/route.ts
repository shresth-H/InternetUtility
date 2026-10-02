import { NextRequest, NextResponse } from "next/server";
import { createJob, processJobAsync } from "@/lib/jobs/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolSlug, inputKey, fileName, fileSize, mimeType } = body;

    if (!toolSlug || !inputKey || !fileName) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    if (fileSize > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
    }

    const job = createJob({ toolSlug, inputKey, fileName, fileSize, mimeType });
    processJobAsync(job.id);

    return NextResponse.json({ jobId: job.id, status: job.status });
  } catch {
    return NextResponse.json({ error: "PROCESSING_FAILED" }, { status: 500 });
  }
}
