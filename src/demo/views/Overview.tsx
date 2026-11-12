import { ArrowRight } from 'lucide-react';
import { COMPANY } from '../../lib/dataset';
import { SERVICE_LINES, SERVICE_LINE_LABEL } from '../../lib/types';
import { pct, usd, usdAxis, usdCompact } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { StatTile } from '../../charts/figures';
import { LINE_COLOR } from '../../charts/palette';
import { flagMarks, labelsOf, monthRows, tickOf } from '../chartHelpers';
import { buildInsights } from '../insights';
import { MEETING_PROMPTS } from '../illustrative';
import { href } from '../router';
import { useDemo } from '../state';
import { Basis, PageHeader, PeriodFilter, PeriodNote, deltaPct, deltaPts } from '../ui';

export function Overview() {
  const { months, summary: s, priorSummary: p } = useDemo();
  const insights = buildInsights(months, s, p);
  const marks = flagMarks(months);

  return (
    <>
      <PageHeader title="Overview" lede={`How ${COMPANY.shortName} is performing across revenue, profit, and cash.`} />
      <PeriodFilter />
      <PeriodNote />

      <div className="stat-grid stat-grid-5">
        <div className="card">
          <StatTile label="Revenue" value={usdCompact(s.revenue)} delta={deltaPct(s.revenue, p?.revenue)} trend={months.map((r) => r.totalRevenue)} note="Sum of the months shown" />
        </div>
        <div className="card">
          <StatTile label="Gross margin" value={pct(s.grossMargin ?? 0)} delta={deltaPts(s.grossMargin, p?.grossMargin)} trend={months.map((r) => r.grossProfit / r.totalRevenue)} note="Gross profit as a share of revenue" />
        </div>
        <div className="card">
          <StatTile label="Operating profit" value={usdCompact(s.operatingProfit)} delta={deltaPct(s.operatingProfit, p?.operatingProfit)} trend={months.map((r) => r.operatingProfit)} note="Gross profit less operating expenses" />
        </div>
        <div className="card">
          <StatTile label="Pretax result" value={usdCompact(s.pretaxResult)} delta={deltaPct(s.pretaxResult, p?.pretaxResult)} trend={months.map((r) => r.pretaxResult)} note="Operating profit less interest" />
        </div>
        <div className="card">
          <StatTile label="Cash at period end" value={usdCompact(s.cashEnd)} delta={deltaPct(s.cashEnd, p?.cashEnd)} trend={months.map((r) => r.cashEnd)} note="Month-end balance, not a sum" />
        </div>
      </div>

      <div className="grid grid-2-1">
        <ChartCard
          title="Revenue by service line"
          subtitle={marks.length > 0 ? 'Monthly revenue. A yellow marker under the axis means that month is flagged for review.' : 'Monthly revenue, stacked by the four service lines.'}
          legend={SERVICE_LINES.map((k) => ({ label: SERVICE_LINE_LABEL[k], color: LINE_COLOR[k] }))}
          table={{
            columns: ['Month', ...SERVICE_LINES.map((k) => SERVICE_LINE_LABEL[k]), 'Total'],
            rows: monthRows(months, (r) => [...SERVICE_LINES.map((k) => usd(r.revenue[k])), usd(r.totalRevenue)]),
          }}
        >
          <CartesianChart
            mode="stacked"
            height={390}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={SERVICE_LINES.map((k) => ({ key: k, label: SERVICE_LINE_LABEL[k], color: LINE_COLOR[k], values: months.map((r) => r.revenue[k]) }))}
            format={usd}
            axisFormat={usdAxis}
            totalLabel="Total revenue"
            marks={marks}
            ariaLabel="Stacked columns of monthly revenue by service line"
          />
        </ChartCard>

        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">What the records show</h3>
            <Basis kind="data" />
          </div>
          <ul className="insights">
            {insights.map((insight) => (
              <li key={insight.text}>
                <p>{insight.text}</p>
                <a href={href(insight.route)} aria-label={`Open the ${insight.route} view`}>
                  <ArrowRight size={15} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <StatTile
            label="Recurring contract share of revenue"
            value={pct(s.recurringShare ?? 0)}
            delta={deltaPts(s.recurringShare, p?.recurringShare)}
            note={`${usd(s.recurringRevenue)} of revenue came from recurring contracts`}
          />
        </div>
        <div className="card">
          <StatTile
            label="Top five customers' share of revenue"
            value={pct(s.topFiveShare ?? 0)}
            delta={deltaPts(s.topFiveShare, p?.topFiveShare, false)}
            note="A lower share means less reliance on a few customers"
          />
        </div>
        <div className="card">
          <StatTile
            label="Owner hours in operations, weekly average"
            value={s.ownerHoursAvg.toFixed(1)}
            delta={deltaPct(s.ownerHoursAvg, p?.ownerHoursAvg, false)}
            note="Monthly estimate, averaged over the period"
          />
        </div>
      </div>

      <section className="card panel panel-advisor">
        <div className="panel-head">
          <h3 className="chart-card-title">Questions to bring to the next meeting</h3>
          <Basis kind="illustrative" />
        </div>
        <ul className="prompts">
          {MEETING_PROMPTS.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
        <a className="text-link" href={href('meetings')}>
          Open meeting preparation
        </a>
      </section>
    </>
  );
}
