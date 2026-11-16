import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Banknote, CalendarCheck, ClipboardCheck, Gauge, Info, Layers, ListChecks, Menu, PieChart, Wrench, X, type LucideIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { COMPANY } from '../lib/dataset';
import { DemoProvider } from './state';
import { href, useRoute, type Route } from './router';
import { Overview } from './views/Overview';
import { Revenue } from './views/Revenue';
import { Profitability } from './views/Profitability';
import { Cash } from './views/Cash';
import { Operations } from './views/Operations';
import { Meetings } from './views/Meetings';
import { Recommendations } from './views/Recommendations';
import { Owner } from './views/Owner';

interface NavItem {
  route: Route;
  label: string;
  icon: LucideIcon;
}

/** What a business owner sees in their workspace. */
const NAV: { heading: string; items: NavItem[] }[] = [
  { heading: 'Your business', items: [{ route: 'owner', label: 'Summary', icon: ClipboardCheck }] },
  {
    heading: 'Performance',
    items: [
      { route: 'overview', label: 'Overview', icon: Gauge },
      { route: 'revenue', label: 'Revenue', icon: Layers },
      { route: 'profitability', label: 'Profitability', icon: PieChart },
      { route: 'cash', label: 'Cash and receivables', icon: Banknote },
      { route: 'operations', label: 'Operations', icon: Wrench },
    ],
  },
  {
    heading: 'Working together',
    items: [
      { route: 'meetings', label: 'Meetings', icon: CalendarCheck },
      { route: 'recommendations', label: 'Recommendations', icon: ListChecks },
    ],
  },
];

const VIEWS: Record<Route, () => JSX.Element> = {
  owner: Owner,
  overview: Overview,
  revenue: Revenue,
  profitability: Profitability,
  cash: Cash,
  operations: Operations,
  meetings: Meetings,
  recommendations: Recommendations,
};

function Shell() {
  const route = useRoute();
  const [navOpen, setNavOpen] = useState(false);
  const aboutRef = useRef<HTMLDialogElement>(null);
  const View = VIEWS[route];

  useEffect(() => setNavOpen(false), [route]);

  return (
    <div className="app">
      <a className="skip-link" href="#view">
        Skip to content
      </a>

      <div className="demo-banner" role="note">
        <span className="demo-banner-text">
          <strong>Demonstration.</strong> Fictional company, synthetic data.<span className="demo-banner-more"> Nothing you do here is saved.</span>
        </span>
        <button type="button" className="demo-banner-btn" onClick={() => aboutRef.current?.showModal()}>
          <Info size={14} aria-hidden /> About this demo
        </button>
      </div>

      <aside className={`sidebar on-dark ${navOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <a href={SITE.homeFromDemo} className="sidebar-logo" aria-label="StrataSight home">
            <Logo onDark />
          </a>
          <button type="button" className="sidebar-close" onClick={() => setNavOpen(false)}>
            <X size={20} aria-hidden />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>

        <div className="sidebar-client">
          <span className="sidebar-client-name">{COMPANY.shortName}</span>
          <span className="sidebar-client-meta">{COMPANY.industry}</span>
          <span className="demo-tag">Fictional company</span>
        </div>

        <nav aria-label="Workspace" className="sidebar-nav">
          {NAV.map((group) => (
            <div key={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.route}>
                    <a href={href(item.route)} className={route === item.route ? 'is-current' : ''} aria-current={route === item.route ? 'page' : undefined}>
                      <item.icon size={17} aria-hidden />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <a className="sidebar-back" href={SITE.homeFromDemo}>
          <ArrowLeft size={15} aria-hidden /> Back to stratasight.net
        </a>
      </aside>
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden />}

      <div className="main">
        <div className="topbar">
          <button type="button" className="topbar-menu" onClick={() => setNavOpen(true)} aria-expanded={navOpen}>
            <Menu size={20} aria-hidden />
            <span className="visually-hidden">Open menu</span>
          </button>
          <span className="topbar-title">{COMPANY.shortName}</span>
          <span className="demo-tag">Demo</span>
        </div>
        <main id="view" className="view" tabIndex={-1}>
          <View />
        </main>
        <footer className="app-foot">
          Every figure here describes a fictional company and is calculated from synthetic records. None of it is client data, a financial statement, or a StrataSight result.
        </footer>
      </div>

      <dialog ref={aboutRef} className="about" aria-labelledby="about-title">
        <h2 id="about-title" className="heading">
          About this demonstration
        </h2>
        <p>
          This is what a business owner sees in a StrataSight client workspace, shown for Aster Ridge Property Services, a fictional landscaping company. Every figure is synthetic. Nothing you
          click here is saved or sent anywhere.
        </p>
        <h3>What is calculated</h3>
        <p>
          Charts and figures come from monthly records running from January 2023 to October 2026. Totals are sums of the months shown, ratios are computed from those sums, and balances are
          month-end values that are never added together.
        </p>
        <h3>What is written as an example</h3>
        <p>
          Recommendations, meeting agendas, and questions are written examples of how the work runs. They are marked Illustrative, are not drawn from the figures, and are not advice.
        </p>
        <h3>What is left out</h3>
        <p>
          The figures leave out taxes and depreciation and are not a full set of accounts. Nothing here is a business valuation.
        </p>
        <form method="dialog">
          <button className="btn btn-solid" type="submit">
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
}

export function App() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}
