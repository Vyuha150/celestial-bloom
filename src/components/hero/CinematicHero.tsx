import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { GoldParticles } from "@/components/site/GoldParticles";
import { useMagnetic } from "@/components/site/CursorLayer";

const METRICS = [
  { k: "14-stage", v: "Molecular extraction" },
  { k: "99.4%", v: "Assayed purity" },
  { k: "0", v: "Fillers, ever" },
];

export function CinematicHero() {
  const stage = useRef<HTMLDivElement>(null);
  const cta = useMagnetic<HTMLAnchorElement>(0.22);


  return (
    <section
      ref={stage}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian pt-24"
      aria-label="Celestial hero"
    >
      {/* Environment light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 42%, oklch(0.32 0.06 70 / 0.55) 0%, transparent 70%), radial-gradient(90% 70% at 50% 110%, oklch(0.20 0.03 60 / 0.5) 0%, transparent 70%)",
        }}
      />
      <GoldParticles count={22} className="opacity-70" />

      {/* Monumental word */}
      <h1
        aria-label="Celestial"
        className="pointer-events-none absolute left-1/2 top-[38%] z-[1] w-full -translate-x-1/2 -translate-y-1/2 select-none text-center text-display font-medium text-[#F4EDDE]"
        style={{
          fontSize: "clamp(3.2rem, 15.5vw, 15rem)",
          letterSpacing: "-0.035em",
          lineHeight: 0.85,
          textShadow: "0 30px 90px rgba(0,0,0,0.7)",
        }}
      >
        CELESTIAL
      </h1>


      {/* Floor reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[38svh]"
        style={{ background: "linear-gradient(to top, var(--obsidian) 22%, transparent)" }}
      />

      {/* Lower-left copy */}
      <div className="relative z-[4] mx-auto w-full max-w-[1440px] px-6 pb-8 md:px-10">
        <div className="max-w-md">
          <p className="text-eyebrow">Precision, elevated beyond the ordinary.</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            Advanced formulations created through scientific extraction, material purity and
            uncompromising sensory design.
          </p>
          <Link
            ref={cta}
            to="/products"
            data-cursor="Enter"
            className="mt-7 inline-block border border-gold/60 px-8 py-3.5 text-[10px] uppercase tracking-[0.32em] text-gold transition-colors duration-500 hover:bg-gold hover:text-obsidian"
          >
            Enter the Collection
          </Link>
        </div>

        {/* Formulation metrics along the lower edge */}
        <div className="mt-10 grid grid-cols-1 gap-px border-t border-gold/15 pt-6 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.k} className="flex items-baseline gap-3">
              <span className="text-display text-2xl text-champagne">{m.k}</span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-ivory/45">{m.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden className="relative z-[4] mx-auto mb-5 h-10 w-px overflow-hidden bg-gold/20">
        <span className="absolute inset-x-0 top-0 h-4 animate-scrollcue bg-gold" />
      </div>
    </section>
  );
}
