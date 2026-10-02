import Link from "next/link";
import { CATEGORIES } from "@internet-utility/tools";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">Toolbox</h3>
            <p className="text-sm text-muted">
              Everything you need to get things done. Fast, private, and free online tools.
            </p>
          </div>
          {CATEGORIES.map((cat) => (
            <div key={cat.slug}>
              <h3 className="font-semibold mb-3">{cat.name}</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <Link href={`/category/${cat.slug}`} className="hover:text-foreground">
                    Browse all
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border text-sm text-muted text-center">
          © {new Date().getFullYear()} Toolbox — Internet Utility Platform
        </div>
      </div>
    </footer>
  );
}
