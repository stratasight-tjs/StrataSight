import { useEffect, useMemo, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { area as d3area, curveMonotoneX } from 'd3-shape';
import { RECORDS } from '../lib/dataset';
import { SERVICE_LINES, SERVICE_LINE_LABEL } from '../lib/types';
import { periodLabel, usd } from '../lib/format';
import { LINE_COLOR_DARK } from '../charts/palette';
import { useWidth } from '../charts/useSize';

/**
 * The hero: 46 months of the demo company's revenue drawn as strata.
 * The visitor moves a sight line across it to read what sits under the top line in any month.
 * Every figure comes from the bundled CSV.
 */
export function StrataHero({ children }: { children: ReactNode }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const n = RECORDS.length;
  const [active, setActive] = useState(n - 1);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const compact = width < 640;
  const height = compact ? 200 : Math.min(340, Math.max(240, width * 0.22));
  const top = 30;

  const geometry = useMemo(() => {
    const max = Math.max(...RECORDS.map((r) => r.totalRevenue)) * 1.06;
    const x = (i: number) => (i / (n - 1)) * width;
    const y = (v: number) => top + (1 - v / max) * (height - top);
    // cumulative[k][i] is the top of layer k at month i
    const cumulative: number[][] = [];
    SERVICE_LINES.forEach((key, k) => {
      cumulative.push(RECORDS.map((r, i) => (k === 0 ? 0 : cumulative[k - 1][i]) + r.revenue[key]));
    });
    const paths = SERVICE_LINES.map((key, k) => {
      const lower = k === 0 ? RECORDS.map(() => 0) : cumulative[k - 1];
      const gen = d3area<number>()
        .x((_, i) => x(i))
        .y0((_, i) => y(lower[i]))
        .y1((v) => y(v))
        .curve(curveMonotoneX);
      return { key, d: gen(cumulative[k]) ?? '' };
    });
    return { x, y, cumulative, paths };
  }, [width, height, n]);

  const record = RECORDS[active];
  const sightX = geometry.x(active);

  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const index = Math.round(((event.clientX - bounds.left) / bounds.width) * (n - 1));
    setActive(Math.max(0, Math.min(n - 1, index)));
  };

  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setActive((i) => Math.max(0, Math.min(n - 1, i + (event.key === 'ArrowRight' ? 1 : -1))));
    }
  };

  return (
    <>
      <div className="hero-grid">
        {children}
        <div className="strata-readout" role="status">
          <div className="strata-readout-head">
            <span>{periodLabel(record.period, true)}</span>
            <span className="demo-tag">Demo data</span>
          </div>
          <div className="strata-topline">
            <span>Top line</span>
            <strong>{usd(record.totalRevenue)}</strong>
          </div>
          <ul>
            {[...SERVICE_LINES].reverse().map((key) => (
              <li key={key}>
                <span className="legend-key legend-key-rect" style={{ background: LINE_COLOR_DARK[key] }} />
                <span>{SERVICE_LINE_LABEL[key]}</span>
                <span className="tabular">{usd(record.revenue[key])}</span>
              </li>
            ))}
          </ul>
          <p className="strata-hint">Move across the chart to read any month. Aster Ridge Property Services is a fictional company.</p>
        </div>
      </div>

      <figure className="strata" aria-label="Interactive chart of demonstration data">
      <div className="strata-plot" ref={ref} style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className={revealed ? 'is-revealed' : ''}
            role="img"
            tabIndex={0}
            aria-label={`Monthly revenue of a fictional landscaping company by service line, January 2023 to October 2026. Selected month: ${periodLabel(record.period, true)}, total ${usd(record.totalRevenue)}. Use the left and right arrow keys to move between months.`}
            onPointerMove={onMove}
            onPointerDown={onMove}
            onKeyDown={onKey}
            style={{ touchAction: 'pan-y' }}
          >
            <defs>
              <clipPath id="strata-reveal">
                <rect className="strata-reveal-rect" x="0" y="0" width={width} height={height} />
              </clipPath>
            </defs>

            {RECORDS.map((r, i) =>
              r.month === 1 ? (
                <g key={r.period}>
                  <line x1={geometry.x(i)} x2={geometry.x(i)} y1={top - 8} y2={height} className="strata-year-rule" />
                  <text x={geometry.x(i) + 8} y={top - 12} className="strata-year">
                    {r.year}
                  </text>
                </g>
              ) : null,
            )}

            <g clipPath="url(#strata-reveal)">
              {geometry.paths.map((p) => (
                <path key={p.key} d={p.d} style={{ fill: LINE_COLOR_DARK[p.key] }} className="strata-layer" />
              ))}
            </g>

            <g className="strata-sight">
              <line x1={sightX} x2={sightX} y1={top - 16} y2={height} />
              {geometry.cumulative.map((layer, k) =>
                RECORDS[active].revenue[SERVICE_LINES[k]] > 0 ? (
                  <circle key={k} cx={sightX} cy={geometry.y(layer[active])} r={3.5} />
                ) : null,
              )}
            </g>
          </svg>
        )}
      </div>
      <figcaption className="visually-hidden">
        Move across the chart to read any month. Aster Ridge Property Services is a fictional company used for demonstration.
      </figcaption>
      </figure>
    </>
  );
}
