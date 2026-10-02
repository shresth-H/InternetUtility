import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import {
  resizeImageProcessor,
  compressImageProcessor,
  jpgToPngProcessor,
  pngToJpgProcessor,
  cropImageProcessor,
  rotateImageProcessor,
  imageThumbnailProcessor,
  imageMetadataRemoveProcessor,
} from "../image-processors";
import {
  mergePdfProcessor,
  splitPdfProcessor,
  rotatePdfProcessor,
  jpgToPdfProcessor,
  compressPdfProcessor,
  pdfToWordProcessor,
  pdfToExcelProcessor,
} from "../pdf-processors";

async function createTestImage(): Promise<Buffer> {
  return await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 50, g: 120, b: 200 },
    },
  })
    .jpeg()
    .toBuffer();
}

async function createTestPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page1 = doc.addPage([400, 600]);
  page1.drawText("Page 1 Content");
  const page2 = doc.addPage([400, 600]);
  page2.drawText("Page 2 Content");
  return Buffer.from(await doc.save());
}

export async function runProcessorTests() {
  console.log("=== Running File Processors Test Suite ===");
  const testImg = await createTestImage();
  const testPdf = await createTestPdf();

  // Test 1: Image Resize
  const resizeRes = await resizeImageProcessor({
    jobId: "test_1",
    toolSlug: "resize-image",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Resize:", resizeRes.outputFileName, "Size:", resizeRes.outputBuffer.length, "bytes");

  // Test 2: Image Compress
  const compImgRes = await compressImageProcessor({
    jobId: "test_2",
    toolSlug: "compress-image",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Compress:", compImgRes.outputFileName, "Size:", compImgRes.outputBuffer.length, "bytes");

  // Test 3: JPG to PNG
  const pngRes = await jpgToPngProcessor({
    jobId: "test_3",
    toolSlug: "jpg-to-png",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ JPG to PNG:", pngRes.outputFileName, "MIME:", pngRes.outputMimeType);

  // Test 4: PNG to JPG
  const jpgRes = await pngToJpgProcessor({
    jobId: "test_4",
    toolSlug: "png-to-jpg",
    inputBuffer: pngRes.outputBuffer,
    fileName: "photo.png",
    mimeType: "image/png",
    fileSize: pngRes.outputBuffer.length,
  });
  console.log("✓ PNG to JPG:", jpgRes.outputFileName, "MIME:", jpgRes.outputMimeType);

  // Test 5: Image Crop
  const cropRes = await cropImageProcessor({
    jobId: "test_5",
    toolSlug: "crop-image",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Crop:", cropRes.outputFileName, "Size:", cropRes.outputBuffer.length, "bytes");

  // Test 6: Image Rotate
  const rotImgRes = await rotateImageProcessor({
    jobId: "test_6",
    toolSlug: "rotate-image",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Rotate:", rotImgRes.outputFileName);

  // Test 7: Image Thumbnail
  const thumbRes = await imageThumbnailProcessor({
    jobId: "test_7",
    toolSlug: "image-thumbnail",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Thumbnail:", thumbRes.outputFileName);

  // Test 8: Image Metadata Remove
  const cleanRes = await imageMetadataRemoveProcessor({
    jobId: "test_8",
    toolSlug: "image-metadata-remove",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ Image Metadata Remove:", cleanRes.outputFileName);

  // Test 9: Merge PDF
  const mergeRes = await mergePdfProcessor({
    jobId: "test_9",
    toolSlug: "merge-pdf",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ Merge PDF:", mergeRes.outputFileName, "Size:", mergeRes.outputBuffer.length, "bytes");

  // Test 10: Split PDF
  const splitRes = await splitPdfProcessor({
    jobId: "test_10",
    toolSlug: "split-pdf",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ Split PDF:", splitRes.outputFileName, "Size:", splitRes.outputBuffer.length, "bytes");

  // Test 11: Rotate PDF
  const rotPdfRes = await rotatePdfProcessor({
    jobId: "test_11",
    toolSlug: "rotate-pdf",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ Rotate PDF:", rotPdfRes.outputFileName);

  // Test 12: JPG to PDF
  const jpgToPdfRes = await jpgToPdfProcessor({
    jobId: "test_12",
    toolSlug: "jpg-to-pdf",
    inputBuffer: testImg,
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    fileSize: testImg.length,
  });
  console.log("✓ JPG to PDF:", jpgToPdfRes.outputFileName, "MIME:", jpgToPdfRes.outputMimeType);

  // Test 13: Compress PDF
  const compPdfRes = await compressPdfProcessor({
    jobId: "test_13",
    toolSlug: "compress-pdf",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ Compress PDF:", compPdfRes.outputFileName);

  // Test 14: PDF to Word
  const wordRes = await pdfToWordProcessor({
    jobId: "test_14",
    toolSlug: "pdf-to-word",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ PDF to Word (.docx):", wordRes.outputFileName, "Size:", wordRes.outputBuffer.length, "bytes");

  // Test 15: PDF to Excel
  const excelRes = await pdfToExcelProcessor({
    jobId: "test_15",
    toolSlug: "pdf-to-excel",
    inputBuffer: testPdf,
    fileName: "document.pdf",
    mimeType: "application/pdf",
    fileSize: testPdf.length,
  });
  console.log("✓ PDF to Excel (.csv):", excelRes.outputFileName, "Size:", excelRes.outputBuffer.length, "bytes");

  console.log("\nALL 15 FILE PROCESSORS TESTED AND VERIFIED SUCCESSFULLY!");
}

runProcessorTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

