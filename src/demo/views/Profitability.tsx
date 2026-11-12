import { DIRECT_COSTS, DIRECT_COST_LABEL, OPEX_CATEGORIES, OPEX_LABEL } from '../../lib/types';
import { pct, usd, usdAxis, usdCompact } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { HBars, SegmentedBar, StatTile } from '../../charts/figures';
import { NEGATIVE, PRIMARY, SECONDARY } from '../../charts/palette';
import { labelsOf, monthRows, tickOf } from '../chartHelpers';
import { useDemo } from '../state';
import { Callout, PageHeader, PeriodFilter, PeriodNote, deltaPct, deltaPts } from '../ui';

export function Profitability() {
  const { months, summary: s, priorSummary: p } = useDemo();
  const pctAxis = (v: number) => `${Math.round(v * 100)}%`;

  const dollar = [
    { label: DIRECT_COST_LABEL.labor, value: s.directCostByType.labor, color: '#0d366b' },
    { label: DIRECT_COST_LABEL.materials, value: s.directCostByType.materials, color: '#1c5cab' },
    { label: 'Subcontractors and equipment', value: s.directCostByType.subcontractors + s.directCostByType.equipment, color: '#3987e5' },
    { label: 'Operating expenses', value: s.opex, color: '#86b6ef', darkText: true },
    { label: 'Interest', value: s.interest, color: '#c2cbc8', darkText: true },
    { label: 'Pretax result', value: s.pretaxResult, color: '#1f9e84' },
  ];

  return (
    <>
      <PageHeader title="Profitability" lede="What is left after the direct cost of doing the work, and after the cost of running the company." />
      <PeriodFilter />
      <PeriodNote />

      <div className="stat-grid stat-grid-4">
        <div className="card">
          <StatTile label="Gross profit" value={usdCompact(s.grossProfit)} delta={deltaPct(s.grossProfit, p?.grossProfit)} note="Revenue less direct costs" />
        </div>
        <div className="card">
          <StatTile label="Gross margin" value={pct(s.grossMargin ?? 0)} delta={deltaPts(s.grossMargin, p?.grossMargin)} note="Gross profit as a share of revenue" />
        </div>
        <div className="card">
          <StatTile label="Operating expenses" value={usdCompact(s.opex)} delta={deltaPct(s.opex, p?.opex, false)} note="Nine categories, owner salary included" />
        </div>
        <div className="card">
          <StatTile label="Operating margin" value={pct(s.operatingMargin ?? 0)} delta={deltaPts(s.operatingMargin, p?.operatingMargin)} note="Operating profit as a share of revenue" />
        </div>
      </div>

      <div className="grid grid-2">
        <ChartCard
          title="Operating profit by month"
          subtitle="Gross profit less operating expenses. Months below zero ran at an operating loss."
          legend={[
            { label: 'Operating profit', color: PRIMARY },
            { label: 'Operating loss', color: NEGATIVE },
          ]}
          table={{ columns: ['Month', 'Gross profit', 'Operating expenses', 'Operating profit'], rows: monthRows(months, (r) => [usd(r.grossProfit), usd(r.totalOpex), usd(r.operatingProfit)]) }}
        >
          <CartesianChart
            mode="columns"
            height={280}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={[{ key: 'op', label: 'Operating profit', color: PRIMARY, values: months.map((r) => r.operatingProfit) }]}
            columnColor={(v) => (v < 0 ? NEGATIVE : PRIMARY)}
            format={usd}
            axisFormat={usdAxis}
            ariaLabel="Columns of monthly operating profit, with losses below the zero line"
          />
        </ChartCard>

        <ChartCard
          title="Margins by month"
          subtitle="Both lines are shares of the same month's revenue, so they share one axis."
          legend={[
            { label: 'Gross margin', color: PRIMARY, shape: 'line' },
            { label: 'Operating margin', color: SECONDARY, shape: 'line' },
          ]}
          table={{ columns: ['Month', 'Gross margin', 'Operating margin'], rows: monthRows(months, (r) => [pct(r.grossProfit / r.totalRevenue), pct(r.operatingProfit / r.totalRevenue)]) }}
        >
          <CartesianChart
            mode="line"
            height={280}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={[
              { key: 'gm', label: 'Gross margin', color: PRIMARY, values: months.map((r) => r.grossProfit / r.totalRevenue) },
              { key: 'om', label: 'Operating margin', color: SECONDARY, values: months.map((r) => r.operatingProfit / r.totalRevenue) },
            ]}
            format={(v) => pct(v)}
            axisFormat={pctAxis}
            ariaLabel="Lines of monthly gross margin and operating margin"
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Where each dollar of revenue went"
        subtitle={s.pretaxResult >= 0 ? `Revenue of ${usd(s.revenue)} for the selected period, split into its costs and what was left before taxes.` : undefined}
      >
        {s.pretaxResult >= 0 ? (
          <SegmentedBar ariaLabel="Split of revenue into costs and pretax result" format={usd} segments={dollar} />
        ) : (
          <p className="empty">
            Costs exceeded revenue in this period: revenue {usd(s.revenue)}, direct costs {usd(s.directCost)}, operating expenses {usd(s.opex)}, interest {usd(s.interest)}, for a pretax result of {usd(s.pretaxResult)}. A single bar cannot show a negative remainder, so the split is given in words.
          </p>
        )}
      </ChartCard>

      <div className="grid grid-2">
        <ChartCard title="Operating expenses by category" subtitle="Ranked for the selected period, with each category's share of the total.">
          <HBars
            format={usd}
            rows={[...OPEX_CATEGORIES]
              .sort((a, b) => s.opexByCategory[b] - s.opexByCategory[a])
              .map((k) => ({ label: OPEX_LABEL[k], value: s.opexByCategory[k], hint: pct(s.opexByCategory[k] / s.opex) }))}
          />
        </ChartCard>
        <ChartCard title="Direct costs of the work" subtitle="Ranked for the selected period, with each cost as a share of revenue.">
          <HBars
            format={usd}
            rows={[...DIRECT_COSTS]
              .sort((a, b) => s.directCostByType[b] - s.directCostByType[a])
              .map((k) => ({ label: DIRECT_COST_LABEL[k], value: s.directCostByType[k], hint: pct(s.directCostByType[k] / s.revenue) }))}
          />
        </ChartCard>
      </div>

      <Callout title="How to read these figures">
        Owner salary is counted once, inside operating expenses. The dataset leaves out taxes and depreciation and is not a full set of accounts, so nothing on this page is EBITDA, seller's discretionary earnings, net income, or a measure of what the owner can take out of the business.
      </Callout>
    </>
  );
}
