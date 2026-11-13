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

/**
 * A static site cannot receive form posts, so this form builds an email in the
 * visitor's own mail app. Nothing is transmitted or stored by the page itself.
 */
export function ContactForm() {
  const [opened, setOpened] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();
    const name = `${get('firstName')} ${get('lastName')}`.trim();
    const details = [
      `Name: ${name}`,
      `Email: ${get('email')}`,
      `Company: ${get('company')}`,
      get('revenue') ? `Approximate annual revenue: ${get('revenue')}` : '',
      get('focus') ? `Primary focus area: ${get('focus')}` : '',
    ].filter((line) => line !== '');
    const body = [...details, '', get('message')].join('\n');
    const subject = `Discovery call request from ${get('company') || name}`;
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
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
      <div className="contact-actions">
        <button type="submit" className="btn btn-solid">
          Write the email
        </button>
        <p className="contact-note" role="status">
          {opened
            ? `Your email app should now be open with the message filled in. If it did not open, write to ${SITE.contactEmail}.`
            : 'This opens your own email app with the message filled in. The website itself sends and stores nothing.'}
        </p>
      </div>
    </form>
  );
}
