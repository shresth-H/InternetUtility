export type JobStatus =
  | "created"
  | "uploading"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "retrying"
  | "failed_permanently"
  | "expired"
  | "cancelled";

export interface Job {
  id: string;
  toolSlug: string;
  status: JobStatus;
  progress?: number;
  inputKey: string;
  outputKey?: string;
  outputFileName?: string;
  outputMimeType?: string;
  error?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  attempt?: number;
  maxRetries?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateJobInput {
  toolSlug: string;
  inputKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  maxRetries?: number;
}

export interface QueueMessage {
  jobId: string;
  toolSlug: string;
  inputKey: string;
  outputKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  attempt: number;
  maxRetries: number;
}

export interface JobStore {
  create(input: CreateJobInput): Promise<Job>;
  get(id: string): Promise<Job | undefined>;
  update(id: string, update: Partial<Job>): Promise<Job | undefined>;
  delete(id: string): Promise<void>;
  listExpired(maxAgeMinutes: number): Promise<Job[]>;
}

