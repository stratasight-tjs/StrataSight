import { useState } from 'react';
import { Check, Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { StrataHero } from './StrataHero';
import { Questions } from './Questions';
import { PlatformPreview } from './PlatformPreview';
import { ContactForm } from './ContactForm';
import { FIT, HEADINGS, HERO, LEGAL, OUR_JOB, PRINCIPLES, SERVICES, STEPS, TEAM, WHO, YOUR_JOB } from './content';

const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#who', label: 'Who it is for' },
  { href: '#engagement', label: 'How it works' },
  { href: '#platform', label: 'The platform' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
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
          <h1 className="display">{HERO.title}</h1>
          <p className="hero-lede">{HERO.lede}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Schedule a discovery call
            </a>
            <a className="btn btn-ghost" href="#services">
              See what we do
            </a>
          </div>
        </div>
        </StrataHero>
      </header>

      <main id="main">
        <section className="fit" aria-labelledby="fit-title">
          <h2 className="fit-title" id="fit-title">
            {HEADINGS.fit}
          </h2>
          <ol>
            {FIT.map((item, index) => (
              <li key={item.title} className={index === 1 ? 'is-us' : ''}>
                <span className="fit-stage">{item.stage}</span>
                <strong className="heading">{item.title}</strong>
                <span className="fit-body">{item.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="services">
          <div className="section-head">
            <h2 className="display section-title">{HEADINGS.services}</h2>
            <p className="prose">
              Everything we do connects to what the business is worth. Think of the value creation plan a private
              equity firm would run, without anyone buying in. You keep the company and you make the decisions.
            </p>
          </div>
          <div className="services">
            {SERVICES.map((service, index) => (
              <article className="service" key={service.title}>
                <div className="service-main">
                  <span className="service-number tabular" aria-hidden>
                    0{index + 1}
                  </span>
                  <h3 className="heading">{service.title}</h3>
                  {service.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="service-included">
                  <h4>What is included</h4>
                  <ul>
                    {service.included.map((item) => (
                      <li key={item}>
                        <Check size={15} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-aside" id="who">
          <div className="section-head">
            <h2 className="display section-title">{HEADINGS.who}</h2>
            <p className="prose">
              We work with owners of privately held businesses in any industry: services, manufacturing, distribution,
              healthcare, professional firms, technology, and more. The common thread is not the industry. It is an
              owner who wants to make deliberate, well supported decisions about the company.
            </p>
          </div>
          <ul className="who-list">
            {WHO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="questions">
          <div className="section-head">
            <h2 className="display section-title">A buyer will study your company layer by layer. See it that way first.</h2>
            <p className="prose">
              Most owners know their business by feel and have rarely seen it the way a buyer would. These are the
              kinds of questions the work answers, shown here for a sample company.
            </p>
          </div>
          <Questions />
        </section>

        <section className="section section-split" id="work">
          <div className="section-head">
            <h2 className="display section-title">{HEADINGS.ourJob}</h2>
            <p className="prose">
              You should not have to become an accountant, an analyst, or a software user to understand what your
              business is worth. The hard part is ours.
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
            </div>
          </div>
        </section>

        <section className="section section-aside" id="engagement">
          <div className="section-head">
            <h2 className="display section-title">{HEADINGS.how}</h2>
            <p className="prose">
              This is ongoing work, not a one-time report. The first three steps happen once. The next two repeat for
              as long as we work together. The last one waits until you are ready.
            </p>
          </div>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className={step.recurring ? 'is-recurring' : ''}>
                <span className="step-number" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="heading">{step.title}</h3>
                  <p>{step.body}</p>
                  {step.recurring && <span className="step-tag">Repeats every meeting cycle</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="band on-dark" id="platform">
          <div className="band-inner">
            <div className="section-head">
              <h2 className="display section-title">A sample of what a client sees</h2>
              <p className="prose">
                Each client gets a workspace: the history of the company in one consistent model, a review trail for
                every figure, meeting preparation, and tracked recommendations. Below is a working sample built on a
                fictional landscaping company.
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

        <section className="section" id="about">
          <div className="section-head">
            <h2 className="display section-title">{HEADINGS.principles}</h2>
            <div className="prose">
              <p>
                Most privately held businesses never get the depth of strategic analysis that institutional investors
                take for granted. The gap between what a company is worth and what it could be worth is usually
                operational. It builds up quietly through process gaps, cost structures that have not kept pace, and
                blind spots that accumulate over years.
              </p>
              <p>
                StrataSight exists to find that gap and work on it with you. We sit between your own financial
                planning and the eventual sale, and we start from your actual data, not a recycled playbook.
              </p>
            </div>
          </div>
          <dl className="principles">
            {PRINCIPLES.map(([title, body]) => (
              <div key={title}>
                <dt className="heading">{title}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>

          <div className="team">
            <div className="team-head">
              <h3 className="heading">{HEADINGS.team}</h3>
              <p>
                StrataSight was formed by a team with complementary expertise in business strategy, quantitative
                analysis, and data infrastructure.
              </p>
            </div>
            <ul className="team-grid">
              {TEAM.map((member) => (
                <li key={member.name}>
                  <strong className="heading">{member.name}</strong>
                  <span className="team-role">{member.role}</span>
                  <p>{member.bio}</p>
                  <span className="team-skills">{member.skills.join(' · ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-intro">
            <h2 className="display section-title">{HEADINGS.contact}</h2>
            <p className="prose">
              A discovery call takes thirty minutes and commits you to nothing. Tell us a little about your business
              and what you are trying to accomplish, and we will reply to arrange it.
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
            <p>Business value advisory for privately held companies: value assessment, operational improvement, and growth planning.</p>
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
            <li>
              <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </li>
          </ul>
          <p className="footer-legal">
            {LEGAL.advisory}
            <br />
            {LEGAL.synthetic}
            <br />© {new Date().getFullYear()} StrataSight. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
