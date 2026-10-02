# Architecture

## Overview

Internet Utility Platform is a modular monolith built with Next.js, organized as an npm workspaces monorepo.

```text
InternetUtility/
├── apps/web/          # Next.js web application
├── packages/
│   ├── tools/         # Tool engine, registry, processors
│   └── calculators/   # Pure calculator functions + tests
├── workers/           # Background workers (future)
└── docs/              # Documentation
```

## Core Systems

### Tool Engine (`packages/tools`)

Every tool is registered via `defineTool()` with:

- Metadata (slug, name, category, type)
- Processing location (client vs server)
- SEO content, FAQ, related tools
- Input schema (Zod) and execute function (optional)

The web app imports `@internet-utility/tools` once in the root layout to register all tools.

### Client vs Server Processing

- **Client**: Text, developer, and calculator tools run entirely in the browser.
- **Server**: PDF and image tools use upload → job queue → worker pattern.

### File Processing Flow

```text
Browser → POST /api/storage/upload → Local/S3 storage
       → POST /api/jobs → Redis queue (future) → Worker
       → GET /api/jobs/:id → Download URL
```

Current MVP uses in-memory storage and simulated async processing. Replace adapters without changing tool definitions.

## Adding a New Tool

1. Create processor logic in `packages/tools/src/processors/` or `packages/calculators/`
2. Register with `defineTool()` in `packages/tools/src/tools/`
3. Add UI panel in `apps/web/src/components/tools/panels/` if needed
4. Tool page, SEO, sitemap, and related tools are automatic

See [tools.md](./tools.md) for the full workflow.
