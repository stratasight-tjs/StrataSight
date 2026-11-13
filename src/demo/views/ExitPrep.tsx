import { CircleCheck, CircleSlash, Flag } from 'lucide-react';
import { COMPANY, RECORDS } from '../../lib/dataset';
import { isFlagged } from '../../lib/checks';
import { pct, periodLabel, usd } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { PRIMARY } from '../../charts/palette';
import { labelsOf, monthRows, tickOf, yearly } from '../chartHelpers';
import { EXIT_NOT_IN_DATASET } from '../illustrative';
import { href } from '../router';
import { useDemo } from '../state';
import { Basis, Callout, PageHeader } from '../ui';

export function ExitPrep() {
  const { reviewed } = useDemo();
  const years = yearly();
  const openFlags = RECORDS.filter((r) => isFlagged(r) && !reviewed.has(r.period));
  const span = `${periodLabel(COMPANY.firstPeriod)} to ${periodLabel(COMPANY.lastPeriod)}`;

  const organized = [
    { title: 'Monthly revenue, costs, and operating profit', detail: `${RECORDS.length} consecutive months, ${span}` },
    { title: 'Revenue by service line', detail: 'Four service lines for every month on record' },
    { title: 'Recurring contract revenue and contract counts', detail: 'Monthly, as a subset of maintenance revenue' },
    { title: 'Customer concentration', detail: "Top five customers' revenue for every month" },
    { title: 'Owner involvement', detail: 'Estimated weekly operational hours for every month' },
    { title: 'Delivery and workforce measures', detail: 'On-time jobs, paid and billable hours, crew size' },
    { title: 'Source and review status for each month', detail: 'Carried from intake into the record' },
  ];

  return (
    <>
      <PageHeader
        title="Exit preparation"
        lede="When an owner decides to sell or hand over the business, the record should already be in order for the professionals who will handle the transaction."
      />

      <Callout title="What this page is and is not" tone="caution">
        The sample data cannot support an opinion of value, so nothing here is a valuation, a multiple, or a readiness score. This page shows how an organized history could be assembled for the exit partner who handles the sale.
      </Callout>

      <ChartCard
          title="Measures to have ready, year by year"
          subtitle="By calendar year, from the demo records. The final column is a partial year and should not be read as a full one."
        >
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  {years.map((y) => (
                    <th key={y.year} scope="col">
                      {y.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Revenue</th>
                  {years.map((y) => (
                    <td key={y.year}>{usd(y.summary.revenue)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Gross margin</th>
                  {years.map((y) => (
                    <td key={y.year}>{pct(y.summary.grossMargin ?? 0)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Operating profit</th>
                  {years.map((y) => (
                    <td key={y.year}>{usd(y.summary.operatingProfit)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Recurring contract share of revenue</th>
                  {years.map((y) => (
                    <td key={y.year}>{pct(y.summary.recurringShare ?? 0)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Top five customers' share of revenue</th>
                  {years.map((y) => (
                    <td key={y.year}>{pct(y.summary.topFiveShare ?? 0)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Owner hours in operations, weekly average</th>
                  {years.map((y) => (
                    <td key={y.year}>{y.summary.ownerHoursAvg.toFixed(1)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Recurring contracts at period end</th>
                  {years.map((y) => (
                    <td key={y.year}>{y.summary.recurringContractsEnd}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </ChartCard>

      <ChartCard
          title="Owner hours in day-to-day operations"
          subtitle="Estimated hours a week, every month on record. This is one indicator of how much the business relies on its owner. It is not a readiness score."
          table={{ columns: ['Month', 'Owner hours a week'], rows: monthRows(RECORDS, (r) => [r.ownerHoursPerWeek.toFixed(1)]) }}
        >
          <CartesianChart
            mode="line"
            area
            height={250}
            labels={labelsOf(RECORDS)}
            tick={tickOf(RECORDS)}
            series={[{ key: 'owner', label: 'Owner hours a week', color: PRIMARY, values: RECORDS.map((r) => r.ownerHoursPerWeek) }]}
            format={(v) => `${v.toFixed(1)} hrs`}
            axisFormat={(v) => String(v)}
            ariaLabel="Line of the owner's estimated weekly operational hours for every month on record"
          />
        </ChartCard>

      <section className="card panel">
        <div className="panel-head">
          <h3 className="chart-card-title">Handoff package</h3>
          <Basis kind="illustrative">Illustrative structure, facts from demo records</Basis>
        </div>
        <div className="handoff">
          <div>
            <h4>
              <CircleCheck size={16} aria-hidden className="is-pass" /> Organized in this workspace
            </h4>
            <ul>
              {organized.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>
              <Flag size={16} aria-hidden className="is-warn" /> Needs review first
            </h4>
            {openFlags.length > 0 ? (
              <ul>
                {openFlags.map((r) => (
                  <li key={r.period}>
                    <strong>{periodLabel(r.period, true)}</strong>
                    <span>{r.reviewNote}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-sub">Every flagged month has been marked reviewed in this session.</p>
            )}
            <a className="text-link" href={href('review')}>
              Open data review
            </a>
          </div>
          <div>
            <h4>
              <CircleSlash size={16} aria-hidden className="is-muted" /> Not in the demo dataset
            </h4>
            <ul>
              {EXIT_NOT_IN_DATASET.map((item) => (
                <li key={item}>
                  <strong>{item}</strong>
                </li>
              ))}
            </ul>
            <p className="panel-sub">A real handoff would need these from the business and its accountant.</p>
          </div>
        </div>
      </section>
    </>
  );
}
