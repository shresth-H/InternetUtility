import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageAdapter, UploadResult } from "./types";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  customDomain?: string;
}

export class R2StorageAdapter implements StorageAdapter {
  private client: S3Client;
  private bucket: string;
  private customDomain?: string;

  constructor(config: R2Config) {
    this.bucket = config.bucketName;
    this.customDomain = config.customDomain;
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async getUploadUrl(key: string, mimeType: string): Promise<{ uploadUrl: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });
    // Presigned upload URL valid for 15 minutes
    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 900 });
    return { uploadUrl, key };
  }

  async getDownloadUrl(key: string, originalName?: string): Promise<string> {
    if (this.customDomain) {
      return `https://${this.customDomain}/${key}`;
    }
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: originalName
        ? `attachment; filename="${encodeURIComponent(originalName)}"`
        : "attachment",
    });
    // Presigned download URL valid for 30 minutes
    return await getSignedUrl(this.client, command, { expiresIn: 1800 });
  }

  async getBuffer(key: string): Promise<Buffer | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const response = await this.client.send(command);
      if (!response.Body) return null;
      const byteArray = await response.Body.transformToByteArray();
      return Buffer.from(byteArray);
    } catch {
      return null;
    }
  }

  async putBuffer(key: string, data: Buffer, mimeType: string): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: mimeType,
    });
    await this.client.send(command);
    return {
      key,
      url: await this.getDownloadUrl(key),
      size: data.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}

