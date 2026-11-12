import { ArrowRight, CalendarCheck, Database, FileSearch, Plus } from 'lucide-react';
import { COMPANY, RECORDS } from '../../lib/dataset';
import { isFlagged } from '../../lib/checks';
import { completeQuarters, summarize, trailing } from '../../lib/metrics';
import { periodLabel, usdCompact } from '../../lib/format';
import { Sparkline } from '../../charts/figures';
import { href, type Route } from '../router';
import { useDemo } from '../state';
import { Basis, PageHeader } from '../ui';

const SEATS = 12;
const LIFECYCLE = ['Intake', 'Baseline', 'Ongoing advisory', 'Transition preparation'];
const CURRENT_STAGE = 2;

const MODELS: { name: string; detail: string; route: Route }[] = [
  { name: 'Revenue by service line', detail: 'Mix, seasonality, year over year', route: 'revenue' },
  { name: 'Direct cost and margin', detail: 'Gross and operating margin with consistent definitions', route: 'profitability' },
  { name: 'Cash and working capital', detail: 'Month-end snapshots, never summed', route: 'cash' },
  { name: 'Sales funnel', detail: 'Leads, estimates, acceptance', route: 'operations' },
  { name: 'Crew time and delivery', detail: 'Utilization and on-time completion', route: 'operations' },
  { name: 'Source and review trail', detail: 'Status for every month on record', route: 'review' },
];

export function Practice() {
  const { reviewed } = useDemo();
  const ttm = summarize(trailing(RECORDS, 12));
  const openFlags = RECORDS.filter((r) => isFlagged(r) && !reviewed.has(r.period)).length;
  const quarters = completeQuarters(RECORDS);
  const latestQuarter = quarters[quarters.length - 1];

  return (
    <>
      <PageHeader
        title="All clients"
        lede={`The platform is designed for a small advisory team looking after about a dozen businesses, each in its own workspace. This demo holds one fictional client and leaves the other seats empty.`}
      />

      <section aria-label="Client workspaces">
        <ul className="seats">
          <li className="card seat seat-filled">
            <div className="seat-head">
              <div>
                <h2 className="heading">{COMPANY.shortName}</h2>
                <p>
                  {COMPANY.industry}, {COMPANY.region}
                </p>
              </div>
              <span className="demo-tag">Fictional</span>
            </div>
            <ol className="lifecycle" aria-label="Engagement stage">
              {LIFECYCLE.map((stage, i) => (
                <li key={stage} className={i < CURRENT_STAGE ? 'is-past' : i === CURRENT_STAGE ? 'is-current' : ''} aria-current={i === CURRENT_STAGE ? 'step' : undefined}>
                  {stage}
                </li>
              ))}
            </ol>
            <dl className="seat-facts">
              <div>
                <dt>Revenue, last 12 months</dt>
                <dd>
                  {usdCompact(ttm.revenue)}
                  <Sparkline values={trailing(RECORDS, 12).map((r) => r.totalRevenue)} />
                </dd>
              </div>
              <div>
                <dt>Data loaded through</dt>
                <dd>{periodLabel(COMPANY.lastPeriod)}</dd>
              </div>
              <div>
                <dt>Months waiting for review</dt>
                <dd>{openFlags}</dd>
              </div>
            </dl>
            <div className="seat-foot">
              <Basis kind="data">Figures from demo records</Basis>
              <Basis kind="illustrative">Stage is illustrative</Basis>
              <a className="btn btn-solid btn-sm" href={href('overview')}>
                Open workspace
              </a>
            </div>
          </li>
          {Array.from({ length: SEATS - 1 }, (_, i) => (
            <li key={i} className="seat seat-open">
              <Plus size={16} aria-hidden />
              <span>Open seat</span>
            </li>
          ))}
        </ul>
        <p className="seats-note">
          {SEATS - 1} of {SEATS} seats are intentionally empty. The demo does not invent other clients or their figures.
        </p>
      </section>

      <div className="grid grid-2">
        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">This week</h3>
            <Basis kind="data" />
          </div>
          <ul className="todo">
            <li>
              <FileSearch size={18} aria-hidden />
              <div>
                <strong>{openFlags === 0 ? 'Review queue is clear' : `${openFlags} ${openFlags === 1 ? 'month is' : 'months are'} waiting for review`}</strong>
                <span>Flagged months should be cleared before figures go into a client meeting.</span>
              </div>
              <a href={href('review')} aria-label="Open data review">
                <ArrowRight size={16} aria-hidden />
              </a>
            </li>
            <li>
              <CalendarCheck size={18} aria-hidden />
              <div>
                <strong>{latestQuarter.label} review brief is ready</strong>
                <span>The most recent complete quarter on record, compared with the same quarter a year earlier.</span>
              </div>
              <a href={href('meetings')} aria-label="Open meetings">
                <ArrowRight size={16} aria-hidden />
              </a>
            </li>
            <li>
              <Database size={18} aria-hidden />
              <div>
                <strong>{periodLabel(COMPANY.lastPeriod, true)} is the latest month loaded</strong>
                <span>{RECORDS.length} consecutive months are on record for this client.</span>
              </div>
              <a href={href('onboarding')} aria-label="Open onboarding">
                <ArrowRight size={16} aria-hidden />
              </a>
            </li>
          </ul>
        </section>

        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">Reusable models</h3>
            <Basis kind="illustrative">Product direction</Basis>
          </div>
          <p className="panel-sub">
            Each client is loaded into the same set of model definitions, so a new engagement does not start from a blank spreadsheet. In this demo they are applied to one client.
          </p>
          <ul className="models">
            {MODELS.map((model) => (
              <li key={model.name}>
                <a href={href(model.route)}>
                  <strong>{model.name}</strong>
                  <span>{model.detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
