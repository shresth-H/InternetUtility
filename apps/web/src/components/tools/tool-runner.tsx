"use client";

import type { ToolDefinition } from "@internet-utility/tools";
import { TextToolsPanel } from "./panels/text-tools-panel";
import { DeveloperToolsPanel } from "./panels/developer-tools-panel";
import { CalculatorToolsPanel } from "./panels/calculator-tools-panel";
import { FileToolUploader } from "./file-tool-uploader";

const PDF_ACCEPT = "application/pdf,.pdf";
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp";
const DOC_ACCEPT = ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function getFileConfig(slug: string) {
  if (slug.includes("word") || slug === "word-to-pdf") {
    return { accept: slug === "word-to-pdf" ? DOC_ACCEPT : PDF_ACCEPT, label: slug === "word-to-pdf" ? "Convert to PDF" : "Convert to Word" };
  }
  if (slug.startsWith("pdf") || slug.includes("pdf")) {
    return { accept: PDF_ACCEPT, label: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
  }
  return { accept: IMAGE_ACCEPT, label: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
}

export function ToolRunner({ tool }: { tool: ToolDefinition }) {
  if (tool.processing === "server") {
    const config = getFileConfig(tool.slug);
    return (
      <FileToolUploader
        toolSlug={tool.slug}
        accept={config.accept}
        actionLabel={config.label}
      />
    );
  }

  if (tool.category === "text") {
    return <TextToolsPanel slug={tool.slug} />;
  }

  if (tool.category === "developer") {
    return <DeveloperToolsPanel slug={tool.slug} />;
  }

  if (tool.category === "calculator") {
    return <CalculatorToolsPanel slug={tool.slug} />;
  }

  return <p className="text-muted">Tool interface coming soon.</p>;
}
