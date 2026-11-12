import { RECORDS } from '../../lib/dataset';
import { sum } from '../../lib/metrics';
import { monthLong, pct, usd } from '../../lib/format';
import { HBars, type BarRow } from '../../charts/figures';
import { NEGATIVE, PRIMARY } from '../../charts/palette';
import { yearly } from '../chartHelpers';
import { RECOMMENDATIONS, type Recommendation } from '../illustrative';
import { useDemo, type ActionStatus } from '../state';
import { Basis, Callout, PageHeader } from '../ui';

interface Measure {
  label: string;
  rows: BarRow[];
  format: (v: number) => string;
  color?: string;
}

/** The computed measure shown beside each illustrative recommendation. All values come from the CSV. */
function measureFor(kind: Recommendation['measure']): Measure {
  const years = yearly();
  switch (kind) {
    case 'recurringShare':
      return {
        label: 'Recurring contract revenue as a share of total revenue',
        rows: years.map((y) => ({ label: y.label, value: y.summary.recurringShare ?? 0 })),
        format: (v) => pct(v),
      };
    case 'ownerHours':
      return {
        label: 'Owner hours in operations, weekly average',
        rows: years.map((y) => ({ label: y.label, value: y.summary.ownerHoursAvg })),
        format: (v) => `${v.toFixed(1)} hrs`,
      };
    case 'utilization':
      return {
        label: 'Billable hours as a share of paid hours',
        rows: years.map((y) => ({ label: y.label, value: y.summary.utilization ?? 0 })),
        format: (v) => pct(v),
      };
    case 'topFiveShare':
      return {
        label: "Top five customers' share of revenue",
        rows: years.map((y) => ({ label: y.label, value: y.summary.topFiveShare ?? 0 })),
        format: (v) => pct(v),
      };
    case 'receivables': {
      // The calendar month in which receivables are highest on average, read in each year that has it.
      const byMonth = Array.from({ length: 12 }, (_, i) => RECORDS.filter((r) => r.month === i + 1));
      const peak = byMonth
        .map((records, i) => ({ month: i + 1, mean: sum(records, (r) => r.arEnd) / records.length }))
        .sort((a, b) => b.mean - a.mean)[0].month;
      return {
        label: `Receivables at the end of ${monthLong(peak)}, the month they run highest`,
        rows: RECORDS.filter((r) => r.month === peak).map((r) => ({ label: String(r.year), value: r.arEnd })),
        format: usd,
      };
    }
    case 'winterResult': {
      // Each winter is December plus the following January and February, when all three are on record.
      const winters = RECORDS.filter((r) => r.month === 12)
        .map((dec) => ({ dec, rest: RECORDS.filter((r) => r.year === dec.year + 1 && r.month <= 2) }))
        .filter((w) => w.rest.length === 2);
      return {
        label: 'Operating result for December through February',
        rows: winters.map((w) => ({
          label: `${w.dec.year} to ${w.dec.year + 1}`,
          value: Math.abs(sum([w.dec, ...w.rest], (r) => r.operatingProfit)),
        })),
        format: (v) => usd(-v),
        color: NEGATIVE,
      };
    }
  }
}

const STATUS_LABEL: Record<ActionStatus, string> = { proposed: 'Proposed', 'in-progress': 'In progress', done: 'Done' };

export function Recommendations() {
  const { actionStatus, setActionStatus } = useDemo();
  const statusOf = (r: Recommendation): ActionStatus => actionStatus[r.id] ?? r.defaultStatus;
  const counts = (Object.keys(STATUS_LABEL) as ActionStatus[]).map((s) => ({ s, n: RECOMMENDATIONS.filter((r) => statusOf(r) === s).length }));

  return (
    <>
      <PageHeader
        title="Recommendations"
        lede="Each recommendation is logged with the measure it is meant to move, so later meetings can look at what actually happened."
      />

      <Callout title="How to read this page">
        The recommendations and their statuses are written examples. The measure beside each one is calculated from the demo records. The demo does not claim that any recommendation caused a change in its measure.
      </Callout>

      <ul className="rec-counts">
        {counts.map(({ s, n }) => (
          <li key={s}>
            <strong>{n}</strong> {STATUS_LABEL[s].toLowerCase()}
          </li>
        ))}
      </ul>

      <ul className="recs">
        {RECOMMENDATIONS.map((rec) => {
          const measure = measureFor(rec.measure);
          const status = statusOf(rec);
          return (
            <li key={rec.id} className="card rec">
              <div className="rec-main">
                <div className="rec-tags">
                  <Basis kind="illustrative">Illustrative recommendation</Basis>
                </div>
                <h3 className="heading">{rec.title}</h3>
                <p className="rec-why">{rec.rationale}</p>
                <label className="rec-status">
                  <span>Status</span>
                  <select value={status} className={`is-${status}`} onChange={(e) => setActionStatus(rec.id, e.target.value as ActionStatus)}>
                    {(Object.keys(STATUS_LABEL) as ActionStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="rec-measure">
                <div className="rec-tags">
                  <Basis kind="data" />
                </div>
                <h4>{measure.label}</h4>
                <HBars rows={measure.rows} format={measure.format} color={measure.color ?? PRIMARY} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
