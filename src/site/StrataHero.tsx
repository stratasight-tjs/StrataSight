import { useEffect, useReducer, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { area as d3area, curveMonotoneX, line as d3line } from 'd3-shape';
import { useWidth } from '../charts/useSize';

/** What each layer stands for, from the surface down. A buyer reads a company in roughly this order. */
const LAYERS = [
  { name: 'Revenue', note: 'How much comes in, and how steadily' },
  { name: 'Recurring work', note: 'How much of next year is already sold' },
  { name: 'Margins', note: 'What is left after the work is done' },
  { name: 'Customer mix', note: 'How much depends on a few accounts' },
  { name: 'Cash', note: 'How quickly sales turn into money in the bank' },
  { name: 'Team depth', note: 'Who can run it day to day' },
  { name: 'Owner dependence', note: 'How much still runs through you' },
];
const COUNT = LAYERS.length;
const SAMPLES = 64;
const TS = Array.from({ length: SAMPLES + 1 }, (_, i) => i / SAMPLES);
/** How much the layer under the pointer thickens, and how much every layer opens up over the first screen of scroll. */
const HOVER_GROWTH = 1.3;
const SCROLL_GROWTH = 0.34;

/**
 * Top edge of layer k at horizontal position t (0 to 1), as a fraction of the plot height.
 * The layers rise and thicken toward the right. This is a drawing, not data.
 * k = COUNT is the floor under the last layer, just below the plot.
 */
function profile(k: number, t: number) {
  if (k === COUNT) return 1.08;
  const depth = k / (COUNT - 1);
  const base = 0.46 + depth * 0.46;
  const rise = 0.3 * t * t * (1 - depth * 0.55);
  const fold = 0.034 * Math.sin(t * 5.2 + k * 0.55) + 0.018 * Math.sin(t * 11.3 + k * 1.7);
  return base - rise - fold * (1 - depth * 0.4);
}

interface Motion {
  /** 0 to 1 per layer: how far it has opened toward the pointer. */
  open: number[];
  /** Pointer position across the width, 0 to 1. */
  x: number;
  /** Scroll progress through the first screen, 0 to 1. */
  scroll: number;
}

/** The y position of every layer edge (COUNT + 1 of them) at horizontal position t. */
function edgesAt(t: number, height: number, m: Motion) {
  const distance = (t - m.x) / 0.16;
  const near = 0.35 + 0.65 * Math.exp(-0.5 * distance * distance);
  const thickness: number[] = [];
  let extra = 0;
  for (let k = 0; k < COUNT; k++) {
    const rest = height * (profile(k + 1, t) - profile(k, t));
    const grown = rest * (1 + SCROLL_GROWTH * m.scroll) * (1 + HOVER_GROWTH * m.open[k] * near);
    thickness.push(grown);
    extra += grown - rest;
  }
  // Most of the added thickness pushes upward, so the stack swells instead of sinking out of view.
  const edges = [height * profile(0, t) - extra * 0.6];
  for (let k = 0; k < COUNT; k++) edges.push(edges[k] + thickness[k]);
  return edges;
}

/**
 * The hero: layered strata that open up as the page scrolls and where the pointer rests.
 * The layer under the pointer thickens and names what it stands for. No data is shown.
 */
export function StrataHero({ children }: { children: ReactNode }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [revealed, setRevealed] = useState(false);
  const [, redraw] = useReducer((n: number) => n + 1, 0);
  const motion = useRef<Motion>({ open: LAYERS.map(() => 0), x: 0.7, scroll: 0 });
  const target = useRef({ layer: -1, x: 0.7, scroll: 0 });
  const frame = useRef(0);
  const reducedMotion = useRef(false);

  const compact = width < 640;
  const height = compact ? 210 : Math.round(Math.min(400, Math.max(280, width * 0.27)));
  // On wide screens the strata climb up behind the empty right side of the copy.
  const overlap = width >= 900 ? Math.round(height * 0.34) : 0;

  const tick = () => {
    const m = motion.current;
    const goal = target.current;
    const rate = reducedMotion.current ? 1 : 0.14;
    let moving = false;
    const ease = (from: number, to: number) => {
      const gap = to - from;
      if (Math.abs(gap) < 0.002) return to;
      moving = true;
      return from + gap * rate;
    };
    m.open = m.open.map((value, k) => ease(value, k === goal.layer ? 1 : 0));
    m.x = ease(m.x, goal.x);
    m.scroll = ease(m.scroll, goal.scroll);
    frame.current = moving ? requestAnimationFrame(tick) : 0;
    redraw();
  };
  const tickRef = useRef(tick);
  tickRef.current = tick;
  const wake = () => {
    if (!frame.current) frame.current = requestAnimationFrame(() => tickRef.current());
  };

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = requestAnimationFrame(() => setRevealed(true));
    const onScroll = () => {
      target.current.scroll = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.8)));
      wake();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(id);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const onPoint = (event: PointerEvent<HTMLDivElement>) => {
    const plot = ref.current;
    if (!plot || width === 0) return;
    const bounds = plot.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = event.clientY - bounds.top;
    const edges = edgesAt(t, height, motion.current);
    let layer = -1;
    for (let k = 0; k < COUNT; k++) if (y >= edges[k] && y < edges[k + 1]) layer = k;
    target.current.layer = layer;
    if (layer >= 0) target.current.x = t;
    wake();
  };

  const onLeave = (event: PointerEvent<HTMLDivElement>) => {
    // A touch keeps its layer open after the finger lifts. A mouse closes it on the way out.
    if (event.pointerType === 'mouse') {
      target.current.layer = -1;
      wake();
    }
  };

  const m = motion.current;
  const columns = TS.map((t) => edgesAt(t, height, m));
  const x = (i: number) => TS[i] * width;
  const edge = d3line<number>().curve(curveMonotoneX);
  const band = d3area<number>().curve(curveMonotoneX);
  const index = TS.map((_, i) => i);

  // Label for the open layer, centered in it near the pointer and kept clear of the page edges.
  const pad = compact ? 96 : 190;
  const labelX = Math.max(pad, Math.min(width - pad, m.x * width));
  const labelEdges = edgesAt(width > 0 ? labelX / width : 0, height, m);

  return (
    <div className="hero-stage" onPointerMove={onPoint} onPointerDown={onPoint} onPointerLeave={onLeave}>
      <div className="hero-grid">{children}</div>

      <div className="strata" ref={ref} style={{ height, marginTop: -overlap }} aria-hidden>
        {width > 0 && (
          <svg width={width} height={height} className={revealed ? 'is-revealed' : ''} focusable="false">
            <defs>
              <clipPath id="strata-reveal">
                <rect className="strata-reveal-rect" x="0" y={-height} width={width} height={height * 2} />
              </clipPath>
            </defs>

            <g clipPath="url(#strata-reveal)">
              {LAYERS.map((layer, k) => {
                const open = m.open[k];
                band.x((i) => x(i)).y1((i) => columns[i][k]).y0((i) => Math.min(columns[i][k + 1], height + 2));
                edge.x((i) => x(i)).y((i) => columns[i][k]);
                const middle = (labelEdges[k] + Math.min(labelEdges[k + 1], height)) / 2;
                return (
                  <g key={layer.name} className={open > 0.5 ? 'strata-band is-open' : 'strata-band'}>
                    <path d={band(index) ?? ''} className="strata-fill" style={{ opacity: 0.14 + k * 0.085 + open * 0.2 }} />
                    <path d={edge(index) ?? ''} className="strata-edge" style={{ opacity: 0.8 - k * 0.08 + open * 0.2 }} />
                    {open > 0.02 && (
                      <text x={labelX} y={middle} className="strata-label" style={{ opacity: open }}>
                        <tspan className="strata-label-name" x={labelX} dy={compact ? '0.35em' : '-0.4em'}>
                          {layer.name}
                        </tspan>
                        {!compact && (
                          <tspan x={labelX} dy="1.45em">
                            {layer.note}
                          </tspan>
                        )}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>
      <p className="visually-hidden">
        The drawing shows the layers a buyer looks through in a company: {LAYERS.map((layer) => layer.name.toLowerCase()).join(', ')}.
      </p>
    </div>
  );
}
