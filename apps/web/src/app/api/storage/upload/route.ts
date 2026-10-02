import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";
import { checkQuotaStatus, recordClassAOperation, recordStorageDelta } from "@/lib/storage/quota-guard";

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
          message: "Server is currently in maintenance for capacity optimization. Please check back shortly, or explore our free client-side calculators and developer tools!",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const key = formData.get("key") as string;
    const file = formData.get("file") as File;

    if (!key || !file) {
      return NextResponse.json({ error: "INVALID_INPUT", message: "Missing file or storage key." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", message: `File exceeds maximum allowed size of ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageAdapter();
    const result = await storage.putBuffer(key, buffer, file.type || "application/octet-stream");

    // Record Class A write operation and storage consumption
    recordClassAOperation(1);
    recordStorageDelta(buffer.length);

    return NextResponse.json({ key: result.key, url: result.url });
  } catch (err) {
    console.error("[Storage API] Upload failed:", err);
    return NextResponse.json({ error: "STORAGE_ERROR", message: "Failed to save uploaded file." }, { status: 500 });
  }
}

