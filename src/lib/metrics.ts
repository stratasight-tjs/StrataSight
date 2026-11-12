/**
 * Deterministic calculations over month records.
 *
 * Rules that come straight from docs/DATA_DICTIONARY.md:
 *  - Flow figures (revenue, costs, counts, hours) are summed across months.
 *  - Snapshot figures (cash, receivables, payables, backlog, contracts, FTE) are never summed.
 *    A period reports the value at its final month.
 *  - Ratios are computed from summed numerators and denominators, never by averaging monthly ratios.
 *  - Nothing here is EBITDA, SDE, net income, or a valuation input. Names follow the CSV definitions.
 */
import {
  DIRECT_COSTS,
  OPEX_CATEGORIES,
  SERVICE_LINES,
  type DirectCost,
  type MonthRecord,
  type OpexCategory,
  type ServiceLine,
} from './types';

export const sum = <T>(items: readonly T[], pick: (item: T) => number): number =>
  items.reduce((total, item) => total + pick(item), 0);

/** Safe ratio. Returns null when the denominator is zero so callers must handle "not available". */
export const ratio = (numerator: number, denominator: number): number | null =>
  denominator === 0 ? null : numerator / denominator;

export interface PeriodSummary {
  months: number;
  firstPeriod: string;
  lastPeriod: string;

  revenue: number;
  revenueByLine: Record<ServiceLine, number>;
  directCost: number;
  directCostByType: Record<DirectCost, number>;
  grossProfit: number;
  grossMargin: number | null;
  opex: number;
  opexByCategory: Record<OpexCategory, number>;
  operatingProfit: number;
  operatingMargin: number | null;
  interest: number;
  pretaxResult: number;
  pretaxMargin: number | null;

  recurringRevenue: number;
  recurringShare: number | null;
  topFiveRevenue: number;
  topFiveShare: number | null;

  leads: number;
  estimatesIssued: number;
  estimatesAccepted: number;
  leadToEstimateRate: number | null;
  acceptanceRate: number | null;
  jobsCompleted: number;
  jobsOnTime: number;
  onTimeRate: number | null;
  hoursPaid: number;
  hoursBillable: number;
  utilization: number | null;
  newCustomers: number;
  repeatCustomers: number;
  /** Simple mean of the monthly owner-hours estimate. */
  ownerHoursAvg: number;

  /** Period-end snapshots, taken from the final month in the period. */
  cashEnd: number;
  arEnd: number;
  apEnd: number;
  backlogEnd: number;
  recurringContractsEnd: number;
  crewFteEnd: number;
}

