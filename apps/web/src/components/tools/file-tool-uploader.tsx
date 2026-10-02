"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Upload, Download, Loader2, FileIcon, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

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
  const [isMaintenance, setIsMaintenance] = useState(false);

  const onFile = useCallback((f: File | null) => {
    setError(null);
    setJob(null);
    setIsMaintenance(false);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("File exceeds the maximum 25MB limit.");
      return;
    }
    setFile(f);
  }, []);

  async function processFile() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setIsMaintenance(false);

    try {
      const key = `uploads/${toolSlug}/${Date.now()}_${file.name}`;
      const formData = new FormData();
      formData.append("key", key);
      formData.append("file", file);

      const uploadRes = await fetch("/api/storage/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (uploadRes.status === 503 || uploadData.error === "SERVER_MAINTENANCE") {
        setIsMaintenance(true);
        setError(uploadData.message || "Server is in maintenance for scheduled optimization. Thanks for visiting!");
        return;
      }

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Upload failed");
      }

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

      const jobData = await jobRes.json();
      if (jobRes.status === 503 || jobData.error === "SERVER_MAINTENANCE") {
        setIsMaintenance(true);
        setError(jobData.message || "Server is in maintenance for scheduled optimization. Thanks for visiting!");
        return;
      }

      if (!jobRes.ok) {
        throw new Error(jobData.message || "Failed to create job");
      }

      const { jobId } = jobData;

      let status = "queued";
      let attempts = 0;
      while (status !== "completed" && status !== "failed" && attempts < 45) {
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
      {/* Maintenance State Banner */}
      {isMaintenance && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-950 dark:text-amber-100 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-base">Server in Maintenance — Capacity Optimization</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Thank you for visiting! File processing is temporarily resting while we optimize storage & cloud bandwidth capacity.
              </p>
              <div className="pt-2 border-t border-amber-500/20">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-300 mb-2">
                  All 19 client-side tools & calculators remain 100% active and free:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/emi-calculator" className="text-xs inline-flex items-center gap-1 font-medium bg-amber-500/20 px-2.5 py-1 rounded-md hover:bg-amber-500/30 transition-colors">
                    <Sparkles className="h-3 w-3" /> EMI Calculator
                  </Link>
                  <Link href="/cagr-calculator" className="text-xs inline-flex items-center gap-1 font-medium bg-amber-500/20 px-2.5 py-1 rounded-md hover:bg-amber-500/30 transition-colors">
                    <Sparkles className="h-3 w-3" /> CAGR Calculator
                  </Link>
                  <Link href="/json-formatter" className="text-xs inline-flex items-center gap-1 font-medium bg-amber-500/20 px-2.5 py-1 rounded-md hover:bg-amber-500/30 transition-colors">
                    <Sparkles className="h-3 w-3" /> JSON Formatter
                  </Link>
                  <Link href="/word-counter" className="text-xs inline-flex items-center gap-1 font-medium bg-amber-500/20 px-2.5 py-1 rounded-md hover:bg-amber-500/30 transition-colors">
                    <Sparkles className="h-3 w-3" /> Word Counter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFile(e.dataTransfer.files[0] ?? null);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card",
          file && "border-primary/50"
        )}
      >
        {file ? (
          <>
            <FileIcon className="h-10 w-10 text-primary mb-3" />
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted mb-3" />
            <p className="font-medium text-foreground">Drop file here</p>
            <p className="text-sm text-muted mt-1">or choose a file (max 25MB)</p>
          </>
        )}
        <label className="mt-4">
          <input
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <span className="cursor-pointer text-sm font-medium text-primary hover:underline">Choose File</span>
        </label>
      </div>

      {error && !isMaintenance && (
        <p className="text-sm text-[var(--danger)]" role="alert">{error}</p>
      )}

      <Button onClick={processFile} disabled={!file || loading || isMaintenance} className="w-full sm:w-auto">
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
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between animate-in fade-in">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Processing complete!</p>
            <p className="text-xs text-muted">Your file has been converted and is ready.</p>
          </div>
          <a href={job.downloadUrl} download>
            <Button variant="outline" size="sm" className="border-emerald-500/40 hover:bg-emerald-500/20">
              <Download className="h-4 w-4 mr-1.5" />
              Download Result
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

