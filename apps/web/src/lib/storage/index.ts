import type { StorageAdapter } from "./types";
import { LocalStorageAdapter } from "./local-adapter";
import { R2StorageAdapter } from "./r2-adapter";

let activeAdapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (activeAdapter) return activeAdapter;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (accountId && accessKeyId && secretAccessKey && bucketName) {
    activeAdapter = new R2StorageAdapter({
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      customDomain: process.env.R2_CUSTOM_DOMAIN,
    });
  } else {
    activeAdapter = new LocalStorageAdapter();
  }

  return activeAdapter;
}

export * from "./types";
export * from "./local-adapter";
export * from "./r2-adapter";

