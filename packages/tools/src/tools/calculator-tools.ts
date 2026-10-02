import { z } from "zod";
import {
  calculateAge,
  calculateCAGR,
  calculateDateDiff,
  calculateEMI,
  calculateGST,
  calculatePercentage,
  calculateSIP,
  convertUnit,
} from "@internet-utility/calculators";
import { defineTool } from "../registry";

const clientPrivacy = {
  location: "client" as const,
  message: "Runs entirely in your browser. Your data is not uploaded.",
};

const financeDisclaimer =
  "Results are for informational purposes only and do not constitute financial advice.";

defineTool({
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  shortDescription: "Calculate percentages, increases and percentage difference.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  featured: true,
  seo: {
    title: "Percentage Calculator — Calculate Percentages Online",
    description: "Free percentage calculator. Find X% of a number, percentage increase, or difference.",
    keywords: ["percentage calculator", "percent calculator"],
  },
  privacy: clientPrivacy,
  relatedTools: ["gst-calculator", "emi-calculator", "cagr-calculator"],
  faq: [
    { question: "Can I calculate percentage change?", answer: "Yes, use difference mode with two values." },
  ],
  howTo: [
    { title: "Enter values", description: "Input the number and percentage." },
    { title: "Select mode", description: "Choose of, increase, or difference." },
    { title: "View result", description: "See the calculated percentage result." },
  ],
  inputSchema: z.object({
    value: z.number(),
    percentage: z.number(),
    mode: z.enum(["of", "change", "difference"]),
    value2: z.number().optional(),
  }),
  execute: (input) => ({ ...calculatePercentage(input), disclaimer: financeDisclaimer }),
});

defineTool({
  slug: "emi-calculator",
  name: "EMI Calculator",
  shortDescription: "Calculate loan EMI, total interest and amortization schedule.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  featured: true,
  seo: {
    title: "EMI Calculator — Calculate Loan EMI Online",
    description: "Calculate monthly EMI, total interest and full amortization schedule for any loan.",
    keywords: ["emi calculator", "loan emi", "home loan calculator"],
  },
  privacy: clientPrivacy,
  relatedTools: ["sip-calculator", "percentage-calculator", "gst-calculator"],
  faq: [
    { question: "What formula is used?", answer: "Standard reducing balance EMI formula." },
    { question: "Is this financial advice?", answer: financeDisclaimer },
  ],
  howTo: [
    { title: "Enter loan details", description: "Principal, interest rate and tenure in months." },
    { title: "Calculate", description: "View EMI and amortization schedule." },
  ],
  inputSchema: z.object({
    principal: z.number().positive(),
    annualRate: z.number().min(0),
    tenureMonths: z.number().int().positive(),
  }),
  execute: (input) => ({ ...calculateEMI(input), disclaimer: financeDisclaimer }),
});

defineTool({
  slug: "sip-calculator",
  name: "SIP Calculator",
  shortDescription: "Estimate returns on systematic investment plans.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  featured: true,
  seo: {
    title: "SIP Calculator — Calculate SIP Returns Online",
    description: "Calculate estimated returns on monthly SIP investments with expected rate of return.",
    keywords: ["sip calculator", "mutual fund sip", "investment calculator"],
  },
  privacy: clientPrivacy,
  relatedTools: ["emi-calculator", "cagr-calculator", "percentage-calculator"],
  faq: [
    { question: "Are returns guaranteed?", answer: "No. Results are estimates based on assumed returns." },
  ],
  howTo: [
    { title: "Enter SIP details", description: "Monthly amount, expected return and duration." },
    { title: "Calculate", description: "View maturity value and estimated returns." },
  ],
  inputSchema: z.object({
    monthlyInvestment: z.number().positive(),
    annualRate: z.number().min(0),
    tenureYears: z.number().positive(),
  }),
  execute: (input) => ({ ...calculateSIP(input), disclaimer: financeDisclaimer }),
});

