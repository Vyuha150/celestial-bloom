import { useEffect, useRef, useState } from "react";

/**
 * Samples the average luminance (0..1) of a region of a playing <video>
 * and returns it, so overlays can adapt their opacity in real time.
 *
 * region is expressed in normalized video coordinates.
 */
export function useVideoLuminance(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options?: {
    region?: { x: number; y: number; w: number; h: number };
    intervalMs?: number;
    smoothing?: number;
  },
) {
  const { x = 0, y = 0, w = 0.5, h = 1 } = options?.region ?? {};
  const intervalMs = options?.intervalMs ?? 250;
  const smoothing = options?.smoothing ?? 0.18;

  const [luminance, setLuminance] = useState(0.12);
  const smoothed = useRef(0.12);

  useEffect(() => {
    const video = videoRef.current;
    if (typeof window === "undefined" || !video) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    const SW = 32;
    const SH = 18;
    canvas.width = SW;
    canvas.height = SH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;

    const sample = () => {
      if (cancelled || video.readyState < 2 || !video.videoWidth) return;
      try {
        const sx = video.videoWidth * x;
        const sy = video.videoHeight * y;
        const sw = video.videoWidth * w;
        const sh = video.videoHeight * h;
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, SW, SH);
        const { data } = ctx.getImageData(0, 0, SW, SH);
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Rec. 709 relative luminance
          sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        }
        const avg = sum / (data.length / 4);
        smoothed.current = smoothed.current + (avg - smoothed.current) * (1 - smoothing);
        setLuminance(Number(smoothed.current.toFixed(3)));
      } catch {
        // Tainted canvas or decode issue — keep the last known value.
        cancelled = true;
      }
    };

    const id = window.setInterval(sample, reduceMotion ? 1000 : intervalMs);
    sample();

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [videoRef, x, y, w, h, intervalMs, smoothing]);

  return luminance;
}
