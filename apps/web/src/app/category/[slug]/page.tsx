import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getToolsByCategory, type ToolCategory } from "@internet-utility/tools";
import { ToolCard } from "@/components/tools/tool-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "pdf" },
    { slug: "image" },
    { slug: "text" },
    { slug: "developer" },
    { slug: "calculator" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — Free Online Tools`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(slug as ToolCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <span className="text-4xl">{category.icon}</span>
      <h1 className="mt-4 text-3xl font-bold">{category.name}</h1>
      <p className="mt-2 text-lg text-muted">{category.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
