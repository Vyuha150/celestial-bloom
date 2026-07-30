import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Shield } from "lucide-react";
import { CelestialMark } from "@/components/CelestialMark";

const NAV = [
  { label: "Philosophy", to: "/protocol" },
  { label: "Science", to: "/science" },
  { label: "Collections", to: "/products" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/universe" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/12 bg-obsidian/72 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="Celestial home" data-cursor="Home">
          <CelestialMark className="h-4 w-4 text-gold" />
          <span className="text-[13px] tracking-[0.42em] text-ivory">CELESTIAL</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="text-[10px] uppercase tracking-[0.28em] text-ivory/60 transition-colors hover:text-gold focus-visible:text-gold focus-visible:outline-none"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="text-ivory/60 transition-colors hover:text-gold">
            <Search className="h-[15px] w-[15px]" />
          </button>
          <button aria-label="Account" className="hidden text-ivory/60 transition-colors hover:text-gold sm:block">
            <User className="h-[15px] w-[15px]" />
          </button>
          <button aria-label="Bag" className="relative text-ivory/60 transition-colors hover:text-gold">
            <ShoppingBag className="h-[15px] w-[15px]" />
            <span className="absolute -right-1.5 -top-1.5 text-[8px] text-gold">0</span>
          </button>
          <Link to="/admin" aria-label="Admin panel" className="text-ivory/40 transition-colors hover:text-gold">
            <Shield className="h-[14px] w-[14px]" />
          </Link>
          <Link
            to="/products"
            data-cursor="Explore"
            className="hidden border border-gold/45 px-5 py-2 text-[9.5px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-obsidian md:inline-block"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </header>
  );
}
