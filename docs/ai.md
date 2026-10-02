# AI Integration Architecture

## Overview

AI is an **enhancement layer** rather than a primary chatbot interface. It delivers contextual value directly inside tools (explaining complex results, comparing financial decisions, summarizing documents, and formatting text).

## Core Architecture

```text
┌────────────────────────┐
│     Client Browser     │
└───────────┬────────────┘
            │ POST /api/ai/explain { toolSlug, inputs, results }
            ▼
┌────────────────────────┐
│  Next.js API Handler   │
│  - Rate Limiting       │
│  - Token Metering      │
│  - Prompt Template     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  AI Provider Adapter   │
│  (Gemini / OpenAI/etc) │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Streaming Text Result  │
└────────────────────────┘
```

## AI Use Cases by Category

1. **Calculators (e.g. CAGR, EMI, SIP)**:
   - *"Explain this result in plain terms"*
   - *"Compare CAGR vs ROI for this 5-year period"*
   - *"What happens if interest rates rise by 1.5%?"*
2. **Text Utilities**:
   - Make professional, simplify, shorten, correct grammar, summarize.
3. **Developer Tools**:
   - Explain decoded JWT claims, suggest regex optimizations, identify syntax errors in invalid JSON.
4. **Document Tools**:
   - Executive summaries, bullet extraction, key terms explanation.

## Security & Provider Abstraction
- API keys are strictly maintained on the server; zero browser exposure.
- Standardized `AIProvider` interface allows hot-swapping between Gemini, OpenAI, Claude, or local Ollama instances without frontend changes.

