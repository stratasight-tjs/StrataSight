import { RECORDS } from '../../lib/dataset';
import type { MonthRecord } from '../../lib/types';
import { pct, periodLabel, usd, usdAxis, usdCompact } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { StatTile } from '../../charts/figures';
import { PRIMARY } from '../../charts/palette';
import { flagMarks, labelsOf, monthRows, tickOf } from '../chartHelpers';
import { useDemo } from '../state';
import { Callout, PageHeader, PeriodFilter, deltaPct } from '../ui';
import { rangeLabel } from '../../lib/periods';

const SNAPSHOTS: { key: 'cashEnd' | 'arEnd' | 'apEnd' | 'backlogEnd'; title: string; subtitle: string; upIsGood: boolean | null }[] = [
  { key: 'cashEnd', title: 'Cash balance', subtitle: 'Cash on hand at each month end.', upIsGood: true },
  { key: 'arEnd', title: 'Receivables', subtitle: 'Money customers owed at each month end.', upIsGood: null },
  { key: 'apEnd', title: 'Payables', subtitle: 'Money owed to suppliers at each month end.', upIsGood: null },
  { key: 'backlogEnd', title: 'Estimated backlog', subtitle: 'Signed work not yet completed at each month end.', upIsGood: true },
];

export function Cash() {
  const { months, range } = useDemo();
  const last = months[months.length - 1];
  const yearEarlier: MonthRecord | undefined = RECORDS.find((r) => r.year === last.year - 1 && r.month === last.month);
  const lastLabel = periodLabel(last.period);

  return (
    <>
      <PageHeader title="Cash and receivables" lede="Balances at the end of each month. These are snapshots, so they are shown as trends and end values and are never added together." />
      <PeriodFilter />
      <p className="period-note">
        Showing <strong>{rangeLabel(RECORDS, range)}</strong>. Tiles give the balance at the end of {lastLabel}
        {yearEarlier ? ` and the change from the end of ${periodLabel(yearEarlier.period)}.` : '. The data has no month a year earlier to compare with.'}
      </p>

      <div className="stat-grid stat-grid-4">
        {SNAPSHOTS.map((snap) => {
          const delta = deltaPct(last[snap.key], yearEarlier?.[snap.key]);
          return (
            <div className="card" key={snap.key}>
              <StatTile
                label={`${snap.title}, end of ${lastLabel}`}
                value={usdCompact(last[snap.key])}
                delta={delta ? { ...delta, good: snap.upIsGood === null ? null : delta.good } : null}
                trend={months.map((r) => r[snap.key])}
                note="Month-end balance"
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-2">
        {SNAPSHOTS.map((snap) => (
          <ChartCard
            key={snap.key}
            title={snap.title}
            subtitle={snap.subtitle}
            table={{ columns: ['Month end', snap.title], rows: monthRows(months, (r) => [usd(r[snap.key])]) }}
          >
            <CartesianChart
              mode="line"
              area
              height={220}
              labels={labelsOf(months)}
              tick={tickOf(months)}
              series={[{ key: snap.key, label: snap.title, color: PRIMARY, values: months.map((r) => r[snap.key]) }]}
              format={usd}
              axisFormat={usdAxis}
              domain={[0, Math.max(...months.map((r) => r[snap.key]))]}
              marks={snap.key === 'arEnd' ? flagMarks(months).filter((m) => m.label.toLowerCase().includes('receivable')) : undefined}
              ariaLabel={`Line of ${snap.title.toLowerCase()} at each month end`}
            />
          </ChartCard>
        ))}
      </div>

      <ChartCard
        title="Receivables compared with the month's revenue"
        subtitle="Month-end receivables divided by that month's revenue. A rising line means more of the month's work was still unpaid when the month closed."
        table={{ columns: ['Month', 'Receivables', 'Revenue', 'Receivables as a share of revenue'], rows: monthRows(months, (r) => [usd(r.arEnd), usd(r.totalRevenue), pct(r.arEnd / r.totalRevenue)]) }}
      >
        <CartesianChart
          mode="line"
          height={220}
          labels={labelsOf(months)}
          tick={tickOf(months)}
          series={[{ key: 'ar', label: 'Receivables as a share of revenue', color: PRIMARY, values: months.map((r) => r.arEnd / r.totalRevenue) }]}
          format={(v) => pct(v)}
          axisFormat={(v) => `${Math.round(v * 100)}%`}
          domain={[0, Math.max(...months.map((r) => r.arEnd / r.totalRevenue))]}
          ariaLabel="Line of month-end receivables as a share of that month's revenue"
        />
      </ChartCard>

      <Callout title="What this page cannot show">
        The dataset has month-end balances only. It does not include a cash-flow statement, loan balances, or an aging report, so this page describes where balances stood and makes no claim about why they moved.
      </Callout>
    </>
  );
}
