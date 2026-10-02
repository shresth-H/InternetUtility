import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const ARTICLES: Record<
  string,
  { title: string; description: string; content: string[]; relatedTool: string; relatedToolName: string }
> = {
  "what-is-cagr": {
    title: "What is CAGR?",
    description: "Understand Compound Annual Growth Rate and how it measures investment growth over time.",
    relatedTool: "cagr-calculator",
    relatedToolName: "CAGR Calculator",
    content: [
      "CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a specified period longer than one year.",
      "It smooths out volatility by assuming profits are reinvested each period. The formula is: CAGR = (Ending Value / Beginning Value)^(1/years) - 1.",
      "CAGR is useful for comparing investments with different time horizons on an equal basis.",
    ],
  },
  "how-emi-works": {
    title: "How EMI Works",
    description: "Learn how Equated Monthly Installments are calculated for loans.",
    relatedTool: "emi-calculator",
    relatedToolName: "EMI Calculator",
    content: [
      "EMI (Equated Monthly Installment) is a fixed payment made by a borrower to a lender on a specified date each month.",
      "Each EMI consists of two components: principal repayment and interest. Early payments have higher interest portions.",
      "The standard formula uses reducing balance method: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly rate, and n is tenure in months.",
    ],
  },
  "what-is-jwt": {
    title: "What is JWT?",
    description: "Understand JSON Web Tokens used for authentication and authorization.",
    relatedTool: "jwt-decoder",
    relatedToolName: "JWT Decoder",
    content: [
      "JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object.",
      "A JWT has three parts: Header (algorithm & type), Payload (claims/data), and Signature (verification).",
      "JWTs are commonly used for stateless authentication in APIs. Always verify signatures server-side in production.",
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function LearnPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span>Learn</span>
      </nav>
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-2 text-lg text-muted">{article.description}</p>
      <div className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
        {article.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-border bg-accent/50 p-4">
        <p className="text-sm text-muted">Try the tool</p>
        <Link href={`/${article.relatedTool}`} className="font-medium text-primary hover:underline">
          {article.relatedToolName} →
        </Link>
      </div>
    </article>
  );
}
