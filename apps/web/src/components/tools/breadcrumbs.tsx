import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategory } from "@internet-utility/tools";

interface BreadcrumbsProps {
  category: string;
  toolName: string;
}

export function Breadcrumbs({ category, toolName }: BreadcrumbsProps) {
  const cat = getCategory(category);
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href={`/category/${category}`} className="hover:text-foreground capitalize">
        {cat?.name ?? category}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{toolName}</span>
    </nav>
  );
}
