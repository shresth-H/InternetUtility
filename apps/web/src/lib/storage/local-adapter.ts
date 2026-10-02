import type { StorageAdapter, UploadResult } from "./types";

const store = new Map<string, { data: Buffer; mimeType: string }>();

export class LocalStorageAdapter implements StorageAdapter {
  async getUploadUrl(key: string, _mimeType: string) {
    const uploadUrl = `/api/storage/upload?key=${encodeURIComponent(key)}`;
    return { uploadUrl, key };
  }

  async getDownloadUrl(key: string) {
    return `/api/storage/download?key=${encodeURIComponent(key)}`;
  }

  async delete(key: string) {
    store.delete(key);
  }

  async putLocal(key: string, data: Buffer, mimeType: string): Promise<UploadResult> {
    store.set(key, { data, mimeType });
    return {
      key,
      url: await this.getDownloadUrl(key),
      size: data.length,
      mimeType,
    };
  }

  get(key: string) {
    return store.get(key);
  }
}

let adapter: LocalStorageAdapter | null = null;

export function getStorageAdapter(): LocalStorageAdapter {
  if (!adapter) adapter = new LocalStorageAdapter();
  return adapter;
}
