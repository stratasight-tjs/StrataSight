import type { ServiceLine } from '../lib/types';

/** Series colors follow the entity, never its rank. Values live in styles/tokens.css. */
export const LINE_COLOR: Record<ServiceLine, string> = {
  maintenance: 'var(--s-maintenance)',
  installations: 'var(--s-installations)',
  cleanup: 'var(--s-cleanup)',
  snow: 'var(--s-snow)',
};

export const LINE_COLOR_DARK: Record<ServiceLine, string> = {
  maintenance: 'var(--s-maintenance-dark)',
  installations: 'var(--s-installations-dark)',
  cleanup: 'var(--s-cleanup-dark)',
  snow: 'var(--s-snow-dark)',
};

/** One hue, light to dark, for ordered categories. */
export const RAMP = ['var(--ramp-1)', 'var(--ramp-2)', 'var(--ramp-3)', 'var(--ramp-4)'];

export const PRIMARY = 'var(--chart-primary)';
export const SECONDARY = 'var(--chart-secondary)';
export const NEGATIVE = 'var(--chart-negative)';
export const MUTED = 'var(--chart-muted)';

/** Sequential blue ramp for heatmaps: near zero recedes toward the surface. */
const SEQ = ['#eef4fb', '#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];

export function sequential(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  return SEQ[Math.min(SEQ.length - 1, Math.floor(clamped * SEQ.length))];
}

/** True when white text is the readable choice on a sequential step. */
export const sequentialNeedsLightText = (t: number): boolean => t >= 0.5;
