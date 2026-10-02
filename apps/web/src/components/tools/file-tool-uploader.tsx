"use client";

import { useCallback, useState } from "react";
import { Upload, Download, Loader2, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface FileToolUploaderProps {
  toolSlug: string;
  accept: string;
  actionLabel: string;
}

type JobState = {
  id: string;
  status: string;
  downloadUrl?: string;
  error?: string;
};

export function FileToolUploader({ toolSlug, accept, actionLabel }: FileToolUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<JobState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File | null) => {
    setError(null);
    setJob(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 50MB.");
      return;
    }
    setFile(f);
  }, []);

  async function processFile() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const key = `uploads/${toolSlug}/${Date.now()}_${file.name}`;
      const formData = new FormData();
      formData.append("key", key);
      formData.append("file", file);

      const uploadRes = await fetch("/api/storage/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");

      const jobRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          inputKey: key,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      });
      if (!jobRes.ok) throw new Error("Failed to create job");
      const { jobId } = await jobRes.json();

      let status = "queued";
      let attempts = 0;
      while (status !== "completed" && status !== "failed" && attempts < 30) {
        await new Promise((r) => setTimeout(r, 1000));
        const pollRes = await fetch(`/api/jobs/${jobId}`);
        const pollData = await pollRes.json();
        status = pollData.status;
        if (status === "completed") {
          setJob({
            id: jobId,
            status,
            downloadUrl: pollData.downloadUrl,
          });
        } else if (status === "failed") {
          setError(pollData.error ?? "Processing failed");
        }
        attempts++;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files[0] ?? null);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card",
          file && "border-primary/50"
        )}
      >
        {file ? (
          <>
            <FileIcon className="h-10 w-10 text-primary mb-3" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted mb-3" />
            <p className="font-medium">Drop file here</p>
            <p className="text-sm text-muted mt-1">or choose a file</p>
          </>
        )}
        <label className="mt-4">
          <input
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <span className="cursor-pointer text-sm text-primary hover:underline">Choose File</span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)]" role="alert">{error}</p>
      )}

      <Button onClick={processFile} disabled={!file || loading} className="w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          actionLabel
        )}
      </Button>

      {job?.downloadUrl && (
        <div className="rounded-lg border border-border bg-accent/50 p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--success)]">Processing complete!</p>
          <a href={job.downloadUrl} download>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