export function summarize(records: readonly MonthRecord[]): PeriodSummary {
  if (records.length === 0) throw new Error('summarize() needs at least one month');
  const last = records[records.length - 1];

  const byKey = <K extends string>(keys: readonly K[], pick: (r: MonthRecord, k: K) => number) =>
    Object.fromEntries(keys.map((k) => [k, sum(records, (r) => pick(r, k))])) as Record<K, number>;

  const revenue = sum(records, (r) => r.totalRevenue);
  const directCost = sum(records, (r) => r.totalDirectCost);
  const grossProfit = sum(records, (r) => r.grossProfit);
  const opex = sum(records, (r) => r.totalOpex);
  const operatingProfit = sum(records, (r) => r.operatingProfit);
  const interest = sum(records, (r) => r.interestExpense);
  const pretaxResult = sum(records, (r) => r.pretaxResult);
  const recurringRevenue = sum(records, (r) => r.recurringRevenue);
  const topFiveRevenue = sum(records, (r) => r.topFiveRevenue);
  const leads = sum(records, (r) => r.leads);
  const estimatesIssued = sum(records, (r) => r.estimatesIssued);
  const estimatesAccepted = sum(records, (r) => r.estimatesAccepted);
  const jobsCompleted = sum(records, (r) => r.jobsCompleted);
  const jobsOnTime = sum(records, (r) => r.jobsOnTime);
  const hoursPaid = sum(records, (r) => r.hoursPaid);
  const hoursBillable = sum(records, (r) => r.hoursBillable);

  return {
    months: records.length,
    firstPeriod: records[0].period,
    lastPeriod: last.period,
    revenue,
    revenueByLine: byKey(SERVICE_LINES, (r, k) => r.revenue[k]),
    directCost,
    directCostByType: byKey(DIRECT_COSTS, (r, k) => r.directCosts[k]),
    grossProfit,
    grossMargin: ratio(grossProfit, revenue),
    opex,
    opexByCategory: byKey(OPEX_CATEGORIES, (r, k) => r.opex[k]),
    operatingProfit,
    operatingMargin: ratio(operatingProfit, revenue),
    interest,
    pretaxResult,
    pretaxMargin: ratio(pretaxResult, revenue),
    recurringRevenue,
    recurringShare: ratio(recurringRevenue, revenue),
    topFiveRevenue,
    topFiveShare: ratio(topFiveRevenue, revenue),
    leads,
    estimatesIssued,
    estimatesAccepted,
    leadToEstimateRate: ratio(estimatesIssued, leads),
    acceptanceRate: ratio(estimatesAccepted, estimatesIssued),
    jobsCompleted,
    jobsOnTime,
    onTimeRate: ratio(jobsOnTime, jobsCompleted),
    hoursPaid,
    hoursBillable,
    utilization: ratio(hoursBillable, hoursPaid),
    newCustomers: sum(records, (r) => r.newCustomers),
    repeatCustomers: sum(records, (r) => r.repeatCustomers),
    ownerHoursAvg: sum(records, (r) => r.ownerHoursPerWeek) / records.length,
    cashEnd: last.cashEnd,
    arEnd: last.arEnd,
    apEnd: last.apEnd,
    backlogEnd: last.backlogEnd,
    recurringContractsEnd: last.recurringContracts,
    crewFteEnd: last.crewFte,
  };
}

/**
 * The same calendar months one year earlier. Returns null unless every month has a counterpart,
 * so comparisons are always like for like.
 */
export function priorYearSlice(
  all: readonly MonthRecord[],
  slice: readonly MonthRecord[],
): MonthRecord[] | null {
  const byPeriod = new Map(all.map((r) => [r.period, r]));
  const prior: MonthRecord[] = [];
  for (const r of slice) {
    const match = byPeriod.get(`${r.year - 1}-${String(r.month).padStart(2, '0')}`);
    if (!match) return null;
    prior.push(match);
  }
  return prior;
}

/** Relative change, or null when the base is zero. */
export const change = (current: number, base: number): number | null =>
  base === 0 ? null : (current - base) / Math.abs(base);

export const byYear = (all: readonly MonthRecord[], year: number): MonthRecord[] =>
  all.filter((r) => r.year === year);

/** Months 1..throughMonth of a year. Used for year-to-date comparisons. */
export const yearToDate = (all: readonly MonthRecord[], year: number, throughMonth: number): MonthRecord[] =>
  all.filter((r) => r.year === year && r.month <= throughMonth);

/** The final `count` months of the series. */
export const trailing = (all: readonly MonthRecord[], count: number): MonthRecord[] =>
  all.slice(Math.max(0, all.length - count));

/** Calendar quarters that are fully present in the data, oldest first. */
export interface Quarter {
  key: string;
  label: string;
  year: number;
  quarter: number;
  records: MonthRecord[];
}

export function completeQuarters(all: readonly MonthRecord[]): Quarter[] {
  const groups = new Map<string, MonthRecord[]>();
  for (const r of all) {
    const q = Math.ceil(r.month / 3);
    const key = `${r.year}-Q${q}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()]
    .filter(([, records]) => records.length === 3)
    .map(([key, records]) => ({
      key,
      label: `Q${Math.ceil(records[0].month / 3)} ${records[0].year}`,
      year: records[0].year,
      quarter: Math.ceil(records[0].month / 3),
      records,
    }));
}
