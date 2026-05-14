import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CelestialMark } from "@/components/CelestialMark";
import scienceHero from "@/assets/science-hero.jpg";
import scienceBg from "@/assets/science-bg.jpg";
import iconLeaf from "@/assets/icon-leaf.png";
import iconMolecule from "@/assets/icon-molecule.png";
import iconGem from "@/assets/icon-gem.png";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "The Science — Celestial" },
      {
        name: "description",
        content:
          "Inside Celestial's 14-stage extraction architecture: sub-critical CO₂, liposomal encapsulation, triple-blinded HPLC verification.",
      },
      { property: "og:title", content: "The Science — Celestial" },
      {
        property: "og:description",
        content:
          "Pharmaceutical-grade extraction, clinical dosing, and triple-blinded purity. The science behind every Celestial molecule.",
      },
      { property: "og:image", content: scienceHero },
    ],
  }),
  component: SciencePage,
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
          <Link to="/science" className="text-gold">Science</Link>
          <Link to="/products" className="transition-colors hover:text-gold">Products</Link>
          <Link to="/brand-new" className="transition-colors hover:text-gold">Brand New</Link>
          <Link to="/protocol" className="transition-colors hover:text-gold">Protocol</Link>
          <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
          <Link to="/journal" className="transition-colors hover:text-gold">Journal</Link>
        </nav>
        <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
          Enter
        </button>
      </div>
    </header>
  );
}

const stages = [
  { n: "01", t: "Botanical Sourcing", b: "Single-origin biomass from certified Swiss & Icelandic terroir partners." },
  { n: "02", t: "Sub-critical CO₂", b: "Solvent-free extraction at 31°C preserves heat-labile actives." },
  { n: "03", t: "Molecular Filtration", b: "0.2 µm sterile filtration removes microbial load without heat damage." },
  { n: "04", t: "Chelation Binding", b: "Amino-acid chelation lifts mineral bioavailability up to 4.2×." },
  { n: "05", t: "Liposomal Encapsulation", b: "Phosphatidylcholine vesicles shield molecules across the gut barrier." },
  { n: "06", t: "Cold Microdosing", b: "Sub-zero compression locks dose accuracy within ±0.3 mg per capsule." },
  { n: "07", t: "Triple-Blinded HPLC", b: "Three independent labs verify identity, potency, and purity." },
];

const purity = [
  { l: "Active purity", v: 99.97 },
  { l: "Heavy metal removal", v: 99.92 },
  { l: "Solvent residue removal", v: 100 },
  { l: "Microbial threshold compliance", v: 99.99 },
  { l: "Identity match (HPLC)", v: 99.95 },
];

const pillars = [
  { icon: iconLeaf, t: "Botanically Sourced", b: "Single-origin biomass with full chain-of-custody." },
  { icon: iconMolecule, t: "Clinically Dosed", b: "Each molecule meets peer-reviewed efficacy thresholds." },
  { icon: iconGem, t: "Pharma-Grade Made", b: "GMP-certified Swiss manufacturing. Full COA per lot." },
];

function SciencePage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-24">
        <img
          src={scienceHero}
          alt="Celestial laboratory glass vials"
          width={1536}
          height={1024}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--obsidian) 0%, color-mix(in oklab, var(--obsidian) 60%, transparent) 50%, var(--obsidian) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1320px] px-8">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="text-eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> The Method
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-ivory"
            >
              We do not formulate.<br />
              <span className="italic text-gold">We engineer.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-ivory/75">
              Every Celestial molecule travels a 14-stage architecture — from sub-critical CO₂
              extraction to triple-blinded HPLC verification. The result: pharmaceutical purity,
              clinical dosing, and bioavailability that holds up under independent scrutiny.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-y border-border bg-midnight/30 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto grid max-w-[1320px] grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border px-8 md:grid-cols-3 md:px-0"
        >
          {pillars.map((p) => (
            <motion.div key={p.t} variants={fadeUp} className="bg-obsidian p-10">
              <img src={p.icon} alt="" width={56} height={56} className="h-14 w-14 opacity-90" />
              <h3 className="text-display mt-6 text-2xl text-ivory">{p.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/60">{p.b}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 14-STAGE TIMELINE */}
      <section className="py-28">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-16 flex items-end justify-between border-b border-border pb-10">
            <div>
              <div className="text-eyebrow mb-5">The 14-Stage Architecture</div>
              <h2 className="text-display max-w-2xl text-5xl text-ivory lg:text-6xl">
                From soil <span className="italic text-champagne">to cell.</span>
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-display text-5xl text-gold">14</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">Verified stages</div>
            </div>
          </div>

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative space-y-px overflow-hidden rounded-3xl border border-border bg-border"
          >
            {stages.map((s) => (
              <motion.li
                key={s.n}
                variants={fadeUp}
                className="grid grid-cols-12 items-center gap-6 bg-obsidian px-8 py-7 transition-colors hover:bg-midnight/50"
              >
                <div className="col-span-2 text-display text-3xl text-gold md:col-span-1">{s.n}</div>
                <div className="col-span-10 md:col-span-4">
                  <div className="text-display text-xl text-ivory">{s.t}</div>
                </div>
                <div className="col-span-12 text-sm text-ivory/60 md:col-span-7">{s.b}</div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* PURITY INFOGRAPHIC */}
      <section className="relative overflow-hidden border-t border-border py-28">
        <img
          src={scienceBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
        />
        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-8 lg:grid-cols-2">
          <div>
            <div className="text-eyebrow mb-5">Independent Verification</div>
            <h2 className="text-display text-5xl text-ivory lg:text-6xl">
              Triple-blinded.<br />
              <span className="italic text-gold">Publicly auditable.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-ivory/65">
              Three independent ISO 17025 laboratories verify every Celestial lot.
              Certificates are published per batch and accessible by lot number — not
              marketing copy.
            </p>
            <Link
              to="/products"
              className="mt-10 inline-flex rounded-full bg-gold px-9 py-3.5 text-[10.5px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne"
            >
              See verified formulations →
            </Link>
          </div>

          <div className="space-y-7">
            {purity.map((p, i) => (
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
      </section>

      {/* CTA */}
      <section className="bg-midnight/30 py-24 text-center">
        <div className="mx-auto max-w-2xl px-8">
          <h3 className="text-display text-4xl text-ivory">
            Engineering you can <span className="italic text-gold">measure.</span>
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-ivory/65">
            Begin with a stack designed around your biology — not a marketing persona.
          </p>
          <Link
            to="/universe"
            className="mt-9 inline-flex rounded-full border border-gold/50 px-9 py-3.5 text-[10.5px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian"
          >
            Customize your stack →
          </Link>
        </div>
      </section>
    </div>
  );
}
