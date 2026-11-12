import { useState } from 'react';
import { Check, CircleCheck, Flag, RotateCcw } from 'lucide-react';
import { RECORDS } from '../../lib/dataset';
import { isFlagged, ROW_CHECKS, runChecks } from '../../lib/checks';
import { monthShort, num, periodLabel, usd } from '../../lib/format';
import type { MonthRecord } from '../../lib/types';
import { ChartCard } from '../../charts/ChartCard';
import { HBars } from '../../charts/figures';
import { useDemo } from '../state';
import { Basis, Callout, PageHeader } from '../ui';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

type Status = 'approved' | 'flagged' | 'reviewed';

export function Review() {
  const { reviewed, toggleReviewed } = useDemo();
  const flagged = RECORDS.filter(isFlagged);
  const open = flagged.filter((r) => !reviewed.has(r.period));
  const [selected, setSelected] = useState<string>((open[0] ?? flagged[0] ?? RECORDS[RECORDS.length - 1]).period);
  const record = RECORDS.find((r) => r.period === selected)!;
  const checks = runChecks(RECORDS);
  const years = [...new Set(RECORDS.map((r) => r.year))];

  const statusOf = (r: MonthRecord): Status => (isFlagged(r) ? (reviewed.has(r.period) ? 'reviewed' : 'flagged') : 'approved');
  const sources = [...new Set(RECORDS.map((r) => r.sourceType))].map((source) => ({
    label: source.replace(' (synthetic)', ''),
    value: RECORDS.filter((r) => r.sourceType === source).length,
  }));
  const rowChecksPassed = ROW_CHECKS.filter((c) => c.test(record)).length;

  return (
    <>
      <PageHeader
        title="Data review"
        lede="Before a figure reaches a client meeting, an advisor confirms where it came from. Months that need a second look wait here."
      />

      <div className="stat-grid stat-grid-4">
        <div className="card stat">
          <div className="stat-label">Months on record</div>
          <div className="stat-value">{RECORDS.length}</div>
          <div className="stat-note">
            {periodLabel(RECORDS[0].period)} to {periodLabel(RECORDS[RECORDS.length - 1].period)}
          </div>
        </div>
        <div className="card stat">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{RECORDS.length - flagged.length}</div>
          <div className="stat-note">Status in the sample file</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Waiting for review</div>
          <div className="stat-value">{open.length}</div>
          <div className="stat-note">{flagged.length} flagged in the sample file</div>
        </div>
        <div className="card stat">
          <div className="stat-label">Arithmetic checks passing</div>
          <div className="stat-value">
            {checks.filter((c) => c.failures.length === 0).length} of {checks.length}
          </div>
          <div className="stat-note">Run in your browser on every row</div>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">Coverage map</h3>
            <Basis kind="data">Status from the sample file</Basis>
          </div>
          <p className="panel-sub">Every month on record. Select a month to see its source and status.</p>
          <div className="coverage" role="group" aria-label="Review status by month">
            <span />
            {MONTHS.map((m) => (
              <span key={m} className="coverage-col">
                {monthShort(m).slice(0, 1)}
                <span className="visually-hidden">{monthShort(m).slice(1)}</span>
              </span>
            ))}
            {years.map((year) => (
              <div key={year} style={{ display: 'contents' }}>
                <span className="coverage-row">{year}</span>
                {MONTHS.map((m) => {
                  const r = RECORDS.find((x) => x.year === year && x.month === m);
                  if (!r) return <span key={m} className="coverage-cell is-empty" aria-label={`${monthShort(m)} ${year}: no data yet`} />;
                  const status = statusOf(r);
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`coverage-cell is-${status} ${selected === r.period ? 'is-selected' : ''}`}
                      aria-pressed={selected === r.period}
                      aria-label={`${periodLabel(r.period)}: ${status === 'approved' ? 'approved' : status === 'flagged' ? 'flagged for review' : 'reviewed in this session'}`}
                      onClick={() => setSelected(r.period)}
                    >
                      {status === 'flagged' && <Flag size={12} aria-hidden />}
                      {status === 'reviewed' && <Check size={13} strokeWidth={3} aria-hidden />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <ul className="coverage-legend">
            <li>
              <span className="coverage-cell is-approved" /> Approved
            </li>
            <li>
              <span className="coverage-cell is-flagged">
                <Flag size={11} aria-hidden />
              </span>{' '}
              Flagged for review
            </li>
            <li>
              <span className="coverage-cell is-reviewed">
                <Check size={12} strokeWidth={3} aria-hidden />
              </span>{' '}
              Reviewed in this session
            </li>
            <li>
              <span className="coverage-cell is-empty" /> No data yet
            </li>
          </ul>
        </section>

        <section className="card panel" aria-live="polite">
          <div className="panel-head">
            <h3 className="chart-card-title">{periodLabel(record.period, true)}</h3>
            <StatusChip status={statusOf(record)} />
          </div>
          <dl className="facts">
            <div>
              <dt>Source</dt>
              <dd>{record.sourceType}</dd>
            </div>
            <div>
              <dt>Status in file</dt>
              <dd>{record.reviewStatus}</dd>
            </div>
            <div>
              <dt>Reviewer note</dt>
              <dd>{record.reviewNote || 'None'}</dd>
            </div>
            <div>
              <dt>Arithmetic checks</dt>
              <dd>
                {rowChecksPassed} of {ROW_CHECKS.length} pass for this month
              </dd>
            </div>
          </dl>
          <table className="mini-table">
            <tbody>
              <tr>
                <th scope="row">Revenue</th>
                <td>{usd(record.totalRevenue)}</td>
              </tr>
              <tr>
                <th scope="row">Direct costs</th>
                <td>{usd(record.totalDirectCost)}</td>
              </tr>
              <tr>
                <th scope="row">of which subcontractors</th>
                <td>{usd(record.directCosts.subcontractors)}</td>
              </tr>
              <tr>
                <th scope="row">Operating expenses</th>
                <td>{usd(record.totalOpex)}</td>
              </tr>
              <tr>
                <th scope="row">Operating profit</th>
                <td>{usd(record.operatingProfit)}</td>
              </tr>
              <tr>
                <th scope="row">Receivables at month end</th>
                <td>{usd(record.arEnd)}</td>
              </tr>
            </tbody>
          </table>
          {isFlagged(record) ? (
            <div className="panel-actions">
              <button type="button" className="btn btn-solid btn-sm" onClick={() => toggleReviewed(record.period)}>
                {reviewed.has(record.period) ? (
                  <>
                    <RotateCcw size={14} aria-hidden /> Reopen
                  </>
                ) : (
                  <>
                    <Check size={14} aria-hidden /> Mark reviewed
                  </>
                )}
              </button>
              <span>Changes here last only until you reload the page.</span>
            </div>
          ) : (
            <p className="panel-sub">This month is approved in the sample file, so there is nothing to act on.</p>
          )}
        </section>
      </div>

      <section className="card panel">
        <div className="panel-head">
          <h3 className="chart-card-title">Review queue</h3>
          <Basis kind="data">Flags and notes from the sample file</Basis>
        </div>
        <p className="panel-sub">These flags are simulated to show the workflow. They are not real concerns about a real business.</p>
        <ul className="queue">
          {flagged.map((r) => (
            <li key={r.period}>
              <StatusChip status={statusOf(r)} />
              <div>
                <strong>{periodLabel(r.period, true)}</strong>
                <p>{r.reviewNote}</p>
                <span>{r.sourceType}</span>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(r.period)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-2-1">
        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">Arithmetic checks</h3>
            <Basis kind="data">Run live on all {RECORDS.length} rows</Basis>
          </div>
          <ul className="checks">
            {checks.map((c) => (
              <li key={c.id}>
                <CircleCheck size={17} aria-hidden className={c.failures.length === 0 ? 'is-pass' : 'is-fail'} />
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.detail}</span>
                </div>
                <span className="tabular">
                  {num(c.passed)} of {num(c.total)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <ChartCard title="Where the figures came from" subtitle="Months by source type.">
          <HBars rows={sources} format={(v) => `${v} months`} wideLabels />
        </ChartCard>
      </div>

      <Callout title="What a production version adds" tone="caution">
        This static demo reads one file and keeps nothing. A real workspace would record the exact uploaded document behind each figure, the import batch, every edit and who approved it, with access controls and an audit log. None of that is demonstrated here.
      </Callout>
    </>
  );
}

function StatusChip({ status }: { status: Status }) {
  if (status === 'flagged')
    return (
      <span className="status status-warning">
        <Flag size={12} aria-hidden /> Flagged
      </span>
    );
  if (status === 'reviewed')
    return (
      <span className="status status-good">
        <Check size={12} strokeWidth={3} aria-hidden /> Reviewed
      </span>
    );
  return (
    <span className="status status-neutral">
      <CircleCheck size={12} aria-hidden /> Approved
    </span>
  );
}
