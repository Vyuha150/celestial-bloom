import logoAsset from "@/assets/celestial-logo.png.asset.json";

export function CelestialMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Celestial logo"
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}