defineTool({
  slug: "cagr-calculator",
  name: "CAGR Calculator",
  shortDescription: "Calculate Compound Annual Growth Rate for investments.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  featured: true,
  seo: {
    title: "CAGR Calculator — Calculate Compound Annual Growth Rate",
    description: "Calculate CAGR from beginning value, ending value and number of years.",
    keywords: ["cagr calculator", "compound annual growth rate"],
  },
  privacy: clientPrivacy,
  relatedTools: ["sip-calculator", "percentage-calculator", "emi-calculator"],
  faq: [
    { question: "What is CAGR?", answer: "Compound Annual Growth Rate — the smoothed annual return over a period." },
  ],
  howTo: [
    { title: "Enter values", description: "Beginning value, ending value and years." },
    { title: "Calculate CAGR", description: "View CAGR and total return." },
  ],
  inputSchema: z.object({
    beginningValue: z.number().positive(),
    endingValue: z.number().positive(),
    years: z.number().positive(),
  }),
  execute: (input) => ({ ...calculateCAGR(input), disclaimer: financeDisclaimer }),
});

defineTool({
  slug: "gst-calculator",
  name: "GST Calculator",
  shortDescription: "Add or remove GST from amounts with any tax rate.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  seo: {
    title: "GST Calculator — Calculate GST Online",
    description: "Calculate GST for exclusive or inclusive amounts. Supports any GST rate.",
    keywords: ["gst calculator", "goods and services tax"],
  },
  privacy: clientPrivacy,
  relatedTools: ["percentage-calculator", "emi-calculator"],
  faq: [
    { question: "What GST rates are supported?", answer: "Any rate — common rates are 5%, 12%, 18% and 28%." },
  ],
  howTo: [
    { title: "Enter amount", description: "Input the amount and GST rate." },
    { title: "Choose mode", description: "Exclusive (add GST) or inclusive (extract GST)." },
  ],
  inputSchema: z.object({
    amount: z.number().positive(),
    gstRate: z.number().min(0),
    mode: z.enum(["exclusive", "inclusive"]),
  }),
  execute: (input) => ({ ...calculateGST(input), disclaimer: financeDisclaimer }),
});

defineTool({
  slug: "age-calculator",
  name: "Age Calculator",
  shortDescription: "Calculate exact age from date of birth.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  seo: {
    title: "Age Calculator — Calculate Age from Date of Birth",
    description: "Calculate your exact age in years, months and days from your date of birth.",
    keywords: ["age calculator", "calculate age", "date of birth"],
  },
  privacy: clientPrivacy,
  relatedTools: ["date-calculator", "percentage-calculator"],
  faq: [
    { question: "Can I use a custom reference date?", answer: "Yes, optionally specify a reference date." },
  ],
  howTo: [
    { title: "Enter birth date", description: "Select your date of birth." },
    { title: "Calculate", description: "View age in years, months and days." },
  ],
  inputSchema: z.object({
    birthDate: z.string(),
    referenceDate: z.string().optional(),
  }),
  execute: (input) => calculateAge(input),
});

defineTool({
  slug: "date-calculator",
  name: "Date Calculator",
  shortDescription: "Calculate days, weeks and months between two dates.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  seo: {
    title: "Date Calculator — Days Between Dates",
    description: "Calculate the number of days, weeks, months and business days between two dates.",
    keywords: ["date calculator", "days between dates"],
  },
  privacy: clientPrivacy,
  relatedTools: ["age-calculator", "unit-converter"],
  faq: [
    { question: "Are business days included?", answer: "Yes, business days exclude weekends." },
  ],
  howTo: [
    { title: "Select dates", description: "Choose start and end dates." },
    { title: "Calculate", description: "View the difference in multiple units." },
  ],
  inputSchema: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  execute: (input) => calculateDateDiff(input),
});

defineTool({
  slug: "unit-converter",
  name: "Unit Converter",
  shortDescription: "Convert length, weight and temperature units.",
  category: "calculator",
  type: "calculator",
  processing: "client",
  seo: {
    title: "Unit Converter — Convert Length, Weight & Temperature",
    description: "Free unit converter for length, weight and temperature measurements.",
    keywords: ["unit converter", "length converter", "temperature converter"],
  },
  privacy: clientPrivacy,
  relatedTools: ["date-calculator", "percentage-calculator"],
  faq: [
    { question: "What units are supported?", answer: "Length, weight and temperature with common units." },
  ],
  howTo: [
    { title: "Select category", description: "Choose length, weight or temperature." },
    { title: "Enter value", description: "Input value and select from/to units." },
  ],
  inputSchema: z.object({
    value: z.number(),
    category: z.enum(["length", "weight", "temperature"]),
    fromUnit: z.string(),
    toUnit: z.string(),
  }),
  execute: (input) => convertUnit(input),
});
