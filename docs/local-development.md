# Local Development Guide

## Overview

ToolBox works 100% locally out of the box with zero external cloud dependencies. You do not need Cloudflare R2 credentials or Docker to develop and test all 34 tools locally.

## Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suites
```bash
# Run calculator unit tests (Vitest)
npm run test:calculators

# Run real file processor tests (Sharp & pdf-lib)
npm run test:processors

# Run both test suites
npm test
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## How Local Storage & Processing Works
- When `R2_ACCOUNT_ID` is unset in `.env`, the system automatically defaults to `LocalStorageAdapter`.
- Uploaded files are stored in-memory, processed in real-time by the worker engine, and served directly to the browser via `/api/storage/download`.

