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
/** spin spring — critically damped so it accelerates and settles, never snaps */
const SPIN_K = 38;
const SPIN_C = 2 * Math.sqrt(SPIN_K) * 1.06;
/** camera parallax limits */
const TILT_X = 7; // deg, from pointer Y
const TILT_Y = 5; // deg, from pointer X
const SHIFT = 16; // px of lateral camera travel

/**
 * 360° turntable of a transparent product cutout, rendered on a real
 * perspective camera rig.
 *
 * - Spin: cursor X maps to an absolute angle, followed by a critically damped
 *   spring — the jar eases into motion and eases out, including when the
 *   cursor crosses the centre line.
 * - Depth: pointer X/Y drive rotateX + rotateY, a small lateral/vertical
 *   camera shift and a dolly, plus a contact shadow that slides with the
 *   light — so the object reads as a physical body in space.
 * - Drag / touch: 1:1 scrubbing, released with inertia and friction.
 */
export function Turntable({ sprite, label, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    frame: 0,
    spin: 0, // frames/sec
    target: 0,
    anchor: 0,
    hovering: false,
    dragging: false,
    lastX: 0,
    lastT: 0,
    // parallax (current + target), normalised -1..1
    px: 0,
    py: 0,
    tx: 0,
    ty: 0,
    depth: 0,
    depthTarget: 0,
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

      if (dt > 0) {
        if (!s.dragging) {
          if (s.hovering) {
            // damped spring in angle space — substepped for rock-solid stability
            const steps = Math.max(1, Math.ceil(dt / 0.008));
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
              const a = SPIN_K * (s.target - s.frame) - SPIN_C * s.spin;
              s.spin += a * h;
              s.frame += s.spin * h;
            }
          } else {
            // no cursor, no motion — released inertia glides to a full stop
            s.spin *= Math.exp(-3.2 * dt);
            if (Math.abs(s.spin) < 0.08) s.spin = 0;
            s.frame += s.spin * dt;
            s.target = s.frame;
          }
        }

        // camera easing (same feel in both axes)
        const k = 1 - Math.exp(-6.5 * dt);
        s.px += (s.tx - s.px) * k;
        s.py += (s.ty - s.py) * k;
        s.depth += (s.depthTarget - s.depth) * k;

        if (rigRef.current) {
          rigRef.current.style.transform =
            `translate3d(${(s.px * SHIFT).toFixed(2)}px, ${(-s.py * SHIFT * 0.55).toFixed(2)}px, ${(s.depth * 34).toFixed(2)}px)` +
            ` rotateX(${(-s.py * TILT_X).toFixed(2)}deg) rotateY(${(s.px * TILT_Y).toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform =
            `translate3d(${(-s.px * 30).toFixed(2)}px, 0, 0) scale(${(1 + Math.abs(s.px) * 0.12).toFixed(3)}, ${(1 - s.py * 0.1).toFixed(3)})`;
          shadowRef.current.style.opacity = String(0.55 - Math.abs(s.px) * 0.12);
        }
        if (!s.dragging) draw();
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

    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    s.tx = nx;
    s.ty = ny;
    s.depthTarget = 1 - Math.min(1, Math.hypot(nx, ny));

    if (s.dragging) {
      const dx = e.clientX - s.lastX;
      const now = performance.now();
      const dt = Math.max(8, now - s.lastT) / 1000;
      const perPx = sprite.frames / r.width; // one revolution per stage width
      s.frame += dx * perPx;
      s.target = s.frame;
      s.spin = (dx * perPx) / dt;
      s.lastX = e.clientX;
      s.lastT = now;
      draw();
      return;
    }

    if (!s.hovering) {
      s.hovering = true;
      // anchor so the jar never jumps when the cursor first arrives
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
    s.spin = Math.max(-sprite.frames * 1.5, Math.min(sprite.frames * 1.5, s.spin));
    const r = hostRef.current?.getBoundingClientRect();
    if (r && s.hovering) {
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      // re-anchor and let the spring carry the release momentum into the new angle
      s.anchor = s.frame - nx * sprite.frames * SWEEP_REVOLUTIONS;
      s.target = s.frame + s.spin * 0.18;
      s.anchor += s.spin * 0.18;
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
    s.tx = 0;
    s.ty = 0;
    s.depthTarget = 0;
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
      style={{ touchAction: "none", cursor: "ew-resize", perspective: "1100px", perspectiveOrigin: "50% 45%" }}
    >
      <div
        ref={rigRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* contact shadow, grounded on the floor plane */}
        <div
          ref={shadowRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-[14%] bottom-[1%] h-[9%] rounded-[50%]"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.85) 0%, transparent 72%)",
            filter: "blur(14px)",
            transform: "translate3d(0,0,0)",
          }}
        />
        <div
          ref={filmRef}
          className="h-full w-full select-none"
          style={{
            backgroundImage: `url(${sprite.url})`,
            backgroundSize: `${sprite.cols * 100}% ${sprite.rows * 100}%`,
            backgroundRepeat: "no-repeat",
            imageRendering: "auto",
            filter:
              "drop-shadow(0 44px 60px rgba(0,0,0,0.62)) drop-shadow(0 0 60px color-mix(in oklab, var(--gold) 16%, transparent))",
          }}
        />
      </div>
    </div>
  );
}
