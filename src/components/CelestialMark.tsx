export function CelestialMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M20 8 L20 14 M20 26 L20 32 M8 14 L13 17 M27 23 L32 26 M8 26 L13 23 M27 17 L32 14"
        stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}
