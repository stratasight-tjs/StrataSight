import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  CalendarCheck,
  ClipboardCheck,
  DoorOpen,
  FileSearch,
  Gauge,
  Info,
  LayoutGrid,
  Layers,
  ListChecks,
  Menu,
  PieChart,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { SITE } from '../config/site';
import { COMPANY, CSV_URL, RECORDS } from '../lib/dataset';
import { isFlagged } from '../lib/checks';
import { DemoProvider, useDemo } from './state';
import { href, useRoute, type Route } from './router';
import { Practice } from './views/Practice';
import { Overview } from './views/Overview';
import { Revenue } from './views/Revenue';
import { Profitability } from './views/Profitability';
import { Cash } from './views/Cash';
import { Operations } from './views/Operations';
import { Onboarding } from './views/Onboarding';
import { Review } from './views/Review';
import { Meetings } from './views/Meetings';
import { Recommendations } from './views/Recommendations';
import { ExitPrep } from './views/ExitPrep';
import { Owner } from './views/Owner';

interface NavItem {
  route: Route;
  label: string;
  icon: LucideIcon;
}

const NAV: { heading: string; items: NavItem[] }[] = [
  { heading: 'Practice', items: [{ route: 'practice', label: 'All clients', icon: LayoutGrid }] },
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
    heading: 'Engagement',
    items: [
      { route: 'onboarding', label: 'Onboarding', icon: Briefcase },
      { route: 'review', label: 'Data review', icon: FileSearch },
      { route: 'meetings', label: 'Meetings', icon: CalendarCheck },
      { route: 'recommendations', label: 'Recommendations', icon: ListChecks },
      { route: 'exit', label: 'Exit preparation', icon: DoorOpen },
    ],
  },
];

const VIEWS: Record<Route, () => JSX.Element> = {
  practice: Practice,
  overview: Overview,
  revenue: Revenue,
  profitability: Profitability,
  cash: Cash,
  operations: Operations,
  onboarding: Onboarding,
  review: Review,
  meetings: Meetings,
  recommendations: Recommendations,
  exit: ExitPrep,
  owner: Owner,
};

function Shell() {
  const route = useRoute();
  const { reviewed } = useDemo();
  const [navOpen, setNavOpen] = useState(false);
  const aboutRef = useRef<HTMLDialogElement>(null);
  const View = VIEWS[route];
  const ownerMode = route === 'owner';
  const openFlags = RECORDS.filter((r) => isFlagged(r) && !reviewed.has(r.period)).length;

  useEffect(() => setNavOpen(false), [route]);

  return (
    <div className="app">
      <a className="skip-link" href="#view">
        Skip to content
      </a>

      <div className="demo-banner" role="note">
        <span className="demo-banner-text">
          <strong>Demonstration.</strong> Fictional company, synthetic data.<span className="demo-banner-more"> No accounts, nothing saved.</span>
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

        <div className="viewas" role="group" aria-label="View as">
          <a href={href('overview')} className={ownerMode ? '' : 'is-selected'} aria-current={ownerMode ? undefined : 'true'}>
            Advisor
          </a>
          <a href={href('owner')} className={ownerMode ? 'is-selected' : ''} aria-current={ownerMode ? 'true' : undefined}>
            Business owner
          </a>
        </div>

        <div className="sidebar-client">
          <span className="sidebar-client-name">{COMPANY.shortName}</span>
          <span className="sidebar-client-meta">{COMPANY.industry}</span>
          <span className="demo-tag">Fictional company</span>
        </div>

        <nav aria-label="Demo views" className="sidebar-nav">
          {ownerMode ? (
            <ul>
              <li>
                <a href={href('owner')} className="is-current" aria-current="page">
                  <ClipboardCheck size={17} aria-hidden /> Your business
                </a>
              </li>
            </ul>
          ) : (
            NAV.map((group) => (
              <div key={group.heading}>
                <h2>{group.heading}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.route}>
                      <a
                        href={href(item.route)}
                        className={route === item.route ? 'is-current' : ''}
                        aria-current={route === item.route ? 'page' : undefined}
                      >
                        <item.icon size={17} aria-hidden />
                        {item.label}
                        {item.route === 'review' && openFlags > 0 && (
                          <span className="nav-count" aria-label={`${openFlags} months to review`}>
                            {openFlags}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
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
          Every figure in this demo is calculated in your browser from one synthetic CSV file about a fictional company.
          It is not client data, a financial statement, or evidence of StrataSight results.{' '}
          <a href={CSV_URL} download="stratasight_demo_company_monthly.csv">
            Download the sample file
          </a>
        </footer>
      </div>

      <dialog ref={aboutRef} className="about" aria-labelledby="about-title">
        <h2 id="about-title" className="heading">
          About this demonstration
        </h2>
        <p>
          This is a preview of the advisory platform StrataSight is building. It is a static web page. There is no
          server, database, login, or stored information behind it.
        </p>
        <h3>What is calculated</h3>
        <p>
          Charts and figures come from a synthetic monthly dataset for Aster Ridge Property Services, a fictional
          landscaping company (January 2023 to October 2026). Totals are sums of the months shown, ratios are computed
          from those sums, and balances are month-end values that are never added together.
        </p>
        <h3>What is illustrative</h3>
        <p>
          Recommendations, meeting notes, document lists, and onboarding steps are written examples of how the product
          would be used. They are marked as illustrative, are not derived from the data, and are not advice.
        </p>
        <h3>What this demo leaves out</h3>
        <p>
          Figures exclude taxes and depreciation and are not a full set of accounts. Nothing here is EBITDA, seller's
          discretionary earnings, net income, or a business valuation. Real client workspaces will need secure
          accounts, access controls, audit history, and an independent security review before any confidential record
          is loaded.
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
