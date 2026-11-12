import { RECORDS } from '../lib/dataset';
import { summarize, type PeriodSummary } from '../lib/metrics';
import type { MonthRecord } from '../lib/types';
import { isFlagged } from '../lib/checks';
import { monthShort, periodLabel, periodShort } from '../lib/format';

export const labelsOf = (months: MonthRecord[]): string[] => months.map((r) => periodLabel(r.period, true));

/** Short ranges label every month. Long ranges label each January with its year and each quarter start with its month. */
export const tickOf =
  (months: MonthRecord[]) =>
  (i: number): string | null => {
    const r = months[i];
    if (months.length <= 14) return periodShort(r.period);
    if (r.month === 1) return String(r.year);
    return r.month % 3 === 1 ? monthShort(r.month) : null;
  };

export const flagMarks = (months: MonthRecord[]) =>
  months
    .map((r, index) => ({ r, index }))
    .filter(({ r }) => isFlagged(r))
    .map(({ r, index }) => ({ index, label: `${periodLabel(r.period)} is flagged for review: ${r.reviewNote}` }));

/** Table rows for a month-by-month chart. */
export const monthRows = (months: MonthRecord[], cells: (r: MonthRecord) => (string | number)[]): (string | number)[][] =>
  months.map((r) => [periodLabel(r.period), ...cells(r)]);


export interface YearSummary {
  year: number;
  /** "2025", or "2026 to Oct" when the year is incomplete. */
  label: string;
  complete: boolean;
  summary: PeriodSummary;
}

/** One summary per calendar year on record. Incomplete years are labeled so they are never read as full years. */
export function yearly(): YearSummary[] {
  const years = [...new Set(RECORDS.map((r) => r.year))];
  return years.map((year) => {
    const records = RECORDS.filter((r) => r.year === year);
    const complete = records.length === 12;
    return {
      year,
      label: complete ? String(year) : `${year} to ${monthShort(records[records.length - 1].month)}`,
      complete,
      summary: summarize(records),
    };
  });
}
