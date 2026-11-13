import { useState, type FormEvent } from 'react';
import { SITE } from '../config/site';

const REVENUE_RANGES = ['Under $1M', '$1M to $5M', '$5M to $15M', '$15M to $50M', '$50M or more', 'Prefer not to say'];

const FOCUS_AREAS = [
  'Strategic Value Assessment',
  'Operational Efficiency',
  'Strategic Growth Advisory',
  'Preparing for a sale or transition',
  'Not sure yet',
];

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'mail-opened';

const NOTE: Record<Status, string> = {
  idle: SITE.formEndpoint
    ? 'Your message goes to StrataSight through a hosted form service. This site stores nothing.'
    : 'This opens your own email app with the message filled in. The website itself sends and stores nothing.',
  sending: 'Sending your message.',
  sent: 'Thank you. Your message has been sent and we will reply to arrange a call.',
  failed: `The message could not be sent. Please write to ${SITE.contactEmail} instead.`,
  'mail-opened': `Your email app should now be open with the message filled in. If it did not open, write to ${SITE.contactEmail}.`,
};

/**
 * A static site cannot receive form posts. When SITE.formEndpoint is set, the form posts
 * to that hosted service. Otherwise it builds an email in the visitor's own mail app.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    const name = `${get('firstName')} ${get('lastName')}`.trim();
    const subject = `Discovery call request from ${get('company') || name}`;

    if (!SITE.formEndpoint) {
      const details = [
        `Name: ${name}`,
        `Email: ${get('email')}`,
        `Company: ${get('company')}`,
        get('revenue') ? `Approximate annual revenue: ${get('revenue')}` : '',
        get('focus') ? `Primary focus area: ${get('focus')}` : '',
      ].filter((line) => line !== '');
      const body = [...details, '', get('message')].join('\n');
      window.location.href = `mailto:${SITE.formRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('mail-opened');
      return;
    }

    data.set('_subject', subject);
    setStatus('sending');
    try {
      const response = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!response.ok) throw new Error(`Form service answered ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label className="field">
          <span>First name</span>
          <input name="firstName" type="text" autoComplete="given-name" required />
        </label>
        <label className="field">
          <span>Last name</span>
          <input name="lastName" type="text" autoComplete="family-name" required />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Company name</span>
          <input name="company" type="text" autoComplete="organization" required />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Approximate annual revenue</span>
          <select name="revenue" defaultValue="">
            <option value="">Select a range</option>
            {REVENUE_RANGES.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Primary focus area</span>
          <select name="focus" defaultValue="">
            <option value="">Select a focus area</option>
            {FOCUS_AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Tell us about your business and what you are trying to accomplish</span>
        <textarea name="message" rows={4} required />
      </label>
      {/* Spam trap read by the form service. People never see or fill it. */}
      <input className="visually-hidden" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="contact-actions">
        <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
          {SITE.formEndpoint ? 'Send message' : 'Write the email'}
        </button>
        <p className="contact-note" role="status">
          {NOTE[status]}
        </p>
      </div>
    </form>
  );
}
