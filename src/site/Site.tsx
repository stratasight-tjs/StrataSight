import { useEffect, useState, type ReactNode } from 'react';
import { Check, Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { StrataHero } from './StrataHero';
import { Questions } from './Questions';
import { ContactForm } from './ContactForm';
import { scrollToTop } from './scroll';
import { FIT, HEADINGS, HERO, INTROS, LEGAL, OUR_JOB, PRINCIPLES, SERVICES, STEPS, TEAM, WHO, YOUR_JOB } from './content';

/*
 * The public website: five pages on hash routes, so any static host serves them from this one file.
 * The words live in content.ts, which the build also turns into the plain HTML that crawlers read.
 */

type Page = 'home' | 'services' | 'who' | 'about' | 'contact';
const PAGES: Page[] = ['home', 'services', 'who', 'about', 'contact'];

interface Route {
  page: Page;
  /** The id of a spot on the page to bring into view and point out. */
  spot: string | null;
}

function parse(hash: string): Route {
  const [section, spot] = hash.replace(/^#\/?/, '').split('/');
  return PAGES.includes(section as Page) ? { page: section as Page, spot: spot || null } : { page: 'home', spot: null };
}

/** An id for a heading, used in links to that spot: "Operational Efficiency" becomes "operational-efficiency". */
const spotId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Brings a spot into view under the pinned header, then marks it for a moment so the eye finds it.
 * Waits two frames so the new page has drawn first.
 */
function showSpot(id: string) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return scrollToTop();
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      target.classList.remove('is-here');
      void target.offsetWidth;
      target.classList.add('is-here');
      window.setTimeout(() => target.classList.remove('is-here'), 1600);
    }),
  );
}

