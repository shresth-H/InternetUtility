import Link from "next/link";
import { CATEGORIES, getFeaturedTools } from "@internet-utility/tools";
import { ToolCard } from "@/components/tools/tool-card";
import { CategorySearch } from "@/components/home/category-search";

export default function HomePage() {
  const featured = getFeaturedTools(8);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Everything you need to get things done.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Free online tools for PDF, images, text, developers and calculators.
            Fast, private, and built for real work.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <CategorySearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-6">Popular Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-accent/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold mb-4">Learn</h2>
          <p className="text-muted mb-6">Understand concepts behind the tools you use.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/learn/what-is-cagr", title: "What is CAGR?" },
              { href: "/learn/how-emi-works", title: "How EMI Works" },
              { href: "/learn/what-is-jwt", title: "What is JWT?" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary/40 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
