import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { categories } from "@/data/products";

type Slug =
  | "core-performance-stack"
  | "bioavailability-capsules"
  | "precision-powders"
  | "functional-beverages"
  | "smart-gummies-strips"
  | "luxury-ready-to-consume"
  | "diagnostic-protocols";

type Q = {
  q: string;
  options: { label: string; weights: Partial<Record<Slug, number>> }[];
};

const questions: Q[] = [
  {
    q: "What is your primary goal right now?",
    options: [
      { label: "Daily energy & cognitive sharpness", weights: { "core-performance-stack": 3, "bioavailability-capsules": 1 } },
      { label: "Longevity & cellular repair", weights: { "bioavailability-capsules": 3, "diagnostic-protocols": 1 } },
      { label: "Recovery & athletic output", weights: { "precision-powders": 3, "functional-beverages": 1 } },
      { label: "Insights into my biomarkers", weights: { "diagnostic-protocols": 3 } },
    ],
  },
  {
    q: "How do you prefer to take supplements?",
    options: [
      { label: "Capsules — fast and clean", weights: { "bioavailability-capsules": 3, "core-performance-stack": 1 } },
      { label: "Powders I can mix", weights: { "precision-powders": 3 } },
      { label: "Ready-to-drink beverages", weights: { "functional-beverages": 3, "luxury-ready-to-consume": 1 } },
      { label: "Gummies or strips on the go", weights: { "smart-gummies-strips": 3 } },
    ],
  },
  {
    q: "What best describes your lifestyle?",
    options: [
      { label: "High-performance executive", weights: { "luxury-ready-to-consume": 3, "core-performance-stack": 1 } },
      { label: "Athlete or training daily", weights: { "precision-powders": 2, "functional-beverages": 2 } },
      { label: "Constantly traveling", weights: { "smart-gummies-strips": 3, "luxury-ready-to-consume": 1 } },
      { label: "Data-driven optimizer", weights: { "diagnostic-protocols": 3, "bioavailability-capsules": 1 } },
    ],
  },
  {
    q: "Your investment horizon?",
    options: [
      { label: "Premium — best-in-class only", weights: { "luxury-ready-to-consume": 3, "diagnostic-protocols": 1 } },
      { label: "Daily essentials", weights: { "core-performance-stack": 3 } },
      { label: "Targeted, science-led", weights: { "bioavailability-capsules": 2, "diagnostic-protocols": 2 } },
      { label: "Easy & convenient", weights: { "smart-gummies-strips": 2, "functional-beverages": 2 } },
    ],
  },
];

export function StackQuiz({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [done, setDone] = useState<Slug | null>(null);

  const reset = () => {
    setStep(0);
    setScores({});
    setDone(null);
  };

  const choose = (opt: Q["options"][number]) => {
    const next = { ...scores };
    Object.entries(opt.weights).forEach(([k, v]) => {
      next[k] = (next[k] ?? 0) + (v ?? 0);
    });
    setScores(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0]?.[0] as Slug;
      setDone(winner);
    }
  };

  const winnerCat = done ? categories.find((c) => c.slug === done) : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 300);
      }}
    >
      <DialogContent className="max-w-2xl border-gold/30 bg-obsidian text-ivory sm:rounded-2xl">
        <DialogTitle className="sr-only">Customize your stack</DialogTitle>
        <div className="p-2">
          {!done && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Step {step + 1} / {questions.length}
                </span>
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-8 rounded-full transition-all ${
                        i <= step ? "bg-gold" : "bg-ivory/15"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-display text-2xl text-ivory lg:text-3xl">
                    {questions[step].q}
                  </h3>
                  <div className="mt-6 grid gap-3">
                    {questions[step].options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => choose(o)}
                        className="group flex items-center justify-between rounded-xl border border-border bg-midnight/40 px-5 py-4 text-left text-sm text-ivory/85 transition-all hover:border-gold/60 hover:bg-midnight hover:text-gold"
                      >
                        <span>{o.label}</span>
                        <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {done && winnerCat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-eyebrow mb-3 text-gold">Your suggested stack</div>
              <h3 className="text-display text-3xl text-ivory lg:text-4xl">
                {winnerCat.title}
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
                {winnerCat.tagline}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => {
                      navigate({ to: "/products/$slug", params: { slug: winnerCat.slug } });
                      reset();
                    }, 200);
                  }}
                  className="rounded-full bg-gold px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-obsidian transition-all hover:bg-champagne"
                >
                  Explore {winnerCat.title} →
                </button>
                <button
                  onClick={reset}
                  className="rounded-full border border-ivory/30 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition-all hover:border-ivory hover:text-ivory"
                >
                  Retake quiz
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