/** A stock photo served from this site, in two sizes so phones download the small one. See public/images/CREDITS.md. */
function Photo({ name, alt, className = '', eager = false }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <img
      className={className}
      src={`images/${name}-800.webp`}
      srcSet={`images/${name}-800.webp 800w, images/${name}-1600.webp 1600w`}
      sizes={className.includes('photo-full') ? '100vw' : '(min-width: 900px) 50vw, 100vw'}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** Photos and other marked pieces ease into view the first time they scroll on screen. */
function useReveal(key: unknown) {
  useEffect(() => {
    const items = [...document.querySelectorAll('.public-site .reveal:not(.is-visible)')];
    if (!('IntersectionObserver' in window)) return items.forEach((el) => el.classList.add('is-visible'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}

/** True once the page has scrolled, so the pinned header can take on its background. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function usePage() {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const first = parse(window.location.hash);
    if (first.spot) showSpot(first.spot);
    const onChange = () => {
      const next = parse(window.location.hash);
      setRoute(next);
      if (next.spot) showSpot(next.spot);
      else scrollToTop();
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

const NAV: { href: string; page: Page; label: string }[] = [
  { href: '#/', page: 'home', label: 'Home' },
  { href: '#/services', page: 'services', label: 'Services' },
  { href: '#/who', page: 'who', label: 'Who it is for' },
  { href: '#/about', page: 'about', label: 'About' },
  { href: '#/contact', page: 'contact', label: 'Contact' },
];

const PAGE_TITLE: Record<Exclude<Page, 'home'>, string> = {
  services: 'Services',
  who: 'Who it is for',
  about: 'About StrataSight',
  contact: HEADINGS.contact.replace(/\.$/, ''),
};

const HEADER_PHOTO: Partial<Record<Page, { name: string; alt: string }>> = {
  services: { name: 'strata-canyon', alt: 'Layers of rock in a canyon at dusk' },
  about: { name: 'workshop-bench', alt: 'Tools on a workbench in a sunlit workshop' },
};

export function Site() {
  const { page } = usePage();
  const scrolled = useScrolled();
  useReveal(page);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [page]);
  const photo = HEADER_PHOTO[page];

  return (
    <div className="public-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className={`site-nav on-dark ${scrolled || menuOpen ? 'is-pinned' : ''}`}>
        <nav className="nav" aria-label="Primary">
          <a href="#/" className="nav-home" aria-label="StrataSight home">
            <Logo onDark />
          </a>
          <ul className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="nav-links">
            {NAV.map((item) => (
              <li key={item.page}>
                <a href={item.href} aria-current={page === item.page ? 'page' : undefined} className={page === item.page ? 'is-current' : ''} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost btn-sm nav-demo" href={SITE.demoPath}>
            Platform demo
          </a>
          <button type="button" className="nav-toggle" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            <span className="visually-hidden">Menu</span>
          </button>
        </nav>
      </div>

      {page === 'home' ? (
        <header className="hero on-dark">
          <StrataHero>
            <div className="hero-copy" id="top">
              <h1 className="display">{HERO.title}</h1>
              <p className="hero-lede">{HERO.lede}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#/contact">
                  Schedule a discovery call
                </a>
                <a className="btn btn-solid hero-secondary" href="#/services">
                  See what we do
                </a>
              </div>
            </div>
          </StrataHero>
        </header>
      ) : (
        <header className={`hero on-dark page-header ${photo ? 'has-photo' : ''}`}>
          {photo && <Photo name={photo.name} alt={photo.alt} className="page-header-photo photo-full" eager />}
          <div className="page-header-inner">
            <h1 className="display">{PAGE_TITLE[page]}</h1>
            {page === 'contact' && <p className="page-header-lede">{INTROS.contact}</p>}
          </div>
        </header>
      )}

      <main id="main">
        {page === 'home' && <Home />}
        {page === 'services' && <Services />}
        {page === 'who' && <Who />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
      </main>

      <footer className="footer on-dark">
        <div className="footer-inner">
          <div>
            <Logo onDark />
            <p>Business value advisory for privately held companies: value assessment, operational improvement, and growth planning.</p>
          </div>
          <ul>
            {NAV.map((item) => (
              <li key={item.page}>
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
    </div>
  );
}

function Section({ title, intro, aside, media, children }: { title: string; intro?: ReactNode; aside?: boolean; media?: ReactNode; children: ReactNode }) {
  return (
    <section className={`section ${aside ? 'section-aside' : ''}`}>
      <div className="section-head">
        <h2 className="display section-title">{title}</h2>
        {intro && <div className="prose">{intro}</div>}
        {media && <div className="section-photo reveal">{media}</div>}
      </div>
      {children}
    </section>
  );
}

function Home() {
  return (
    <>
      {/* Where we fit, as three layers laid down in order, each deeper than the last. */}
      <section className="fit-strata" aria-labelledby="fit-title">
        <div className="fit-strata-inner">
          <div className="fit-strata-head">
            <p className="eyebrow">{HEADINGS.fit}</p>
            <h2 className="display section-title" id="fit-title">
              {HEADINGS.fitTitle}
            </h2>
            <p className="fit-strata-lede">{INTROS.fit}</p>
          </div>
          <ol className="strata-stack">
            {FIT.map((item, index) => (
              <li key={item.title} className={`stratum stratum-${index + 1}`}>
                <span className="stratum-stage">{item.stage}</span>
                <div>
                  <strong className="heading">{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The three services as cards on one line, over a photo under a navy wash. */}
      <section className="services-band on-dark" aria-labelledby="services-title">
        <Photo name="blueprints" alt="" className="services-band-image photo-full" />
        <div className="services-band-inner">
          <div className="section-head">
            <h2 className="display section-title" id="services-title">
              {HEADINGS.services}
            </h2>
            <div className="prose">
              <p>{INTROS.services}</p>
            </div>
          </div>
          <ul className="service-cards">
            {SERVICES.map((service, index) => (
              <li key={service.title}>
                <a className="service-card" href={`#/services/${spotId(service.title)}`}>
                  <span className="service-number tabular" aria-hidden>
                    0{index + 1}
                  </span>
                  <h3 className="heading">{service.title}</h3>
                  <p>{service.short}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Screens />

      <Section title={HEADINGS.how} aside intro={<p>{INTROS.how}</p>} media={<Photo name="table-meeting" alt="Two people at a table with coffee, notes, and a tablet" />}>
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
      </Section>

      <section className="band on-dark band-photo">
        <Photo name="carving-hands" alt="Hands carving wood with a chisel" className="band-photo-image photo-full reveal" />
        <div className="band-inner cta-band">
          <h2 className="display section-title">{HEADINGS.contact}</h2>
          <a className="btn btn-primary" href="#/contact">
            Schedule a discovery call
          </a>
        </div>
      </section>
    </>
  );
}

/**
 * Layered screenshots of the client workspace, from the platform's fictional demonstration company. The value range
 * and the EBITDA figure are blurred, since this site shows neither.
 */
function Screens() {
  const shot = (name: string, alt: string, className: string) => <img className={`screen ${className}`} src={`images/screens/${name}.webp`} alt={alt} loading="lazy" decoding="async" />;
  return (
    <section className="screens" id="platform">
      <div className="screens-inner">
        <div className="screens-copy">
          <p className="eyebrow">Your workspace</p>
          <h2 className="display section-title">{HEADINGS.screens}</h2>
          <p className="screens-text">{INTROS.screens}</p>
          <p className="screens-note">
            Shown with a fictional demonstration company. <a href={SITE.demoPath}>Try the demo</a>
          </p>
        </div>
        <div className="screens-stage">
          {shot('cash', 'The cash and debt page of the workspace', 'screen-1')}
          {shot('customers', 'The customers page, with revenue by customer', 'screen-2')}
          {shot('summary', 'The summary page of the workspace', 'screen-3')}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section">
      <div className="services">
        {SERVICES.map((service, index) => (
          <article className="service spot" key={service.title} id={spotId(service.title)}>
            <div className="service-main">
              <span className="service-number tabular" aria-hidden>
                0{index + 1}
              </span>
              <h2 className="heading">{service.title}</h2>
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
  );
}

function Who() {
  return (
    <>
      <Section title="Owners who want to decide with the numbers in front of them" aside intro={<p>{INTROS.who}</p>} media={<Photo name="store-owner" alt="An owner standing in his shop" />}>
        <ul className="who-list">
          {WHO.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={HEADINGS.questions} intro={<p>{INTROS.questions}</p>}>
        <Questions />
      </Section>
    </>
  );
}

function About() {
  return (
    <>
      <Section
        title={HEADINGS.principles}
        intro={INTROS.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      >
        <dl className="principles">
          {PRINCIPLES.map(([title, body]) => (
            <div key={title}>
              <dt className="heading">{title}</dt>
              <dd>{body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="photo-strip-wrap reveal">
        <Photo name="blueprints" alt="Plans with drafting pencils and a ruler" className="photo-strip photo-full" />
      </div>

      <Section title={HEADINGS.ourJob}>
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
      </Section>

      <Section title={HEADINGS.team} intro={<p>{INTROS.team}</p>}>
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
      </Section>
    </>
  );
}

/** The form first, so it is the first thing a visitor meets. Everything else supports it. */
function Contact() {
  return (
    <section className="section contact contact-form-first">
      <ContactForm />
      <aside className="contact-aside">
        <div className="section-photo reveal">
          <Photo name="cafe-conversation" alt="Two people talking at a cafe table" />
        </div>
        <p className="contact-care">Please do not send financial statements or other confidential records. We will arrange a proper way to share them once we have spoken.</p>
        <p className="contact-direct">
          {SITE.formOpen ? (
            <>
              Prefer email? <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </>
          ) : (
            <>
              Find us on <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </>
          )}
        </p>
      </aside>
    </section>
  );
}
