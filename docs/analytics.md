# Analytics & Privacy Telemetry

## Overview

The platform tracks actionable lifecycle events to measure activation and tool retention while enforcing privacy and never logging sensitive file contents or calculation inputs.

## Event Schema

| Event Name | Trigger | Payload Properties |
|------------|---------|-------------------|
| `tool_viewed` | Page landing | `toolSlug`, `category`, `referrer` |
| `tool_started` | User inputs initial value | `toolSlug` |
| `file_uploaded` | File dropped / selected | `toolSlug`, `fileSize`, `mimeType` |
| `processing_started` | Execution kicked off | `jobId`, `toolSlug` |
| `processing_completed` | Conversion finished | `jobId`, `durationMs` |
| `download_clicked` | File downloaded | `jobId`, `toolSlug` |
| `ai_explanation_requested`| AI trigger clicked | `toolSlug` |
| `export_clicked` | Export table/data | `toolSlug`, `format` (csv/json/pdf) |

## Core Metrics
- **North Star**: Successful utility actions per active visitor.
- **Engagement**: Tools used per session.
- **Conversion**: Organic visitor to completed action rate.

