import type { StorageAdapter, UploadResult } from "./types";

const memoryStore = new Map<string, { data: Buffer; mimeType: string }>();

export class LocalStorageAdapter implements StorageAdapter {
  async getUploadUrl(key: string, _mimeType: string): Promise<{ uploadUrl: string; key: string }> {
    const uploadUrl = `/api/storage/upload?key=${encodeURIComponent(key)}`;
    return { uploadUrl, key };
  }

  async getDownloadUrl(key: string, _originalName?: string): Promise<string> {
    return `/api/storage/download?key=${encodeURIComponent(key)}`;
  }

  async getBuffer(key: string): Promise<Buffer | null> {
    const entry = memoryStore.get(key);
    return entry ? entry.data : null;
  }

  async putBuffer(key: string, data: Buffer, mimeType: string): Promise<UploadResult> {
    memoryStore.set(key, { data, mimeType });
    return {
      key,
      url: await this.getDownloadUrl(key),
      size: data.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    memoryStore.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return memoryStore.has(key);
  }

  // Helper for direct retrieval by local API routes
  getEntry(key: string) {
    return memoryStore.get(key);
  }
}

