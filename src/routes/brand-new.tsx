import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { categories } from "@/data/products";
import { CelestialMark } from "@/components/CelestialMark";

export const Route = createFileRoute("/brand-new")({
  head: () => ({
    meta: [
      { title: "Brand New & Best Buys — Celestial" },
      {
        name: "description",
        content:
          "This season's new arrivals and most-loved formulations. Limited allocations, founder-only pricing, free concierge onboarding.",
      },
      { property: "og:title", content: "Brand New & Best Buys — Celestial" },
      {
        property: "og:description",
        content:
          "Newly launched precision formulations and the bestsellers operators reorder month after month.",
      },
    ],
  }),
  component: BrandNewPage,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

// Curated launches — pick 4 categories as "new"
const newLaunches = [
  {
    cat: categories[3], // beverages
    productName: "NMN Longevity Elixir — 2026 Reformulation",
    badge: "Just Launched",
    price: "$240",
    was: "$280",
    save: "Save $40",
    blurb:
      "300 mg pharmaceutical-grade NMN, stabilised in a citrate matrix. Cold-chain glass. Allocations open this week.",
    chips: ["Glass only", "300mg / serving", "Cold-chain"],
  },
  {
    cat: categories[4], // gummies
    productName: "NAD+ Longevity Gummy — Black Fig",
    badge: "New Flavour",
    price: "$160",
    was: "$190",
    save: "Save $30",
    blurb:
      "Same 250 mg NAD+ dose, now in a sugar-free Michelin-developed black fig gummy. First production run is 4,000 tins.",
    chips: ["250mg NAD+", "0g sugar", "Pectin base"],
  },
  {
    cat: categories[1], // bio
    productName: "Liposomal Vitamin C — Phospholipid v.4",
    badge: "Updated Formula",
    price: "$95",
    was: "$120",
    save: "Save $25",
    blurb:
      "New 120 nm liposomal envelope pushes cellular uptake to 94%. The most absorbable vitamin C we've ever shipped.",
    chips: ["94% uptake", "120nm particle", "30-day supply"],
  },
  {
    cat: categories[6], // diagnostic
    productName: "At-Home 62-Biomarker Kit",
    badge: "New Kit",
    price: "$320",
    was: "$420",
    save: "Save $100",
    blurb:
      "Quarterly bloodwork, mailed in a chilled aluminium case. 48 h turnaround, clinician review included.",
    chips: ["62 biomarkers", "48h results", "Clinician 1:1"],
  },
];

// Best buys — pick the 3 highlight tiers across categories
const bestBuys = [
  {
    cat: categories[0],
    productName: "Quarterly Performance Protocol",
    rating: "4.9 ★ (2,184)",
    price: "$890",
    cadence: "/ 90 days",
    save: "Save 13%",
    blurb:
      "The flagship daily stack. Most operators reorder before the third bottle is empty.",
  },
  {
    cat: categories[2],
    productName: "Training Block — 3-Tin Bundle",
    rating: "4.8 ★ (1,420)",
    price: "$210",
    cadence: "/ 3 tins",
    save: "Save 10%",
    blurb:
      "Whey isolate, creatine, electrolytes — mix and match flavours. The athlete favourite.",
  },
  {
    cat: categories[5],
    productName: "Weekly Pantry — Chef Box",
    rating: "4.9 ★ (980)",
    price: "$220",
    cadence: "/ week",
    save: "Save 11%",
    blurb:
      "Macro-locked bars, nootropic chocolate, DHA snacks. Eats like a tasting menu.",
  },
];

// Animated infographic — sales velocity
const velocityBars = [
  { label: "NMN Elixir launch demand", value: 92 },
  { label: "NAD+ Black Fig pre-orders", value: 78 },
  { label: "Liposomal C reorder rate", value: 84 },
  { label: "Diagnostic Kit waitlist fill", value: 96 },
];

function BrandNewPage() {
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
            <Link to="/products" className="transition-colors hover:text-gold">Products</Link>
            <Link to="/brand-new" className="text-gold">Brand New</Link>
            <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
            <Link to="/" hash="protocol" className="transition-colors hover:text-gold">Protocol</Link>
          </nav>
          <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
            Enter
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-veil)" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mx-auto max-w-[1320px] px-8">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="text-eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="relative">
                Just Dropped — Q2 2026
                <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold align-middle" />
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display max-w-5xl text-[clamp(2.5rem,6.2vw,5.8rem)] leading-[1.04] text-ivory"
            >
              Brand new arrivals.<br />
              <span className="italic text-gold">Best buys, on allocation.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-xl text-base leading-relaxed text-ivory/70"
            >
              Four launches this season. Three perennial bestsellers. Founder-only pricing
              while the first production runs ship — no codes required, discount applied at vault.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-gold/60 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold">
                Up to 30% off launch lots
              </span>
              <span className="rounded-full border border-border bg-midnight/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/65">
                Free concierge onboarding
              </span>
              <span className="rounded-full border border-border bg-midnight/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/65">
                Cold-chain shipping included
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* NEW LAUNCHES */}
      <section className="px-8 pb-24">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
            <div>
              <div className="text-eyebrow mb-3">01 — New launches</div>
              <h2 className="text-display text-3xl text-ivory lg:text-5xl">
                Four formulations, fresh off the bench.
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-display text-5xl text-gold">04</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                Launches this quarter
              </div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {newLaunches.map((p, i) => (
              <motion.article
                key={p.productName}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-midnight/40"
              >
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={p.cat.image}
                    alt={p.productName}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease }}
                    className="absolute left-5 top-5 rounded-full border border-gold/60 bg-obsidian/80 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur"
                  >
                    ✦ {p.badge}
                  </motion.div>
                  <div className="absolute right-5 top-5 rounded-full bg-gold/95 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-obsidian">
                    {p.save}
                  </div>
                </div>
                <div className="p-7">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
                    {p.cat.title}
                  </div>
                  <h3 className="text-display mt-2 text-2xl text-ivory">{p.productName}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{p.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border bg-obsidian/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-ivory/55"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-display text-3xl text-gold">{p.price}</span>
                      <span className="text-sm text-ivory/35 line-through">{p.was}</span>
                    </div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.cat.slug }}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian"
                    >
                      Reserve →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INFOGRAPHIC */}
      <section className="border-t border-border px-8 py-24">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-eyebrow mb-3">02 — Launch velocity</div>
            <h2 className="text-display text-3xl text-ivory lg:text-5xl">
              These move <span className="italic text-gold">fast.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/65">
              First-run allocations almost always close inside the first 14 days. Live percentages
              against this quarter's reserved inventory — updated on each refresh.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-gold"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Live allocation tracker
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-midnight/40 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                  Q2 2026 — % allocated
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Updated live
                </div>
              </div>
              <div className="space-y-6">
                {velocityBars.map((b, i) => (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease }}
                  >
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-sm text-ivory/80">{b.label}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.1 + i * 0.12, duration: 0.4 }}
                        className="text-display text-lg text-gold"
                      >
                        {b.value}%
                      </motion.span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-obsidian/60">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 1.4, ease }}
                        className="h-full rounded-full"
                        style={{ background: "var(--gradient-gold)" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST BUYS */}
      <section className="border-t border-border px-8 py-24">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
            <div>
              <div className="text-eyebrow mb-3">03 — Best buys</div>
              <h2 className="text-display text-3xl text-ivory lg:text-5xl">
                The reorders we can't keep on the shelf.
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-display text-5xl text-gold">93%</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                Reorder rate
              </div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {bestBuys.map((p, i) => (
              <motion.article
                key={p.productName}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease }}
                className={`group relative overflow-hidden rounded-3xl border bg-midnight/40 ${
                  i === 1 ? "border-gold/60" : "border-border"
                }`}
              >
                {i === 1 && (
                  <div className="absolute right-5 top-5 z-10 rounded-full bg-gold px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-obsidian">
                    ◆ Most loved
                  </div>
                )}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={p.cat.image}
                    alt={p.productName}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-ivory/45">{p.cat.title}</span>
                    <span className="text-gold">{p.rating}</span>
                  </div>
                  <h3 className="text-display mt-3 text-xl text-ivory">{p.productName}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{p.blurb}</p>
                  <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-display text-2xl text-gold">{p.price}</span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/45">
                          {p.cadence}
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gold/80">
                        {p.save}
                      </div>
                    </div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.cat.slug }}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian"
                    >
                      Add →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="text-eyebrow mb-4">Final note</div>
          <h2 className="text-display text-4xl text-ivory lg:text-5xl">
            Allocations close <span className="italic text-gold">when the lot does.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ivory/65">
            Every launch ships in a single sealed production run. When it's gone, the next lot is
            a quarter away. Reserve while founder pricing is live.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-full bg-gold px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-all hover:opacity-90"
            >
              Browse full catalogue →
            </Link>
            <Link
              to="/universe"
              className="rounded-full border border-gold/60 px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian"
            >
              Customize a stack
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border py-10 text-center">
        <Link to="/" className="text-eyebrow inline-flex items-center gap-2 hover:text-champagne">
          ← Return home
        </Link>
      </footer>
    </div>
  );
}
