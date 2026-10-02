# PDF Processing Architecture

## Overview

PDF manipulation involves computationally intensive operations (rendering, OCR, rasterization, document parsing, page merging/splitting, and compression). These operations are decoupled from the main web process via an asynchronous job pipeline.

## Architectural Flow

```text
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ 1. Request presigned upload URL
       ▼
┌──────────────┐
│  API Route   │
└──────┬───────┘
       │ 2. Return Presigned S3/R2 URL
       ▼
┌──────────────┐  3. Direct Upload
│Object Storage├────────────────────────┐
└──────┬───────┘                        │
       │                                ▼
┌──────┴───────┐  4. Enqueue Job  ┌──────────────┐
│  API Route   ├─────────────────►│ Redis Queue  │
└──────────────┘                  └──────┬───────┘
                                         │ 5. Dequeue
                                         ▼
                                  ┌──────────────┐
                                  │ PDF Worker   │
                                  │ (pdf-lib,    │
                                  │  poppler,    │
                                  │  ghostscript)│
                                  └──────┬───────┘
                                         │ 6. Upload Result
                                         ▼
                                  ┌──────────────┐
                                  │Object Storage│
                                  └──────┬───────┘
                                         │ 7. Signed Download
                                         ▼
                                  ┌──────────────┐
                                  │   Browser    │
                                  └──────────────┘
```

## Supported Operations & Engine Selection

| Tool | Recommended Engine / Library | Strategy |
|------|------------------------------|----------|
| **PDF to Word** | LibreOffice / pdf2docx | Server background worker |
| **Word to PDF** | LibreOffice headless | Server background worker |
| **Merge PDF** | `pdf-lib` / poppler | In-memory stream or worker |
| **Split PDF** | `pdf-lib` | Stream slice |
| **Compress PDF** | Ghostscript (`ebook` / `screen` profiles) | Background queue |
| **PDF to JPG** | Poppler (`pdftoppm`) | Multi-page archive output |
| **JPG to PDF** | `pdf-lib` / Sharp | Direct image embedding |
| **Rotate PDF** | `pdf-lib` | Metadata page orientation change |

## Security & Sanitization
- Max file size limits enforced at presigned URL generation (50MB free).
- PDF header byte validation (`%PDF-`).
- Strict virus/malware scanning hook before execution.
- Temporary storage TTL: Input deleted in 1 hour; output deleted in 24 hours.

