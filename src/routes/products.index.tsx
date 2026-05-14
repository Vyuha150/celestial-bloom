import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { categories, totalSkus } from "@/data/products";
import { CelestialMark } from "@/components/CelestialMark";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Celestial" },
      {
        name: "description",
        content:
          "Forty-eight precision formulations across seven categories. Pharmaceutical-grade supplementation, scientifically dosed.",
      },
      { property: "og:title", content: "Products — Celestial" },
      {
        property: "og:description",
        content: "Seven categories. Forty-eight formulations. One operating system for elite human biology.",
      },
    ],
  }),
  component: ProductsIndex,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };

function ProductsIndex() {
  return (
    <div className="min-h-screen bg-obsidian">
      {/* Slim secondary nav */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto mt-5 flex max-w-[1320px] items-center justify-between rounded-full border border-gold/20 bg-obsidian/70 px-8 py-3.5 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <CelestialMark className="h-5 w-5 text-gold" />
            <span className="text-display text-base tracking-[0.4em] text-ivory">CELESTIAL</span>
          </Link>
          <nav className="hidden gap-10 text-[10.5px] tracking-[0.3em] uppercase text-ivory/70 md:flex">
            <Link to="/" hash="science" className="transition-colors hover:text-gold">Science</Link>
            <Link to="/products" className="text-gold">Products</Link>
            <Link to="/brand-new" className="transition-colors hover:text-gold">Brand New</Link>
            <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
            <Link to="/" hash="protocol" className="transition-colors hover:text-gold">Protocol</Link>
          </nav>
          <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
            Enter
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden pt-40 pb-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-veil)" }}
        />
        <div className="mx-auto max-w-[1320px] px-8">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="text-eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> The Catalogue
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-ivory"
            >
              Seven categories.<br />
              <span className="italic text-gold">{totalSkus} formulations.</span><br />
              One operating system.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-ivory/65">
              Browse the full range. Each category opens into a dedicated protocol page —
              clinical doses, infographics, lot transparency, and allocation tiers.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-gold/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold">
                Free concierge onboarding
              </span>
              <span className="rounded-full border border-border bg-midnight/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/60">
                Cold-chain shipping included
              </span>
              <span className="rounded-full border border-border bg-midnight/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/60">
                90-day biomarker guarantee
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-8 pb-32">
        <div className="mx-auto max-w-[1320px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((c, i) => (
              <motion.article
                key={c.slug}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-midnight/40"
              >
                <Link to="/products/$slug" params={{ slug: c.slug }} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={c.image}
                      alt={c.title}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                    <div className="absolute left-5 top-5 rounded-full border border-gold/40 bg-obsidian/70 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur">
                      {String(i + 1).padStart(2, "0")} ─ {c.items.length} SKU
                    </div>
                    <div className="absolute bottom-5 right-5 rounded-full bg-gold/90 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-obsidian">
                      {c.tiers[0].price}+
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="text-display text-2xl text-ivory">{c.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/55">{c.tagline}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
                        {c.stats[0].value} <span className="text-ivory/30">· {c.stats[0].label}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all group-hover:gap-4">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center">
        <Link to="/" className="text-eyebrow inline-flex items-center gap-2 hover:text-champagne">
          ← Return home
        </Link>
      </footer>
    </div>
  );
}
