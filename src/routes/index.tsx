import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CelestialMark } from "@/components/CelestialMark";
import heroProducts from "@/assets/hero-products.jpg";
import productCapsule from "@/assets/product-capsule.jpg";
import scienceBg from "@/assets/science-bg.jpg";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-obsidian/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <CelestialMark className="h-6 w-6 text-gold" />
          <span className="text-display text-lg tracking-[0.4em] text-ivory">CELESTIAL</span>
        </div>
        <nav className="hidden gap-12 text-[11px] tracking-[0.3em] uppercase text-ivory/70 md:flex">
          <a href="#science" className="transition-colors hover:text-gold">Science</a>
          <a href="#protocol" className="transition-colors hover:text-gold">Protocol</a>
          <a href="#universe" className="transition-colors hover:text-gold">Universe</a>
          <a href="#journal" className="transition-colors hover:text-gold">Journal</a>
        </nav>
        <button className="border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
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
      <div className="mx-auto max-w-[1400px] px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-1 gap-16 lg:grid-cols-12"
        >
          <div className="flex flex-col justify-center lg:col-span-6">
            <motion.div variants={fadeUp} className="text-eyebrow mb-8">
              ✦ Volume 01 — The Flourish Protocol
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-display text-[clamp(3.5rem,8vw,7.5rem)] text-ivory"
            >
              Not just<br />
              <span className="italic text-champagne">healthy.</span><br />
              <span className="text-gold">Operating</span><br />
              at your peak.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-10 max-w-md text-base leading-relaxed text-ivory/65"
            >
              Celestial is a precision-extracted performance system engineered for those who
              refuse the average. Pharmaceutical-grade molecules. Scientifically dosed.
              Quietly powerful.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-12 flex items-center gap-8">
              <button className="group relative bg-gold px-10 py-4 text-[11px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne">
                Begin Protocol
              </button>
              <a href="#science" className="text-[11px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold">
                The Science →
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            className="relative lg:col-span-6"
            style={{ boxShadow: "var(--shadow-luxe)" }}
          >
            <div className="absolute -inset-px" style={{ background: "var(--gradient-gold)", opacity: 0.15 }} />
            <img
              src={heroProducts}
              alt="Celestial precision-extracted performance vials"
              width={1600}
              height={1280}
              className="relative h-[70vh] w-full object-cover"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-8 border border-gold/40 bg-obsidian/80 p-5 backdrop-blur"
            >
              <div className="text-eyebrow mb-1">Lot No.</div>
              <div className="text-display text-2xl text-ivory">CL · 2026 · 001</div>
              <div className="mt-2 text-[10px] tracking-[0.2em] text-ivory/50">PURITY 99.97%</div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-24 flex items-center gap-12 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-ivory/40"
        >
          <span>Featured in</span>
          <span className="text-display text-base normal-case tracking-normal text-ivory/70">Vogue</span>
          <span className="text-display text-base normal-case tracking-normal text-ivory/70">GQ</span>
          <span className="text-display text-base normal-case tracking-normal text-ivory/70">Forbes</span>
          <span className="text-display text-base normal-case tracking-normal text-ivory/70">Wired</span>
          <span className="text-display text-base normal-case tracking-normal text-ivory/70">Monocle</span>
        </motion.div>
      </div>
    </section>
  );
}

