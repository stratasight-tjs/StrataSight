import { useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as d3area, line as d3line } from 'd3-shape';
import { useWidth } from './useSize';

export interface Series {
  key: string;
  label: string;
  color: string;
  values: (number | null)[];
  /** Stroke width for line mode. Default 2. */
  width?: number;
}

interface Props {
  /** line: one line per series. stacked: stacked columns. columns: one series of columns from a zero baseline. */
  mode: 'line' | 'stacked' | 'columns';
  /** Full label for each x position, shown in the tooltip. */
  labels: string[];
  /** Axis label for an x position, or null for no tick. Dense ticks are thinned automatically. */
  tick: (index: number) => string | null;
  series: Series[];
  format: (value: number) => string;
  axisFormat?: (value: number) => string;
  height?: number;
  /** Force the y domain. Line charts default to a padded data extent, bars always include zero. */
  domain?: [number, number];
  /** Line mode: wash under the first series. */
  area?: boolean;
  /** Stacked mode: label for the total row in the tooltip. */
  totalLabel?: string;
  /** Columns mode: color by value (for example, positive and negative). */
  columnColor?: (value: number) => string;
  /** Line mode: label each line at its final point. */
  endLabels?: boolean;
  /** Small markers on the x axis, for example months flagged for review. */
  marks?: { index: number; label: string }[];
  ariaLabel: string;
}

const MARGIN = { top: 12, right: 12, bottom: 28, left: 46 };

