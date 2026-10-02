import Link from "next/link";
import type { ToolDefinition } from "@internet-utility/tools";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <h3 className="font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
      <p className="mt-2 text-sm text-muted line-clamp-2 flex-1">{tool.shortDescription}</p>
      <span className="mt-4 text-xs font-medium text-primary capitalize">{tool.category}</span>
    </Link>
  );
}
