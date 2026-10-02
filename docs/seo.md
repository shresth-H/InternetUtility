# SEO & Content Architecture

## Overview

The platform uses a programmatic, high-quality SEO architecture where every utility is a high-ranking entry point.

## Core URL Structure

Clean, unnested root routes are prioritized for search relevance and shareability:
- Tools: `/[slug]` (e.g. `/emi-calculator`, `/pdf-to-word`, `/json-formatter`)
- Categories: `/category/[slug]` (e.g. `/category/pdf`, `/category/calculator`)
- Educational Guides: `/learn/[slug]` (e.g. `/learn/what-is-cagr`, `/learn/how-emi-works`)
- Search: `/search?q=...`

## Automated SEO Metadata Generation

Every tool defined via `defineTool()` automatically generates:
1. **Title Tag**: Optimized target query format (`{Name} — Free Online Tool`)
2. **Meta Description**: Action-oriented, keyword-rich summary.
3. **Canonical URL**: Prevents duplicate indexation across tracking parameters.
4. **Open Graph & Twitter Cards**: High-CTR social preview cards.
5. **Schema.org Structured Data**:
   - `WebApplication` / `SoftwareApplication`
   - `BreadcrumbList`
   - `FAQPage`
6. **Robots.txt & XML Sitemaps**: Dynamic `/sitemap.xml` and `/robots.txt` indexing all active tools, categories, and educational guides.

## Internal Linking Graph

Tools dynamically cross-link using the registry's `relatedTools` property. This creates a dense, semantically coherent topical graph connecting:
- Related operations (e.g. `PDF to Word` ↔ `Compress PDF` ↔ `Word to PDF`)
- Educational articles (e.g. `cagr-calculator` ↔ `/learn/what-is-cagr`)

