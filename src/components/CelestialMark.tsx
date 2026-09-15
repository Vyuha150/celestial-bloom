import celestialLogoUrl from "@/assets/celestial-logo.png";

export function CelestialMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={celestialLogoUrl}
      alt="Celestial logo"
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}
