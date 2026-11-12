import { RECORDS, COMPANY } from '../lib/dataset';
import { SERVICE_LINES, SERVICE_LINE_LABEL } from '../lib/types';
import { change, priorYearSlice, summarize, trailing } from '../lib/metrics';
import { pct, pctChange, periodLabel, periodShort, ptsChange, usd, usdAxis, usdCompact } from '../lib/format';
import { CartesianChart } from '../charts/CartesianChart';
import { Legend } from '../charts/ChartCard';
import { StatTile } from '../charts/figures';
import { LINE_COLOR } from '../charts/palette';
import { SITE } from '../config/site';

/** A live slice of the demo, embedded in the public site. Same data layer, same chart components. */
export function PlatformPreview() {
  const months = trailing(RECORDS, 12);
  const current = summarize(months);
  const prior = summarize(priorYearSlice(RECORDS, months)!);
  const revenueChange = change(current.revenue, prior.revenue)!;
  const marginChange = current.grossMargin! - prior.grossMargin!;
  const profitChange = change(current.operatingProfit, prior.operatingProfit)!;
  const versus = 'vs prior 12 months';

  return (
    <div className="preview">
      <div className="preview-bar">
        <span className="preview-company">{COMPANY.shortName}</span>
        <span className="demo-tag">Fictional company, demonstration data</span>
        <span className="preview-range">
          {periodLabel(months[0].period)} to {periodLabel(months[11].period)}
        </span>
      </div>
      <div className="preview-stats">
        <StatTile
          label="Revenue"
          value={usdCompact(current.revenue)}
          delta={{ text: pctChange(revenueChange), direction: revenueChange >= 0 ? 'up' : 'down', good: revenueChange >= 0, versus }}
        />
        <StatTile
          label="Gross margin"
          value={pct(current.grossMargin!)}
          delta={{ text: ptsChange(marginChange), direction: marginChange >= 0 ? 'up' : 'down', good: marginChange >= 0, versus }}
        />
        <StatTile
          label="Operating profit"
          value={usdCompact(current.operatingProfit)}
          delta={{ text: pctChange(profitChange), direction: profitChange >= 0 ? 'up' : 'down', good: profitChange >= 0, versus }}
        />
        <StatTile label="Cash at month end" value={usdCompact(current.cashEnd)} note={`Balance at the end of ${periodLabel(current.lastPeriod)}`} />
      </div>
      <div className="preview-chart">
        <div className="preview-chart-head">
          <h3 className="chart-card-title">Revenue by service line</h3>
          <Legend items={SERVICE_LINES.map((k) => ({ label: SERVICE_LINE_LABEL[k], color: LINE_COLOR[k] }))} />
        </div>
        <CartesianChart
          mode="stacked"
          height={230}
          labels={months.map((r) => periodLabel(r.period, true))}
          tick={(i) => periodShort(months[i].period)}
          series={SERVICE_LINES.map((k) => ({
            key: k,
            label: SERVICE_LINE_LABEL[k],
            color: LINE_COLOR[k],
            values: months.map((r) => r.revenue[k]),
          }))}
          format={usd}
          axisFormat={usdAxis}
          totalLabel="Total revenue"
          ariaLabel="Stacked columns of monthly revenue by service line for the last twelve months of demonstration data"
        />
      </div>
      <div className="preview-foot">
        <p>This panel is live. It reads the same sample file and uses the same calculations as the full demo.</p>
        <a className="btn btn-solid" href={SITE.demoPath}>
          Open the full demo
        </a>
      </div>
    </div>
  );
}
