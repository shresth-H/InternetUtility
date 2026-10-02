import type { FileProcessor } from "./types";
import {
  resizeImageProcessor,
  compressImageProcessor,
  jpgToPngProcessor,
  pngToJpgProcessor,
  webpConverterProcessor,
  cropImageProcessor,
  rotateImageProcessor,
  imageMetadataRemoveProcessor,
  imageThumbnailProcessor,
  backgroundRemoverProcessor,
} from "./image-processors";
import {
  mergePdfProcessor,
  splitPdfProcessor,
  rotatePdfProcessor,
  jpgToPdfProcessor,
  compressPdfProcessor,
  pdfToJpgProcessor,
  pdfToWordProcessor,
  wordToPdfProcessor,
  pdfToExcelProcessor,
} from "./pdf-processors";

const processors: Record<string, FileProcessor> = {
  // Image Processors
  "resize-image": resizeImageProcessor,
  "image-resize": resizeImageProcessor,
  "compress-image": compressImageProcessor,
  "image-compress": compressImageProcessor,
  "jpg-to-png": jpgToPngProcessor,
  "png-to-jpg": pngToJpgProcessor,
  "webp-converter": webpConverterProcessor,
  "image-convert": webpConverterProcessor,
  "crop-image": cropImageProcessor,
  "image-crop": cropImageProcessor,
  "rotate-image": rotateImageProcessor,
  "image-rotate": rotateImageProcessor,
  "image-metadata-remove": imageMetadataRemoveProcessor,
  "remove-image-metadata": imageMetadataRemoveProcessor,
  "image-thumbnail": imageThumbnailProcessor,
  "generate-thumbnail": imageThumbnailProcessor,
  "background-remover": backgroundRemoverProcessor,

  // PDF Processors
  "merge-pdf": mergePdfProcessor,
  "split-pdf": splitPdfProcessor,
  "rotate-pdf": rotatePdfProcessor,
  "jpg-to-pdf": jpgToPdfProcessor,
  "compress-pdf": compressPdfProcessor,
  "pdf-to-jpg": pdfToJpgProcessor,
  "pdf-to-word": pdfToWordProcessor,
  "word-to-pdf": wordToPdfProcessor,
  "pdf-to-excel": pdfToExcelProcessor,
};

export function getProcessor(slug: string): FileProcessor | undefined {
  return processors[slug];
}

export function getAllSupportedProcessors(): string[] {
  return Object.keys(processors);
}

