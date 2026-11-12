import { useEffect, useState } from 'react';

/**
 * Hash routing: every view lives at demo/#/<route>. The server only ever serves
 * demo/index.html, so deep links and refreshes work on any static host.
 */
export const ROUTES = [
  'practice',
  'overview',
  'revenue',
  'profitability',
  'cash',
  'operations',
  'onboarding',
  'review',
  'meetings',
  'recommendations',
  'exit',
  'owner',
] as const;

export type Route = (typeof ROUTES)[number];

const DEFAULT_ROUTE: Route = 'overview';

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return (ROUTES as readonly string[]).includes(raw) ? (raw as Route) : DEFAULT_ROUTE;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const href = (route: Route): string => `#/${route}`;
