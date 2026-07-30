import { useMemo } from "react";

type Props = {
  count?: number;
  className?: string;
  /** 0..1 — pointer proximity influence is handled by the parent via CSS vars. */
  seed?: number;
};

/**
 * Lightweight suspended gold particulate. CSS-driven (no WebGL) so it stays
 * at 60fps on every device; count is reduced automatically on small screens.
 */
export function GoldParticles({ count = 26, className = "", seed = 1 }: Props) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin((i + 1) * seed * n) + 1) / 2);
        const round = (n: number) => Math.round(n * 100) / 100;
        return {
          left: round(r(12.9898) * 100),
          top: round(r(78.233) * 100),
          size: round(1.5 + r(43.123) * 4.5),
          delay: round(r(93.11) * 8),
          duration: round(7 + r(27.31) * 9),
          opacity: round(0.18 + r(11.7) * 0.5),
        };
      }),
    [count, seed],
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-drift"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
            background: "radial-gradient(circle, oklch(0.86 0.11 80) 0%, oklch(0.72 0.12 75 / 0) 70%)",
            boxShadow: "0 0 8px oklch(0.72 0.12 75 / 0.55)",
            animationDelay: `-${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
