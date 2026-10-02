import { defineTool } from "../registry";

const serverPrivacy = {
  location: "server" as const,
  message: "Files are uploaded temporarily, processed securely, and automatically deleted after processing.",
};

function fileTool(
  slug: string,
  name: string,
  shortDescription: string,
  category: "pdf" | "image",
  relatedTools: string[],
  featured = false
) {
  defineTool({
    slug,
    name,
    shortDescription,
    category,
    type: category === "pdf" ? "converter" : "processor",
    processing: "server",
    featured,
    seo: {
      title: `${name} — Free Online Tool`,
      description: `${shortDescription} Fast, secure, and free.`,
      keywords: [slug.replace(/-/g, " ")],
    },
    privacy: serverPrivacy,
    relatedTools,
    faq: [
      { question: "Are my files stored?", answer: "No. Files are deleted automatically after processing." },
      { question: "What is the file size limit?", answer: "Up to 50MB per file on the free tier." },
    ],
    howTo: [
      { title: "Upload file", description: "Drag and drop or choose your file." },
      { title: "Process", description: "Click the action button to start processing." },
      { title: "Download", description: "Download your processed file when ready." },
    ],
  });
}

// PDF tools
fileTool("pdf-to-word", "PDF to Word", "Convert PDF files into editable Word documents.", "pdf", ["word-to-pdf", "pdf-to-jpg", "compress-pdf", "merge-pdf"], true);
fileTool("word-to-pdf", "Word to PDF", "Convert Word documents to PDF format.", "pdf", ["pdf-to-word", "merge-pdf", "compress-pdf"]);
fileTool("merge-pdf", "Merge PDF", "Combine multiple PDF files into one document.", "pdf", ["split-pdf", "compress-pdf", "pdf-to-word"], true);
fileTool("split-pdf", "Split PDF", "Split a PDF into separate pages or ranges.", "pdf", ["merge-pdf", "compress-pdf", "rotate-pdf"]);
fileTool("compress-pdf", "Compress PDF", "Reduce PDF file size while maintaining quality.", "pdf", ["merge-pdf", "pdf-to-word", "split-pdf"], true);
fileTool("pdf-to-jpg", "PDF to JPG", "Convert PDF pages to JPG images.", "pdf", ["jpg-to-pdf", "compress-pdf", "pdf-to-word"]);
fileTool("jpg-to-pdf", "JPG to PDF", "Convert JPG images to a PDF document.", "pdf", ["pdf-to-jpg", "merge-pdf", "compress-pdf"]);
fileTool("rotate-pdf", "Rotate PDF", "Rotate PDF pages to the correct orientation.", "pdf", ["split-pdf", "merge-pdf", "compress-pdf"]);

// Image tools
fileTool("compress-image", "Compress Image", "Reduce image file size without noticeable quality loss.", "image", ["resize-image", "webp-converter", "jpg-to-png"], true);
fileTool("resize-image", "Resize Image", "Resize images to exact dimensions or percentages.", "image", ["compress-image", "crop-image", "webp-converter"]);
fileTool("crop-image", "Crop Image", "Crop images to a specific area or aspect ratio.", "image", ["resize-image", "compress-image", "jpg-to-png"]);
fileTool("jpg-to-png", "JPG to PNG", "Convert JPG images to PNG format.", "image", ["png-to-jpg", "webp-converter", "compress-image"]);
fileTool("png-to-jpg", "PNG to JPG", "Convert PNG images to JPG format.", "image", ["jpg-to-png", "compress-image", "webp-converter"]);
fileTool("webp-converter", "WebP Converter", "Convert images to and from WebP format.", "image", ["compress-image", "jpg-to-png", "png-to-jpg"]);
fileTool("background-remover", "Background Remover", "Remove image backgrounds automatically.", "image", ["compress-image", "resize-image", "crop-image"]);
