export function AuraMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Aura Workspace logo"
      className={className}
    >
      <defs>
        <filter id="aura-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g filter="url(#aura-soft)">
        <path
          d="M24 5c2.1 7.6 5.4 11 13 13-7.6 2.1-10.9 5.4-13 13-2.1-7.6-5.4-10.9-13-13 7.6-2 10.9-5.4 13-13Z"
          fill="var(--color-blue)"
          opacity="0.95"
        />
        <circle cx="30" cy="31" r="11" fill="var(--color-rose)" opacity="0.8" />
        <circle cx="17" cy="33" r="7.5" fill="var(--color-lime)" opacity="0.7" />
      </g>
    </svg>
  );
}
