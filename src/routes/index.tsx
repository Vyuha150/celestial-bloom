import { createFileRoute } from "@tanstack/react-router";
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
          <a href="#universe" className="transition-colors hover:text-gold">Universe</a>
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
    <section className="relative min-h-screen overflow-hidden bg-grain pt-32">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-veil)" }} />

      {/* corner ribbon */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease }}
        className="absolute right-0 top-0 z-10 hidden md:block"
      >
        <div className="relative h-32 w-72 overflow-hidden">
          <div className="absolute -right-20 top-8 w-[28rem] rotate-45 bg-gold py-2 text-center text-[10px] uppercase tracking-[0.4em] text-obsidian">
            ✦ Volume 01 — 2026
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1320px] px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12"
        >
          <div className="flex flex-col justify-center lg:col-span-6">
            <motion.div variants={fadeUp} className="text-eyebrow mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              The Flourish Protocol
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display text-[clamp(3rem,7.5vw,6.5rem)] text-ivory"
            >
              Premium <span className="italic text-champagne">Precision</span><br />
              Performance <span className="text-gold">Formulae</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-md text-base leading-relaxed text-ivory/65"
            >
              Celestial is a precision-extracted performance system engineered for those who
              refuse the average. Pharmaceutical-grade molecules. Scientifically dosed.
              Quietly powerful.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-8">
              <button className="rounded-full bg-gold px-9 py-3.5 text-[11px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne">
                Begin Protocol
              </button>
              <a href="#science" className="text-[11px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold">
                The Science →
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="relative lg:col-span-6">
            <div
              className="absolute -inset-2 rounded-[2rem]"
              style={{ background: "var(--gradient-gold)", opacity: 0.18, filter: "blur(40px)" }}
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-[2rem] border border-gold/20"
              style={{ boxShadow: "var(--shadow-luxe)" }}
            >
              <img
                src={heroFlatlay}
                alt="Celestial luxury supplement bottles flat lay with gold leaf accents"
                width={1600}
                height={1280}
                className="h-[68vh] w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-6 left-6 rounded-2xl border border-gold/30 bg-obsidian/80 p-4 backdrop-blur"
            >
              <div className="text-eyebrow mb-1 text-[9px]">Lot No.</div>
              <div className="text-display text-xl text-ivory">CL · 2026 · 001</div>
              <div className="mt-1 text-[9px] tracking-[0.2em] text-ivory/50">PURITY 99.97%</div>
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full border border-gold/40 md:block"
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
          className="mt-20 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-ivory/40"
        >
          <span>Featured in</span>
          {["Vogue", "GQ", "Forbes", "Wired", "Monocle"].map((b) => (
            <span key={b} className="text-display text-base normal-case tracking-normal text-ivory/70">{b}</span>
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
  const cats = [
    { t: "Core Performance Stack", n: "07 SKU", items: ["Precision Greens v.12+", "Mitochondrial Energy", "Cognitive Blend", "Adaptogen Stress"] },
    { t: "Bioavailability Capsules", n: "07 SKU", items: ["Liposomal Vitamin C", "Nanoemulsion CoQ10", "Magnesium Glycinate", "D3 + K2 in MCT"] },
    { t: "Precision Powders", n: "06 SKU", items: ["Whey Isolate · grass-fed", "Collagen Peptides I+III", "Creatine Creapure®", "Reishi + Lion's Mane"] },
    { t: "Functional Beverages", n: "07 SKU", items: ["Nootropic Focus Shot", "NMN Longevity Elixir", "H₂-Rich Mineral Water", "KSM-66 Latte"] },
    { t: "Smart Gummies & Strips", n: "07 SKU", items: ["NAD+ Longevity Gummy", "Melatonin + L-Theanine", "Astaxanthin Antioxidant", "B12 Sublingual Strip"] },
    { t: "Diagnostic Protocols", n: "06 SKU", items: ["At-home Biomarker Test", "30-Day Performance Box", "Athlete's Quarterly Refill", "Corporate Stack"] },
  ];
  return (
    <section id="universe" className="border-t border-border py-28">
      <div className="mx-auto max-w-[1320px] px-8">
        <div className="mb-16 flex items-end justify-between border-b border-border pb-10">
          <div>
            <div className="text-eyebrow mb-5">The Product Universe</div>
            <h2 className="text-display max-w-2xl text-5xl text-ivory lg:text-6xl">
              Forty formulations.<br />
              <span className="italic text-champagne">One operating system</span> for the body.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-display text-5xl text-gold">40+</div>
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
          {cats.map((c, i) => (
            <motion.article
              key={c.t}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.5, ease }}
              className="group relative cursor-pointer bg-obsidian p-10 transition-all duration-700 hover:bg-midnight"
            >
              <div className="flex items-start justify-between">
                <span className="text-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">{c.n}</span>
              </div>
              <h3 className="text-display mt-10 text-3xl text-ivory">{c.t}</h3>
              <ul className="mt-7 space-y-2 text-sm text-ivory/55">
                {c.items.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <span className="h-px w-3 bg-gold" />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-10 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all group-hover:gap-5">
                Explore range →
              </div>
            </motion.article>
          ))}
        </motion.div>
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
