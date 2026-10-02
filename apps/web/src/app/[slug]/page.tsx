import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTools, getRelatedTools, getTool } from "@internet-utility/tools";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { ToolRunner } from "@/components/tools/tool-runner";
import { PrivacyBadge } from "@/components/tools/privacy-badge";
import { FAQSection } from "@/components/tools/faq-section";
import { RelatedTools } from "@/components/tools/related-tools";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.shortDescription,
    applicationCategory: "UtilityApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs category={tool.category} toolName={tool.name} />
      <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
      <p className="mt-2 text-lg text-muted">{tool.shortDescription}</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <ToolRunner tool={tool} />
      </div>

      <div className="mt-6">
        <PrivacyBadge privacy={tool.privacy} />
      </div>

      {tool.howTo.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">How to use {tool.name}</h2>
          <ol className="space-y-3">
            {tool.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <FAQSection faq={tool.faq} />
      <RelatedTools tools={related} />
    </div>
  );
}
