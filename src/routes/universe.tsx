import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { categories, totalSkus } from "@/data/products";
import { StackQuiz } from "@/components/StackQuiz";

export const Route = createFileRoute("/universe")({
  head: () => ({
    meta: [
      { title: "The Universe — Celestial" },
      {
        name: "description",
        content:
          "Forty-eight precision formulations across seven categories. Celestial's full product universe — from core stacks to diagnostic protocols.",
      },
      { property: "og:title", content: "The Universe — Celestial" },
      {
        property: "og:description",
        content: "Seven categories. Forty-eight precision formulations.",
      },
    ],
  }),
  component: UniversePage,
});

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};

function UniversePage() {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <div className="min-h-screen bg-obsidian pt-32">
      <StackQuiz open={quizOpen} onOpenChange={setQuizOpen} />
      <div className="mx-auto max-w-[1320px] px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease }}>
          <Link to="/" className="text-eyebrow inline-flex items-center gap-2 hover:text-champagne">
            ← Back to home
          </Link>
          <div className="mt-8 flex items-end justify-between border-b border-border pb-10">
            <div>
              <div className="text-eyebrow mb-5">The Product Universe</div>
              <h1 className="text-display max-w-3xl text-5xl text-ivory lg:text-7xl">
                Seven categories.<br />
                <span className="italic text-gold">{totalSkus} formulations.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/60">
                Every Celestial SKU is engineered around a peer-reviewed clinical threshold,
                housed in matte aluminium, and verified by an independent third-party lab.
              </p>
              <button
                onClick={() => setQuizOpen(true)}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-obsidian shadow-[0_8px_30px_rgba(212,175,55,0.25)] transition-all hover:bg-champagne hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)]"
              >
                Customize your stack
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-display text-6xl text-gold">{totalSkus}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50">Active SKUs</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-24 py-20">
          {categories.map((c, i) => (
            <motion.section
              key={c.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease }}
              className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-12 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden rounded-3xl border border-gold/20 lg:col-span-6"
              >
                <motion.img
                  src={c.image}
                  alt={c.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 1.4, ease }}
                  className="h-[480px] w-full object-cover"
                />
                <div className="absolute left-5 top-5 rounded-full border border-gold/40 bg-obsidian/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur">
                  {String(i + 1).padStart(2, "0")} ─ {c.items.length} SKU
                </div>
              </motion.div>

              <div className="lg:col-span-6">
                <div className="text-eyebrow mb-4">Category {String(i + 1).padStart(2, "0")}</div>
                <h2 className="text-display text-4xl text-ivory lg:text-5xl">{c.title}</h2>
                <div className="hairline my-6 max-w-[8rem]" />
                <p className="max-w-md text-sm leading-relaxed text-ivory/65">{c.tagline}</p>
                <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {c.items.map((it) => (
                    <li
                      key={it}
                      className="group flex items-center gap-3 rounded-full border border-border bg-midnight/40 px-4 py-2 text-[12px] text-ivory/75 transition-all hover:border-gold/50 hover:text-gold"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold transition-all group-hover:scale-150" />
                      {it}
                    </li>
                  ))}
                </ul>
                <button className="mt-10 rounded-full border border-gold/60 px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all hover:bg-gold hover:text-obsidian">
                  Request Allocation →
                </button>
              </div>
            </motion.section>
          ))}
        </div>

        <div className="border-t border-border py-16 text-center">
          <Link
            to="/"
            className="text-eyebrow inline-flex items-center gap-2 hover:text-champagne"
          >
            ← Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
