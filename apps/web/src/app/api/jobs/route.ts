import { NextRequest, NextResponse } from "next/server";
import { createJob, processJobAsync } from "@/lib/jobs/store";
import { getProcessor } from "@/lib/worker/registry";
import { checkQuotaStatus } from "@/lib/storage/quota-guard";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || "26214400", 10); // 25 MB default

export async function POST(request: NextRequest) {
  try {
    // 1. Quota & Safety Circuit Breaker Check
    const quota = checkQuotaStatus();
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "SERVER_MAINTENANCE",
          reason: quota.reason,
          message: "Server is currently in maintenance for scheduled optimization. Please check back shortly, or explore our free client-side calculators and developer tools!",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { toolSlug, inputKey, fileName, fileSize, mimeType } = body;

    if (!toolSlug || !fileName) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "toolSlug and fileName are required." },
        { status: 400 }
      );
    }

    // Check if tool processor exists
    const processor = getProcessor(toolSlug);
    if (!processor) {
      return NextResponse.json(
        { error: "UNSUPPORTED_TOOL", message: `Tool '${toolSlug}' is not supported.` },
        { status: 400 }
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "FILE_TOO_LARGE",
          message: `File size exceeds the maximum limit of ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB.`,
        },
        { status: 400 }
      );
    }

    const key = inputKey || `jobs/pending/${Date.now()}_${fileName}`;
    const job = createJob({
      toolSlug,
      inputKey: key,
      fileName,
      fileSize: fileSize || 0,
      mimeType: mimeType || "application/octet-stream",
    });

    // Asynchronously dispatch real processor
    processJobAsync(job.id);

    return NextResponse.json({
      jobId: job.id,
      id: job.id,
      status: job.status,
      inputKey: job.inputKey,
    });
  } catch (err) {
    console.error("[Jobs API] Job creation failed:", err);
    return NextResponse.json(
      { error: "PROCESSING_FAILED", message: "Failed to create processing job." },
      { status: 500 }
    );
  }
}

