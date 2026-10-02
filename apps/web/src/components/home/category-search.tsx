"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

export function CategorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        placeholder="What do you need to do?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </form>
  );
}
