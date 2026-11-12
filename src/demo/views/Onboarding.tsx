import { Check, CircleDashed, FileCheck2, FileClock, FileInput, ScanLine, Upload } from 'lucide-react';
import { COMPANY, RECORDS } from '../../lib/dataset';
import { periodLabel } from '../../lib/format';
import { INTAKE_COMPLETED_THROUGH, INTAKE_DOCUMENTS, INTAKE_STAGES, type IntakeDocument } from '../illustrative';
import { href } from '../router';
import { Basis, Callout, PageHeader } from '../ui';

const DOC_STATUS: Record<IntakeDocument['status'], { label: string; icon: typeof Check; tone: string }> = {
  reconciled: { label: 'Reconciled', icon: FileCheck2, tone: 'good' },
  digitized: { label: 'Digitized', icon: ScanLine, tone: 'neutral' },
  received: { label: 'Received', icon: FileInput, tone: 'neutral' },
  requested: { label: 'Requested', icon: FileClock, tone: 'warning' },
};

export function Onboarding() {
  const sources = [...new Set(RECORDS.map((r) => r.sourceType))];
  const counts = (Object.keys(DOC_STATUS) as IntakeDocument['status'][]).map((status) => ({
    status,
    count: INTAKE_DOCUMENTS.filter((d) => d.status === status).length,
  }));

  return (
    <>
      <PageHeader
        title="Onboarding"
        lede="How a new client goes from boxes of paper and exports to a working baseline. The advisor does the collecting. The owner mostly hands things over."
      />

      <section className="card panel">
        <div className="panel-head">
          <h3 className="chart-card-title">Intake sequence for {COMPANY.shortName}</h3>
          <Basis kind="illustrative" />
        </div>
        <ol className="stages">
          {INTAKE_STAGES.map((stage, i) => {
            const done = i <= INTAKE_COMPLETED_THROUGH;
            return (
              <li key={stage.title} className={done ? 'is-done' : ''}>
                <span className="stage-dot">{done ? <Check size={14} strokeWidth={3} aria-hidden /> : <CircleDashed size={14} aria-hidden />}</span>
                <strong>{stage.title}</strong>
                <span>{stage.detail}</span>
                <span className="visually-hidden">{done ? 'Complete' : 'Not started'}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid grid-2-1">
        <section className="card panel">
          <div className="panel-head">
            <h3 className="chart-card-title">Document checklist</h3>
            <Basis kind="illustrative" />
          </div>
          <p className="panel-sub">
            An example of the records an advisor would request and track. The documents and their statuses are invented for this demo.
          </p>
          <ul className="doc-summary">
            {counts.map(({ status, count }) => (
              <li key={status}>
                <strong>{count}</strong> {DOC_STATUS[status].label.toLowerCase()}
              </li>
            ))}
          </ul>
          <ul className="docs">
            {INTAKE_DOCUMENTS.map((doc) => {
              const s = DOC_STATUS[doc.status];
              return (
                <li key={doc.name}>
                  <div>
                    <strong>{doc.name}</strong>
                    <span>{doc.detail}</span>
                  </div>
                  <span className={`status status-${s.tone}`}>
                    <s.icon size={12} aria-hidden /> {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="stack">
          <section className="card panel">
            <div className="panel-head">
              <h3 className="chart-card-title">What is loaded</h3>
              <Basis kind="data" />
            </div>
            <dl className="facts">
              <div>
                <dt>History</dt>
                <dd>
                  {RECORDS.length} months, {periodLabel(COMPANY.firstPeriod)} to {periodLabel(COMPANY.lastPeriod)}
                </dd>
              </div>
              {sources.map((source) => (
                <div key={source}>
                  <dt>{source.replace(' (synthetic)', '')}</dt>
                  <dd>{RECORDS.filter((r) => r.sourceType === source).length} months</dd>
                </div>
              ))}
            </dl>
            <a className="text-link" href={href('review')}>
              Open data review
            </a>
          </section>

          <section className="card panel">
            <div className="panel-head">
              <h3 className="chart-card-title">The owner's side</h3>
              <Basis kind="illustrative" />
            </div>
            <div className="dropzone" aria-disabled="true">
              <Upload size={22} aria-hidden />
              <strong>Document upload is not active in this demo</strong>
              <span>
                In the planned client portal an owner could drop a file here or photograph a page with a phone. This static page cannot receive files, so nothing can be uploaded.
              </span>
            </div>
          </section>
        </div>
      </div>

      <Callout title="Before any real record is collected" tone="caution">
        Secure intake needs a properly designed backend: authenticated accounts, encrypted storage, access controls, and an independent security review. This demo has none of those and should never be sent real financial documents.
      </Callout>
    </>
  );
}
