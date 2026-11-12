import { useState, type FormEvent } from 'react';
import { SITE } from '../config/site';

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
    const lines = [
      `Name: ${get('name')}`,
      `Business: ${get('business')}`,
      get('phone') ? `Phone: ${get('phone')}` : '',
      '',
      get('message'),
    ].filter((line, index) => line !== '' || index === 3);
    const subject = `Conversation request from ${get('business') || get('name')}`;
    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setOpened(true);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Business name</span>
          <input name="business" type="text" autoComplete="organization" required />
        </label>
      </div>
      <label className="field">
        <span>
          Phone <em>(optional)</em>
        </span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="field">
        <span>What would you like to understand better about your business?</span>
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
