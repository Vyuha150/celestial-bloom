import { Link } from "@tanstack/react-router";
import { CelestialMark } from "@/components/CelestialMark";
import { useStoreSettings } from "@/lib/storeSettings";
import { NewsletterForm } from "./NewsletterForm";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Collections",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Brand New", to: "/brand-new" },
      { label: "Customization", to: "/universe" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "Science", to: "/science" },
      { label: "Philosophy", to: "/protocol" },
      { label: "Journal", to: "/journal" },
    ],
  },
  {
    title: "Client",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Your account", to: "/account" },
    ],
  },
];

export function SiteFooter() {
  const { storeName, supportEmail } = useStoreSettings();

  return (
    <footer id="contact" className="border-t border-gold/12 bg-obsidian pb-12 pt-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <CelestialMark className="h-4 w-4 text-gold" />
              <span className="text-[13px] tracking-[0.42em] text-ivory">CELESTIAL</span>
            </div>
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-ivory/45">
              Scientifically extracted formulations for those who intend to flourish, not merely
              sustain.
            </p>
            <div className="mt-8 max-w-sm">
              <NewsletterForm
                source="footer"
                className="flex items-center border-b border-gold/25 pb-2"
                inputClassName="w-full bg-transparent text-xs text-ivory placeholder:text-ivory/30 focus:outline-none"
                buttonClassName="text-[10px] uppercase tracking-[0.28em] text-gold"
              />
            </div>
            {supportEmail && (
              <p className="mt-6 text-xs text-ivory/45">
                Support:{" "}
                <a href={`mailto:${supportEmail}`} className="text-ivory/70 transition-colors hover:text-gold">
                  {supportEmail}
                </a>
              </p>
            )}
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-xs text-ivory/50 transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-gold/10 pt-6 text-[10px] tracking-[0.22em] text-ivory/30 md:flex-row">
          <span>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </span>
          <span>Precision · Purity · Performance</span>
        </div>
      </div>
    </footer>
  );
}
