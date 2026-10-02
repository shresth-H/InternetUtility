# Tool Development Guide

## Quick Start

```typescript
import { z } from "zod";
import { defineTool } from "../registry";

defineTool({
  slug: "my-tool",
  name: "My Tool",
  shortDescription: "Does something useful.",
  category: "text",
  type: "text-utility",
  processing: "client",
  seo: {
    title: "My Tool — Online",
    description: "Description for search engines.",
  },
  privacy: {
    location: "client",
    message: "Runs entirely in your browser.",
  },
  relatedTools: ["word-counter"],
  faq: [{ question: "...", answer: "..." }],
  howTo: [{ title: "Step 1", description: "..." }],
  inputSchema: z.object({ text: z.string() }),
  execute: ({ text }) => ({ result: text.toUpperCase() }),
});
```

## What the Platform Provides Automatically

- URL: `/{slug}`
- SEO metadata and Open Graph tags
- JSON-LD structured data
- Breadcrumbs
- Privacy badge
- FAQ section
- Related tools
- Sitemap entry

## Tool Types

| Type | Processing | Examples |
|------|------------|----------|
| calculator | client | EMI, CAGR, GST |
| text-utility | client | Word counter, case converter |
| developer-utility | client | JSON formatter, JWT decoder |
| converter | server | PDF to Word |
| processor | server | Compress image |

## UI Panels

For client tools, add a case in the appropriate panel component under `apps/web/src/components/tools/panels/`.

For server/file tools, `FileToolUploader` handles upload and job polling automatically.
