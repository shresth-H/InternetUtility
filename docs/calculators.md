# Calculator Architecture & Deterministic Logic

## Overview

Calculators in the Internet Utility Platform are designed around **pure, deterministic TypeScript functions** with zero external network dependencies and 100% automated test coverage.

## Core Design Principles

1. **Pure Functions**: Input → Math → Structured Output. No side effects, DOM queries, or network requests.
2. **Zero Hallucination**: AI is never used for mathematical calculations. AI is strictly layered on top for natural language explanation and contextual interpretation.
3. **Informational Disclaimer**: Every financial calculator renders standard disclaimers stating estimates are for informational purposes only.
4. **Export Ready**: Standardized output structures (e.g. amortization schedules, growth curves) allow 1-click JSON, CSV, or PDF export.

## Implemented Calculators (`packages/calculators`)

| Calculator | Input Parameters | Output Metrics |
|------------|------------------|----------------|
| **EMI Calculator** | Principal (₹), Annual Rate (%), Tenure (months) | Monthly EMI, Total Interest, Total Payment, Full Amortization Schedule |
| **SIP Calculator** | Monthly Investment (₹), Expected Return (%), Duration (years) | Total Invested, Estimated Returns, Maturity Value |
| **CAGR Calculator** | Beginning Value (₹), Ending Value (₹), Years | CAGR (%), Total Return (₹), Total Return (%) |
| **GST Calculator** | Amount (₹), GST Rate (%), Mode (inclusive/exclusive) | Base Amount, GST Amount, Total Amount |
| **Percentage Calculator** | Value, Percentage, Mode (of/change/difference), Value2 | Calculated Value, Text Explanation |
| **Age Calculator** | Date of Birth | Years, Months, Days, Total Days |
| **Date Calculator** | Start Date, End Date | Calendar Days, Full Weeks, Business Days (Mon-Fri) |
| **Unit Converter** | Value, Category (Length/Weight/Temp), FromUnit, ToUnit | Converted Numeric Value |

## Test Suite Execution

To run unit tests across all calculators:
```bash
npm run test --workspace=@internet-utility/calculators
```
Unit tests check exact edge cases, leap years, boundary rates, negative numbers, and high precision rounding.

