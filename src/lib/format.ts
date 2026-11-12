const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** $1,234,567 (negative: -$1,234) */
export const usd = (value: number): string => usd0.format(Math.round(value));

/** Compact dollars for axes and tiles: $940, $12.4K, $1.19M */
export function usdCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

/** Axis ticks: $0, $50K, $100K */
export function usdAxis(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${+(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${+(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs}`;
}

export const num = (value: number): string => int.format(value);

/** 0.4873 -> "48.7%" */
export const pct = (ratio: number, digits = 1): string => `${(ratio * 100).toFixed(digits)}%`;

/** Signed percent change: +13.8% / -4.2% */
export function pctChange(ratio: number, digits = 1): string {
  const sign = ratio > 0 ? '+' : ratio < 0 ? '-' : '';
  return `${sign}${Math.abs(ratio * 100).toFixed(digits)}%`;
}

/** Signed percentage-point change: +1.2 pts */
export function ptsChange(delta: number, digits = 1): string {
  const sign = delta > 0 ? '+' : delta < 0 ? '-' : '';
  return `${sign}${Math.abs(delta * 100).toFixed(digits)} pts`;
}

/** "2025-07" -> "Jul 2025" */
export function periodLabel(period: string, long = false): string {
  const [y, m] = period.split('-').map(Number);
  return `${(long ? MONTHS_LONG : MONTHS_SHORT)[m - 1]} ${y}`;
}

/** "2025-07" -> "Jul '25" */
export function periodShort(period: string): string {
  const [y, m] = period.split('-').map(Number);
  return `${MONTHS_SHORT[m - 1]} '${String(y).slice(2)}`;
}

export const monthShort = (month: number): string => MONTHS_SHORT[month - 1];
export const monthLong = (month: number): string => MONTHS_LONG[month - 1];
