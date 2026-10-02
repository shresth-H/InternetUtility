import type { CreateJobInput, Job, JobStatus } from "./types";

const jobs = new Map<string, Job>();

function generateId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createJob(input: CreateJobInput): Job {
  const now = new Date().toISOString();
  const job: Job = {
    id: generateId(),
    toolSlug: input.toolSlug,
    status: "queued",
    inputKey: input.inputKey,
    fileName: input.fileName,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJobStatus(
  id: string,
  status: JobStatus,
  extra?: Partial<Pick<Job, "outputKey" | "error" | "completedAt">>
): Job | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  const updated: Job = {
    ...job,
    status,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
  jobs.set(id, updated);
  return updated;
}

export async function processJobAsync(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  updateJobStatus(jobId, "processing");

  // Simulate async processing — replace with real worker integration
  await new Promise((r) => setTimeout(r, 2000));

  // Placeholder: mark completed with same key (real worker would produce output)
  updateJobStatus(jobId, "completed", {
    outputKey: job.inputKey,
    completedAt: new Date().toISOString(),
  });
}
