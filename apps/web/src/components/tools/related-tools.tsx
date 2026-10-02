import { ToolCard } from "./tool-card";
import type { ToolDefinition } from "@internet-utility/tools";

export function RelatedTools({ tools }: { tools: ToolDefinition[] }) {
  if (!tools.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
