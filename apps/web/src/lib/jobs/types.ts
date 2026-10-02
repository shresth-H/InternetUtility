export type JobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "expired"
  | "cancelled";

export interface Job {
  id: string;
  toolSlug: string;
  status: JobStatus;
  inputKey: string;
  outputKey?: string;
  error?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
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
}
