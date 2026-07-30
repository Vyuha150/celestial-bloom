import { useEffect } from "react";

/**
 * Lenis smooth scrolling, mounted once at the page root.
 * Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    void Promise.all([import("lenis"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { ScrollTrigger }]) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.1,
          lerp: 0.09,
          smoothWheel: true,
        });
        // Keep pinned ScrollTrigger scenes in sync with Lenis' virtual scroll.
        const onScroll = () => ScrollTrigger.update();
        lenis.on("scroll", onScroll);
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        destroy = () => {
          cancelAnimationFrame(raf);
          lenis.off("scroll", onScroll);
          lenis.destroy();
        };
      },
    );


    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return null;
}
