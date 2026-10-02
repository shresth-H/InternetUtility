# Contributing & Adding New Tools

## The Core Principle

> **Build the platform once; make launching individual tools extremely cheap.**

Adding a new tool takes only a few minutes without modifying core routing or application layout code.

## 5-Step Workflow to Add a New Tool

### 1. Define Business Logic / Calculation / Processor
- For calculators: add pure function to `packages/calculators/src/your-calc.ts` and export from `index.ts`.
- For text/dev tools: add processor to `packages/tools/src/processors/`.

### 2. Add Unit Test
- Add unit tests in `packages/calculators/src/__tests__/` or `packages/tools/` verifying edge cases and formulas.

### 3. Register Tool Definition
In `packages/tools/src/tools/`:
```typescript
defineTool({
  slug: "salary-calculator",
  name: "Salary Calculator",
  shortDescription: "Calculate take-home salary, deductions, and tax liabilities.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  featured: true,
  seo: {
    title: "Salary Calculator — Calculate In-Hand Salary Online",
    description: "Free online salary calculator to compute gross, net take-home, EPF, and taxes.",
    keywords: ["salary calculator", "take home pay", "in hand salary"]
  },
  privacy: {
    location: "client",
    message: "Calculated entirely in your browser."
  },
  relatedTools: ["income-tax-calculator", "gst-calculator", "emi-calculator"],
  howTo: [
    { title: "Enter CTC", description: "Input your annual Cost to Company (CTC)." },
    { title: "Review Deductions", description: "Adjust EPF, gratuity, and insurance options." },
    { title: "View Net Pay", description: "Get your detailed monthly and annual take-home salary." }
  ],
  faq: [
    { question: "Is my salary data saved?", answer: "No, calculations run purely in your browser." }
  ]
});
```

### 4. Create or Connect UI Panel
Add the interactive UI in `apps/web/src/components/tools/panels/` if it's a client tool, or let `FileToolUploader` handle it automatically if it's a server file tool.

### 5. Verify Build & Deploy
Run `npm test; npm run build`. The tool is automatically live with its own URL, SEO meta, breadcrumbs, FAQ schema, sitemap entry, and related tool links.

