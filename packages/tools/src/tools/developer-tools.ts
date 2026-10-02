import { z } from "zod";
import { defineTool } from "../registry";
import {
  decodeBase64,
  decodeJWT,
  decodeURL,
  encodeBase64,
  encodeURL,
  formatJSON,
  generateUUID,
  validateJSON,
} from "../processors/developer";

const clientPrivacy = {
  location: "client" as const,
  message: "Runs entirely in your browser. Your data is not uploaded.",
};

defineTool({
  slug: "json-formatter",
  name: "JSON Formatter",
  shortDescription: "Format and beautify JSON with syntax validation.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  featured: true,
  seo: {
    title: "JSON Formatter — Beautify & Format JSON Online",
    description: "Free JSON formatter and beautifier. Format, validate and prettify JSON in your browser.",
    keywords: ["json formatter", "json beautifier", "format json"],
  },
  privacy: clientPrivacy,
  relatedTools: ["json-validator", "jwt-decoder", "base64-encoder-decoder"],
  faq: [
    { question: "Is my JSON sent to a server?", answer: "No. Formatting happens entirely in your browser." },
  ],
  howTo: [
    { title: "Paste JSON", description: "Enter minified or messy JSON." },
    { title: "Format", description: "Click Format to beautify with proper indentation." },
  ],
  inputSchema: z.object({ json: z.string() }),
  execute: ({ json }: { json: string }) => formatJSON(json),
});

defineTool({
  slug: "json-validator",
  name: "JSON Validator",
  shortDescription: "Validate JSON syntax and detect errors instantly.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  seo: {
    title: "JSON Validator — Validate JSON Online",
    description: "Check if your JSON is valid. Instant syntax validation in the browser.",
    keywords: ["json validator", "validate json"],
  },
  privacy: clientPrivacy,
  relatedTools: ["json-formatter", "jwt-decoder"],
  faq: [
    { question: "What errors does it show?", answer: "Parse errors with position information when available." },
  ],
  howTo: [
    { title: "Paste JSON", description: "Enter JSON to validate." },
    { title: "Check validity", description: "See if JSON is valid or view the error." },
  ],
  inputSchema: z.object({ json: z.string() }),
  execute: ({ json }: { json: string }) => validateJSON(json),
});

defineTool({
  slug: "jwt-decoder",
  name: "JWT Decoder",
  shortDescription: "Decode JWT tokens and inspect header and payload.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  featured: true,
  seo: {
    title: "JWT Decoder — Decode JSON Web Tokens Online",
    description: "Decode JWT tokens safely in your browser. Inspect header and payload without uploading.",
    keywords: ["jwt decoder", "decode jwt", "json web token"],
  },
  privacy: {
    location: "client",
    message: "Your token never leaves your browser. We do not verify signatures.",
  },
  relatedTools: ["json-formatter", "base64-encoder-decoder", "uuid-generator"],
  faq: [
    { question: "Is it safe to paste JWTs here?", answer: "Processing is local, but never paste production secrets on untrusted sites." },
    { question: "Does it verify signatures?", answer: "No. This tool only decodes the token structure." },
  ],
  howTo: [
    { title: "Paste JWT", description: "Enter your JWT token." },
    { title: "Inspect", description: "View decoded header and payload." },
  ],
  inputSchema: z.object({ token: z.string() }),
  execute: ({ token }: { token: string }) => decodeJWT(token),
});

defineTool({
  slug: "uuid-generator",
  name: "UUID Generator",
  shortDescription: "Generate random UUID v4 identifiers instantly.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  seo: {
    title: "UUID Generator — Generate UUID v4 Online",
    description: "Generate cryptographically random UUID v4 identifiers. Free and instant.",
    keywords: ["uuid generator", "generate uuid", "uuid v4"],
  },
  privacy: clientPrivacy,
  relatedTools: ["jwt-decoder", "base64-encoder-decoder"],
  faq: [
    { question: "What UUID version?", answer: "Version 4 (random) UUIDs." },
  ],
  howTo: [
    { title: "Generate", description: "Click to generate a new UUID." },
    { title: "Copy", description: "Copy the UUID to your clipboard." },
  ],
  execute: () => ({ uuid: generateUUID() }),
});

defineTool({
  slug: "base64-encoder-decoder",
  name: "Base64 Encoder/Decoder",
  shortDescription: "Encode and decode Base64 strings online.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  seo: {
    title: "Base64 Encoder/Decoder — Encode & Decode Online",
    description: "Encode text to Base64 or decode Base64 strings. Runs locally in your browser.",
    keywords: ["base64 encoder", "base64 decoder"],
  },
  privacy: clientPrivacy,
  relatedTools: ["url-encoder-decoder", "json-formatter"],
  faq: [
    { question: "What encoding is used?", answer: "Standard Base64 encoding for UTF-8 text." },
  ],
  howTo: [
    { title: "Enter text", description: "Paste text or Base64 string." },
    { title: "Encode or decode", description: "Choose the operation and get results." },
  ],
  inputSchema: z.object({
    input: z.string(),
    mode: z.enum(["encode", "decode"]),
  }),
  execute: ({ input, mode }: { input: string; mode: "encode" | "decode" }) =>
    mode === "encode" ? { result: encodeBase64(input) } : decodeBase64(input),
});

defineTool({
  slug: "url-encoder-decoder",
  name: "URL Encoder/Decoder",
  shortDescription: "Encode and decode URL components safely.",
  category: "developer",
  type: "developer-utility",
  processing: "client",
  seo: {
    title: "URL Encoder/Decoder — Encode & Decode URLs Online",
    description: "Encode special characters for URLs or decode URL-encoded strings.",
    keywords: ["url encoder", "url decoder", "percent encoding"],
  },
  privacy: clientPrivacy,
  relatedTools: ["base64-encoder-decoder", "json-formatter"],
  faq: [
    { question: "What encoding standard?", answer: "Standard URI component encoding (encodeURIComponent)." },
  ],
  howTo: [
    { title: "Enter text", description: "Paste URL or text to encode/decode." },
    { title: "Convert", description: "Select encode or decode." },
  ],
  inputSchema: z.object({
    input: z.string(),
    mode: z.enum(["encode", "decode"]),
  }),
  execute: ({ input, mode }: { input: string; mode: "encode" | "decode" }) =>
    mode === "encode" ? { result: encodeURL(input) } : decodeURL(input),
});
