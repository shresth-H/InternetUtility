import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJobStatus, processJobAsync } from "@/lib/jobs/store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "NOT_FOUND", message: "Job not found." }, { status: 404 });
  }

  if (job.status === "completed") {
    return NextResponse.json({ id: job.id, status: job.status, message: "Job already completed." });
  }

  updateJobStatus(id, "queued");
  processJobAsync(id);

  return NextResponse.json({ id: job.id, status: "queued" });
}

