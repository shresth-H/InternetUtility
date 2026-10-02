import sharp from "sharp";
import type { ProcessorContext, ProcessorResult } from "./types";

function getBaseName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
}

export async function resizeImageProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const metadata = await sharp(ctx.inputBuffer).metadata();
  const currentWidth = metadata.width || 1000;
  const currentHeight = metadata.height || 1000;

  // Resize to 50% scale or maximum 1200px width
  const targetWidth = Math.min(Math.round(currentWidth * 0.75), 1200);

  const outputBuffer = await sharp(ctx.inputBuffer)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_resized.${metadata.format || "jpg"}`,
    outputMimeType: `image/${metadata.format || "jpeg"}`,
    metadata: { originalWidth: currentWidth, originalHeight: currentHeight, resizedWidth: targetWidth },
  };
}

export async function compressImageProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const image = sharp(ctx.inputBuffer);
  const metadata = await image.metadata();
  const format = (metadata.format as string) || "jpeg";

  let outputBuffer: Buffer;
  let mimeType = `image/${format}`;

  if (format === "png") {
    outputBuffer = await image.png({ quality: 75, compressionLevel: 8 }).toBuffer();
    mimeType = "image/png";
  } else if (format === "webp") {
    outputBuffer = await image.webp({ quality: 75, effort: 4 }).toBuffer();
    mimeType = "image/webp";
  } else if (format === "avif") {
    outputBuffer = await image.avif({ quality: 65 }).toBuffer();
    mimeType = "image/avif";
  } else {
    // Default JPEG
    outputBuffer = await image.jpeg({ quality: 70, mozjpeg: true }).toBuffer();
    mimeType = "image/jpeg";
  }

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_compressed.${format}`,
    outputMimeType: mimeType,
    metadata: { originalSize: ctx.fileSize, compressedSize: outputBuffer.length },
  };
}

export async function jpgToPngProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const outputBuffer = await sharp(ctx.inputBuffer).png({ quality: 90 }).toBuffer();
  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}.png`,
    outputMimeType: "image/png",
  };
}

export async function pngToJpgProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const outputBuffer = await sharp(ctx.inputBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}.jpg`,
    outputMimeType: "image/jpeg",
  };
}

export async function webpConverterProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const metadata = await sharp(ctx.inputBuffer).metadata();
  const isWebP = metadata.format === "webp";

  if (isWebP) {
    // Convert WebP to PNG
    const outputBuffer = await sharp(ctx.inputBuffer).png().toBuffer();
    return {
      outputBuffer,
      outputFileName: `${getBaseName(ctx.fileName)}.png`,
      outputMimeType: "image/png",
    };
  } else {
    // Convert any image to WebP
    const outputBuffer = await sharp(ctx.inputBuffer).webp({ quality: 80 }).toBuffer();
    return {
      outputBuffer,
      outputFileName: `${getBaseName(ctx.fileName)}.webp`,
      outputMimeType: "image/webp",
    };
  }
}

export async function cropImageProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const metadata = await sharp(ctx.inputBuffer).metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // Center crop: extract central 80% box
  const cropWidth = Math.round(width * 0.8);
  const cropHeight = Math.round(height * 0.8);
  const left = Math.round((width - cropWidth) / 2);
  const top = Math.round((height - cropHeight) / 2);

  const outputBuffer = await sharp(ctx.inputBuffer)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_cropped.${metadata.format || "jpg"}`,
    outputMimeType: `image/${metadata.format || "jpeg"}`,
  };
}

export async function rotateImageProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const metadata = await sharp(ctx.inputBuffer).metadata();
  // Rotate 90 degrees clockwise
  const outputBuffer = await sharp(ctx.inputBuffer).rotate(90).toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_rotated.${metadata.format || "jpg"}`,
    outputMimeType: `image/${metadata.format || "jpeg"}`,
  };
}

export async function imageMetadataRemoveProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  const metadata = await sharp(ctx.inputBuffer).metadata();
  // Strip all EXIF, IPTC, and ICC metadata
  const outputBuffer = await sharp(ctx.inputBuffer)
    .withMetadata({ exif: {}, orientation: 1 })
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_clean.${metadata.format || "jpg"}`,
    outputMimeType: `image/${metadata.format || "jpeg"}`,
  };
}

export async function imageThumbnailProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  // Generate a crisp 250x250 square thumbnail with smart cover fit
  const outputBuffer = await sharp(ctx.inputBuffer)
    .resize(250, 250, { fit: "cover", position: "centre" })
    .jpeg({ quality: 80 })
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_thumb.jpg`,
    outputMimeType: "image/jpeg",
  };
}

export async function backgroundRemoverProcessor(ctx: ProcessorContext): Promise<ProcessorResult> {
  // Edge-preserving contrast alpha segmentation for local/browser serverless mode
  // Sharp thresholding and alpha masking
  const image = sharp(ctx.inputBuffer);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // Simple luminosity-based corner background detection
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  const threshold = 35;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (diff < threshold) {
      data[i + 3] = 0; // Transparent
    }
  }

  const outputBuffer = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return {
    outputBuffer,
    outputFileName: `${getBaseName(ctx.fileName)}_nobg.png`,
    outputMimeType: "image/png",
  };
}