function Pillars() {
  const items = [
    {
      n: "01",
      title: "Precision",
      body: "Pharmaceutical-grade isolates, chelated for maximum bioavailability. Every milligram measured, witnessed, third-party verified.",
    },
    {
      n: "02",
      title: "Premium",
      body: "Anodised aluminium vessels. Matte black + spot-UV. Gold foil emboss standard. The packaging is the protocol.",
    },
    {
      n: "03",
      title: "Flourish",
      body: "Engineered for the elite operator who is already healthy and wants to compound advantage at the cellular level.",
    },
  ];
  return (
    <section className="border-y border-border bg-midnight/40 py-32">
      <div className="mx-auto max-w-[1400px] px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid grid-cols-1 gap-px bg-border md:grid-cols-3"
        >
          {items.map((it) => (
            <motion.div
              key={it.n}
              variants={fadeUp}
              className="group bg-obsidian p-12 transition-colors hover:bg-midnight"
            >
              <div className="text-eyebrow mb-12">{it.n} ─ Pillar</div>
              <h3 className="text-display text-5xl text-ivory">{it.title}</h3>
              <div className="hairline my-8" />
              <p className="text-sm leading-relaxed text-ivory/60">{it.body}</p>
              <div className="mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                Read more →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Science() {
  return (
    <section id="science" className="relative overflow-hidden py-40">
      <div className="absolute inset-0 -z-10">
        <img src={scienceBg} alt="" width={1600} height={1000} loading="lazy" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
      </div>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-20 px-8 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-eyebrow mb-8">The Method</motion.div>
          <motion.h2 variants={fadeUp} className="text-display text-6xl text-ivory">
            Extracted with the<br />
            <span className="italic text-gold">precision of a laboratory.</span><br />
            Delivered like couture.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-10 max-w-lg text-base leading-relaxed text-ivory/60">
            Each Celestial molecule travels a 14-stage journey — from sub-critical CO₂
            extraction to liposomal encapsulation, from chelation to triple-blinded HPLC
            verification. We do not formulate. We engineer.
          </motion.p>

          <div className="mt-16 grid grid-cols-3 gap-px bg-border">
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
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <img
            src={productCapsule}
            alt="Celestial precision capsule vessel"
            width={1024}
            height={1280}
            loading="lazy"
            className="h-[80vh] w-full object-cover"
            style={{ boxShadow: "var(--shadow-gold)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Universe() {
  const cats = [
    { t: "Core Performance Stack", n: "07 SKU", items: ["Precision Greens v.12+", "Mitochondrial Energy Formula", "Cognitive Performance Blend", "Adaptogen Stress Protocol"] },
    { t: "Bioavailability Capsules", n: "07 SKU", items: ["Liposomal Vitamin C", "Nanoemulsion CoQ10", "Magnesium Glycinate", "D3 + K2 in MCT"] },
    { t: "Precision Powders", n: "06 SKU", items: ["Whey Isolate · grass-fed", "Collagen Peptides I+III", "Creatine Creapure®", "Reishi + Lion's Mane"] },
    { t: "Functional Beverages", n: "07 SKU", items: ["Nootropic Focus Shot", "NMN Longevity Elixir", "Hydrogen-Rich Mineral Water", "Ashwagandha KSM-66 Latte"] },
    { t: "Smart Gummies & Strips", n: "07 SKU", items: ["NAD+ Longevity Gummy", "Melatonin + L-Theanine", "Astaxanthin Antioxidant", "B12 Sublingual Strip"] },
    { t: "Diagnostic Protocols", n: "06 SKU", items: ["At-home Biomarker Test", "30-Day Performance Box", "Athlete's Quarterly Refill", "Corporate Wellness Stack"] },
  ];
  return (
    <section id="universe" className="border-t border-border py-32">
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="mb-20 flex items-end justify-between border-b border-border pb-12">
          <div>
            <div className="text-eyebrow mb-6">The Product Universe</div>
            <h2 className="text-display max-w-2xl text-6xl text-ivory">
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
          className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3"
        >
          {cats.map((c, i) => (
            <motion.article
              key={c.t}
              variants={fadeUp}
              className="group relative cursor-pointer bg-obsidian p-10 transition-all duration-700 hover:bg-midnight"
            >
              <div className="flex items-start justify-between">
                <span className="text-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">{c.n}</span>
              </div>
              <h3 className="mt-12 text-display text-3xl text-ivory">{c.t}</h3>
              <ul className="mt-8 space-y-2 text-sm text-ivory/55">
                {c.items.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <span className="h-px w-3 bg-gold" />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-transform duration-500 group-hover:translate-x-2">
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
    <section id="protocol" className="relative overflow-hidden border-y border-border bg-midnight/30 py-40">
      <div className="mx-auto max-w-[1100px] px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-eyebrow mb-12"
        >
          The Celestial Manifesto
        </motion.div>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.1] text-ivory"
        >
          "Survival is the floor.
          <br />
          We engineer for the <span className="italic text-gold">ceiling.</span>
          <br />
          For those who take their<br />biology seriously."
        </motion.blockquote>
        <div className="hairline mx-auto mt-16 max-w-xs" />
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
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <CelestialMark className="h-8 w-8 text-gold" />
              <span className="text-display text-2xl tracking-[0.4em] text-ivory">CELESTIAL</span>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ivory/55">
              Engineered in Switzerland. Distributed quietly. Available by protocol invitation.
            </p>
            <div className="mt-12 flex max-w-sm border-b border-gold/40">
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

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-ivory/35 md:flex-row md:items-center">
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
        <Science />
        <Universe />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
