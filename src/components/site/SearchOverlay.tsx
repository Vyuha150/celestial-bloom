import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { categories } from "@/data/products";

type Result = { slug: string; title: string; tagline: string; image: string; matched: string[] };

// Searches the catalogue that ships with the site (category titles,
// taglines and the formulas listed in each) — instant, no network call.
function search(query: string): Result[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: (Result & { score: number })[] = [];
  for (const c of categories) {
    const title = c.title.toLowerCase();
    const haystack = `${title} ${c.tagline} ${c.items.join(" ")}`.toLowerCase();
    if (!terms.every((t) => haystack.includes(t))) continue;

    const matched = c.items.filter((item) => terms.some((t) => item.toLowerCase().includes(t)));
    const score = (terms.some((t) => title.includes(t)) ? 2 : 0) + (matched.length > 0 ? 1 : 0);
    results.push({ slug: c.slug, title: c.title, tagline: c.tagline, image: c.image, matched: matched.slice(0, 4), score });
  }
  return results.sort((a, b) => b.score - a.score);
}

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] bg-obsidian/90 backdrop-blur-md" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto mt-24 w-[calc(100%-2rem)] max-w-2xl text-ivory"
      >
        <div className="flex items-center gap-4 border-b border-gold/40 pb-4">
          <Search className="h-5 w-5 shrink-0 text-gold" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas and collections"
            aria-label="Search formulas and collections"
            className="w-full bg-transparent text-display text-2xl text-ivory outline-none placeholder:text-ivory/30"
          />
          <button onClick={onClose} aria-label="Close search" className="text-ivory/50 transition-colors hover:text-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div data-lenis-prevent className="mt-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div>
              <p className="text-eyebrow mb-4">Collections</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/products/$slug"
                      params={{ slug: c.slug }}
                      onClick={onClose}
                      className="block border border-gold/10 px-4 py-3 text-sm text-ivory/75 transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length === 0 ? (
            <p className="py-10 text-center text-sm text-ivory/50">
              Nothing matches “{query.trim()}”. Try a formula name, such as “magnesium” or “collagen”.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: r.slug }}
                    onClick={onClose}
                    className="flex items-center gap-4 border border-gold/10 p-3 transition-colors hover:border-gold/50"
                  >
                    <img src={r.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-cover" />
                    <div className="min-w-0">
                      <div className="text-sm text-ivory">{r.title}</div>
                      <div className="mt-1 truncate text-xs text-ivory/50">
                        {r.matched.length > 0 ? r.matched.join(" · ") : r.tagline}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
