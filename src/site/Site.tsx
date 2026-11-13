import { useState } from 'react';
import { Check, Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { StrataHero } from './StrataHero';
import { Questions } from './Questions';
import { PlatformPreview } from './PlatformPreview';
import { ContactForm } from './ContactForm';

const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#who', label: 'Who it is for' },
  { href: '#engagement', label: 'How it works' },
  { href: '#platform', label: 'The platform' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const FIT = [
  {
    stage: 'First',
    title: 'You build the business',
    body: 'Years of work, customers, and people. Most of what the company is worth is already there.',
  },
  {
    stage: 'Then, over a period of years',
    title: 'StrataSight builds its value',
    body: 'We assess what the company is worth and why, set the strategy, and improve operations and growth alongside you.',
  },
  {
    stage: 'When you are ready',
    title: 'An exit partner handles the sale',
    body: 'A specialist in exits takes a well documented company to market from the strongest position it can be in.',
  },
];

const SERVICES = [
  {
    title: 'Strategic Value Assessment',
    body: [
      'Most owners carry a number in their head for what the business is worth. Without disciplined analysis behind it, that number is usually wrong, sometimes by a wide margin.',
      'The assessment gives you an evidence-based advisory opinion of what the company is worth today and a clear map of what is pushing that figure up or holding it back. We look at financial trends, market comparables, customer concentration, operational risk, management depth, and growth trajectory.',
      'It is a working document and it does not sit still. We return to it at our regular meetings as the business changes.',
    ],
    included: [
      'Enterprise value advisory opinion',
      'Comparable market benchmarking',
      'Value drivers identified and ranked',
      'Gap analysis and opportunity map',
      'Multiple analysis (EBITDA, SDE, revenue)',
      'Risk factor assessment',
      'Written report and walkthrough in person',
      'Revisited at regular meetings',
    ],
  },
  {
    title: 'Operational Efficiency',
    body: [
      'Inefficiency rarely announces itself. It shows up as margins that slip a little each year, departments that are busy without producing more, and overhead that grows faster than output.',
      'Left alone, it compounds, and a buyer prices it in. We review your cost centers, workflows, and profitability measures in a structured way, using your own numbers.',
      'You get a ranked list of specific improvements with an estimate of what each could be worth, so you know where to start. Then we follow the results with you.',
    ],
    included: [
      'Profitability analysis by product or segment',
      'Cost structure review and benchmarking',
      'Workflow and resource allocation review',
      'Margin improvement modeling',
      'Productivity and output analysis',
      'Ranked recommendations with estimated impact',
      'Implementation sequencing guide',
      'Results tracked at later meetings',
    ],
  },
  {
    title: 'Strategic Growth Advisory',
    body: [
      'Growth without a strategy is spending faster. We build the growth plan around your business model, your market, and what your operation can actually carry, not around a framework borrowed from another industry.',
      'The plan is prioritized, sequenced, and tied to milestones you can reach. It stays at the level of the business: corporate strategy, market position, and the ability to scale.',
      'We keep working it with you, meeting by meeting, and adjust as the results come in.',
    ],
    included: [
      'Market opportunity and competitive analysis',
      'Revenue growth modeling and scenario planning',
      'Customer and channel expansion strategy',
      'Operational scalability assessment',
      'Strategic initiative prioritization',
      'Return framing for major decisions',
      'Roadmap with clear milestones',
      'Progress reviewed at regular meetings',
    ],
  },
];

const WHO = [
  'Owners considering a sale or transition in the next one to five years',
  'Owners who want to know what their company is actually worth, and why',
  'Companies whose margins are slipping or whose growth has stalled',
  'Owners who want to scale without giving up profitability',
  'Partners or co-owners who want a shared, documented view of the company',
  'Owners whose personal financial plan depends on what the business will one day sell for',
];

const OUR_JOB = [
  ['Gather the records', 'Accounting exports, bank statements, invoices, payroll reports, job logs. Whatever exists, in whatever shape it is in.'],
  ['Digitize the paper', 'Filing cabinets and folders become organized, searchable records with a note of where each figure came from.'],
  ['Consolidate the picture', 'Several years of financial and operating history, brought into one consistent view of the company.'],
  ['Analyze value and performance', 'What the company is worth, what drives that, and how revenue, margins, costs, and cash move together.'],
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
    title: 'A first conversation',
    body: 'Thirty minutes. We learn about the business, what you want from it, and when. You need no preparation, and we will tell you plainly whether we can help.',
  },
  {
    title: 'We collect what exists',
    body: 'The work starts with your records as they are today. We take in exports, statements, and paper, then organize and digitize them. Anything unclear is marked for review instead of guessed at.',
  },
  {
    title: 'We assess the value and what drives it',
    body: 'Your history goes into a consistent financial and operating model. From it we form an advisory opinion of what the company is worth today, and a ranked list of what raises or lowers that figure.',
  },
  {
    title: 'We meet regularly and work the plan',
    body: 'On a regular schedule we sit down to go through what the numbers show, what to improve in operations and growth, and what we would look at next. You ask questions until it makes sense.',
    recurring: true,
  },
  {
    title: 'We track what you decide',
    body: 'Each recommendation you take on is recorded along with the measures it was meant to move. At later meetings we look at what actually happened and update the picture of value.',
    recurring: true,
  },
  {
    title: 'An exit partner takes it to market',
    body: 'When you decide to sell, a partner who specializes in exits handles the sale. They start with a company whose history is documented and whose value is already understood.',
  },
];

const PRINCIPLES = [
  ['Evidence only', 'Every recommendation rests on your own financial and operating data. Not gut feel, and not industry averages loosely applied.'],
  ['A defined scope', 'We work at the level of the business: value, operations, and growth. Personal finances, legal work, and the sale itself belong to other professionals.'],
  ['Built to be used', 'Ranked findings, specific next steps, and measures to check them against. We stay with the work through implementation.'],
  ['A person explains it', 'Software does the arithmetic. An advisor sits across the table, answers questions, and knows your business by name.'],
  ['We say what the numbers cannot tell us', 'Every figure carries its source and review status. When a record is incomplete or reconstructed, you will see that it is.'],
  ['No promises about price', 'Our view of value is an advisory opinion, not a certified valuation. We do not promise a sale price or a guaranteed increase.'],
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
          <h1 className="display">Know what your company is worth. Then build on it.</h1>
          <p className="hero-lede">
            StrataSight is a business value advisory for privately held companies. We assess what your business is
            worth and why, set the strategy, and work with you over a period of years to improve operations and
            growth, so that when you sell, you sell from a position of strength.
          </p>
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
            Where we fit
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
            <h2 className="display section-title">Three disciplines, one aim: a more valuable company.</h2>
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
            <h2 className="display section-title">Who it is for</h2>
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
            <h2 className="display section-title">We do the paperwork. You run the company.</h2>
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
            <h2 className="display section-title">How it works</h2>
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
            <h2 className="display section-title">Depth over decoration</h2>
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
        </section>

        <section className="section contact" id="contact">
          <div className="contact-intro">
            <h2 className="display section-title">Start with a conversation.</h2>
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
            StrataSight provides corporate-level strategic advisory only. Services do not constitute personal financial
            planning, investment advice, insurance, legal services, or certified appraisal. Opinions of value are
            advisory opinions, not certified valuations.
            <br />
            Charts and figures on this site come from a synthetic dataset about a fictional company. They are not
            client results.
            <br />© {new Date().getFullYear()} StrataSight. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
