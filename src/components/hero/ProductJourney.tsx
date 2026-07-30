import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { GoldParticles } from "@/components/site/GoldParticles";
import serum from "@/assets/p-luna-elixir.png.asset.json";
import supplement from "@/assets/p-luminosity.png.asset.json";
import essence from "@/assets/p-balance.png.asset.json";
import nutrition from "@/assets/p-ritual-greens.png.asset.json";

type Scene = {
  word: string;
  name: string;
  product: string;
  alt: string;
  metric: string;
  copy: string;
  to: string;
  glow: string;
};

const SCENES: Scene[] = [
  {
    word: "COSMETICS",
    name: "Molecular Renewal Serum",
    product: serum.url,
    alt: "Celestial Luna Elixir night recovery facial serum",
    metric: "Precision-active formulation",
    copy: "Cold-phase extraction holds the actives intact — potency you can measure on skin.",
    to: "/products/luxury-ready-to-consume",
    glow: "oklch(0.62 0.13 70 / 0.55)",
  },
  {
    word: "SUPPLEMENTS",
    name: "Cellular Vitality",
    product: supplement.url,
    alt: "Celestial Luminosity skin radiance capsules",
    metric: "Measured potency. Refined delivery.",
    copy: "Liposomal architecture carries each compound past the barriers that blunt ordinary dosing.",
    to: "/products/core-performance-stack",
    glow: "oklch(0.58 0.09 60 / 0.5)",
  },
  {
    word: "ESSENCE",
    name: "Celestial Essence",
    product: essence.url,
    alt: "Celestial Balance gentle cleanser",
    metric: "A sensory signature beyond convention",
    copy: "A structured accord of resin, iris and cold mineral air — composed, never perfumed.",
    to: "/products/luxury-ready-to-consume",
    glow: "oklch(0.60 0.07 300 / 0.35)",
  },
  {
    word: "NUTRITION",
    name: "Pure Origin",
    product: nutrition.url,
    alt: "Celestial Ritual Greens daily superfood",
    metric: "Origin preserved through precision",
    copy: "Single-origin inputs, traced lot to lot, reduced only by methods that keep them whole.",
    to: "/products/precision-powders",
    glow: "oklch(0.55 0.09 95 / 0.42)",
  },
];

export function ProductJourney() {
  const wrap = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!wrap.current || scenes.length === 0) return;

    if (reduce) {
      scenes.forEach((s) => {
        s.style.opacity = "1";
        s.style.position = "relative";
      });
      return;
    }

    let cleanup = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrap.current!,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: ".journey-stage",
              pinSpacing: false,
              anticipatePin: 1,
            },
          });

          gsap.set(scenes, { opacity: (i: number) => (i === 0 ? 1 : 0) });

          scenes.forEach((scene, i) => {
            const img = scene.querySelector<HTMLElement>("[data-product]");
            const word = scene.querySelector<HTMLElement>("[data-word]");
            const copy = scene.querySelectorAll<HTMLElement>("[data-reveal]");
            const at = i - 0.5;

            if (i > 0) {
              const prev = scenes[i - 1];
              // Outgoing scene lifts and dissolves; incoming rises into frame.
              tl.to(prev, { opacity: 0, duration: 0.5 }, at)
                .to(
                  prev.querySelector("[data-product]"),
                  { yPercent: -12, scale: 0.92, duration: 0.5 },
                  at,
                )
                .to(scene, { opacity: 1, duration: 0.5 }, at)
                .fromTo(
                  img,
                  { yPercent: 14, scale: 1.08, rotate: -3 },
                  { yPercent: 0, scale: 1, rotate: 0, duration: 0.9, immediateRender: false },
                  at,
                )
                .fromTo(
                  word,
                  { yPercent: 22, opacity: 0 },
                  { yPercent: 0, opacity: 1, duration: 0.8, immediateRender: false },
                  at,
                )
                .fromTo(
                  copy,
                  { yPercent: 110, opacity: 0 },
                  {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.06,
                    immediateRender: false,
                  },
                  at + 0.2,
                );
            }

            // Continuous, controlled drift while the scene holds.
            tl.to(
              img,
              { rotate: i % 2 === 0 ? 3 : -3, yPercent: -4, duration: 1, immediateRender: false },
              i + 0.5,
            );
            tl.to(
              word,
              { xPercent: i % 2 === 0 ? -2 : 2, duration: 1, immediateRender: false },
              i + 0.5,
            );
          });

          if (progressRef.current) {
            tl.fromTo(progressRef.current, { scaleY: 0 }, { scaleY: 1, duration: 4 }, 0);
          }

        }, wrap);

        cleanup = () => ctx.revert();
      },
    );

    return () => cleanup();
  }, []);

  return (
    <div ref={wrap} className="relative bg-obsidian" style={{ height: "400svh" }}>
      <section
        className="journey-stage relative flex h-[100svh] items-center overflow-hidden"
        aria-label="Celestial product journey"
      >
        <GoldParticles count={18} className="z-[1] opacity-60" />

        {/* Scroll progress rail */}
        <div aria-hidden className="absolute right-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-gold/15 md:block">
          <span ref={progressRef} className="block h-full w-full origin-top bg-gold/70" />
        </div>

        {SCENES.map((s, i) => (
          <div
            key={s.word}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(55% 50% at 50% 45%, ${s.glow} 0%, transparent 70%)` }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[24%] flex justify-center overflow-hidden"
            >
              <span
                data-word
                className="block select-none whitespace-nowrap text-center text-display font-medium text-[#EFE6D4]/85 will-change-transform"
                style={{
                  fontSize: "clamp(2.2rem, 11vw, 11rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                }}
              >
                {s.word}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-[10%] z-[2] flex h-[74svh] justify-center">
              <img
                data-product
                src={s.product}
                alt={s.alt}
                loading="lazy"
                width={1024}
                height={1536}
                className="h-full w-auto object-contain will-change-transform"
                style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.7))" }}
              />
            </div>


            <div className="relative z-[3] mx-auto flex w-full max-w-[1440px] items-end justify-between gap-6 self-end px-6 pb-14 md:px-10">
              <div className="max-w-sm">
                <div className="overflow-hidden">
                  <h2 data-reveal className="text-display text-3xl text-ivory md:text-4xl">
                    {s.name}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p data-reveal className="mt-3 text-sm leading-relaxed text-ivory/60">
                    {s.copy}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <Link
                    data-reveal
                    to={s.to}
                    data-cursor="View"
                    className="mt-5 inline-block border-b border-gold/50 pb-1 text-[10px] uppercase tracking-[0.3em] text-gold"
                  >
                    View the formula
                  </Link>
                </div>
              </div>
              <div className="hidden max-w-[220px] text-right md:block">
                <div className="overflow-hidden">
                  <p data-reveal className="text-[10px] uppercase tracking-[0.26em] text-champagne/80">
                    {s.metric}
                  </p>
                </div>
                <p className="mt-2 text-[10px] tracking-[0.24em] text-ivory/30">
                  0{i + 1} / 0{SCENES.length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
