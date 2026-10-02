# Security & Data Privacy

## Overview

A utility platform handling documents, code tokens, and financial data must maintain high privacy standards and defense-in-depth protection.

## Core Security Controls

1. **Client-First Execution**:
   - Developer tools (JSON, JWT, UUID, Base64, URL encoder, Regex) and calculators run 100% in the user's browser. No data leaves the client.
2. **File Processing Protections**:
   - MIME type and magic number validation on all uploads.
   - Max file size limits enforced prior to upload.
   - Direct S3/R2 presigned upload URLs with 15-minute TTL.
   - Background worker isolation (sandboxed execution).
3. **Automated Data Deletion (TTL Lifecycle)**:
   - Raw input files deleted after 1 hour.
   - Processed output files deleted after 24 hours.
4. **Network & API Security**:
   - Strict Content Security Policy (CSP), HSTS, and X-Frame-Options headers.
   - IP and user-based sliding window rate limiting.
   - Zero client-side exposure of API keys or cloud credentials.

