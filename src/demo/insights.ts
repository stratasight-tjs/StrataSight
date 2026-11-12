/**
 * Plain-language observations generated from the data for whatever period is selected.
 * Every sentence is built from computed values, so the text can never drift from the charts.
 */
import { SERVICE_LINES, SERVICE_LINE_LABEL, type MonthRecord } from '../lib/types';
import { change, type PeriodSummary } from '../lib/metrics';
import { pct, pctChange, periodLabel, ptsChange, usd } from '../lib/format';
import type { Route } from './router';

export interface Insight {
  text: string;
  route: Route;
}

export function buildInsights(months: MonthRecord[], current: PeriodSummary, prior: PeriodSummary | null): Insight[] {
  const out: Insight[] = [];

  if (prior) {
    const c = change(current.revenue, prior.revenue)!;
    out.push({
      text: `Revenue was ${usd(current.revenue)}, ${c >= 0 ? 'up' : 'down'} ${pctChange(Math.abs(c)).replace('+', '')} from ${usd(prior.revenue)} in the same months a year earlier.`,
      route: 'revenue',
    });
    const movers = SERVICE_LINES.map((k) => ({ k, c: change(current.revenueByLine[k], prior.revenueByLine[k]) }))
      .filter((m): m is { k: (typeof SERVICE_LINES)[number]; c: number } => m.c !== null)
      .sort((a, b) => b.c - a.c);
    if (movers.length > 1) {
      const top = movers[0];
      const bottom = movers[movers.length - 1];
      out.push({
        text: `${SERVICE_LINE_LABEL[top.k]} changed the most (${pctChange(top.c)}). ${SERVICE_LINE_LABEL[bottom.k]} changed the least (${pctChange(bottom.c)}).`,
        route: 'revenue',
      });
    }
  } else {
    const largest = [...SERVICE_LINES].sort((a, b) => current.revenueByLine[b] - current.revenueByLine[a])[0];
    out.push({
      text: `Revenue was ${usd(current.revenue)}. ${SERVICE_LINE_LABEL[largest]} was the largest service line at ${pct(current.revenueByLine[largest] / current.revenue)} of the total.`,
      route: 'revenue',
    });
  }

  if (current.grossMargin !== null) {
    const base = `Gross margin was ${pct(current.grossMargin)}`;
    out.push({
      text:
        prior && prior.grossMargin !== null
          ? `${base}, ${ptsChange(current.grossMargin - prior.grossMargin)} against a year earlier.${Math.abs(current.grossMargin - prior.grossMargin) < 0.005 ? ' Direct costs moved almost in step with revenue.' : ''}`
          : `${base} after direct labor, materials, subcontractors, and equipment rental.`,
      route: 'profitability',
    });
  }

  const lossMonths = months.filter((r) => r.operatingProfit < 0);
  if (lossMonths.length > 0) {
    const names = lossMonths.map((r) => periodLabel(r.period));
    const list = names.length <= 4 ? names.join(', ') : `${names.slice(0, 3).join(', ')} and ${names.length - 3} more`;
    const allWinter = lossMonths.every((r) => r.month === 12 || r.month <= 2);
    out.push({
      text: `${lossMonths.length} of ${months.length} months ran at an operating loss (${list}).${allWinter ? ' All of them fall between December and February.' : ''}`,
      route: 'profitability',
    });
  } else {
    out.push({ text: `Every month in this period produced an operating profit.`, route: 'profitability' });
  }

  if (months.length > 1) {
    const first = months[0];
    const delta = current.cashEnd - first.cashEnd;
    out.push({
      text: `Cash stood at ${usd(current.cashEnd)} at the end of ${periodLabel(current.lastPeriod)}, ${delta >= 0 ? 'up' : 'down'} ${usd(Math.abs(delta))} from the end of ${periodLabel(first.period)}.`,
      route: 'cash',
    });
  }

  return out;
}
