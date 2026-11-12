import { useId, useState, type ReactNode } from 'react';
import { BarChart3, Table2 } from 'lucide-react';

export interface LegendItem {
  label: string;
  color: string;
  /** "line" for line series, "rect" for bars and areas. */
  shape?: 'line' | 'rect';
}

export interface TableData {
  columns: string[];
  rows: (string | number)[][];
}

interface Props {
  title: string;
  subtitle?: ReactNode;
  legend?: LegendItem[];
  /** The same data as a table. Every chart has one so no value is gated behind hover. */
  table?: TableData;
  footnote?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="legend">
      {items.map((item) => (
        <li key={item.label}>
          <span className={`legend-key legend-key-${item.shape ?? 'rect'}`} style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function ChartCard({ title, subtitle, legend, table, footnote, className, children }: Props) {
  const [showTable, setShowTable] = useState(false);
  const headingId = useId();

  return (
    <section className={`card chart-card ${className ?? ''}`} aria-labelledby={headingId}>
      <header className="chart-card-head">
        <div>
          <h3 id={headingId} className="chart-card-title">
            {title}
          </h3>
          {subtitle && <p className="chart-card-sub">{subtitle}</p>}
        </div>
        {table && (
          <button
            type="button"
            className="icon-toggle"
            aria-pressed={showTable}
            onClick={() => setShowTable((v) => !v)}
          >
            {showTable ? <BarChart3 size={15} aria-hidden /> : <Table2 size={15} aria-hidden />}
            {showTable ? 'Chart' : 'Table'}
          </button>
        )}
      </header>
      {legend && legend.length > 1 && !showTable && <Legend items={legend} />}
      {showTable && table ? (
        <div className="table-scroll" tabIndex={0} role="region" aria-label={`${title}, as a table`}>
          <table className="data-table">
            <thead>
              <tr>
                {table.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={j}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-card-body">{children}</div>
      )}
      {footnote && <p className="chart-card-foot">{footnote}</p>}
    </section>
  );
}
