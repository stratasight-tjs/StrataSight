/** The StrataSight mark: three strata crossed by a single sight line. */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  const ink = onDark ? 'var(--on-dark)' : 'var(--prussian-800)';
  return (
    <span className="logo">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <path d="M2 8.5c4-2.6 7 1.4 11 0s7-2.8 11-.4" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <path d="M2 14c4-2.6 7 1.4 11 0s7-2.8 11-.4" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M2 19.5c4-2.6 7 1.4 11 0s7-2.8 11-.4" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 2.5v21" stroke="var(--tape)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="logo-word">StrataSight</span>
    </span>
  );
}
