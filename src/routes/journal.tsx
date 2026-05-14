import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CelestialMark } from "@/components/CelestialMark";
import journalHero from "@/assets/journal-hero.jpg";
import banner1 from "@/assets/banner-product-1.jpg";
import banner2 from "@/assets/banner-product-2.jpg";
import catBio from "@/assets/cat-bio.jpg";
import catLuxury from "@/assets/cat-luxury.jpg";
import catPowders from "@/assets/cat-powders.jpg";
import catDiagnostic from "@/assets/cat-diagnostic.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "The Journal — Celestial" },
      {
        name: "description",
        content:
          "Field notes from Celestial Laboratories: longevity science, protocol design, and the rituals of high-output biology.",
      },
      { property: "og:title", content: "The Journal — Celestial" },
      {
        property: "og:description",
        content: "Field notes, essays, and lab reports from the Celestial research desk.",
      },
      { property: "og:image", content: journalHero },
    ],
  }),
  component: JournalPage,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };

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
          <Link to="/protocol" className="transition-colors hover:text-gold">Protocol</Link>
          <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
          <Link to="/journal" className="text-gold">Journal</Link>
        </nav>
        <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
          Enter
        </button>
      </div>
    </header>
  );
}

const featured = {
  cover: banner1,
  category: "Lab Report · Issue 014",
  title: "NMN at clinical thresholds: what the 12-week data actually shows.",
  excerpt:
    "We dosed 312 protocol members with 250 mg liposomal NMN over 12 weeks. NAD+ serum levels climbed 47%, fatigue scores dropped 31%, and morning cortisol normalised within four weeks.",
  read: "11 min",
};

const articles = [
  {
    img: catBio,
    cat: "Bioavailability",
    title: "Why liposomal isn't a marketing word.",
    excerpt: "Phosphatidylcholine vesicles, gut barrier transport, and the bioavailability data nobody publishes.",
    read: "8 min",
  },
  {
    img: banner2,
    cat: "Longevity",
    title: "The five biomarkers we track every quarter.",
    excerpt: "ApoB, hs-CRP, fasting insulin, HRV, and grip strength — a minimum viable longevity dashboard.",
    read: "9 min",
  },
  {
    img: catLuxury,
    cat: "Ritual",
    title: "Designed objects, designed compliance.",
    excerpt: "On anodised aluminium, weighted glass, and why the vessel is part of the dose.",
    read: "6 min",
  },
  {
    img: catPowders,
    cat: "Recovery",
    title: "Magnesium, three forms, one architecture.",
    excerpt: "Threonate for sleep, glycinate for nerves, malate for muscle — the three-state mineral protocol.",
    read: "7 min",
  },
  {
    img: catDiagnostic,
    cat: "Diagnostics",
    title: "Bloodwork as a feedback loop.",
    excerpt: "How quarterly panels rewrite the stack — and why annual checkups are too slow for elite biology.",
    read: "10 min",
  },
];

const stats = [
  { v: "1,240", l: "Protocol members analysed" },
  { v: "47%", l: "Median NAD+ serum lift" },
  { v: "12 wk", l: "Cohort observation window" },
  { v: "0", l: "Sponsored studies" },
];

const series = [
  { t: "The Method", n: "07", d: "Extraction, encapsulation, and the engineering choices behind every capsule." },
  { t: "The Cohort", n: "12", d: "Observational write-ups from 1,240 protocol members." },
  { t: "The Long Arc", n: "05", d: "Essays on longevity, compounding habits, and biological ceiling." },
  { t: "Lab Notes", n: "21", d: "Short-form protocols, FAQs, and ingredient briefs from the bench." },
];

function JournalPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <img
          src={journalHero}
          alt="Celestial journal cover"
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
              <span className="h-px w-8 bg-gold" /> Field Notes · Issue 014
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-ivory"
            >
              Notes from <span className="italic text-gold">the bench.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-relaxed text-ivory/75">
              Lab reports, protocol essays, and quiet field notes from the Celestial
              research desk. Published when there is something worth reading — never
              on a content calendar.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1320px] px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease }}
            className="grid grid-cols-1 gap-10 overflow-hidden rounded-3xl border border-gold/20 bg-midnight/40 lg:grid-cols-2"
          >
            <div className="relative h-[420px] overflow-hidden lg:h-auto">
              <motion.img
                src={featured.cover}
                alt={featured.title}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full border border-gold/40 bg-obsidian/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur">
                Featured
              </div>
            </div>
            <div className="flex flex-col justify-center p-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{featured.category}</div>
              <h2 className="text-display mt-5 text-3xl text-ivory lg:text-4xl">{featured.title}</h2>
              <p className="mt-5 text-sm leading-relaxed text-ivory/65">{featured.excerpt}</p>
              <div className="mt-8 flex items-center gap-6">
                <a className="inline-flex cursor-pointer items-center gap-3 text-[10.5px] uppercase tracking-[0.3em] text-gold transition-all hover:gap-5">
                  Read the report →
                </a>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">{featured.read}</span>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-midnight/30 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto grid max-w-[1320px] grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.l} variants={fadeUp} className="bg-obsidian p-8 text-center">
              <div className="text-display text-4xl text-gold">{s.v}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-28">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-12 flex items-end justify-between border-b border-border pb-8">
            <div>
              <div className="text-eyebrow mb-5">The Archive</div>
              <h2 className="text-display text-4xl text-ivory lg:text-5xl">
                Recent <span className="italic text-champagne">essays.</span>
              </h2>
            </div>
            <span className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/45 md:block">
              {articles.length.toString().padStart(2, "0")} entries
            </span>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((a) => (
              <motion.article
                key={a.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="group overflow-hidden rounded-2xl border border-border bg-midnight/30 transition-colors hover:border-gold/30"
              >
                <div className="relative h-52 overflow-hidden">
                  <motion.img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/30 bg-obsidian/70 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur">
                    {a.cat}
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-display text-xl text-ivory">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{a.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-gold transition-all group-hover:tracking-[0.4em]">Read →</span>
                    <span className="text-ivory/40">{a.read}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERIES */}
      <section className="border-t border-border bg-midnight/30 py-24">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-12">
            <div className="text-eyebrow mb-5">By Series</div>
            <h2 className="text-display text-4xl text-ivory lg:text-5xl">
              Four ongoing <span className="italic text-gold">columns.</span>
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
          >
            {series.map((s) => (
              <motion.div key={s.t} variants={fadeUp} className="bg-obsidian p-8">
                <div className="flex items-baseline justify-between">
                  <div className="text-display text-2xl text-ivory">{s.t}</div>
                  <div className="text-display text-2xl text-gold">{s.n}</div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ivory/55">{s.d}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
                  Browse series →
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-8">
          <h3 className="text-display text-4xl text-ivory">
            A quiet dispatch, <span className="italic text-gold">monthly.</span>
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-ivory/65">
            One essay. One lab report. One field note. No marketing.
          </p>
          <div className="mx-auto mt-9 flex max-w-md border-b border-gold/40">
            <input
              type="email"
              placeholder="your@private.email"
              className="flex-1 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/30 outline-none"
            />
            <button className="text-[10px] uppercase tracking-[0.3em] text-gold">Join →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
