import { getJob, updateJobStatus } from "@/lib/jobs/store";
import { getStorageAdapter } from "@/lib/storage";
import { getProcessor } from "./registry";
import type { ProcessorContext } from "./types";

const MAX_EXECUTION_TIMEOUT_MS = parseInt(process.env.JOB_TIMEOUT_SECONDS || "60", 10) * 1000;

export async function executeJob(jobId: string): Promise<void> {
  const job = await getJob(jobId);
  if (!job) {
    console.error(`[Worker] Job ${jobId} not found`);
    return;
  }

  const processor = getProcessor(job.toolSlug);
  if (!processor) {
    console.error(`[Worker] No processor registered for tool: ${job.toolSlug}`);
    await updateJobStatus(jobId, "failed", {
      error: `Unsupported tool operation: ${job.toolSlug}`,
      completedAt: new Date().toISOString(),
    });
    return;
  }

  await updateJobStatus(jobId, "processing", { progress: 25 });

  const storage = getStorageAdapter();

  try {
    // 1. Fetch input file from storage
    const inputBuffer = await storage.getBuffer(job.inputKey);
    if (!inputBuffer || inputBuffer.length === 0) {
      throw new Error("Input file could not be read from storage.");
    }

    const context: ProcessorContext = {
      jobId: job.id,
      toolSlug: job.toolSlug,
      inputBuffer,
      fileName: job.fileName,
      mimeType: job.mimeType,
      fileSize: job.fileSize || inputBuffer.length,
    };

    // 2. Execute with timeout protection
    await updateJobStatus(jobId, "processing", { progress: 50 });

    const resultPromise = processor(context);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out")), MAX_EXECUTION_TIMEOUT_MS)
    );

    const result = await Promise.race([resultPromise, timeoutPromise]);

    if (!result.outputBuffer || result.outputBuffer.length === 0) {
      throw new Error("Processor produced an empty output file.");
    }

    await updateJobStatus(jobId, "processing", { progress: 85 });

    // 3. Store output file
    const outputKey = `jobs/${job.id}/output/${result.outputFileName}`;
    await storage.putBuffer(outputKey, result.outputBuffer, result.outputMimeType);

    // 4. Mark job as completed
    await updateJobStatus(jobId, "completed", {
      progress: 100,
      outputKey,
      outputFileName: result.outputFileName,
      outputMimeType: result.outputMimeType,
      completedAt: new Date().toISOString(),
    });

    console.log(`[Worker] Job ${job.id} completed successfully for ${job.toolSlug}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Processing failed";
    console.error(`[Worker] Job ${jobId} failed:`, errorMessage);

    const attempt = (job.attempt || 1) + 1;
    const maxRetries = job.maxRetries || 3;

    if (attempt <= maxRetries && !errorMessage.includes("Unsupported") && !errorMessage.includes("empty")) {
      await updateJobStatus(jobId, "retrying", {
        attempt,
        error: `Temporary error: ${errorMessage}. Retrying...`,
      });
      // Retry dispatch
      setTimeout(() => executeJob(jobId), 1500);
    } else {
      await updateJobStatus(jobId, "failed", {
        error: errorMessage.includes("timed out")
          ? "The processing timed out. Please try with a smaller file."
          : errorMessage,
        completedAt: new Date().toISOString(),
      });
    }
  }
}

