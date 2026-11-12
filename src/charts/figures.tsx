import { useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { sequential, sequentialNeedsLightText } from './palette';

/* ---------- Sparkline ---------- */

export function Sparkline({ values, color = 'var(--chart-muted)' }: { values: number[]; color?: string }) {
  const w = 96;
  const h = 28;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const px = (i: number) => 2 + (i / Math.max(1, values.length - 1)) * (w - 6);
  const py = (v: number) => h - 3 - ((v - lo) / span) * (h - 6);
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const last = values.length - 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="sparkline">
      <path d={d} fill="none" style={{ stroke: color }} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(last)} cy={py(values[last])} r={2.5} style={{ fill: 'var(--chart-primary)' }} />
    </svg>
  );
}

/* ---------- Stat tile ---------- */

export interface Delta {
  /** Already formatted, signed: "+13.8%" */
  text: string;
  direction: 'up' | 'down' | 'flat';
  /** Whether this direction is favorable for the business. */
  good: boolean | null;
  /** What the change is measured against. */
  versus: string;
}

interface StatProps {
  label: string;
  value: string;
  delta?: Delta | null;
  note?: ReactNode;
  trend?: number[];
}

export function StatTile({ label, value, delta, note, trend }: StatProps) {
  const Icon = delta?.direction === 'up' ? ArrowUpRight : delta?.direction === 'down' ? ArrowDownRight : Minus;
  const tone = delta?.good === null || !delta ? 'neutral' : delta.good ? 'good' : 'bad';
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-row">
        <div className="stat-value">{value}</div>
        {trend && trend.length > 1 && <Sparkline values={trend} />}
      </div>
      {delta ? (
        <div className={`stat-delta is-${tone}`}>
          <Icon size={14} aria-hidden />
          <span>
            <strong>{delta.text}</strong> {delta.versus}
          </span>
        </div>
      ) : (
        note && <div className="stat-note">{note}</div>
      )}
    </div>
  );
}

/* ---------- Ranked horizontal bars ---------- */

export interface BarRow {
  label: string;
  value: number;
  /** Secondary figure shown after the value, for example a share of the total. */
  hint?: string;
}

export function HBars({ rows, format, color = 'var(--chart-primary)', wideLabels = false }: { rows: BarRow[]; format: (v: number) => string; color?: string; wideLabels?: boolean }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className={`hbars ${wideLabels ? 'hbars-wide' : ''}`}>
      {rows.map((row) => (
        <li key={row.label} className="hbar">
          <span className="hbar-label">{row.label}</span>
          <span className="hbar-track">
            <span className="hbar-fill" style={{ width: `${(row.value / max) * 100}%`, background: color }} />
          </span>
          <span className="hbar-value tabular">
            {format(row.value)}
            {row.hint && <span className="hbar-hint">{row.hint}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Tall segmented bar: one whole split into parts ---------- */

export interface Segment {
  label: string;
  value: number;
  color: string;
  /** Use dark text inside this segment (for light fills). */
  darkText?: boolean;
}

export function SegmentedBar({ segments, format, ariaLabel }: { segments: Segment[]; format: (v: number) => string; ariaLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((t, s) => t + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);
  const description = visible.map((s) => `${s.label} ${format(s.value)} (${((s.value / total) * 100).toFixed(1)}%)`).join(', ');
  return (
    <div className="segbar-wrap">
      <div className="segbar" role="img" aria-label={`${ariaLabel}: ${description}`}>
        {visible.map((s, i) => {
          const share = s.value / total;
          return (
            <div
              key={s.label}
              className="segbar-part"
              style={{ flexGrow: s.value, background: s.color, color: s.darkText ? 'var(--ink)' : '#fff' }}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            >
              {share >= 0.07 && <span>{(share * 100).toFixed(0)}%</span>}
            </div>
          );
        })}
      </div>
      <ul className="segbar-legend">
        {visible.map((s, i) => (
          <li key={s.label} className={active === i ? 'is-active' : ''}>
            <span className="legend-key legend-key-rect" style={{ background: s.color }} />
            <span className="segbar-name">{s.label}</span>
            <span className="tabular segbar-figure">
              {format(s.value)}
              <span className="hbar-hint">{((s.value / total) * 100).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Heatmap: rows by columns, one hue ---------- */

interface HeatmapProps {
  rows: string[];
  columns: string[];
  /** values[row][column], null where there is no data. */
  values: (number | null)[][];
  format: (v: number) => string;
  cellLabel: (row: number, column: number) => string;
  ariaLabel: string;
}

export function Heatmap({ rows, columns, values, format, cellLabel, ariaLabel }: HeatmapProps) {
  const flat = values.flat().filter((v): v is number => v !== null);
  const lo = Math.min(...flat);
  const hi = Math.max(...flat);
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  return (
    <div className="heatmap" role="group" aria-label={ariaLabel}>
      <div className="heatmap-grid" style={{ gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, 1fr))` }}>
        <span />
        {columns.map((c) => (
          <span key={c} className="heatmap-col">
            {c}
          </span>
        ))}
        {rows.map((row, r) => (
          <div key={row} style={{ display: 'contents' }}>
            <span className="heatmap-row">{row}</span>
            {columns.map((_, c) => {
              const v = values[r][c];
              if (v === null) return <span key={c} className="heatmap-cell is-empty" aria-label={`${cellLabel(r, c)}: no data yet`} />;
              const t = (v - lo) / (hi - lo || 1);
              return (
                <button
                  key={c}
                  type="button"
                  className="heatmap-cell"
                  style={{ background: sequential(t), color: sequentialNeedsLightText(t) ? '#fff' : 'var(--ink)' }}
                  aria-label={`${cellLabel(r, c)}: ${format(v)}`}
                  onPointerEnter={() => setActive({ r, c })}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive({ r, c })}
                  onBlur={() => setActive(null)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="heatmap-foot">
        <div className="heatmap-scale" aria-hidden>
          <span>{format(lo)}</span>
          <span className="heatmap-ramp" />
          <span>{format(hi)}</span>
        </div>
        <div className="heatmap-readout" role="status">
          {active && values[active.r][active.c] !== null ? (
            <>
              <strong>{format(values[active.r][active.c] as number)}</strong> {cellLabel(active.r, active.c)}
            </>
          ) : (
            'Hover or focus a month to read its value'
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Funnel: ordered stages with the conversion between them ---------- */

export interface FunnelStage {
  label: string;
  value: number;
  /** Conversion from the previous stage, already formatted. */
  rate?: string;
  rateLabel?: string;
}

export function Funnel({ stages, format }: { stages: FunnelStage[]; format: (v: number) => string }) {
  const max = Math.max(...stages.map((s) => s.value), 1);
  const ramp = ['var(--ramp-1)', 'var(--ramp-2)', 'var(--ramp-3)', 'var(--ramp-4)'];
  return (
    <ol className="funnel">
      {stages.map((stage, i) => (
        <li key={stage.label}>
          {stage.rate && (
            <div className="funnel-rate">
              <strong>{stage.rate}</strong> {stage.rateLabel}
            </div>
          )}
          <div className="funnel-stage">
            <span className="funnel-label">{stage.label}</span>
            <span className="hbar-track">
              <span className="hbar-fill" style={{ width: `${(stage.value / max) * 100}%`, background: ramp[Math.min(i, ramp.length - 1)] }} />
            </span>
            <span className="hbar-value tabular">{format(stage.value)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
