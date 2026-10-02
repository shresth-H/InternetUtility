import type { Metadata } from "next";
import { searchTools } from "@internet-utility/tools";
import { ToolCard } from "@/components/tools/tool-card";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search Tools",
  description: "Search all online tools on Toolbox.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const results = searchTools(q ?? "");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">
        {q ? `Results for "${q}"` : "All Tools"}
      </h1>
      <p className="mt-2 text-muted">{results.length} tool(s) found</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-8 text-muted">No tools match your search. Try different keywords.</p>
      )}
    </div>
  );
}
