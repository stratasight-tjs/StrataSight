import { num, pct } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { Funnel, StatTile } from '../../charts/figures';
import { PRIMARY, SECONDARY } from '../../charts/palette';
import { labelsOf, monthRows, tickOf } from '../chartHelpers';
import { useDemo } from '../state';
import { Callout, PageHeader, PeriodFilter, PeriodNote, deltaPct, deltaPts } from '../ui';

export function Operations() {
  const { months, summary: s, priorSummary: p } = useDemo();
  const pctAxis = (v: number) => `${Math.round(v * 100)}%`;
  const safe = (a: number, b: number) => (b === 0 ? null : a / b);

  return (
    <>
      <PageHeader title="Operations" lede="How work is won, how crews spend their paid time, and whether jobs finish when promised." />
      <PeriodFilter />
      <PeriodNote />

      <div className="stat-grid stat-grid-4">
        <div className="card">
          <StatTile label="Estimate acceptance rate" value={pct(s.acceptanceRate ?? 0)} delta={deltaPts(s.acceptanceRate, p?.acceptanceRate)} note={`${num(s.estimatesAccepted)} of ${num(s.estimatesIssued)} estimates`} />
        </div>
        <div className="card">
          <StatTile label="Jobs completed on time" value={pct(s.onTimeRate ?? 0)} delta={deltaPts(s.onTimeRate, p?.onTimeRate)} note={`${num(s.jobsOnTime)} of ${num(s.jobsCompleted)} jobs`} />
        </div>
        <div className="card">
          <StatTile label="Labor utilization" value={pct(s.utilization ?? 0)} delta={deltaPts(s.utilization, p?.utilization)} note={`${num(s.hoursBillable)} billable of ${num(s.hoursPaid)} paid hours`} />
        </div>
        <div className="card">
          <StatTile label="Jobs completed" value={num(s.jobsCompleted)} delta={deltaPct(s.jobsCompleted, p?.jobsCompleted)} note="Sum of the months shown" />
        </div>
      </div>

      <div className="grid grid-2">
        <ChartCard title="From lead to accepted estimate" subtitle="Counts for the selected period, with the rate between each stage.">
          <Funnel
            format={num}
            stages={[
              { label: 'New leads', value: s.leads },
              { label: 'Estimates issued', value: s.estimatesIssued, rate: pct(s.leadToEstimateRate ?? 0), rateLabel: 'estimates issued relative to leads' },
              { label: 'Estimates accepted', value: s.estimatesAccepted, rate: pct(s.acceptanceRate ?? 0), rateLabel: 'of estimates accepted' },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Acceptance rate by month"
          subtitle="Estimates accepted divided by estimates issued in the same month."
          table={{ columns: ['Month', 'Leads', 'Issued', 'Accepted', 'Acceptance rate'], rows: monthRows(months, (r) => [r.leads, r.estimatesIssued, r.estimatesAccepted, r.estimatesIssued ? pct(r.estimatesAccepted / r.estimatesIssued) : 'n/a']) }}
        >
          <CartesianChart
            mode="line"
            height={230}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={[{ key: 'acc', label: 'Acceptance rate', color: PRIMARY, values: months.map((r) => safe(r.estimatesAccepted, r.estimatesIssued)) }]}
            format={(v) => pct(v)}
            axisFormat={pctAxis}
            ariaLabel="Line of monthly estimate acceptance rate"
          />
        </ChartCard>
      </div>

      <div className="grid grid-2">
        <ChartCard
          title="Utilization and on-time delivery"
          subtitle="Utilization is billable hours over paid hours. On-time is jobs finished when promised over jobs completed."
          legend={[
            { label: 'On-time jobs', color: SECONDARY, shape: 'line' },
            { label: 'Labor utilization', color: PRIMARY, shape: 'line' },
          ]}
          table={{ columns: ['Month', 'Paid hours', 'Billable hours', 'Utilization', 'Jobs', 'On time', 'On-time rate'], rows: monthRows(months, (r) => [num(r.hoursPaid), num(r.hoursBillable), pct(r.hoursBillable / r.hoursPaid), r.jobsCompleted, r.jobsOnTime, pct(r.jobsOnTime / r.jobsCompleted)]) }}
        >
          <CartesianChart
            mode="line"
            height={250}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={[
              { key: 'ontime', label: 'On-time jobs', color: SECONDARY, values: months.map((r) => safe(r.jobsOnTime, r.jobsCompleted)) },
              { key: 'util', label: 'Labor utilization', color: PRIMARY, values: months.map((r) => safe(r.hoursBillable, r.hoursPaid)) },
            ]}
            format={(v) => pct(v)}
            axisFormat={pctAxis}
            ariaLabel="Lines of monthly on-time job rate and labor utilization"
          />
        </ChartCard>

        <ChartCard
          title="Customers served"
          subtitle="Repeat and new customers served each month."
          legend={[
            { label: 'Repeat customers', color: 'var(--ramp-3)' },
            { label: 'New customers', color: 'var(--ramp-1)' },
          ]}
          table={{ columns: ['Month', 'Repeat', 'New'], rows: monthRows(months, (r) => [r.repeatCustomers, r.newCustomers]) }}
          footnote="These are monthly activity counts. A customer served in three months is counted three times, so the totals are not unique customers or a retention rate."
        >
          <CartesianChart
            mode="stacked"
            height={250}
            labels={labelsOf(months)}
            tick={tickOf(months)}
            series={[
              { key: 'repeat', label: 'Repeat customers', color: 'var(--ramp-3)', values: months.map((r) => r.repeatCustomers) },
              { key: 'new', label: 'New customers', color: 'var(--ramp-1)', values: months.map((r) => r.newCustomers) },
            ]}
            format={num}
            totalLabel="Customers served"
            ariaLabel="Stacked columns of repeat and new customers served each month"
          />
        </ChartCard>
      </div>

      <Callout title="About crew size">
        Average field crew is a full-time-equivalent estimate for each month ({s.crewFteEnd.toFixed(1)} at the end of this period). It is not a headcount and is never added across months.
      </Callout>
    </>
  );
}
