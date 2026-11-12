import { useState } from 'react';
import { Check } from 'lucide-react';
import { RECORDS } from '../../lib/dataset';
import { SERVICE_LINES, SERVICE_LINE_LABEL, type ServiceLine } from '../../lib/types';
import { change, summarize, yearToDate } from '../../lib/metrics';
import { monthLong, monthShort, pct, pctChange, periodLabel, usd, usdAxis, usdCompact } from '../../lib/format';
import { CartesianChart } from '../../charts/CartesianChart';
import { ChartCard } from '../../charts/ChartCard';
import { Heatmap, SegmentedBar, StatTile } from '../../charts/figures';
import { LINE_COLOR, RAMP } from '../../charts/palette';
import { labelsOf, monthRows, tickOf } from '../chartHelpers';
import { useDemo } from '../state';
import { PageHeader, PeriodFilter, PeriodNote, SectionTitle, deltaPct, deltaPts } from '../ui';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function Revenue() {
  const { months, summary: s, priorSummary: p } = useDemo();
  const [shown, setShown] = useState<ReadonlySet<ServiceLine>>(new Set(SERVICE_LINES));
  const visibleLines = SERVICE_LINES.filter((k) => shown.has(k));

  const toggle = (line: ServiceLine) =>
    setShown((current) => {
      const next = new Set(current);
      if (next.has(line)) {
        if (next.size > 1) next.delete(line);
      } else next.add(line);
      return next;
    });

  // All-years views, independent of the period filter.
  const years = [...new Set(RECORDS.map((r) => r.year))];
  const latestYear = years[years.length - 1];
  const through = Math.max(...RECORDS.filter((r) => r.year === latestYear).map((r) => r.month));
  const ytd = summarize(yearToDate(RECORDS, latestYear, through));
  const ytdPrior = summarize(yearToDate(RECORDS, latestYear - 1, through));
  const ytdLabel = `January to ${monthShort(through)} ${latestYear}`;
  const byYearMonth = years.map((year) => MONTHS.map((m) => RECORDS.find((r) => r.year === year && r.month === m)?.totalRevenue ?? null));

  const peaks = years.map((_, i) => byYearMonth[i].indexOf(Math.max(...byYearMonth[i].map((v) => v ?? 0))) + 1);
  const peakSentence = peaks.every((m) => m === peaks[0]) ? ` ${monthLong(peaks[0])} has been the highest month in every year so far.` : '';

  return (
    <>
      <PageHeader title="Revenue" lede="Where the money comes from, how it moves through the year, and how each year compares with the last." />
      <PeriodFilter />
      <PeriodNote />

      <div className="stat-grid stat-grid-4">
        <div className="card">
          <StatTile label="Revenue" value={usdCompact(s.revenue)} delta={deltaPct(s.revenue, p?.revenue)} trend={months.map((r) => r.totalRevenue)} note="Sum of the months shown" />
        </div>
        <div className="card">
          <StatTile label="Average month" value={usdCompact(s.revenue / s.months)} delta={deltaPct(s.revenue / s.months, p ? p.revenue / p.months : null)} note="Revenue divided by months shown" />
        </div>
        <div className="card">
          <StatTile label="Recurring contract share" value={pct(s.recurringShare ?? 0)} delta={deltaPts(s.recurringShare, p?.recurringShare)} note="Part of maintenance revenue" />
        </div>
        <div className="card">
          <StatTile label="Active recurring contracts" value={String(s.recurringContractsEnd)} delta={deltaPct(s.recurringContractsEnd, p?.recurringContractsEnd)} note={`Count at the end of ${periodLabel(s.lastPeriod)}`} />
        </div>
      </div>

      <ChartCard
        title="Revenue by service line"
        subtitle="Choose which service lines to include. Colors stay with their service line."
        table={{
          columns: ['Month', ...visibleLines.map((k) => SERVICE_LINE_LABEL[k]), 'Shown total'],
          rows: monthRows(months, (r) => [...visibleLines.map((k) => usd(r.revenue[k])), usd(visibleLines.reduce((t, k) => t + r.revenue[k], 0))]),
        }}
      >
        <div className="toggle-row" role="group" aria-label="Service lines shown">
          {SERVICE_LINES.map((k) => (
            <button key={k} type="button" className={`chip chip-series ${shown.has(k) ? 'is-selected' : ''}`} aria-pressed={shown.has(k)} onClick={() => toggle(k)}>
              <span className="chip-swatch" style={{ background: LINE_COLOR[k] }}>
                {shown.has(k) && <Check size={10} strokeWidth={4} color="#fff" aria-hidden />}
              </span>
              {SERVICE_LINE_LABEL[k]}
            </button>
          ))}
        </div>
        <CartesianChart
          mode="stacked"
          height={300}
          labels={labelsOf(months)}
          tick={tickOf(months)}
          series={visibleLines.map((k) => ({ key: k, label: SERVICE_LINE_LABEL[k], color: LINE_COLOR[k], values: months.map((r) => r.revenue[k]) }))}
          format={usd}
          axisFormat={usdAxis}
          totalLabel={visibleLines.length === SERVICE_LINES.length ? 'Total revenue' : 'Total of lines shown'}
          ariaLabel="Stacked columns of monthly revenue for the selected service lines"
        />
      </ChartCard>

      <div className="grid grid-2">
        <ChartCard title="Service line mix" subtitle="Share of revenue in the selected period.">
          <SegmentedBar
            ariaLabel="Share of revenue by service line"
            format={usd}
            segments={SERVICE_LINES.map((k) => ({ label: SERVICE_LINE_LABEL[k], value: s.revenueByLine[k], color: LINE_COLOR[k] }))}
          />
        </ChartCard>

        <ChartCard title="Change by service line" subtitle={p ? 'Selected period against the same months a year earlier.' : 'Needs a period with matching months a year earlier.'}>
          {p ? (
            <table className="mini-table">
              <thead>
                <tr>
                  <th scope="col">Service line</th>
                  <th scope="col">Period</th>
                  <th scope="col">Year earlier</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_LINES.map((k) => {
                  const c = change(s.revenueByLine[k], p.revenueByLine[k]);
                  return (
                    <tr key={k}>
                      <th scope="row">
                        <span className="legend-key legend-key-rect" style={{ background: LINE_COLOR[k] }} /> {SERVICE_LINE_LABEL[k]}
                      </th>
                      <td>{usd(s.revenueByLine[k])}</td>
                      <td>{usd(p.revenueByLine[k])}</td>
                      <td className={c !== null && c < 0 ? 'is-down' : 'is-up'}>{c === null ? 'n/a' : pctChange(c)}</td>
                    </tr>
                  );
                })}
                <tr className="mini-table-total">
                  <th scope="row">Total</th>
                  <td>{usd(s.revenue)}</td>
                  <td>{usd(p.revenue)}</td>
                  <td>{pctChange(change(s.revenue, p.revenue) ?? 0)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="empty">Pick a period that has the same months one year earlier, such as "Last 12 months" or a later year, to see the change for each service line.</p>
          )}
        </ChartCard>
      </div>

      <SectionTitle title="All years on record" note="These three views always use the full history, so the period filter above does not change them." />

      <div className="grid grid-2">
        <ChartCard
          title="Each year, month by month"
          subtitle={`Total revenue by calendar month. ${latestYear} runs through ${monthShort(through)}.`}
          legend={years.map((y, i) => ({ label: String(y), color: RAMP[Math.min(i, RAMP.length - 1)], shape: 'line' as const }))}
          table={{ columns: ['Month', ...years.map(String)], rows: MONTHS.map((m, i) => [monthShort(m), ...byYearMonth.map((row) => (row[i] === null ? 'n/a' : usd(row[i] as number)))]) }}
        >
          <CartesianChart
            mode="line"
            height={280}
            labels={MONTHS.map((m) => monthShort(m))}
            tick={(i) => monthShort(i + 1)}
            series={years.map((y, i) => ({ key: String(y), label: String(y), color: RAMP[Math.min(i, RAMP.length - 1)], values: byYearMonth[i], width: y === latestYear ? 2.5 : 2 }))}
            format={usd}
            axisFormat={usdAxis}
            domain={[0, Math.max(...RECORDS.map((r) => r.totalRevenue))]}
            endLabels
            ariaLabel="Lines of total monthly revenue, one line per year"
          />
        </ChartCard>

        <ChartCard
          title={`${latestYear} year to date against ${latestYear - 1}`}
          subtitle={`${ytdLabel} compared with the same ${through} months of ${latestYear - 1}. ${latestYear} is not a complete year.`}
        >
          <div className="ytd">
            <div>
              <span className="ytd-label">{latestYear} to date</span>
              <span className="ytd-value">{usd(ytd.revenue)}</span>
            </div>
            <div>
              <span className="ytd-label">{latestYear - 1}, same months</span>
              <span className="ytd-value is-muted">{usd(ytdPrior.revenue)}</span>
            </div>
            <div>
              <span className="ytd-label">Change</span>
              <span className="ytd-value">{pctChange(change(ytd.revenue, ytdPrior.revenue) ?? 0)}</span>
            </div>
          </div>
          <ul className="pairs">
            {SERVICE_LINES.map((k) => {
              const max = Math.max(...SERVICE_LINES.map((x) => Math.max(ytd.revenueByLine[x], ytdPrior.revenueByLine[x])));
              const c = change(ytd.revenueByLine[k], ytdPrior.revenueByLine[k]);
              return (
                <li key={k}>
                  <span className="pairs-label">{SERVICE_LINE_LABEL[k]}</span>
                  <span className="pairs-bars">
                    <span style={{ width: `${(ytd.revenueByLine[k] / max) * 100}%`, background: 'var(--ramp-3)' }} title={`${latestYear}: ${usd(ytd.revenueByLine[k])}`} />
                    <span style={{ width: `${(ytdPrior.revenueByLine[k] / max) * 100}%`, background: 'var(--ramp-1)' }} title={`${latestYear - 1}: ${usd(ytdPrior.revenueByLine[k])}`} />
                  </span>
                  <span className="pairs-value tabular">
                    {usd(ytd.revenueByLine[k])}
                    <small>
                      {usd(ytdPrior.revenueByLine[k])} a year earlier, {c === null ? 'n/a' : pctChange(c)}
                    </small>
                  </span>
                </li>
              );
            })}
          </ul>
          <ul className="legend pairs-legend">
            <li>
              <span className="legend-key legend-key-rect" style={{ background: 'var(--ramp-3)' }} />
              {latestYear} to date
            </li>
            <li>
              <span className="legend-key legend-key-rect" style={{ background: 'var(--ramp-1)' }} />
              {latestYear - 1}, same months
            </li>
          </ul>
        </ChartCard>
      </div>

      <ChartCard
        title="Seasonality"
        subtitle={`Total revenue for every month on record. Darker means more revenue.${peakSentence}`}
        table={{ columns: ['Year', ...MONTHS.map((m) => monthShort(m))], rows: years.map((y, i) => [String(y), ...byYearMonth[i].map((v) => (v === null ? 'n/a' : usd(v)))]) }}
      >
        <Heatmap
          rows={years.map(String)}
          columns={MONTHS.map((m) => monthShort(m))}
          values={byYearMonth}
          format={usd}
          cellLabel={(r, c) => `${monthShort(c + 1)} ${years[r]}`}
          ariaLabel="Heatmap of total revenue by month and year"
        />
      </ChartCard>
    </>
  );
}