export function CartesianChart({
  mode,
  labels,
  tick,
  series,
  format,
  axisFormat = format,
  height = 260,
  domain,
  area,
  totalLabel,
  columnColor,
  endLabels,
  marks,
  ariaLabel,
}: Props) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const n = labels.length;

  const layout = useMemo(() => {
    const right = endLabels ? 64 : MARGIN.right;
    const innerW = Math.max(10, width - MARGIN.left - right);
    const innerH = height - MARGIN.top - MARGIN.bottom;
    const step = innerW / Math.max(1, n);
    const x = (i: number) => MARGIN.left + step * (i + 0.5);

    let lo = 0;
    let hi = 0;
    if (mode === 'stacked') {
      for (let i = 0; i < n; i++) {
        hi = Math.max(hi, series.reduce((t, s) => t + Math.max(0, s.values[i] ?? 0), 0));
      }
    } else {
      const all = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
      lo = Math.min(...all);
      hi = Math.max(...all);
      if (mode === 'columns') {
        lo = Math.min(0, lo);
        hi = Math.max(0, hi);
      } else if (!domain) {
        const pad = (hi - lo || Math.abs(hi) || 1) * 0.12;
        lo -= pad;
        hi += pad;
      }
    }
    const y = scaleLinear()
      .domain(domain ?? [lo, hi])
      .nice(5)
      .range([MARGIN.top + innerH, MARGIN.top]);
    return { innerW, innerH, step, x, y, right };
  }, [width, height, n, series, mode, domain, endLabels]);

  const { innerW, innerH, step, x, y } = layout;
  const yTicks = y.ticks(5);
  const zeroY = y(Math.max(y.domain()[0], Math.min(0, y.domain()[1])));
  const barW = Math.max(1.5, Math.min(24, step - 2));

  // Thin x ticks so labels never collide.
  const xTicks = useMemo(() => {
    const out: { index: number; label: string }[] = [];
    let lastX = -Infinity;
    for (let i = 0; i < n; i++) {
      const label = tick(i);
      if (label === null) continue;
      const px = x(i);
      if (px - lastX < Math.max(34, label.length * 6.5 + 10)) continue;
      out.push({ index: i, label });
      lastX = px;
    }
    return out;
  }, [n, tick, x]);

  const onMove = (event: PointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - bounds.left) / bounds.width) * n);
    setActive(Math.max(0, Math.min(n - 1, index)));
  };

  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      setActive((current) => Math.max(0, Math.min(n - 1, (current ?? n - 1) + delta)));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(n - 1);
    } else if (event.key === 'Escape') {
      setActive(null);
    }
  };

  const activeTotal =
    active !== null ? series.reduce((t, s) => t + (s.values[active] ?? 0), 0) : 0;
  const tooltipOnLeft = active !== null && x(active) > MARGIN.left + innerW * 0.55;

  return (
    <div className="chart" ref={ref} style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${ariaLabel}. Use the left and right arrow keys to read values.`}
          tabIndex={0}
          onKeyDown={onKey}
          onFocus={() => setActive((current) => current ?? n - 1)}
          onBlur={() => setActive(null)}
        >
          {/* Grid and y axis */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + innerW}
                y1={y(t)}
                y2={y(t)}
                className={t === 0 ? 'chart-baseline' : 'chart-grid'}
              />
              <text x={MARGIN.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="chart-tick">
                {axisFormat(t)}
              </text>
            </g>
          ))}

          {/* X axis */}
          {xTicks.map((t) => (
            <text key={t.index} x={x(t.index)} y={height - 9} textAnchor="middle" className="chart-tick">
              {t.label}
            </text>
          ))}
          {marks?.map((m) => (
            <g key={m.index}>
              <title>{m.label}</title>
              <path
                d={`M${x(m.index) - 4},${MARGIN.top + innerH + 8} l4,-6 l4,6 z`}
                style={{ fill: 'var(--warning)' }}
              />
            </g>
          ))}

          {/* Active column highlight */}
          {active !== null && mode !== 'line' && (
            <rect
              x={x(active) - step / 2}
              y={MARGIN.top}
              width={step}
              height={innerH}
              className="chart-band"
            />
          )}

          {/* Marks */}
          {mode === 'stacked' &&
            labels.map((_, i) => {
              let base = 0;
              const visible = series.filter((s) => (s.values[i] ?? 0) > 0);
              return (
                <g key={i}>
                  {visible.map((s, index) => {
                    const value = s.values[i] ?? 0;
                    const y0 = y(base);
                    const y1 = y(base + value);
                    base += value;
                    const isTop = index === visible.length - 1;
                    const gap = isTop ? 0 : 2;
                    const h = Math.max(0, y0 - y1 - gap);
                    if (h <= 0) return null;
                    const r = isTop ? Math.min(3, barW / 2, h) : 0;
                    return (
                      <path
                        key={s.key}
                        d={roundedTop(x(i) - barW / 2, y1 + gap, barW, h, r)}
                        style={{ fill: s.color }}
                        opacity={active === null || active === i ? 1 : 0.55}
                      />
                    );
                  })}
                </g>
              );
            })}

          {mode === 'columns' &&
            series[0].values.map((value, i) => {
              if (value === null) return null;
              const top = Math.min(y(value), zeroY);
              const h = Math.max(1, Math.abs(y(value) - zeroY));
              const r = Math.min(3, barW / 2, h);
              const fill = columnColor ? columnColor(value) : series[0].color;
              return (
                <path
                  key={i}
                  d={
                    value >= 0
                      ? roundedTop(x(i) - barW / 2, top, barW, h, r)
                      : roundedBottom(x(i) - barW / 2, top, barW, h, r)
                  }
                  style={{ fill }}
                  opacity={active === null || active === i ? 1 : 0.55}
                />
              );
            })}

          {mode === 'line' && (
            <>
              {area && (
                <path
                  d={
                    d3area<number | null>()
                      .defined((v) => v !== null)
                      .x((_, i) => x(i))
                      .y0(y(y.domain()[0]))
                      .y1((v) => y(v ?? 0))(series[0].values) ?? undefined
                  }
                  style={{ fill: series[0].color }}
                  opacity={0.1}
                />
              )}
              {series.map((s) => (
                <path
                  key={s.key}
                  d={
                    d3line<number | null>()
                      .defined((v) => v !== null)
                      .x((_, i) => x(i))
                      .y((v) => y(v ?? 0))(s.values) ?? undefined
                  }
                  fill="none"
                  style={{ stroke: s.color }}
                  strokeWidth={s.width ?? 2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              {endLabels &&
                placeEndLabels(series, x, y).map((l) => (
                  <g key={l.key}>
                    <circle cx={l.x} cy={l.y} r={4} style={{ fill: l.color }} className="chart-dot" />
                    <text x={l.x + 9} y={l.labelY} dy="0.32em" className="chart-end-label">
                      {l.label}
                    </text>
                  </g>
                ))}
            </>
          )}

          {/* Crosshair and active dots */}
          {active !== null && mode === 'line' && (
            <>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={MARGIN.top}
                y2={MARGIN.top + innerH}
                className="chart-crosshair"
              />
              {series.map((s) => {
                const value = s.values[active];
                if (value === null || value === undefined) return null;
                return (
                  <circle
                    key={s.key}
                    cx={x(active)}
                    cy={y(value)}
                    r={4.5}
                    style={{ fill: s.color }}
                    className="chart-dot"
                  />
                );
              })}
            </>
          )}

          {/* Pointer capture: aim at a date, never at a mark. */}
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={innerW}
            height={innerH + MARGIN.bottom}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setActive(null)}
            style={{ touchAction: 'pan-y' }}
          />
        </svg>
      )}

      {active !== null && width > 0 && (
        <div
          className={`chart-tooltip ${tooltipOnLeft ? 'is-left' : ''}`}
          style={{ left: x(active), top: MARGIN.top }}
          role="status"
        >
          <div className="chart-tooltip-head">{labels[active]}</div>
          {(mode === 'stacked' ? [...series].reverse() : series).map((s) => {
            const value = s.values[active];
            if (value === null || value === undefined) return null;
            const color = mode === 'columns' && columnColor ? columnColor(value) : s.color;
            return (
              <div className="chart-tooltip-row" key={s.key}>
                <span className="chart-tooltip-key" style={{ background: color }} />
                <strong>{format(value)}</strong>
                <span>{s.label}</span>
              </div>
            );
          })}
          {mode === 'stacked' && totalLabel && (
            <div className="chart-tooltip-row chart-tooltip-total">
              <span className="chart-tooltip-key" />
              <strong>{format(activeTotal)}</strong>
              <span>{totalLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function roundedTop(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

function roundedBottom(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x},${y} V${y + h - r} Q${x},${y + h} ${x + r},${y + h} H${x + w - r} Q${x + w},${y + h} ${x + w},${y + h - r} V${y} Z`;
}

/** End-of-line labels, nudged apart only when they would overlap. */
function placeEndLabels(series: Series[], x: (i: number) => number, y: (v: number) => number) {
  const items = series
    .map((s) => {
      let last = s.values.length - 1;
      while (last >= 0 && s.values[last] === null) last--;
      if (last < 0) return null;
      const py = y(s.values[last] as number);
      return { key: s.key, label: s.label, color: s.color, x: x(last), y: py, labelY: py };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < items.length; i++) {
    if (Math.abs(items[i].x - items[i - 1].x) < 60 && items[i].labelY - items[i - 1].labelY < 13) {
      items[i].labelY = items[i - 1].labelY + 13;
    }
  }
  return items;
}
