import type { ReactNode } from 'react';
import { RECORDS } from '../lib/dataset';
import { SERVICE_LINES, SERVICE_LINE_LABEL } from '../lib/types';
import { summarize, trailing } from '../lib/metrics';
import { pct, periodLabel, usd } from '../lib/format';
import { LINE_COLOR } from '../charts/palette';
import { SITE } from '../config/site';

/** A small, non-interactive trend line. The numbers it shows are also stated in the text beside it. */
function MiniLine({ values }: { values: number[] }) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * 300, 58 - ((v - lo) / span) * 50] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg className="mini-line" viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden>
      <path d={`${line} L300,64 L0,64 Z`} style={{ fill: 'var(--chart-primary)' }} opacity={0.1} />
      <path d={line} fill="none" style={{ stroke: 'var(--chart-primary)' }} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

interface CardProps {
  question: string;
  layer: string;
  figure: ReactNode;
  finding: ReactNode;
  href: string;
}

function QuestionCard({ question, layer, figure, finding, href }: CardProps) {
  return (
    <article className="question">
      <h3 className="question-text">{question}</h3>
      <p className="question-layer">{layer}</p>
      <div className="question-figure">{figure}</div>
      <p className="question-finding">{finding}</p>
      <a className="question-link" href={href}>
        See this view in the demo
      </a>
    </article>
  );
}

export function Questions() {
  const months = trailing(RECORDS, 12);
  const ttm = summarize(months);
  const first = RECORDS[0];
  const last = RECORDS[RECORDS.length - 1];
  const arPeak = months.reduce((a, b) => (b.arEnd > a.arEnd ? b : a));
  const arLow = months.reduce((a, b) => (b.arEnd < a.arEnd ? b : a));
  const range = `${periodLabel(months[0].period)} to ${periodLabel(months[11].period)}`;

  return (
    <>
      <div className="questions">
        <QuestionCard
          question="Which kind of work actually brings in the money?"
          layer="Revenue by service line"
          figure={
            <div className="mini-seg" aria-hidden>
              {SERVICE_LINES.map((k) => (
                <span key={k} style={{ flexGrow: ttm.revenueByLine[k], background: LINE_COLOR[k] }} />
              ))}
            </div>
          }
          finding={
            <>
              Over {range}, {SERVICE_LINE_LABEL.maintenance.toLowerCase()} was{' '}
              <strong>{pct(ttm.revenueByLine.maintenance / ttm.revenue, 0)}</strong> of revenue and installations{' '}
              <strong>{pct(ttm.revenueByLine.installations / ttm.revenue, 0)}</strong>. Seasonal cleanup and snow made up
              the rest.
            </>
          }
          href={`${SITE.demoPath}#/revenue`}
        />
        <QuestionCard
          question="Why can a busy month still feel tight?"
          layer="Receivables at each month end"
          figure={<MiniLine values={months.map((r) => r.arEnd)} />}
          finding={
            <>
              Money owed by customers ranged from <strong>{usd(arLow.arEnd)}</strong> at the end of{' '}
              {periodLabel(arLow.period)} to <strong>{usd(arPeak.arEnd)}</strong> at the end of {periodLabel(arPeak.period)}.
            </>
          }
          href={`${SITE.demoPath}#/cash`}
        />
        <QuestionCard
          question="Are we winning the jobs we bid on?"
          layer="Estimates issued and accepted"
          figure={<MiniLine values={months.map((r) => r.estimatesAccepted / r.estimatesIssued)} />}
          finding={
            <>
              <strong>{ttm.estimatesAccepted}</strong> of <strong>{ttm.estimatesIssued}</strong> estimates were accepted
              over {range}, an acceptance rate of <strong>{pct(ttm.acceptanceRate!)}</strong>.
            </>
          }
          href={`${SITE.demoPath}#/operations`}
        />
        <QuestionCard
          question="How much of this still runs through me?"
          layer="Owner hours in day-to-day operations"
          figure={<MiniLine values={RECORDS.map((r) => r.ownerHoursPerWeek)} />}
          finding={
            <>
              The owner's estimated operational time went from <strong>{first.ownerHoursPerWeek.toFixed(1)}</strong> hours
              a week in {periodLabel(first.period)} to <strong>{last.ownerHoursPerWeek.toFixed(1)}</strong> in{' '}
              {periodLabel(last.period)}.
            </>
          }
          href={`${SITE.demoPath}#/exit`}
        />
      </div>
      <p className="questions-note">
        <span className="demo-tag">Demonstration data</span> These figures describe Aster Ridge Property Services, a
        fictional landscaping company. They are calculated live from a synthetic sample file and are not client results.
      </p>
    </>
  );
}
