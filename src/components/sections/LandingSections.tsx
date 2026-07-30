import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMagnetic } from "@/components/site/CursorLayer";
import { GoldParticles } from "@/components/site/GoldParticles";
import catCore from "@/assets/cat-core.jpg";
import catLuxury from "@/assets/cat-luxury.jpg";
import catPowders from "@/assets/cat-powders.jpg";
import catBio from "@/assets/cat-bio.jpg";
import scienceBg from "@/assets/science-bg.jpg";
import macro1 from "@/assets/banner-product-1.jpg";
import macro2 from "@/assets/banner-product-2.jpg";
import essence from "@/assets/p-essence.png";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

/* ---------------------------------------------------------------- Science */

const STAGES = [
  { n: "01", t: "Selection", d: "Single-origin botanicals and pharma-grade isolates, accepted on assay only." },
  { n: "02", t: "Extraction", d: "Cold, low-oxygen phase separation that leaves molecular structure intact." },
  { n: "03", t: "Refinement", d: "Fourteen passes of chromatographic purification to a 99.4% floor." },
  { n: "04", t: "Delivery", d: "Liposomal and micellar carriers engineered for measurable uptake." },
];

export function ScienceOfElevation() {
  return (
    <section className="relative overflow-hidden bg-obsidian py-28 md:py-40" aria-labelledby="science-title">
      <img
        src={scienceBg}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl"
        >
          <p className="text-eyebrow">The Science of Elevation</p>
          <h2 id="science-title" className="mt-5 text-display text-4xl leading-[1.05] text-ivory md:text-6xl">
            Performance is a manufacturing decision.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/60">
            Every Celestial formulation is built backwards from the outcome: what must arrive in the
            cell, at what concentration, in what form. Everything upstream — sourcing, extraction,
            carrier design — exists to serve that number.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px border-t border-gold/12 md:grid-cols-4">
          {STAGES.map((s, i) => (
            <motion.article
              key={s.n}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08 }}
              className="border-gold/12 pt-8 md:border-r md:pr-8 md:last:border-r-0"
            >
              <span className="text-[10px] tracking-[0.3em] text-gold/70">{s.n}</span>
              <h3 className="mt-4 text-display text-2xl text-ivory">{s.t}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ivory/50">{s.d}</p>
              <div className="mt-6 h-px w-full origin-left bg-gradient-to-r from-gold/60 to-transparent" />
            </motion.article>
          ))}
        </div>

        {/* Molecular line diagram */}
        <motion.svg
          viewBox="0 0 900 220"
          className="mt-20 w-full text-gold/45"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          aria-hidden
        >
          {[
            [80, 160, 220, 60],
            [220, 60, 380, 130],
            [380, 130, 540, 50],
            [540, 50, 700, 150],
            [700, 150, 830, 90],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
              transition={{ duration: 1.2, delay: i * 0.18, ease }}
            />
          ))}
          {[
            [80, 160],
            [220, 60],
            [380, 130],
            [540, 50],
            [700, 150],
            [830, 90],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="5"
              fill="currentColor"
              variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.18, ease }}
            />
          ))}
        </motion.svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Collections */

const COLLECTIONS = [
  { title: "Cosmetics", copy: "Molecular renewal, visible on the surface.", img: catLuxury, to: "/products/luxury-ready-to-consume", span: "md:col-span-7 md:row-span-2 h-[54svh] md:h-[74svh]" },
  { title: "Supplements", copy: "Measured potency, refined delivery.", img: catCore, to: "/products/core-performance-stack", span: "md:col-span-5 h-[36svh]" },
  { title: "Essence", copy: "A sensory signature beyond convention.", img: catBio, to: "/products/bioavailability-capsules", span: "md:col-span-5 h-[36svh]" },
  { title: "Nutrition", copy: "Origin preserved through precision.", img: catPowders, to: "/products/precision-powders", span: "md:col-span-12 h-[38svh]" },
];

