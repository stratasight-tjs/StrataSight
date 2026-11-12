/**
 * Integrity checks run in the browser against every row of the CSV.
 * They power the "Data review" view and are also asserted in the unit tests.
 */
import { DIRECT_COSTS, OPEX_CATEGORIES, SERVICE_LINES, type MonthRecord } from './types';

export interface CheckResult {
  id: string;
  label: string;
  detail: string;
  passed: number;
  total: number;
  /** Periods that failed, if any. */
  failures: string[];
}

interface RowCheck {
  id: string;
  label: string;
  detail: string;
  test: (r: MonthRecord) => boolean;
}

const total = (values: number[]) => values.reduce((a, b) => a + b, 0);

export const ROW_CHECKS: RowCheck[] = [
  {
    id: 'revenue-sum',
    label: 'Service lines add up to total revenue',
    detail: 'maintenance + installations + seasonal cleanup + snow = total revenue',
    test: (r) => total(SERVICE_LINES.map((k) => r.revenue[k])) === r.totalRevenue,
  },
  {
    id: 'direct-sum',
    label: 'Direct costs add up to total direct cost',
    detail: 'labor + materials + subcontractors + equipment rental = total direct cost',
    test: (r) => total(DIRECT_COSTS.map((k) => r.directCosts[k])) === r.totalDirectCost,
  },
  {
    id: 'gross-profit',
    label: 'Gross profit ties to revenue and direct cost',
    detail: 'total revenue - total direct cost = gross profit',
    test: (r) => r.totalRevenue - r.totalDirectCost === r.grossProfit,
  },
  {
    id: 'opex-sum',
    label: 'Expense categories add up to total operating expense',
    detail: 'nine named categories, owner salary included once',
    test: (r) => total(OPEX_CATEGORIES.map((k) => r.opex[k])) === r.totalOpex,
  },
  {
    id: 'operating-profit',
    label: 'Operating profit ties to gross profit and expenses',
    detail: 'gross profit - total operating expense = operating profit',
    test: (r) => r.grossProfit - r.totalOpex === r.operatingProfit,
  },
  {
    id: 'pretax',
    label: 'Pretax result ties to operating profit and interest',
    detail: 'operating profit - interest expense = pretax result',
    test: (r) => r.operatingProfit - r.interestExpense === r.pretaxResult,
  },
  {
    id: 'recurring-subset',
    label: 'Recurring contract revenue stays within maintenance revenue',
    detail: 'recurring contract revenue <= maintenance revenue',
    test: (r) => r.recurringRevenue <= r.revenue.maintenance,
  },
  {
    id: 'topfive-subset',
    label: 'Top-five customer revenue stays within total revenue',
    detail: 'top five customer revenue <= total revenue',
    test: (r) => r.topFiveRevenue <= r.totalRevenue,
  },
  {
    id: 'funnel-order',
    label: 'Accepted estimates never exceed issued estimates',
    detail: 'estimates accepted <= estimates issued',
    test: (r) => r.estimatesAccepted <= r.estimatesIssued,
  },
  {
    id: 'ontime-subset',
    label: 'On-time jobs never exceed completed jobs',
    detail: 'jobs completed on time <= jobs completed',
    test: (r) => r.jobsOnTime <= r.jobsCompleted,
  },
  {
    id: 'hours-subset',
    label: 'Billable hours never exceed paid hours',
    detail: 'labor hours billable <= labor hours paid',
    test: (r) => r.hoursBillable <= r.hoursPaid,
  },
];

/** True when every month follows the previous one with no gaps or duplicates. */
export function periodsAreContiguous(records: readonly MonthRecord[]): boolean {
  return records.every((r, i) => {
    if (i === 0) return true;
    const prev = records[i - 1];
    const expected = prev.month === 12 ? { year: prev.year + 1, month: 1 } : { year: prev.year, month: prev.month + 1 };
    return r.year === expected.year && r.month === expected.month;
  });
}

export function runChecks(records: readonly MonthRecord[]): CheckResult[] {
  const results: CheckResult[] = ROW_CHECKS.map((check) => {
    const failures = records.filter((r) => !check.test(r)).map((r) => r.period);
    return {
      id: check.id,
      label: check.label,
      detail: check.detail,
      passed: records.length - failures.length,
      total: records.length,
      failures,
    };
  });
  const contiguous = periodsAreContiguous(records);
  results.push({
    id: 'contiguous',
    label: 'No missing or duplicated months',
    detail: `${records.length} consecutive monthly periods`,
    passed: contiguous ? records.length : 0,
    total: records.length,
    failures: contiguous ? [] : ['series'],
  });
  return results;
}

export const isFlagged = (r: MonthRecord): boolean => r.reviewStatus.toLowerCase().includes('flag');
