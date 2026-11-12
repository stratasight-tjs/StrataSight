import type { ReactNode } from 'react';
import { Calculator, Check, PencilLine } from 'lucide-react';
import { RECORDS } from '../lib/dataset';
import { periodLabel, pctChange, ptsChange } from '../lib/format';
import { rangeLabel, sameRange } from '../lib/periods';
import { change } from '../lib/metrics';
import type { Delta } from '../charts/figures';
import { useDemo } from './state';

/**
 * Every panel says where its content comes from:
 *  - "data": calculated in the browser from the demo CSV.
 *  - "illustrative": written to show how the product would work. Not derived from data, not real advice.
 */
export function Basis({ kind, children }: { kind: 'data' | 'illustrative'; children?: ReactNode }) {
  const Icon = kind === 'data' ? Calculator : PencilLine;
  return (
    <span className={`basis basis-${kind}`}>
      <Icon size={12} aria-hidden />
      {children ?? (kind === 'data' ? 'Calculated from demo records' : 'Illustrative, not from data')}
    </span>
  );
}

export function PageHeader({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        <h1 className="heading page-title">{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
      </div>
      {children}
    </header>
  );
}

export function SectionTitle({ title, note, basis }: { title: string; note?: ReactNode; basis?: 'data' | 'illustrative' }) {
  return (
    <div className="section-title-row">
      <h2 className="heading">{title}</h2>
      {basis && <Basis kind={basis} />}
      {note && <p>{note}</p>}
    </div>
  );
}

/** One filter row above everything it scopes: presets first, then a custom range. */
export function PeriodFilter() {
  const { presets, range, setRange } = useDemo();
  const custom = !presets.some((p) => sameRange(p.range, range));
  return (
    <div className="filter" role="group" aria-label="Reporting period">
      <div className="filter-presets">
        {presets.map((preset) => {
          const selected = sameRange(preset.range, range);
          return (
            <button
              key={preset.id}
              type="button"
              className={`chip ${selected ? 'is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => setRange(preset.range)}
            >
              {selected && <Check size={13} strokeWidth={3} aria-hidden />}
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className={`filter-custom ${custom ? 'is-active' : ''}`}>
        <label>
          <span>From</span>
          <select
            value={range.from}
            onChange={(e) => {
              const from = Number(e.target.value);
              setRange({ from, to: Math.max(from, range.to) });
            }}
          >
            {RECORDS.map((r) => (
              <option key={r.period} value={r.index}>
                {periodLabel(r.period)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>To</span>
          <select
            value={range.to}
            onChange={(e) => {
              const to = Number(e.target.value);
              setRange({ from: Math.min(range.from, to), to });
            }}
          >
            {RECORDS.map((r) => (
              <option key={r.period} value={r.index}>
                {periodLabel(r.period)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

/** States the active period and what it is compared with, so no delta is ambiguous. */
export function PeriodNote() {
  const { range, months, priorMonths } = useDemo();
  return (
    <p className="period-note">
      Showing <strong>{rangeLabel(RECORDS, range)}</strong> ({months.length} {months.length === 1 ? 'month' : 'months'}).{' '}
      {priorMonths
        ? `Changes compare with the same ${months.length === 1 ? 'month' : 'months'} one year earlier.`
        : 'The data has no matching months a year earlier for this period, so no changes are shown.'}
    </p>
  );
}

export const VERSUS = 'vs a year earlier';

/** Relative change as a stat-tile delta. `upIsGood` says which direction is favorable. */
export function deltaPct(current: number, prior: number | undefined | null, upIsGood = true): Delta | null {
  if (prior === undefined || prior === null) return null;
  const c = change(current, prior);
  if (c === null) return null;
  return {
    text: pctChange(c),
    direction: c > 0.0005 ? 'up' : c < -0.0005 ? 'down' : 'flat',
    good: Math.abs(c) < 0.0005 ? null : c > 0 === upIsGood,
    versus: VERSUS,
  };
}

/** Percentage-point change between two ratios. */
export function deltaPts(current: number | null, prior: number | null | undefined, upIsGood = true): Delta | null {
  if (current === null || prior === null || prior === undefined) return null;
  const d = current - prior;
  return {
    text: ptsChange(d),
    direction: d > 0.0005 ? 'up' : d < -0.0005 ? 'down' : 'flat',
    good: Math.abs(d) < 0.0005 ? null : d > 0 === upIsGood,
    versus: VERSUS,
  };
}

export function Callout({ title, children, tone = 'info' }: { title?: string; children: ReactNode; tone?: 'info' | 'caution' }) {
  return (
    <aside className={`callout callout-${tone}`}>
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}
