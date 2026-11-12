import { useState } from 'react';
import { Flag } from 'lucide-react';
import { COMPANY, RECORDS } from '../../lib/dataset';
import { isFlagged } from '../../lib/checks';
import { change, completeQuarters, summarize, type PeriodSummary } from '../../lib/metrics';
import { pct, pctChange, periodLabel, ptsChange, usd } from '../../lib/format';
import { MEETING_AGENDA, MEETING_PROMPTS } from '../illustrative';
import { href } from '../router';
import { useDemo } from '../state';
import { Basis, PageHeader } from '../ui';

interface Row {
  label: string;
  current: string;
  prior: string;
  change: string;
  tone: 'up' | 'down' | 'none';
}

function buildRows(s: PeriodSummary, p: PeriodSummary | null): Row[] {
  const money = (label: string, pick: (x: PeriodSummary) => number, upIsGood: boolean | null = true): Row => {
    const c = p ? change(pick(s), pick(p)) : null;
    return {
      label,
      current: usd(pick(s)),
      prior: p ? usd(pick(p)) : 'n/a',
      change: c === null ? 'n/a' : pctChange(c),
      tone: c === null || upIsGood === null ? 'none' : c >= 0 === upIsGood ? 'up' : 'down',
    };
  };
  const share = (label: string, pick: (x: PeriodSummary) => number | null, upIsGood = true): Row => {
    const a = pick(s);
    const b = p ? pick(p) : null;
    const d = a !== null && b !== null ? a - b : null;
    return {
      label,
      current: a === null ? 'n/a' : pct(a),
      prior: b === null ? 'n/a' : pct(b),
      change: d === null ? 'n/a' : ptsChange(d),
      tone: d === null ? 'none' : d >= 0 === upIsGood ? 'up' : 'down',
    };
  };
  const hoursChange = p ? s.ownerHoursAvg - p.ownerHoursAvg : null;
  return [
    money('Revenue', (x) => x.revenue),
    share('Gross margin', (x) => x.grossMargin),
    money('Operating profit', (x) => x.operatingProfit),
    money('Cash at quarter end', (x) => x.cashEnd),
    money('Receivables at quarter end', (x) => x.arEnd, null),
    money('Backlog at quarter end', (x) => x.backlogEnd),
    share('Estimate acceptance rate', (x) => x.acceptanceRate),
    share('Jobs completed on time', (x) => x.onTimeRate),
    share('Labor utilization', (x) => x.utilization),
    {
      label: 'Owner hours in operations, weekly average',
      current: s.ownerHoursAvg.toFixed(1),
      prior: p ? p.ownerHoursAvg.toFixed(1) : 'n/a',
      change: hoursChange === null ? 'n/a' : `${hoursChange > 0 ? '+' : hoursChange < 0 ? '-' : ''}${Math.abs(hoursChange).toFixed(1)} hrs`,
      tone: hoursChange === null ? 'none' : hoursChange <= 0 ? 'up' : 'down',
    },
  ];
}

export function Meetings() {
  const { reviewed } = useDemo();
  const quarters = completeQuarters(RECORDS);
  const [key, setKey] = useState(quarters[quarters.length - 1].key);
  const quarter = quarters.find((q) => q.key === key)!;
  const priorQuarter = quarters.find((q) => q.year === quarter.year - 1 && q.quarter === quarter.quarter) ?? null;
  const s = summarize(quarter.records);
  const p = priorQuarter ? summarize(priorQuarter.records) : null;
  const rows = buildRows(s, p);
  const flags = quarter.records.filter(isFlagged);

  return (
    <>
      <PageHeader
        title="Meetings"
        lede="Each advisory meeting starts from a prepared brief: what changed, what needs a decision, and what to look at next."
      />

      <section className="card panel">
        <div className="panel-head">
          <h3 className="chart-card-title">Quarterly reviews</h3>
          <Basis kind="data">One brief per complete quarter on record</Basis>
        </div>
        <div className="quarters" role="group" aria-label="Choose a quarter">
          {quarters.map((q) => (
            <button key={q.key} type="button" className={`chip ${q.key === key ? 'is-selected' : ''}`} aria-pressed={q.key === key} onClick={() => setKey(q.key)}>
              {q.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-2-1">
        <section className="card panel brief">
          <div className="panel-head">
            <div>
              <h3 className="heading brief-title">
                {quarter.label} review brief
              </h3>
              <p className="panel-sub">
                {COMPANY.shortName}, {periodLabel(quarter.records[0].period)} to {periodLabel(quarter.records[2].period)}
                {priorQuarter ? `, compared with ${priorQuarter.label}` : '. No earlier year on record to compare with'}
              </p>
            </div>
            <Basis kind="data" />
          </div>
          <div className="table-scroll brief-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">{quarter.label}</th>
                  <th scope="col">{priorQuarter?.label ?? 'Year earlier'}</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.current}</td>
                    <td>{row.prior}</td>
                    <td className={row.tone === 'up' ? 'is-up' : row.tone === 'down' ? 'is-down' : ''}>{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="brief-sub">Review items in this quarter</h4>
          {flags.length > 0 ? (
            <ul className="brief-flags">
              {flags.map((r) => (
                <li key={r.period}>
                  <Flag size={14} aria-hidden />
                  <span>
                    <strong>{periodLabel(r.period)}</strong> {r.reviewNote} {reviewed.has(r.period) ? '(marked reviewed in this session)' : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="panel-sub">No months in this quarter are flagged in the sample file.</p>
          )}
          <a className="text-link" href={href('review')}>
            Open data review
          </a>
        </section>

        <div className="stack">
          <section className="card panel panel-advisor">
            <div className="panel-head">
              <h3 className="chart-card-title">Agenda</h3>
              <Basis kind="illustrative" />
            </div>
            <ol className="agenda">
              {MEETING_AGENDA.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="card panel panel-advisor">
            <div className="panel-head">
              <h3 className="chart-card-title">Questions for the owner</h3>
              <Basis kind="illustrative" />
            </div>
            <ul className="prompts">
              {MEETING_PROMPTS.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <a className="text-link" href={href('recommendations')}>
              Open recommendations
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
