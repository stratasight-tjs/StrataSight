import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { StrataHero } from './StrataHero';
import { Questions } from './Questions';
import { PlatformPreview } from './PlatformPreview';
import { ContactForm } from './ContactForm';

const NAV = [
  { href: '#questions', label: 'What you learn' },
  { href: '#work', label: 'What we do' },
  { href: '#engagement', label: 'How it works' },
  { href: '#platform', label: 'The platform' },
  { href: '#contact', label: 'Contact' },
];

const OUR_JOB = [
  ['Gather the records', 'Accounting exports, bank statements, invoices, payroll reports, job logs. Whatever exists, in whatever shape it is in.'],
  ['Digitize the paper', 'Filing cabinets and folders become organized, searchable records with a note of where each figure came from.'],
  ['Consolidate the picture', 'Several years of financial and operating history, brought into one consistent view of the company.'],
  ['Analyze performance', 'Revenue by type of work, margins, costs, cash, sales activity, crew time, and how they move together.'],
  ['Prepare recommendations', 'Specific, practical options to consider, each tied to the numbers behind it.'],
  ['Keep it current', 'New months are added, checked, and reconciled as they close, so the picture never goes stale.'],
];

const YOUR_JOB = [
  ['Share what you already have', 'No new software to learn and no forms to fill in every week.'],
  ['Meet with us regularly', 'We walk through what changed and what it means, in plain language.'],
  ['Make the decisions', 'It is your company. We bring the analysis. You decide what to do with it.'],
];

const STEPS = [
  {
    title: 'We collect what exists',
    body: 'An engagement starts with your records as they are today. We take in exports, statements, and paper, then organize and digitize them. Anything unclear is marked for review instead of guessed at.',
  },
  {
    title: 'We build the first full picture',
    body: 'Your history goes into a consistent financial and operating model. For many owners this is the first time several years of the business can be seen side by side.',
  },
  {
    title: 'We sit down and go through it',
    body: 'On a regular schedule we meet to explain what the numbers show, where the opportunities are, and what we would look at next. You ask questions until it makes sense.',
  },
  {
    title: 'We track what you decide',
    body: 'Each recommendation you take on is recorded along with the measures it was meant to move. At later meetings we look at what actually happened.',
  },
  {
    title: 'We prepare the record for a transition',
    body: 'If and when you plan to sell or hand over the company, we organize its documented history for the financial and exit-strategy professionals you choose to work with.',
  },
];

const PRINCIPLES = [
  ['A person explains it', 'Software does the arithmetic. An advisor sits across the table, answers questions, and knows your business by name.'],
  ['Plain language first', 'If a figure needs a glossary before it is useful, we have not finished our job.'],
  ['The burden stays with us', 'Collection, reconciliation, and upkeep are our responsibility. Your time goes to running the company.'],
  ['We say what the numbers cannot tell us', 'Every figure carries its source and review status. When a record is incomplete or reconstructed, you will see that it is.'],
  ['No promises about price', 'We do not appraise or sell businesses. We make sure the people who do are handed a clear, organized record.'],
];

export function Site() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="hero on-dark">
        <nav className="nav" aria-label="Primary">
          <a href="#top" className="nav-home" aria-label="StrataSight home">
            <Logo onDark />
          </a>
          <ul className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="nav-links">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost btn-sm nav-demo" href={SITE.demoPath}>
            Platform demo
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-links"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            <span className="visually-hidden">Menu</span>
          </button>
        </nav>

        <StrataHero>
        <div className="hero-copy" id="top">
          <h1 className="display">See what is under your top line.</h1>
          <p className="hero-lede">
            StrataSight is a business performance advisory for established, owner-operated companies. We gather your
            records, do the analysis, and meet with you regularly to explain what the numbers mean and what to do next.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Start a conversation
            </a>
            <a className="btn btn-ghost" href={SITE.demoPath}>
              Explore the platform demo
            </a>
          </div>
        </div>
        </StrataHero>
      </header>

      <main id="main">
        <section className="section" id="questions">
          <div className="section-head">
            <h2 className="display section-title">Years of running the company teach you a great deal. Some questions still need the numbers.</h2>
            <p className="prose">
              Most owners we work with have built something solid over decades and know it by feel. What they have
              rarely had is a clear, layered view of how the business actually performs. These are the kinds of
              questions that view can answer.
            </p>
          </div>
          <Questions />
        </section>

        <section className="section section-split" id="work">
          <div className="section-head">
            <h2 className="display section-title">We do the paperwork. You run the company.</h2>
            <p className="prose">
              You should not have to become an accountant, an analyst, or a software user to understand your own
              business. The hard part is ours.
            </p>
          </div>
          <div className="jobs">
            <div className="job job-ours">
              <h3 className="heading">What we take on</h3>
              <ul>
                {OUR_JOB.map(([title, body]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="job job-yours">
              <h3 className="heading">What we ask of you</h3>
              <ul>
                {YOUR_JOB.map(([title, body]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </li>
                ))}
              </ul>
              <p className="job-audience">
                We work with established local businesses such as painting contractors, landscapers, and HVAC
                companies, usually still run day to day by the person who built them.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-aside" id="engagement">
          <div className="section-head">
            <h2 className="display section-title">How an engagement works</h2>
            <p className="prose">
              An engagement is ongoing. The first two steps happen once. The next two repeat for as long as we work
              together. The last one waits until you are ready.
            </p>
          </div>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className={index === 2 || index === 3 ? 'is-recurring' : ''}>
                <span className="step-number" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="heading">{step.title}</h3>
                  <p>{step.body}</p>
                  {(index === 2 || index === 3) && <span className="step-tag">Repeats every meeting cycle</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="band on-dark" id="platform">
          <div className="band-inner">
            <div className="section-head">
              <h2 className="display section-title">The platform behind the advice</h2>
              <p className="prose">
                We are building software that lets a small advisory team serve each client thoroughly: one workspace
                per business, reusable financial and operating models, a review trail for every figure, meeting
                preparation, and tracked recommendations. Below is a working preview built on a fictional landscaping
                company.
              </p>
            </div>
            <PlatformPreview />
            <p className="band-note">
              The demo runs entirely in your browser on a synthetic sample file. It has no accounts, no login, and no
              client information. Real client workspaces will run on a separate, secured system that is designed and
              independently reviewed before any confidential record is loaded.
            </p>
          </div>
        </section>

        <section className="section section-aside" id="principles">
          <div className="section-head">
            <h2 className="display section-title">How we think about the work</h2>
          </div>
          <dl className="principles">
            {PRINCIPLES.map(([title, body]) => (
              <div key={title}>
                <dt className="heading">{title}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-intro">
            <h2 className="display section-title">Start with a conversation.</h2>
            <p className="prose">
              Tell us a little about your business and what you would like to see more clearly. We will reply to
              arrange a first conversation.
            </p>
            <p className="contact-direct">
              Prefer to write directly? <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
            <p className="contact-care">
              Please do not send financial statements or other confidential records by email. We will arrange a
              proper way to share them once we have spoken.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="footer on-dark">
        <div className="footer-inner">
          <div>
            <Logo onDark />
            <p>Business performance advisory for established, owner-operated companies.</p>
          </div>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href={SITE.demoPath}>Platform demo</a>
            </li>
          </ul>
          <p className="footer-legal">
            Charts and figures on this site come from a synthetic dataset about a fictional company. They are not
            client results. Nothing here is legal, tax, accounting, or valuation advice.
            <br />© {new Date().getFullYear()} StrataSight
          </p>
        </div>
      </footer>
    </>
  );
}
