import { Shield as ShieldIcon } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CelestialMark } from "@/components/CelestialMark";
import protocolHero from "@/assets/protocol-hero.jpg";
import productCapsule from "@/assets/product-capsule.jpg";

export const Route = createFileRoute("/protocol")({
  head: () => ({
    meta: [
      { title: "The Protocol — Celestial" },
      {
        name: "description",
        content:
          "A 24-hour engineered ritual. Four phases — ignition, sustain, restore, repair — designed for elite biological output.",
      },
      { property: "og:title", content: "The Protocol — Celestial" },
      {
        property: "og:description",
        content:
          "Daily, weekly, quarterly. The Celestial Protocol synchronises supplementation with circadian biology.",
      },
      { property: "og:image", content: protocolHero },
    ],
  }),
  component: ProtocolPage,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-5 flex max-w-[1320px] items-center justify-between rounded-full border border-gold/20 bg-obsidian/70 px-8 py-3.5 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <CelestialMark className="h-5 w-5 text-gold" />
          <span className="text-display text-base tracking-[0.4em] text-ivory">CELESTIAL</span>
        </Link>
        <nav className="hidden gap-10 text-[10.5px] tracking-[0.3em] uppercase text-ivory/70 md:flex">
          <Link to="/science" className="transition-colors hover:text-gold">Science</Link>
          <Link to="/products" className="transition-colors hover:text-gold">Products</Link>
          <Link to="/brand-new" className="transition-colors hover:text-gold">Brand New</Link>
          <Link to="/protocol" className="text-gold">Protocol</Link>
          <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
          <Link to="/journal" className="transition-colors hover:text-gold">Journal</Link>
          <Link to="/admin" title="Admin Panel" aria-label="Admin Panel" className="inline-flex items-center gap-1 transition-colors hover:text-gold"><ShieldIcon className="h-3.5 w-3.5" /></Link>
        </nav>
        <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
          Enter
        </button>
      </div>
    </header>
  );
}

const phases = [
  {
    n: "01", time: "05:30 — 09:00", t: "Ignition",
    b: "Mitochondrial wake-up. Adaptogen + nootropic stack to bring cortisol into a clean, controlled rise.",
    items: ["NMN Elixir 250 mg", "Lion's Mane Liposomal", "Marine Magnesium 320 mg"],
  },
  {
    n: "02", time: "09:00 — 16:00", t: "Sustain",
    b: "Cognitive endurance. Sustained-release neurotransmitter precursors and adaptogenic anchors.",
    items: ["Tyrosine + Rhodiola", "L-Theanine 200 mg", "Electrolyte Architect"],
  },
  {
    n: "03", time: "16:00 — 21:00", t: "Restore",
    b: "Glycemic flattening, anti-inflammatory recovery, and parasympathetic switch.",
    items: ["Berberine HCL", "Omega-3 EPA/DHA Triglyceride", "Curcumin Phytosome"],
  },
  {
    n: "04", time: "21:00 — 05:30", t: "Repair",
    b: "Sleep-architecture support. Cellular autophagy, GABAergic calm, and overnight repair.",
    items: ["Glycine + Apigenin", "Magnesium Threonate", "Reishi Spore Oil"],
  },
];

const cadence = [
  { l: "Daily compliance", v: 96 },
  { l: "Reported energy lift (W4)", v: 84 },
  { l: "Sleep depth improvement (W6)", v: 72 },
  { l: "Quarterly bloodwork delta", v: 68 },
];

const cycle = [
  { p: "Daily", n: "01", t: "Core stack", b: "Foundational molecules taken every morning and evening." },
  { p: "Weekly", n: "02", t: "Bio-modulators", b: "Cycled adaptogens to prevent receptor downregulation." },
  { p: "Monthly", n: "03", t: "Audit", b: "Biomarker check-in. Subjective journal review." },
  { p: "Quarterly", n: "04", t: "Recalibration", b: "Stack refresh based on labs, season, and goals." },
];

function ProtocolPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-24">
        <img
          src={protocolHero}
          alt="Celestial daily protocol flatlay"
          width={1536}
          height={1024}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--obsidian) 0%, color-mix(in oklab, var(--obsidian) 55%, transparent) 50%, var(--obsidian) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1320px] px-8">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="text-eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> The Daily Architecture
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-ivory"
            >
              A 24-hour ritual<br />
              <span className="italic text-gold">engineered around your circadian biology.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-ivory/75">
              The Celestial Protocol is not a regimen. It is a synchronised sequence of
              molecules — timed to the way the body actually transitions through ignition,
              sustain, restore and repair.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* PHASES — 24h sequence */}
      <section className="border-y border-border bg-midnight/30 py-24">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="text-eyebrow mb-5">The Four Phases</div>
              <h2 className="text-display text-5xl text-ivory lg:text-6xl">
                Ignition · Sustain · <span className="italic text-champagne">Restore · Repair</span>
              </h2>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2"
          >
            {phases.map((p) => (
              <motion.article
                key={p.n}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-obsidian p-10 transition-colors hover:bg-midnight/60"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-display text-3xl text-gold">{p.n}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">{p.time}</span>
                </div>
                <h3 className="text-display mt-6 text-3xl text-ivory">{p.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{p.b}</p>
                <ul className="mt-6 space-y-2 text-[13px] text-ivory/70">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <span className="h-px w-3 bg-gold" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>

          {/* 24-hour bar */}
          <div className="mt-14">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ivory/45">
              <span>05:30</span>
              <span>12:00</span>
              <span>21:00</span>
              <span>05:30</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full border border-gold/20">
              {[
                { pct: 14, c: "var(--gradient-gold)" },
                { pct: 30, c: "color-mix(in oklab, var(--gold) 70%, transparent)" },
                { pct: 22, c: "color-mix(in oklab, var(--gold) 45%, transparent)" },
                { pct: 34, c: "color-mix(in oklab, var(--gold) 25%, transparent)" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 1, ease }}
                  style={{ background: s.c }}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CADENCE */}
      <section className="py-28">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
            className="relative"
          >
            <div
              className="absolute -inset-4 rounded-[2rem]"
              style={{ background: "var(--gradient-gold)", opacity: 0.18, filter: "blur(50px)" }}
            />
            <img
              src={productCapsule}
              alt="Celestial capsule precision"
              width={1024}
              height={1280}
              loading="lazy"
              className="relative h-[68vh] w-full rounded-3xl border border-gold/20 object-cover"
              style={{ boxShadow: "var(--shadow-gold)" }}
            />
          </motion.div>

          <div>
            <div className="text-eyebrow mb-5">Cohort Outcomes · 12 weeks</div>
            <h2 className="text-display text-5xl text-ivory lg:text-6xl">
              Compliance is <span className="italic text-gold">the molecule.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-ivory/65">
              Self-reported and lab-verified outcomes from 1,240 protocol members across
              a 12-week observational cohort.
            </p>

            <div className="mt-10 space-y-7">
              {cadence.map((p, i) => (
                <motion.div
                  key={p.l}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease }}
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-ivory/70">{p.l}</span>
                    <span className="text-display text-2xl text-gold">{p.v}%</span>
                  </div>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-ivory/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.v}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 1.4, ease }}
                      style={{ background: "var(--gradient-gold)" }}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CYCLE */}
      <section className="border-t border-border bg-midnight/30 py-24">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-12">
            <div className="text-eyebrow mb-5">The Long Arc</div>
            <h2 className="text-display text-4xl text-ivory lg:text-5xl">
              Daily. Weekly. Monthly. <span className="italic text-champagne">Quarterly.</span>
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
          >
            {cycle.map((c) => (
              <motion.div key={c.n} variants={fadeUp} className="bg-obsidian p-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{c.p}</div>
                <div className="text-display mt-5 text-3xl text-ivory">{c.n}</div>
                <h3 className="text-display mt-2 text-lg text-ivory">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/55">{c.b}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-8">
          <h3 className="text-display text-4xl text-ivory">
            Begin <span className="italic text-gold">your protocol.</span>
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-ivory/65">
            Four close-ended questions calibrate a stack to your biology and your day.
          </p>
          <Link
            to="/universe"
            className="mt-9 inline-flex rounded-full bg-gold px-9 py-3.5 text-[10.5px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne"
          >
            Customize your stack →
          </Link>
        </div>
      </section>
    </div>
  );
}
