import { useEffect, useRef } from "react";
import { Shield as ShieldIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { categories, findCategory, type Category } from "@/data/products";
import { CelestialMark } from "@/components/CelestialMark";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const cat = findCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.cat;
    if (!c) return { meta: [{ title: "Product — Celestial" }] };
    return {
      meta: [
        { title: `${c.title} — Celestial` },
        { name: "description", content: c.tagline },
        { property: "og:title", content: `${c.title} — Celestial` },
        { property: "og:description", content: c.tagline },
        { property: "og:image", content: c.image },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-obsidian">
      <div className="text-center">
        <h1 className="text-display text-5xl text-ivory">Not found</h1>
        <Link to="/products" className="text-eyebrow mt-6 inline-block text-gold">
          ← All products
        </Link>
      </div>
    </div>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };

function ProductHero({
  cat,
  idx,
  prev,
  next,
}: {
  cat: Category;
  idx: number;
  prev: Category;
  next: Category;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrub = useRef({ target: 0.5, current: 0.5, raf: 0 });
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  // Turntable rotation about the central vertical axis, driven by horizontal cursor position.
  const rotateY = useTransform(sx, [-1, 1], [-38, 38]);
  const y = useTransform(sx, [-1, 0, 1], [6, 0, 6]);
  const glowBg = useTransform(
    sx,
    (v) =>
      `radial-gradient(55% 50% at ${50 + v * 12}% 45%, color-mix(in oklab, var(--gold) 22%, transparent) 0%, transparent 70%)`,
  );

  // Cursor-scrubbed 360° turntable: horizontal position targets a point in the
  // rotation video, eased every frame for a glitch-free spin.
  useEffect(() => {
    if (!cat.heroVideo) return;
    const s = scrub.current;
    const loop = () => {
      const v = videoRef.current;
      if (v && v.duration) {
        s.current += (s.target - s.current) * 0.09;
        const t = s.current * v.duration;
        if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
      }
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
  }, [cat.heroVideo]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    mx.set(nx);
    scrub.current.target = (nx + 1) / 2;
  };
  const reset = () => {
    mx.set(0);
    scrub.current.target = 0.5;
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: glowBg }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48"
        style={{ background: "linear-gradient(to bottom, transparent, var(--obsidian))" }}
      />

      <div className="relative z-10 mx-auto max-w-[1320px] px-8">
        <motion.div initial="hidden" animate="show" variants={stagger} className="text-center">
          <motion.div variants={fadeUp}>
            <Link to="/products" className="text-eyebrow inline-flex items-center gap-2 hover:text-champagne">
              ← All products
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="text-eyebrow mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" /> {cat.hero.eyebrow}
          </motion.div>
        </motion.div>

        {/* Cursor-reactive stage */}
        <div
          ref={stage}
          onPointerMove={onMove}
          onPointerLeave={reset}
          className="relative mt-10 flex items-center justify-center"
        >
          {/* Arrows */}
          <Link
            to="/products/$slug"
            params={{ slug: prev.slug }}
            aria-label={`Previous category: ${prev.title}`}
            className="group absolute left-0 z-20 flex items-center gap-3 text-ivory/60 transition-colors hover:text-gold"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 transition-all duration-500 group-hover:-translate-x-1 group-hover:border-gold">
              <ChevronLeft className="h-4 w-4" />
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.3em] lg:inline">{prev.title}</span>
          </Link>
          <Link
            to="/products/$slug"
            params={{ slug: next.slug }}
            aria-label={`Next category: ${next.title}`}
            className="group absolute right-0 z-20 flex items-center gap-3 text-ivory/60 transition-colors hover:text-gold"
          >
            <span className="hidden text-[10px] uppercase tracking-[0.3em] lg:inline">{next.title}</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 transition-all duration-500 group-hover:translate-x-1 group-hover:border-gold">
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>

          <div style={{ perspective: 1400 }} className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease }}
              style={cat.heroVideo ? { y } : { rotateY, y, transformStyle: "preserve-3d" }}
              className="relative w-[min(560px,72vw)] will-change-transform"
            >
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[3rem]"
              style={{ background: "var(--gradient-gold)", opacity: 0.16, filter: "blur(70px)" }}
            />
            {cat.heroVideo ? (
              <video
                ref={videoRef}
                src={cat.heroVideo}
                muted
                playsInline
                preload="auto"
                aria-label={`${cat.title} — 360° view`}
                className="relative mx-auto h-[min(560px,64vh)] w-auto object-contain mix-blend-screen invert"
                style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 50px color-mix(in oklab, var(--gold) 18%, transparent))" }}
              />
            ) : cat.heroImage ? (
              <img
                src={cat.heroImage}
                alt={cat.title}
                className="relative mx-auto h-[min(560px,64vh)] w-auto object-contain"
                style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 50px color-mix(in oklab, var(--gold) 18%, transparent))" }}
              />
            ) : (
              <img
                src={cat.image}
                alt={cat.title}
                width={1024}
                height={1024}
                className="relative aspect-square w-full rounded-[2rem] border border-gold/20 object-cover"
                style={{ boxShadow: "var(--shadow-gold)" }}
              />
            )}
            </motion.div>
          </div>
        </div>

        {/* Stable description */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto mt-12 max-w-3xl text-center">
          <motion.h1
            variants={fadeUp}
            className="text-display text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.06] text-ivory"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
          >
            {cat.hero.headline} <span className="italic text-gold">{cat.hero.italic}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/80">
            {cat.hero.pitch}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#allocate" className="rounded-full bg-gold px-7 py-3.5 text-[10.5px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne">
              Reserve allocation →
            </a>
            <a href="#science" className="text-[10.5px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold">
              See the science
            </a>
            <span className="rounded-full border border-gold/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold">
              {cat.hero.badge}
            </span>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-5 text-[9px] tracking-[0.3em] text-ivory/40 uppercase">
            Lot CL · 2026 · {String(idx + 1).padStart(3, "0")} — {cat.items.length} SKU in range
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
        >
          {cat.stats.map((s) => (
            <div key={s.label} className="bg-obsidian p-5 text-center">
              <div className="text-display text-3xl text-gold">{s.value}</div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/50">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductPage() {
  const { cat } = Route.useLoaderData() as { cat: Category };
  const idx = categories.findIndex((c) => c.slug === cat.slug);
  const next = categories[(idx + 1) % categories.length];
  const prev = categories[(idx - 1 + categories.length) % categories.length];
  const maxBar = Math.max(...cat.infographic.bars.map((b) => b.value));


  return (
    <div className="min-h-screen bg-obsidian">
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto mt-5 flex max-w-[1320px] items-center justify-between rounded-full border border-gold/20 bg-obsidian/70 px-8 py-3.5 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <CelestialMark className="h-5 w-5 text-gold" />
            <span className="text-display text-base tracking-[0.4em] text-ivory">CELESTIAL</span>
          </Link>
          <nav className="hidden gap-10 text-[10.5px] tracking-[0.3em] uppercase text-ivory/70 md:flex">
            <Link to="/science" className="transition-colors hover:text-gold">Science</Link>
            <Link to="/products" className="text-gold">Products</Link>
            <Link to="/brand-new" className="transition-colors hover:text-gold">Brand New</Link>
            <Link to="/protocol" className="transition-colors hover:text-gold">Protocol</Link>
            <Link to="/universe" className="transition-colors hover:text-gold">Customization</Link>
            <Link to="/journal" className="transition-colors hover:text-gold">Journal</Link>
          <Link to="/admin" title="Admin Panel" aria-label="Admin Panel" className="inline-flex items-center gap-1 transition-colors hover:text-gold"><ShieldIcon className="h-3.5 w-3.5" /></Link>
          </nav>
          <button className="rounded-full border border-gold/60 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
            Enter
          </button>
        </div>
      </header>

      {/* HERO */}
      <ProductHero cat={cat} idx={idx} prev={prev} next={next} />


      {/* BENEFITS */}
      <section className="border-y border-border bg-midnight/30 py-24">
        <div className="mx-auto max-w-[1320px] px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-14 max-w-2xl"
          >
            <motion.div variants={fadeUp} className="text-eyebrow mb-4">Why this category</motion.div>
            <motion.h2 variants={fadeUp} className="text-display text-4xl text-ivory lg:text-5xl">
              Three reasons it<br />
              <span className="italic text-gold">moves your biology.</span>
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3"
          >
            {cat.benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-obsidian p-10 transition-colors hover:bg-midnight"
              >
                <div className="text-display text-5xl text-gold">{b.icon}</div>
                <h3 className="text-display mt-6 text-2xl text-ivory">{b.title}</h3>
                <div className="hairline my-5" />
                <p className="text-sm leading-relaxed text-ivory/60">{b.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INFOGRAPHIC */}
      <section id="science" className="py-28">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-8 lg:grid-cols-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="lg:col-span-5"
          >
            <motion.div variants={fadeUp} className="text-eyebrow mb-5">Measured impact</motion.div>
            <motion.h2 variants={fadeUp} className="text-display text-4xl text-ivory lg:text-5xl">
              {cat.infographic.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 max-w-md text-sm leading-relaxed text-ivory/60">
              Numbers below come from internal trials, third-party HPLC reports, and customer
              biomarker data. Methodology available on request.
            </motion.p>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="space-y-7 rounded-3xl border border-border bg-midnight/30 p-10">
              {cat.infographic.bars.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm text-ivory/80">{b.label}</span>
                    <span className="text-display text-2xl text-gold">
                      {b.value}{b.suffix ?? ""}
                    </span>
                  </div>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(b.value / maxBar) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease, delay: 0.2 + i * 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "var(--gradient-gold)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKU GRID */}
      <section className="border-t border-border bg-midnight/20 py-28">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <div className="text-eyebrow mb-4">In the range</div>
              <h2 className="text-display text-4xl text-ivory lg:text-5xl">
                {cat.items.length} formulations<br />
                <span className="italic text-gold">in this category.</span>
              </h2>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-display text-5xl text-gold">{String(cat.items.length).padStart(2, "0")}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">SKUs</div>
            </div>
          </div>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cat.items.map((it, i) => (
              <motion.li
                key={it}
                variants={fadeUp}
                whileHover={{ y: -3, borderColor: "color-mix(in oklab, var(--gold) 70%, transparent)" }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-obsidian px-5 py-4 transition-colors hover:bg-midnight"
              >
                <div className="flex items-center gap-4">
                  <span className="text-display text-xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-ivory/85">{it}</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 transition-colors group-hover:text-gold">
                  Spec →
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24">
        <div className="mx-auto max-w-[1100px] px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="text-eyebrow mb-10"
          >
            What operators say
          </motion.div>
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease }}
            className="text-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.15] text-ivory"
          >
            “{cat.social.quote}”
          </motion.blockquote>
          <div className="hairline mx-auto mt-12 max-w-[6rem]" />
          <div className="mt-6 text-[11px] uppercase tracking-[0.4em] text-ivory/55">
            ✦ {cat.social.by} · <span className="text-ivory/40">{cat.social.role}</span>
          </div>
        </div>
      </section>

      {/* PRICING / ALLOCATION */}
      <section id="allocate" className="border-y border-border bg-midnight/30 py-28">
        <div className="mx-auto max-w-[1320px] px-8">
          <div className="mb-14 max-w-2xl">
            <div className="text-eyebrow mb-4">Allocation</div>
            <h2 className="text-display text-4xl text-ivory lg:text-5xl">
              Three ways to<br />
              <span className="italic text-gold">begin the protocol.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/60">
              All allocations include third-party lot certificates, cold-chain shipping, and
              your first concierge call. Cancel any subscription, any time.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {cat.tiers.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  t.highlight
                    ? "border-gold/60 bg-obsidian shadow-[0_0_60px_-10px_oklch(0.72_0.12_75/0.4)]"
                    : "border-border bg-obsidian/60"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-obsidian">
                    Most chosen
                  </div>
                )}
                <div className="text-eyebrow">{t.name}</div>
                <div className="mt-5 flex items-baseline gap-2">
                  <div className="text-display text-5xl text-ivory">{t.price}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-ivory/50">{t.cadence}</div>
                </div>
                <div className="hairline my-7" />
                <ul className="flex-1 space-y-3 text-sm text-ivory/70">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-10 rounded-full px-6 py-3.5 text-[10.5px] uppercase tracking-[0.3em] transition-all ${
                    t.highlight
                      ? "bg-gold text-obsidian hover:bg-champagne"
                      : "border border-gold/60 text-gold hover:bg-gold hover:text-obsidian"
                  }`}
                >
                  {t.cta} →
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-14 px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-eyebrow mb-4">Considered answers</div>
            <h2 className="text-display text-4xl text-ivory lg:text-5xl">
              You'll<br />
              <span className="italic text-gold">probably ask.</span>
            </h2>
          </div>
          <div className="space-y-3 lg:col-span-8">
            {cat.faqs.map((f, i) => (
              <motion.details
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.07 }}
                className="group rounded-2xl border border-border bg-midnight/30 p-6 open:border-gold/40"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base text-ivory">
                  {f.q}
                  <span className="text-display text-2xl text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-ivory/65">{f.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT CATEGORY */}
      <section className="border-t border-border py-20">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-8 md:flex-row md:items-center">
          <Link to="/products" className="text-eyebrow hover:text-champagne">
            ← All categories
          </Link>
          <Link
            to="/products/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center gap-6 text-right"
          >
            <div>
              <div className="text-eyebrow mb-2 text-ivory/50">Next category</div>
              <div className="text-display text-2xl text-ivory transition-colors group-hover:text-gold">
                {next.title} →
              </div>
            </div>
            <img
              src={next.image}
              alt=""
              width={120}
              height={120}
              loading="lazy"
              className="hidden h-20 w-20 rounded-2xl object-cover md:block"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
