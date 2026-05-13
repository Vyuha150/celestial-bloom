import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, totalSkus } from "@/data/products";
import { motion } from "motion/react";
import { CelestialMark } from "@/components/CelestialMark";
import heroFlatlay from "@/assets/hero-flatlay.jpg";
import banner1 from "@/assets/banner-product-1.jpg";
import banner2 from "@/assets/banner-product-2.jpg";
import productCapsule from "@/assets/product-capsule.jpg";
import iconLeaf from "@/assets/icon-leaf.png";
import iconMolecule from "@/assets/icon-molecule.png";
import iconGem from "@/assets/icon-gem.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celestial — Operate at Your Biological Peak" },
      {
        name: "description",
        content:
          "Celestial. Hyper-precise, scientifically extracted performance formulations for those who don't sustain — they flourish.",
      },
      { property: "og:title", content: "Celestial — Operate at Your Biological Peak" },
      {
        property: "og:description",
        content: "Premium, science-led supplementation for elite human performance.",
      },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-5 flex max-w-[1320px] items-center justify-between rounded-full border border-gold/20 bg-obsidian/70 px-8 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <CelestialMark className="h-5 w-5 text-gold" />
          <span className="text-display text-base tracking-[0.4em] text-ivory">CELESTIAL</span>
        </div>
        <nav className="hidden gap-10 text-[10.5px] tracking-[0.3em] uppercase text-ivory/70 md:flex">
          <a href="#science" className="transition-colors hover:text-gold">Science</a>
          <a href="#protocol" className="transition-colors hover:text-gold">Protocol</a>
          <Link to="/universe" className="transition-colors hover:text-gold">Universe</Link>
          <a href="#journal" className="transition-colors hover:text-gold">Journal</a>
        </nav>
        <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
          Enter
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex h-screen min-h-[640px] flex-col overflow-hidden">
      {/* Full-bleed background still */}
      <motion.img
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease }}
        src={heroFlatlay}
        alt="Celestial luxury supplement bottles flat lay with gold leaf accents"
        width={1600}
        height={1280}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Cinematic luxury video, right-anchored, edge-blended (no box) */}
      <motion.video
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease, delay: 0.2 }}
        src={heroVideo.url}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroFlatlay}
        className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover md:w-[70%]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,1) 45%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,1) 45%)",
        }}
      />
      {/* Cinematic overlays — blend media into page */}
      <div className="absolute inset-0 -z-10 bg-obsidian/45" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, var(--obsidian) 0%, color-mix(in oklab, var(--obsidian) 78%, transparent) 38%, color-mix(in oklab, var(--obsidian) 30%, transparent) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-56"
        style={{ background: "linear-gradient(to bottom, transparent, var(--obsidian))" }}
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-32"
        style={{ background: "linear-gradient(to bottom, var(--obsidian), transparent)" }}
      />
      <div className="absolute inset-0 -z-10 bg-grain" />

      {/* corner ribbon */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease }}
        className="pointer-events-none absolute right-0 top-0 z-10 hidden md:block"
      >
        <div className="relative h-28 w-64 overflow-hidden">
          <div className="absolute -right-20 top-7 w-[26rem] rotate-45 bg-gold py-1.5 text-center text-[9px] uppercase tracking-[0.4em] text-obsidian">
            ✦ Volume 01 — 2026
          </div>
        </div>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-8 pt-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="flex flex-1 flex-col justify-center"
        >
          <motion.div variants={fadeUp} className="text-eyebrow mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            The Flourish Protocol
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-display max-w-3xl text-[clamp(2.5rem,6vw,5.25rem)] text-ivory"
          >
            Premium <span className="italic text-champagne">Precision</span><br />
            Performance <span className="text-gold">Formulae</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70"
          >
            A precision-extracted performance system engineered for those who refuse the
            average. Pharmaceutical-grade molecules. Scientifically dosed. Quietly powerful.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex items-center gap-6">
            <button className="rounded-full bg-gold px-7 py-3 text-[10.5px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne">
              Begin Protocol
            </button>
            <a href="#science" className="text-[10.5px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold">
              The Science →
            </a>
          </motion.div>

          {/* Lot card pinned bottom-right, integrated not patched */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, ease }}
            className="absolute bottom-24 right-8 hidden items-center gap-4 border-l border-gold/40 pl-5 md:flex"
          >
            <div>
              <div className="text-eyebrow mb-1 text-[9px]">Lot No.</div>
              <div className="text-display text-lg text-ivory">CL · 2026 · 001</div>
              <div className="mt-0.5 text-[9px] tracking-[0.25em] text-ivory/50">PURITY 99.97%</div>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <path id="circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-gold" style={{ fontSize: 9, letterSpacing: "0.3em" }}>
                  <textPath href="#circle">★ CELESTIAL ✦ PRECISION ★ FLOURISH ✦</textPath>
                </text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="relative flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-border/60 py-5 text-[10px] uppercase tracking-[0.3em] text-ivory/45"
        >
          <span>Featured in</span>
          {["Vogue", "GQ", "Forbes", "Wired", "Monocle"].map((b) => (
            <span key={b} className="text-display text-sm normal-case tracking-normal text-ivory/75">{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Pillars() {
  const items = [
    { icon: iconLeaf, n: "01", title: "Precision Extracted", body: "Sub-critical CO₂ isolates, chelated for maximum bioavailability. Every milligram measured, witnessed, third-party verified." },
    { icon: iconMolecule, n: "02", title: "Scientifically Dosed", body: "Each protocol engineered around peer-reviewed clinical thresholds. No marketing doses. No filler science." },
    { icon: iconGem, n: "03", title: "Premium by Design", body: "Anodised aluminium vessels. Matte black. Gold foil emboss standard. The packaging is the protocol." },
  ];
  return (
    <section className="border-y border-border bg-midnight/30 py-24">
      <div className="mx-auto max-w-[1320px] px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3"
        >
          {items.map((it) => (
            <motion.div
              key={it.n}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, ease }}
              className="group bg-obsidian p-12 transition-colors hover:bg-midnight"
            >
              <motion.img
                src={it.icon}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="h-14 w-14 object-contain"
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ duration: 0.6, ease }}
              />
              <div className="text-eyebrow mt-10">{it.n} ─ Pillar</div>
              <h3 className="text-display mt-3 text-4xl text-ivory">{it.title}</h3>
              <div className="hairline my-6" />
              <p className="text-sm leading-relaxed text-ivory/60">{it.body}</p>
              <div className="mt-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all group-hover:gap-5">
                Discover →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Banner({
  image, eyebrow, title, italic, body, reverse = false,
}: {
  image: string; eyebrow: string; title: string; italic: string; body: string; reverse?: boolean;
}) {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[1320px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className={`grid grid-cols-1 items-stretch overflow-hidden rounded-3xl border border-gold/15 bg-midnight/50 md:grid-cols-2 ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div variants={fadeUp} className="relative min-h-[420px] overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              width={1400}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.4, ease }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 to-transparent" />
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col justify-center p-12 lg:p-16">
            <div className="text-eyebrow mb-5 inline-flex items-center gap-3">
              <span className="h-px w-6 bg-gold" /> {eyebrow}
            </div>
            <h3 className="text-display text-5xl text-ivory">
              {title}<br />
              <span className="italic text-gold">{italic}</span>
            </h3>
            <div className="hairline my-7 max-w-[8rem]" />
            <p className="max-w-md text-sm leading-relaxed text-ivory/65">{body}</p>
            <button className="mt-10 w-fit rounded-full bg-ivory px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-gold">
              Read more →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Science() {
  return (
    <section id="science" className="relative overflow-hidden py-32">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-16 px-8 lg:grid-cols-2">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-eyebrow mb-6">The Method</motion.div>
          <motion.h2 variants={fadeUp} className="text-display text-5xl text-ivory lg:text-6xl">
            Extracted with the<br />
            <span className="italic text-gold">precision of a laboratory.</span><br />
            Delivered like couture.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-8 max-w-lg text-base leading-relaxed text-ivory/60">
            Each Celestial molecule travels a 14-stage journey — from sub-critical CO₂
            extraction to liposomal encapsulation, from chelation to triple-blinded HPLC
            verification. We do not formulate. We engineer.
          </motion.p>
          <div className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {[
              { v: "99.97%", l: "Active purity" },
              { v: "14", l: "Extraction stages" },
              { v: "0", l: "Fillers · binders" },
            ].map((s) => (
              <motion.div key={s.l} variants={fadeUp} className="bg-obsidian p-6">
                <div className="text-display text-4xl text-gold">{s.v}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
            alt="Celestial precision capsule vessel"
            width={1024}
            height={1280}
            loading="lazy"
            className="relative h-[72vh] w-full rounded-3xl border border-gold/20 object-cover"
            style={{ boxShadow: "var(--shadow-gold)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Universe() {
  return (
    <section id="universe" className="border-t border-border py-28">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="mb-16 flex items-end justify-between border-b border-border pb-10">
          <div>
            <div className="text-eyebrow mb-5">The Product Universe</div>
            <h2 className="text-display max-w-2xl text-5xl text-ivory lg:text-6xl">
              {totalSkus} formulations.<br />
              <span className="italic text-champagne">One operating system</span> for the body.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-display text-5xl text-gold">{totalSkus}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">Active SKUs</div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((c, i) => (
            <motion.article
              key={c.slug}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, ease }}
              className="group relative cursor-pointer overflow-hidden bg-obsidian transition-all duration-700 hover:bg-midnight"
            >
              <Link to="/universe" hash={c.slug} className="block">
                <div className="relative h-44 overflow-hidden">
                  <motion.img
                    src={c.image}
                    alt={c.title}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <span className="text-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
                      {String(c.items.length).padStart(2, "0")} SKU
                    </span>
                  </div>
                  <h3 className="text-display mt-6 text-2xl text-ivory">{c.title}</h3>
                  <ul className="mt-5 space-y-1.5 text-[13px] text-ivory/55">
                    {c.items.slice(0, 4).map((it) => (
                      <li key={it} className="flex items-center gap-3">
                        <span className="h-px w-3 bg-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all group-hover:gap-5">
                    Explore range →
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            to="/universe"
            className="inline-flex rounded-full bg-gold px-9 py-3.5 text-[10.5px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne"
          >
            Enter the full universe →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="protocol" className="relative overflow-hidden border-y border-border bg-midnight/30 py-32">
      <div className="mx-auto max-w-[1100px] px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-eyebrow mb-10"
        >
          The Celestial Manifesto
        </motion.div>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="text-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.1] text-ivory"
        >
          "Survival is the floor.<br />
          We engineer for the <span className="italic text-gold">ceiling.</span><br />
          For those who take their<br />biology seriously."
        </motion.blockquote>
        <div className="hairline mx-auto mt-14 max-w-xs" />
        <div className="mt-8 text-[11px] uppercase tracking-[0.4em] text-ivory/50">
          ✦ Founders · Celestial Laboratories
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="journal" className="bg-obsidian py-20">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <CelestialMark className="h-7 w-7 text-gold" />
              <span className="text-display text-2xl tracking-[0.4em] text-ivory">CELESTIAL</span>
            </div>
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-ivory/55">
              Engineered in Switzerland. Distributed quietly. Available by protocol invitation.
            </p>
            <div className="mt-10 flex max-w-sm border-b border-gold/40">
              <input
                type="email"
                placeholder="your@private.email"
                className="flex-1 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/30 outline-none"
              />
              <button className="text-[10px] uppercase tracking-[0.3em] text-gold">Join →</button>
            </div>
          </div>
          {[
            { t: "Universe", l: ["Performance", "Bioavailability", "Powders", "Beverages", "Gummies", "Diagnostics"] },
            { t: "Method", l: ["The Science", "Sourcing", "Testing", "Manufacturing"] },
            { t: "House", l: ["Concierge", "Press", "Careers", "Contact"] },
          ].map((col) => (
            <div key={col.t} className="md:col-span-2">
              <div className="text-eyebrow mb-6">{col.t}</div>
              <ul className="space-y-3">
                {col.l.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-ivory/60 transition-colors hover:text-gold">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-ivory/35 md:flex-row md:items-center">
          <div>© MMXXVI · Celestial Laboratories — All atoms reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Lot Verification</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <Banner
          image={banner1}
          eyebrow="Featured Capsule"
          title="Precision-Engineered"
          italic="Performance Stack"
          body="A matte-black vessel housing a chelated micronutrient lattice. Cellular-grade absorption, designed for the operator who measures everything — including their biology."
        />
        <Science />
        <Banner
          image={banner2}
          eyebrow="Signature Elixir"
          title="Quiet Power."
          italic="Loud Results."
          body="Hand-blended adaptogenic tinctures pressed into onyx glass. A single dropper replaces the morning chaos — calm focus, stable energy, compounded over weeks."
          reverse
        />
        <Universe />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
