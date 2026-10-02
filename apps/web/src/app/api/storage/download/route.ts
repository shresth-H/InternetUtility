import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter } from "@/lib/storage";
import { recordClassBOperation } from "@/lib/storage/quota-guard";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const storage = getStorageAdapter();
  const buffer = await storage.getBuffer(key);

  if (!buffer) {
    return NextResponse.json({ error: "NOT_FOUND", message: "File not found or expired." }, { status: 404 });
  }

  // Record Class B read operation
  recordClassBOperation(1);

  const fileName = key.split("/").pop() || "download";
  const ext = fileName.split(".").pop()?.toLowerCase();

  let mimeType = "application/octet-stream";
  if (ext === "pdf") mimeType = "application/pdf";
  else if (ext === "png") mimeType = "image/png";
  else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  else if (ext === "webp") mimeType = "image/webp";
  else if (ext === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  else if (ext === "csv") mimeType = "text/csv";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
}

