# Database Schema & Architecture

## Overview

The platform uses a relational PostgreSQL database schema with Prisma ORM to manage user accounts, tool definitions, execution metrics, asynchronous processing jobs, saved calculations, and SEO content.

## Entity Relationship Model

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │1     *│  ToolExecution  │*     1│      Tool       │
│─────────────────│───────│─────────────────│───────│─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email           │       │ userId (FK)     │       │ slug (Unique)   │
│ tier (Free/Pro) │       │ toolSlug (FK)   │       │ name            │
│ createdAt       │       │ durationMs      │       │ category        │
│ updatedAt       │       │ status          │       │ enabled         │
└────────┬────────┘       │ createdAt       │       └────────┬────────┘
         │1               └─────────────────┘                │1
         │                                                   │
         │*                                                  │*
┌────────┴────────┐       ┌─────────────────┐       ┌────────┴────────┐
│ SavedCalculation│       │       Job       │       │  RelatedTools   │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ fromSlug (FK)   │
│ userId (FK)     │       │ toolSlug (FK)   │       │ toSlug (FK)     │
│ toolSlug        │       │ inputKey        │       │ order           │
│ inputData (JSON)│       │ outputKey       │       └─────────────────┘
│ resultData(JSON)│       │ status          │
│ createdAt       │       │ error           │
└─────────────────┘       │ createdAt       │
                          │ completedAt     │
                          └─────────────────┘
```

## Core Schema Definitions

### 1. User & Authentication
- `User`: Handles identity, role (admin/member), tier (`free`, `pro`, `enterprise`), API rate limit tier.
- `APIKey`: Enables programmatic REST access with hashed key secrets and scoped permissions.

### 2. Tools & Taxonomy
- `Tool`: Tool registry mirror allowing dynamic overriding of SEO metadata, FAQs, and feature flags without redeployment.
- `ToolCategory`: Categories (`pdf`, `image`, `text`, `developer`, `calculator`, `ai`).
- `RelatedTool`: Graph table defining bi-directional cross-tool recommendations.

### 3. Asynchronous File Jobs
- `Job`: Tracks lifecycle of background conversions (`queued`, `processing`, `completed`, `failed`, `expired`).
- `File`: Ephemeral reference linking storage keys with MIME type, size, and retention TTL.

### 4. Saved Data & AI Sessions
- `SavedCalculation`: User-saved financial or mathematical models with full inputs and schedule.
- `AIConversation`: Contextual AI explanation logs linked to specific tool runs for cost control and token tracking.

