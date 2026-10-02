import type { ToolCategory, ToolDefinition } from "./types";

const tools = new Map<string, ToolDefinition>();

export function defineTool<TInput = unknown, TResult = unknown>(
  definition: ToolDefinition<TInput, TResult>
): ToolDefinition<TInput, TResult> {
  tools.set(definition.slug, definition as ToolDefinition);
  return definition;
}

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.get(slug);
}

export function getAllTools(): ToolDefinition[] {
  return Array.from(tools.values()).filter((t) => t.enabled !== false);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return getAllTools().filter((t) => t.category === category);
}

export function getFeaturedTools(limit = 8): ToolDefinition[] {
  return getAllTools()
    .filter((t) => t.featured)
    .slice(0, limit);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((s) => getTool(s))
    .filter((t): t is ToolDefinition => t !== undefined && t.enabled !== false);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllTools();
  return getAllTools().filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.slug.includes(q) ||
      t.category.includes(q) ||
      t.seo.keywords?.some((k) => k.toLowerCase().includes(q))
  );
}
