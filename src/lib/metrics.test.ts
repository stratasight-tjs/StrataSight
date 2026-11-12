import { describe, expect, it } from 'vitest';
import { RECORDS } from './dataset';
import { isFlagged, runChecks } from './checks';
import { byYear, change, completeQuarters, priorYearSlice, summarize, trailing, yearToDate } from './metrics';
import { parseCsv } from './csv';

describe('csv parser', () => {
  it('handles quoted fields with commas and escaped quotes', () => {
    const rows = parseCsv('a,b\n"x, y","say ""hi"""\n');
    expect(rows).toEqual([{ a: 'x, y', b: 'say "hi"' }]);
  });
});

describe('dataset', () => {
  it('loads 46 contiguous months from 2023-01 through 2026-10', () => {
    expect(RECORDS).toHaveLength(46);
    expect(RECORDS[0].period).toBe('2023-01');
    expect(RECORDS[45].period).toBe('2026-10');
    expect(RECORDS[0].region).toBe('Greater Philadelphia, PA (fictional)');
  });

  it('passes every integrity check on every row', () => {
    for (const result of runChecks(RECORDS)) {
      expect(result.failures, result.label).toEqual([]);
    }
  });

  it('has four simulated review flags', () => {
    expect(RECORDS.filter(isFlagged).map((r) => r.period)).toEqual(['2023-06', '2024-04', '2025-09', '2026-07']);
  });
});

describe('metrics', () => {
  it('sums flows and takes snapshots from the final month', () => {
    const y2023 = summarize(byYear(RECORDS, 2023));
    expect(y2023.months).toBe(12);
    expect(y2023.revenue).toBe(869988);
    expect(y2023.grossProfit).toBe(y2023.revenue - y2023.directCost);
    expect(y2023.operatingProfit).toBe(y2023.grossProfit - y2023.opex);
    expect(y2023.pretaxResult).toBe(y2023.operatingProfit - y2023.interest);
    expect(y2023.cashEnd).toBe(170882);
  });

  it('compares 2026 year to date with the same ten months of 2025', () => {
    const ytd26 = summarize(yearToDate(RECORDS, 2026, 10));
    const ytd25 = summarize(yearToDate(RECORDS, 2025, 10));
    expect(ytd26.revenue).toBe(1186909);
    expect(ytd25.revenue).toBe(1043061);
    expect(change(ytd26.revenue, ytd25.revenue)).toBeCloseTo(0.1379, 4);
  });

  it('only offers a prior-year comparison when every month has a counterpart', () => {
    expect(priorYearSlice(RECORDS, byYear(RECORDS, 2023))).toBeNull();
    const prior = priorYearSlice(RECORDS, trailing(RECORDS, 12));
    expect(prior?.[0].period).toBe('2024-11');
    expect(prior).toHaveLength(12);
  });

  it('lists only complete calendar quarters', () => {
    const quarters = completeQuarters(RECORDS);
    expect(quarters[0].key).toBe('2023-Q1');
    expect(quarters[quarters.length - 1].key).toBe('2026-Q3');
  });
});
