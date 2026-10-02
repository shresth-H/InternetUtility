import type { FAQItem } from "@internet-utility/tools";

export function FAQSection({ faq }: { faq: FAQItem[] }) {
  if (!faq.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faq.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-border bg-card"
          >
            <summary className="cursor-pointer px-4 py-3 font-medium list-none flex justify-between items-center">
              {item.question}
              <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
