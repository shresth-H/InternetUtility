import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage/local-adapter";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const key = formData.get("key") as string;
    const file = formData.get("file") as File;

    if (!key || !file) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageAdapter();
    const result = await storage.putLocal(key, buffer, file.type);

    return NextResponse.json({ key: result.key, url: result.url });
  } catch {
    return NextResponse.json({ error: "STORAGE_ERROR" }, { status: 500 });
  }
}
