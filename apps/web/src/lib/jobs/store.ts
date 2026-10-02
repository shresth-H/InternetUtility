import type { CreateJobInput, Job, JobStatus, JobStore } from "./types";
import { executeJob } from "@/lib/worker/executor";

const jobsStore = new Map<string, Job>();

function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export class LocalJobStore implements JobStore {
  async create(input: CreateJobInput): Promise<Job> {
    const now = new Date().toISOString();
    const job: Job = {
      id: generateId(),
      toolSlug: input.toolSlug,
      status: "queued",
      progress: 0,
      inputKey: input.inputKey,
      fileName: input.fileName,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      attempt: 1,
      maxRetries: input.maxRetries || 3,
      createdAt: now,
      updatedAt: now,
    };
    jobsStore.set(job.id, job);
    return job;
  }

  async get(id: string): Promise<Job | undefined> {
    return jobsStore.get(id);
  }

  async update(id: string, update: Partial<Job>): Promise<Job | undefined> {
    const existing = jobsStore.get(id);
    if (!existing) return undefined;
    const updated: Job = {
      ...existing,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    jobsStore.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    jobsStore.delete(id);
  }

  async listExpired(maxAgeMinutes = 60): Promise<Job[]> {
    const now = Date.now();
    const cutoff = now - maxAgeMinutes * 60 * 1000;
    const expired: Job[] = [];

    for (const job of jobsStore.values()) {
      if (new Date(job.createdAt).getTime() < cutoff) {
        expired.push(job);
      }
    }
    return expired;
  }
}

const defaultJobStore = new LocalJobStore();

export function getJobStore(): JobStore {
  return defaultJobStore;
}

export function createJob(input: CreateJobInput): Job {
  const now = new Date().toISOString();
  const job: Job = {
    id: generateId(),
    toolSlug: input.toolSlug,
    status: "queued",
    progress: 0,
    inputKey: input.inputKey,
    fileName: input.fileName,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    attempt: 1,
    maxRetries: input.maxRetries || 3,
    createdAt: now,
    updatedAt: now,
  };
  jobsStore.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobsStore.get(id);
}

export function updateJobStatus(
  id: string,
  status: JobStatus,
  extra?: Partial<Pick<Job, "outputKey" | "outputFileName" | "outputMimeType" | "error" | "completedAt" | "progress" | "attempt">>
): Job | undefined {
  const job = jobsStore.get(id);
  if (!job) return undefined;
  const updated: Job = {
    ...job,
    status,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
  jobsStore.set(id, updated);
  return updated;
}

export async function processJobAsync(jobId: string): Promise<void> {
  // Execute real processor via the worker engine
  await executeJob(jobId);
}

