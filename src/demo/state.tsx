import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { RECORDS } from '../lib/dataset';
import { buildPresets, sliceRange, type Preset, type Range } from '../lib/periods';
import { priorYearSlice, summarize, type PeriodSummary } from '../lib/metrics';
import type { MonthRecord } from '../lib/types';

/** Where a recommendation stands. The owner accepts or declines a proposal; the advisor moves accepted work along. */
export type ActionStatus = 'proposed' | 'accepted' | 'declined' | 'in-progress' | 'done';

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
      actionStatus,
      setActionStatus: (id, status) => setStatus((current) => ({ ...current, [id]: status })),
    };
  }, [presets, range, actionStatus]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo(): DemoState {
  const state = useContext(Context);
  if (!state) throw new Error('useDemo must be used inside DemoProvider');
  return state;
}
