# Backend Architecture & File Processing Pipeline

## 1. High-Level Architecture

The ToolBox backend is designed for **near-zero cost at V1** while maintaining a scalable, decoupled architecture between the control plane, object storage, and compute workers.

```text
┌────────────────┐
│ Client Browser │
└───────┬────────┘
        │ 1. Direct Presigned Upload or API Upload
        ▼
┌────────────────┐  2. Store Input Object  ┌────────────────────────┐
│  Next.js API   ├────────────────────────►│  Storage Layer          │
│ Control Plane  │                         │  - Cloudflare R2 (Prod)│
└───────┬────────┘                         │  - Local Memory/Disk   │
        │ 3. Dispatch Job                  └───────────┬────────────┘
        ▼                                              │
┌────────────────┐                                     │
│ Job / Queue    │                                     │
│  State Machine │                                     │
└───────┬────────┘                                     │
        │ 4. Execute Processor                         │
        ▼                                              │
┌────────────────┐  5. Read Input Buffer               │
│ Worker Engine  │◄────────────────────────────────────┤
│ (Sharp/pdf-lib/│                                     │
│  LibreOffice)  ├────────────────────────────────────►│
└────────────────┘  6. Write Output Buffer             │
                                                       │
┌────────────────┐  7. Download Processed File         │
│ Client Browser │◄────────────────────────────────────┘
└────────────────┘
```

## 2. Storage Abstraction Layer (`apps/web/src/lib/storage/`)

- **Interface**: `StorageAdapter` exposes `getUploadUrl()`, `getDownloadUrl()`, `getBuffer()`, `putBuffer()`, `delete()`, and `exists()`.
- **Adapters**:
  - `LocalStorageAdapter`: Zero-dependency in-memory/disk buffer store for local development with signed local streaming URLs.
  - `R2StorageAdapter`: S3-compatible client targeting Cloudflare R2 with 15-minute presigned upload URLs and 30-minute signed download URLs.
- **Cost**: Cloudflare R2 offers 10 GB/month storage, 1M Class A operations, 10M Class B operations, and **$0 egress fees**, allowing ₹0/month operation for V1.

## 3. Job Lifecycle & State Machine (`apps/web/src/lib/jobs/`)

```text
CREATED ──► UPLOADING ──► QUEUED ──► PROCESSING ──► COMPLETED
                             │             │
                             ▼             ▼
                          RETRYING ◄─── FAILED (Transient)
                             │
                             ▼
                     FAILED_PERMANENTLY (Fatal)
```

- **States**:
  - `created`: Job metadata initialized.
  - `queued`: Enqueued for worker execution.
  - `processing`: Worker is actively downloading, converting, and uploading.
  - `completed`: Processed output file ready in storage with signed download URL.
  - `failed`: Terminal failure state with user-friendly error message.

## 4. Processing Engines

| Tool Category | Engine | Handled Operations |
| :--- | :--- | :--- |
| **Image Processing** | `Sharp` (libvips) | Resize, Compress, JPG↔PNG, WebP Convert, Crop, Rotate, Metadata Removal, Thumbnail, Background Removal. |
| **PDF Manipulation** | `pdf-lib` + `Sharp` | Merge PDF, Split PDF, Rotate PDF, JPG to PDF, Compress PDF. |
| **Document Conversions**| OpenXML / `pdf-lib` + LibreOffice Container | PDF to Word (.docx), Word to PDF, PDF to Excel (.csv). |

## 5. Security & Isolation Controls
- **Size Limits**: Enforced 25MB maximum upload limit per file.
- **Dimension Guards**: Maximum 25 Megapixels on image processing to prevent decompression bombs.
- **Timeout Protection**: 60 seconds for simple operations; 180 seconds for heavy conversions.
- **Non-Root Execution**: Container worker runs under unprivileged `appuser`.
- **Sanitized Errors**: Internal system paths and stack traces are suppressed; clear user-facing messages are returned.

