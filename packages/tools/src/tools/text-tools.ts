import { z } from "zod";
import { defineTool } from "../registry";
import {
  convertCase,
  countCharacters,
  countWords,
  removeDuplicateLines,
  textDiff,
} from "../processors/text";

const clientPrivacy = {
  location: "client" as const,
  message: "Runs entirely in your browser. Your data is not uploaded.",
};

defineTool({
  slug: "word-counter",
  name: "Word Counter",
  shortDescription: "Count words, characters, sentences and paragraphs in your text.",
  category: "text",
  type: "text-utility",
  processing: "client",
  featured: true,
  seo: {
    title: "Word Counter — Count Words & Characters Online",
    description: "Free online word counter. Count words, characters, sentences and paragraphs instantly in your browser.",
    keywords: ["word counter", "character count", "text counter"],
  },
  privacy: clientPrivacy,
  relatedTools: ["character-counter", "case-converter", "remove-duplicate-lines"],
  faq: [
    { question: "Is my text uploaded?", answer: "No. Everything runs locally in your browser." },
    { question: "What counts as a word?", answer: "Words are separated by whitespace." },
  ],
  howTo: [
    { title: "Paste your text", description: "Enter or paste text into the input area." },
    { title: "View counts", description: "Word, character and sentence counts update instantly." },
  ],
  inputSchema: z.object({ text: z.string() }),
  execute: ({ text }: { text: string }) => countWords(text),
});

defineTool({
  slug: "character-counter",
  name: "Character Counter",
  shortDescription: "Count characters, bytes and characters without spaces.",
  category: "text",
  type: "text-utility",
  processing: "client",
  seo: {
    title: "Character Counter — Count Characters Online",
    description: "Count characters, bytes and characters without spaces. Private browser-based tool.",
    keywords: ["character counter", "char count"],
  },
  privacy: clientPrivacy,
  relatedTools: ["word-counter", "case-converter"],
  faq: [
    { question: "Does it count spaces?", answer: "Yes, and you can also see counts without spaces." },
  ],
  howTo: [
    { title: "Enter text", description: "Type or paste your text." },
    { title: "See results", description: "Character counts update in real time." },
  ],
  inputSchema: z.object({ text: z.string() }),
  execute: ({ text }: { text: string }) => countCharacters(text),
});

defineTool({
  slug: "case-converter",
  name: "Case Converter",
  shortDescription: "Convert text to uppercase, lowercase, title case, camelCase and more.",
  category: "text",
  type: "text-utility",
  processing: "client",
  seo: {
    title: "Case Converter — Change Text Case Online",
    description: "Convert text to uppercase, lowercase, title case, camelCase, snake_case and kebab-case.",
    keywords: ["case converter", "uppercase", "camelcase"],
  },
  privacy: clientPrivacy,
  relatedTools: ["word-counter", "remove-duplicate-lines"],
  faq: [
    { question: "What case formats are supported?", answer: "Upper, lower, title, sentence, camel, snake and kebab case." },
  ],
  howTo: [
    { title: "Enter text", description: "Paste the text you want to convert." },
    { title: "Choose format", description: "Select the target case format." },
    { title: "Copy result", description: "Copy the converted text." },
  ],
  inputSchema: z.object({
    text: z.string(),
    mode: z.enum(["upper", "lower", "title", "sentence", "camel", "snake", "kebab"]),
  }),
  execute: ({ text, mode }: { text: string; mode: Parameters<typeof convertCase>[1] }) => ({
    result: convertCase(text, mode),
  }),
});

defineTool({
  slug: "remove-duplicate-lines",
  name: "Remove Duplicate Lines",
  shortDescription: "Remove duplicate lines from text while preserving order.",
  category: "text",
  type: "text-utility",
  processing: "client",
  seo: {
    title: "Remove Duplicate Lines — Clean Text Online",
    description: "Remove duplicate lines from any text. Fast, free, and runs in your browser.",
    keywords: ["remove duplicate lines", "deduplicate text"],
  },
  privacy: clientPrivacy,
  relatedTools: ["word-counter", "text-diff", "case-converter"],
  faq: [
    { question: "Is order preserved?", answer: "Yes, the first occurrence of each line is kept." },
  ],
  howTo: [
    { title: "Paste text", description: "Enter text with one item per line." },
    { title: "Remove duplicates", description: "Click to remove duplicate lines." },
  ],
  inputSchema: z.object({ text: z.string() }),
  execute: ({ text }: { text: string }) => removeDuplicateLines(text),
});

defineTool({
  slug: "text-diff",
  name: "Text Diff",
  shortDescription: "Compare two blocks of text and highlight differences.",
  category: "text",
  type: "text-utility",
  processing: "client",
  seo: {
    title: "Text Diff — Compare Two Texts Online",
    description: "Compare two texts side by side and see added, removed and unchanged lines.",
    keywords: ["text diff", "compare text", "diff checker"],
  },
  privacy: clientPrivacy,
  relatedTools: ["remove-duplicate-lines", "word-counter"],
  faq: [
    { question: "How does comparison work?", answer: "Lines are compared sequentially and differences are highlighted." },
  ],
  howTo: [
    { title: "Enter both texts", description: "Paste original and modified text." },
    { title: "Compare", description: "View highlighted differences." },
  ],
  inputSchema: z.object({ textA: z.string(), textB: z.string() }),
  execute: ({ textA, textB }: { textA: string; textB: string }) => ({ lines: textDiff(textA, textB) }),
});
