import type { MonthRecord } from './types';
import { periodLabel } from './format';

/** An inclusive index range into the full record series. */
export interface Range {
  from: number;
  to: number;
}

export interface Preset {
  id: string;
  label: string;
  range: Range;
}

/** Builds the filter presets from whatever periods the data actually contains. */
export function buildPresets(all: readonly MonthRecord[]): Preset[] {
  const lastIndex = all.length - 1;
  const presets: Preset[] = [
    { id: 'ttm', label: 'Last 12 months', range: { from: Math.max(0, lastIndex - 11), to: lastIndex } },
  ];
  const years = [...new Set(all.map((r) => r.year))].sort((a, b) => b - a);
  for (const year of years) {
    const records = all.filter((r) => r.year === year);
    const complete = records.length === 12;
    presets.push({
      id: `y${year}`,
      label: complete ? String(year) : `${year} year to date`,
      range: { from: records[0].index, to: records[records.length - 1].index },
    });
  }
  presets.push({ id: 'all', label: 'All months', range: { from: 0, to: lastIndex } });
  return presets;
}

export const sliceRange = (all: readonly MonthRecord[], range: Range): MonthRecord[] =>
  all.slice(range.from, range.to + 1);

export function rangeLabel(all: readonly MonthRecord[], range: Range): string {
  const a = all[range.from].period;
  const b = all[range.to].period;
  return a === b ? periodLabel(a) : `${periodLabel(a)} to ${periodLabel(b)}`;
}

export const sameRange = (a: Range, b: Range): boolean => a.from === b.from && a.to === b.to;
