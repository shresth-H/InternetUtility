export interface ProcessorContext {
  jobId: string;
  toolSlug: string;
  inputBuffer: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export interface ProcessorResult {
  outputBuffer: Buffer;
  outputFileName: string;
  outputMimeType: string;
  metadata?: Record<string, unknown>;
}

export type FileProcessor = (ctx: ProcessorContext) => Promise<ProcessorResult>;

