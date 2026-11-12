import { Upload } from 'lucide-react';
import { COMPANY, RECORDS } from '../../lib/dataset';
import { change, completeQuarters, priorYearSlice, summarize, trailing } from '../../lib/metrics';
import { pctChange, periodLabel, periodShort, usd, usdAxis } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { SegmentedBar } from '../../charts/figures';
import { PRIMARY } from '../../charts/palette';
import { labelsOf, monthRows } from '../chartHelpers';
import { RECOMMENDATIONS } from '../illustrative';
import { useDemo, type ActionStatus } from '../state';
import { Basis, Callout, PageHeader } from '../ui';

const STATUS_LABEL: Record<ActionStatus, string> = { proposed: 'Proposed', 'in-progress': 'In progress', done: 'Done' };

const GLOSSARY = [
  ['Revenue', 'Everything customers were billed for the work.'],
  ['Direct costs', 'What it cost to do that work: crew wages, materials, subcontractors, rented equipment.'],
  ['Gross profit', 'Revenue minus direct costs.'],
  ['Operating expenses', 'The cost of running the company whether or not a job is on: office staff, your own salary, rent, insurance, vehicles.'],
  ['Operating profit', 'Gross profit minus operating expenses.'],
  ['Receivables', 'Money customers owe you for work already done.'],
];

export function Owner() {
  const { actionStatus } = useDemo();
  const months = trailing(RECORDS, 12);
  const s = summarize(months);
  const prior = summarize(priorYearSlice(RECORDS, months)!);
  const revenueChange = change(s.revenue, prior.revenue)!;
  const cents = (value: number) => Math.round((value / s.revenue) * 100);
  const quarters = completeQuarters(RECORDS);
  const lossMonths = months.filter((r) => r.operatingProfit < 0);
  const last = periodLabel(s.lastPeriod, true);

  return (
    <div className="owner">
      <PageHeader
        title={`${COMPANY.shortName}: the last 12 months`}
        lede="A simple view for the business owner. Your advisor prepares everything on this page and walks through it with you."
      />

      <section className="card owner-story" aria-label="Summary in plain language">
        <Basis kind="data">
          Calculated from demo records, {periodLabel(months[0].period)} to {periodLabel(months[11].period)}
        </Basis>
        <p>
          You brought in <strong>{usd(s.revenue)}</strong>. That is {pctChange(Math.abs(revenueChange)).replace('+', '')} {revenueChange >= 0 ? 'more' : 'less'} than the 12 months before.
        </p>
        <p>
          Out of every dollar, about <strong>{cents(s.directCost)} cents</strong> went to doing the work and <strong>{cents(s.opex)} cents</strong> to running the company. Before taxes, <strong>{usd(s.pretaxResult)}</strong> was left.
        </p>
        <p>
          At the end of {last} you had <strong>{usd(s.cashEnd)}</strong> in the bank and customers owed you <strong>{usd(s.arEnd)}</strong>.
        </p>
        {lossMonths.length > 0 && (
          <p>
            {lossMonths.length === 1 ? 'One month' : `${lossMonths.length} months`} cost more to run than {lossMonths.length === 1 ? 'it' : 'they'} brought in: {lossMonths.map((r) => periodLabel(r.period, true)).join(', ')}.
          </p>
        )}
      </section>

      <div className="grid grid-2">
        <ChartCard title="What you billed each month" table={{ columns: ['Month', 'Revenue'], rows: monthRows(months, (r) => [usd(r.totalRevenue)]) }}>
          <CartesianChart
            mode="columns"
            height={240}
            labels={labelsOf(months)}
            tick={(i) => periodShort(months[i].period)}
            series={[{ key: 'rev', label: 'Revenue', color: PRIMARY, values: months.map((r) => r.totalRevenue) }]}
            format={usd}
            axisFormat={usdAxis}
            ariaLabel="Columns of monthly revenue for the last twelve months"
          />
        </ChartCard>
        <ChartCard title="Where each dollar went">
          <SegmentedBar
            ariaLabel="Split of revenue into costs and what was left before taxes"
            format={usd}
            segments={[
              { label: 'Doing the work', value: s.directCost, color: '#0d366b' },
              { label: 'Running the company', value: s.opex, color: '#3987e5' },
              { label: 'Loan interest', value: s.interest, color: '#c2cbc8', darkText: true },
              { label: 'Left before taxes', value: s.pretaxResult, color: '#1f9e84' },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid grid-2">
        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">What we are working on together</h3>
            <Basis kind="illustrative" />
          </div>
          <ul className="owner-actions">
            {RECOMMENDATIONS.map((rec) => {
              const status = actionStatus[rec.id] ?? rec.defaultStatus;
              return (
                <li key={rec.id}>
                  <span>{rec.title}</span>
                  <span className={`status status-${status === 'done' ? 'good' : status === 'in-progress' ? 'neutral' : 'warning'}`}>{STATUS_LABEL[status]}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="stack">
          <section className="card panel">
            <div className="panel-head">
              <h3 className="chart-card-title">Your next meeting</h3>
              <Basis kind="illustrative" />
            </div>
            <p className="owner-meeting">
              We will go through the <strong>{quarters[quarters.length - 1].label}</strong> review together. Bring your questions. There is nothing you need to prepare.
            </p>
          </section>
          <section className="card panel">
            <div className="panel-head">
              <h3 className="chart-card-title">Send us a document</h3>
              <Basis kind="illustrative" />
            </div>
            <div className="dropzone" aria-disabled="true">
              <Upload size={22} aria-hidden />
              <strong>Not active in this demo</strong>
              <span>The planned portal would let you drop in a file or photograph a page when it suits you. This static page cannot receive files.</span>
            </div>
          </section>
        </div>
      </div>

      <section className="card panel">
        <div className="panel-head">
          <h3 className="chart-card-title">The words we use</h3>
        </div>
        <dl className="glossary">
          {GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Callout title="About these numbers">
        They leave out taxes and depreciation, so "left before taxes" is not the same as take-home profit. Your advisor will explain what each figure does and does not include.
      </Callout>
    </div>
  );
}
