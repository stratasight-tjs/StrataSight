import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { RECORDS } from '../lib/dataset';
import { buildPresets, sliceRange, type Preset, type Range } from '../lib/periods';
import { priorYearSlice, summarize, type PeriodSummary } from '../lib/metrics';
import type { MonthRecord } from '../lib/types';

export type ActionStatus = 'proposed' | 'in-progress' | 'done';

interface DemoState {
  presets: Preset[];
  range: Range;
  setRange: (range: Range) => void;
  /** Months inside the selected period. */
  months: MonthRecord[];
  summary: PeriodSummary;
  /** The same calendar months one year earlier, when the data has them all. */
  priorMonths: MonthRecord[] | null;
  priorSummary: PeriodSummary | null;

  /** Flagged periods the visitor has marked reviewed. Held in memory only. */
  reviewed: ReadonlySet<string>;
  toggleReviewed: (period: string) => void;

  actionStatus: Record<string, ActionStatus>;
  setActionStatus: (id: string, status: ActionStatus) => void;
}

const Context = createContext<DemoState | null>(null);

/**
 * All demo state lives in React memory. Nothing is written to storage or sent anywhere,
 * so a reload returns the demo to its starting point.
 */
export function DemoProvider({ children }: { children: ReactNode }) {
  const presets = useMemo(() => buildPresets(RECORDS), []);
  const [range, setRange] = useState<Range>(presets[0].range);
  const [reviewed, setReviewed] = useState<ReadonlySet<string>>(new Set());
  const [actionStatus, setStatus] = useState<Record<string, ActionStatus>>({});

  const value = useMemo<DemoState>(() => {
    const months = sliceRange(RECORDS, range);
    const priorMonths = priorYearSlice(RECORDS, months);
    return {
      presets,
      range,
      setRange,
      months,
      summary: summarize(months),
      priorMonths,
      priorSummary: priorMonths ? summarize(priorMonths) : null,
      reviewed,
      toggleReviewed: (period) =>
        setReviewed((current) => {
          const next = new Set(current);
          if (next.has(period)) next.delete(period);
          else next.add(period);
          return next;
        }),
      actionStatus,
      setActionStatus: (id, status) => setStatus((current) => ({ ...current, [id]: status })),
    };
  }, [presets, range, reviewed, actionStatus]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo(): DemoState {
  const state = useContext(Context);
  if (!state) throw new Error('useDemo must be used inside DemoProvider');
  return state;
}
