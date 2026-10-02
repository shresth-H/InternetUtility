import type { CategoryDefinition } from "./types";

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Convert, merge, split, compress and manage PDF files.",
    icon: "📄",
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, convert and edit images online.",
    icon: "🖼️",
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Count, convert, compare and clean up text.",
    icon: "📝",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format JSON, decode JWT, encode Base64 and more.",
    icon: "⚙️",
  },
  {
    slug: "calculator",
    name: "Calculators",
    description: "Financial, date, age and unit conversion calculators.",
    icon: "🔢",
  },
];

export function getCategory(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
