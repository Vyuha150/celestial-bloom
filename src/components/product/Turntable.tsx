import { useCallback, useEffect, useRef } from "react";

export type SpriteTurntable = {
  url: string;
  frames: number;
  cols: number;
  rows: number;
  /** intrinsic cell aspect ratio (width / height) */
  aspect: number;
};

type Props = {
  sprite: SpriteTurntable;
  label: string;
  className?: string;
};

/** revolutions covered by sweeping the cursor across the full stage width */
const SWEEP_REVOLUTIONS = 0.85;
/** idle auto-spin, revolutions per second */
const IDLE_RPS = 0.05;

/**
 * True 360° turntable of a transparent product cutout.
 *
 * Interaction model (absolute, so it always feels "connected"):
 * - Hover: the cursor's horizontal position maps directly to an angle — move
 *   right, the product turns right by the same amount, every time. Smoothed
 *   with a critically-damped follow so it never jitters or overshoots.
 * - Drag / touch: 1:1 scrubbing with inertia and friction on release.
 * - Idle: a barely-there drift keeps the object alive.
 * Pointer Y adds a small perspective tilt for real dimensional feel.
 */
export function Turntable({ sprite, label, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    frame: 0, // rendered frame (float)
    target: 0, // where the cursor says we should be
    anchor: 0, // frame under the cursor when the pointer entered
    hovering: false,
    dragging: false,
    velocity: 0, // frames/sec, used only for release inertia
    lastX: 0,
    lastT: 0,
    tilt: 0,
    tiltTarget: 0,
    prevTs: 0,
    raf: 0,
  });

  const draw = useCallback(() => {
    const el = filmRef.current;
    if (!el) return;
    const { cols, rows, frames } = sprite;
    const i = ((Math.round(state.current.frame) % frames) + frames) % frames;
    const col = i % cols;
    const row = Math.floor(i / cols);
    el.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
  }, [sprite]);

  useEffect(() => {
    const s = state.current;
    const loop = (ts: number) => {
      const dt = s.prevTs ? Math.min(0.05, (ts - s.prevTs) / 1000) : 0;
      s.prevTs = ts;

      if (!s.dragging) {
        if (s.hovering) {
          // exponential follow toward the cursor angle — smooth, never overshoots
          const k = 1 - Math.exp(-9 * dt);
          s.frame += (s.target - s.frame) * k;
          s.velocity = 0;
        } else {
          // release inertia, decaying into a gentle idle drift
          s.velocity *= Math.exp(-2.6 * dt);
          const idle = IDLE_RPS * sprite.frames;
          const v = Math.abs(s.velocity) > idle ? s.velocity : idle;
          s.frame += v * dt;
        }
        s.tilt += (s.tiltTarget - s.tilt) * (1 - Math.exp(-7 * dt));
        if (tiltRef.current) {
          tiltRef.current.style.transform = `perspective(1200px) rotateX(${s.tilt.toFixed(2)}deg)`;
        }
        draw();
      }
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    draw();
    return () => cancelAnimationFrame(s.raf);
  }, [draw, sprite.frames]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return;
    const s = state.current;

    // small vertical tilt for dimensionality
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    s.tiltTarget = -ny * 5;

    if (s.dragging) {
      const dx = e.clientX - s.lastX;
      const now = performance.now();
      const dt = Math.max(8, now - s.lastT) / 1000;
      const perPx = sprite.frames / r.width; // one revolution per stage width
      s.frame += dx * perPx;
      s.target = s.frame;
      s.velocity = (dx * perPx) / dt;
      s.lastX = e.clientX;
      s.lastT = now;
      draw();
      return;
    }

    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    if (!s.hovering) {
      s.hovering = true;
      // anchor so the product doesn't jump when the cursor first arrives
      s.anchor = s.frame - nx * sprite.frames * SWEEP_REVOLUTIONS;
    }
    s.target = s.anchor + nx * sprite.frames * SWEEP_REVOLUTIONS;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.velocity = Math.max(-sprite.frames * 1.5, Math.min(sprite.frames * 1.5, s.velocity));
    const r = hostRef.current?.getBoundingClientRect();
    if (r && s.hovering) {
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      s.anchor = s.frame - nx * sprite.frames * SWEEP_REVOLUTIONS;
      s.target = s.frame;
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    endDrag(e);
    const s = state.current;
    s.hovering = false;
    s.tiltTarget = 0;
  };

  return (
    <div
      ref={hostRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onPointerLeave}
      role="img"
      aria-label={`${label} — interactive 360° view`}
      className={className}
      style={{ touchAction: "none", cursor: "ew-resize" }}
    >
      <div ref={tiltRef} className="h-full w-full" style={{ willChange: "transform" }}>
        <div
          ref={filmRef}
          className="h-full w-full select-none"
          style={{
            backgroundImage: `url(${sprite.url})`,
            backgroundSize: `${sprite.cols * 100}% ${sprite.rows * 100}%`,
            backgroundRepeat: "no-repeat",
            filter:
              "drop-shadow(0 44px 60px rgba(0,0,0,0.62)) drop-shadow(0 0 60px color-mix(in oklab, var(--gold) 16%, transparent))",
          }}
        />
      </div>
    </div>
  );
}
