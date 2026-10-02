import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage/local-adapter";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const storage = getStorageAdapter();
  const file = storage.get(key);

  if (!file) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
    },
  });
}