export function CollectionsGrid() {
  return (
    <section className="bg-obsidian py-28 md:py-36" aria-labelledby="collections-title">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-eyebrow">Collections</p>
            <h2 id="collections-title" className="mt-4 text-display text-4xl text-ivory md:text-5xl">
              Four disciplines. One standard.
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden border-b border-gold/40 pb-1 text-[10px] uppercase tracking-[0.3em] text-gold md:inline-block"
          >
            All collections
          </Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-12">
          {COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.title}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06 }}
              className={c.span}
            >
              <Link
                to={c.to}
                data-cursor="View"
                className="group relative block h-full overflow-hidden border border-gold/10"
              >
                <img
                  src={c.img}
                  alt={`${c.title} collection`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45 transition-all duration-[1400ms] ease-out group-hover:scale-100 group-hover:opacity-75"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--obsidian) 5%, transparent 65%)" }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-display text-3xl text-ivory">{c.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-ivory/60 opacity-0 transition-all duration-700 group-hover:max-h-16 group-hover:opacity-100">
                    {c.copy}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Material & Form */

export function MaterialAndFormula() {
  return (
    <section className="bg-obsidian py-24 md:py-32" aria-labelledby="material-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 md:grid-cols-2 md:px-10">
        <div className="grid grid-cols-2 gap-4">
          <motion.img
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            src={macro1}
            alt="Macro detail of Celestial glass and serum"
            loading="lazy"
            className="h-[30svh] w-full object-cover opacity-80 md:h-[44svh]"
          />
          <motion.img
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            src={macro2}
            alt="Macro detail of refined Celestial powder and metal"
            loading="lazy"
            className="mt-10 h-[30svh] w-full object-cover opacity-80 md:h-[44svh]"
          />
        </div>
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-eyebrow">Material & Formula</p>
          <h2 id="material-title" className="mt-5 text-display text-4xl leading-tight text-ivory md:text-5xl">
            Glass, metal, powder, light.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/60">
            Pharmaceutical amber glass. Solid brushed brass closures. Powders milled to a uniform
            micron so they dissolve without residue. The material tells you what the formula intends
            before you ever open it.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-y-6">
            {[
              ["Amber glass", "UV-blocking, inert"],
              ["Brass closure", "Solid, machined"],
              ["Micron mill", "18µm uniform"],
              ["Lot tracing", "Batch to origin"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-champagne">{k}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.24em] text-ivory/40">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Manifesto */

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-obsidian py-32 md:py-48">
      <GoldParticles count={14} className="opacity-50" />
      <motion.blockquote
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl px-6 text-center md:px-10"
      >
        <p className="text-display text-3xl leading-[1.15] text-ivory md:text-6xl">
          “The highest expression of nature begins with precision.”
        </p>
        <footer className="mt-8 text-[10px] uppercase tracking-[0.35em] text-gold/70">
          Celestial — Brand Manifesto
        </footer>
      </motion.blockquote>
    </section>
  );
}

/* ------------------------------------------------------------- Conversion */

export function FeaturedProduct() {
  const cta = useMagnetic<HTMLAnchorElement>(0.2);

  return (
    <section className="relative overflow-hidden bg-obsidian py-24 md:py-32" aria-labelledby="featured-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 40%, oklch(0.34 0.06 70 / 0.5) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-6 text-center md:px-10">
        <motion.img
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          src={essence}
          alt="Celestial Essence flacon under a focused spotlight"
          loading="lazy"
          width={1024}
          height={1408}
          className="h-[42svh] w-auto object-contain"
          style={{ filter: "drop-shadow(0 50px 70px rgba(0,0,0,0.8))" }}
        />
        <p className="mt-10 text-eyebrow">Featured formulation</p>
        <h2 id="featured-title" className="mt-4 text-display text-4xl text-ivory md:text-5xl">
          Celestial Essence
        </h2>
        <p className="mt-4 max-w-md text-sm text-ivory/60">
          A structured sensory signature — resin, iris and cold mineral air, held in faceted crystal.
        </p>
        <p className="mt-6 text-display text-2xl text-champagne">$385</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            ref={cta}
            to="/products/luxury-ready-to-consume"
            data-cursor="Discover"
            className="border border-gold/60 px-8 py-3.5 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-obsidian"
          >
            Discover the Formula
          </Link>
          <button className="bg-champagne px-8 py-3.5 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-opacity hover:opacity-85">
            Add to Collection
          </button>
        </div>
      </div>
    </section>
  );
}
