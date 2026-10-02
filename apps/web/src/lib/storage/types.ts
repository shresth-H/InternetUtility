export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  getUploadUrl(key: string, mimeType: string): Promise<{ uploadUrl: string; key: string }>;
  getDownloadUrl(key: string): Promise<string>;
  delete(key: string): Promise<void>;
  putLocal?(key: string, data: Buffer, mimeType: string): Promise<UploadResult>;
}
