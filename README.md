# Internet Utility Platform (Toolbox)

A scalable online utility platform with PDF, image, text, developer, and calculator tools.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `apps/web` — Next.js frontend and API routes
- `packages/tools` — Tool engine and registry
- `packages/calculators` — Calculator logic with tests
- `docs/` — Architecture and development guides

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run calculator unit tests |

## MVP Tools (34)

**Text:** Word Counter, Character Counter, Case Converter, Remove Duplicate Lines, Text Diff

**Developer:** JSON Formatter, JSON Validator, JWT Decoder, UUID Generator, Base64, URL Encoder

**Calculators:** Percentage, EMI, SIP, CAGR, GST, Age, Date, Unit Converter

**PDF:** PDF to Word, Word to PDF, Merge, Split, Compress, PDF to JPG, JPG to PDF, Rotate

**Image:** Compress, Resize, Crop, JPG to PNG, PNG to JPG, WebP Converter, Background Remover

## Documentation

See [docs/architecture.md](./docs/architecture.md) and [docs/tools.md](./docs/tools.md).
