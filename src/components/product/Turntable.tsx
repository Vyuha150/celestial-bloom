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

/**
 * Cursor + touch driven 360° turntable.
 *
 * - Hover: horizontal cursor position sets spin velocity (dead-zone in the
 *   middle so the product rests, eased curve so edges feel fast but natural).
 * - Drag / touch: 1:1 frame scrubbing, released with inertia and friction.
 * Rendered as a background-position sprite walk — zero decode churn, no
 * video seeking jitter, and a fully transparent product (no white plate).
 */
export function Turntable({ sprite, label, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    frame: 0, // float, wraps over sprite.frames
    velocity: 0, // frames per second
    target: 0, // hover target velocity
    dragging: false,
    lastX: 0,
    lastT: 0,
    raf: 0,
    prevTs: 0,
  });

  const draw = useCallback(() => {
    const el = filmRef.current;
    if (!el) return;
    const { cols, rows, frames } = sprite;
    const i = ((Math.round(state.current.frame) % frames) + frames) % frames;
    const col = i % cols;
    const row = Math.floor(i / cols);
    // percentage positioning across a (cols x rows) sheet
    el.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
  }, [sprite]);

  useEffect(() => {
    const s = state.current;
    const loop = (ts: number) => {
      const dt = s.prevTs ? Math.min(0.05, (ts - s.prevTs) / 1000) : 0;
      s.prevTs = ts;
      if (!s.dragging) {
        // ease toward hover target, then apply friction when idle
        s.velocity += (s.target - s.velocity) * Math.min(1, dt * 6);
        if (Math.abs(s.target) < 0.001) s.velocity *= Math.pow(0.12, dt); // inertia decay
        if (Math.abs(s.velocity) < 0.02) s.velocity = 0;
        s.frame += s.velocity * dt;
        draw();
      }
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    draw();
    return () => cancelAnimationFrame(s.raf);
  }, [draw]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return;
    const s = state.current;

    if (s.dragging) {
      const dx = e.clientX - s.lastX;
      const now = performance.now();
      const dt = Math.max(8, now - s.lastT) / 1000;
      // 1:1 drag: full sheet across ~1.15× the stage width
      const perPx = sprite.frames / (r.width * 1.15);
      s.frame += dx * perPx;
      s.velocity = (dx * perPx) / dt;
      s.lastX = e.clientX;
      s.lastT = now;
      draw();
      return;
    }

    // Hover: eased velocity curve with a soft dead-zone at the centre.
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const dead = 0.14;
    const a = Math.abs(nx);
    const shaped = a <= dead ? 0 : Math.pow((a - dead) / (1 - dead), 1.6);
    s.target = Math.sign(nx) * shaped * sprite.frames * 0.62; // ≈1.6s per revolution at edges
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.target = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    // clamp release inertia so it glides rather than whips
    s.velocity = Math.max(-sprite.frames * 2, Math.min(sprite.frames * 2, s.velocity));
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    endDrag(e);
    state.current.target = 0;
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
  );
}
