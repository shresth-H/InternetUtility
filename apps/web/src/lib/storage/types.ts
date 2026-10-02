export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  getUploadUrl(key: string, mimeType: string): Promise<{ uploadUrl: string; key: string }>;
  getDownloadUrl(key: string, originalName?: string): Promise<string>;
  getBuffer(key: string): Promise<Buffer | null>;
  putBuffer(key: string, data: Buffer, mimeType: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

