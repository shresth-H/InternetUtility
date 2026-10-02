import type { z } from "zod";

export type ToolCategory =
  | "pdf"
  | "image"
  | "text"
  | "developer"
  | "calculator";

export type ToolType =
  | "calculator"
  | "converter"
  | "processor"
  | "text-utility"
  | "developer-utility"
  | "ai-utility";

export type ProcessingLocation = "client" | "server";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface ToolPrivacy {
  location: ProcessingLocation;
  message: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolDefinition<TInput = unknown, TResult = unknown> {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  type: ToolType;
  processing: ProcessingLocation;
  seo: ToolSEO;
  privacy: ToolPrivacy;
  relatedTools: string[];
  faq: FAQItem[];
  howTo: HowToStep[];
  inputSchema?: z.ZodType<TInput>;
  execute?: (input: TInput) => TResult | Promise<TResult>;
  featured?: boolean;
  enabled?: boolean;
}

export interface CategoryDefinition {
  slug: ToolCategory;
  name: string;
  description: string;
  icon: string;
}
