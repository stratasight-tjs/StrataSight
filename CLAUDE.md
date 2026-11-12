# Working notes for Claude Code

Static Vite + React + TypeScript site for StrataSight. Two entry points: the public site (`index.html`, `src/site/`) and the platform demo (`demo/index.html`, `src/demo/`). Hosted on GitHub Pages at stratasight.net. No backend.

## Commands

- `npm run dev` : dev server
- `npm test` : Vitest unit tests (data layer)
- `npm run build` : `tsc --noEmit` then `vite build` to `dist/`
- `npm run preview` : serve `dist/` as a static host would

Run `npm test` and `npm run build` before calling a change done.

## Rules that must hold

1. **The data is fictional and must look fictional.** Every place demo figures appear carries a demo label. Never add testimonials, client names, credentials, outcomes, pricing, or valuations.
2. **Follow `docs/DATA_DICTIONARY.md`.** Never sum snapshot fields (`cashEnd`, `arEnd`, `apEnd`, `backlogEnd`, `recurringContracts`, `crewFte`). Never label anything EBITDA, SDE, net income, normalized earnings, or valuation. Owner salary is an operating expense counted once. `recurringRevenue` and `topFiveRevenue` are subsets, never added to revenue. 2026 is year to date.
3. **Numbers come from `src/lib/`.** Views do not do their own aggregation beyond trivial display math. Add a function to `metrics.ts` with a test instead.
4. **Separate calculated from illustrative.** Hand-written example content lives only in `src/demo/illustrative.ts` and is shown with `<Basis kind="illustrative" />`. Computed content uses `<Basis kind="data" />`. Do not mix a made-up number into a computed panel.
5. **No persistence, no network.** The demo keeps state in React memory. Do not add localStorage, cookies, analytics, remote fonts, or API calls without an explicit request.
6. **Static hosting.** Keep `base: './'`, the two HTML entries, and hash routing in the demo. Do not introduce path-based client routing.
7. **Writing style.** Plain, sentence case, active voice. No em dashes or en dashes anywhere in site copy or docs.

## Charts

Custom SVG in `src/charts/`, following a few fixed rules:

- One y-axis per chart. Two measures on different scales get two charts.
- Series colors belong to the entity (`charts/palette.ts`, tokens in `styles/tokens.css`). Filtering never repaints a series. The four service-line colors were validated for color-vision-deficiency separation on both the light and dark surfaces. Re-validate if you change them.
- Ordered categories (years, funnel stages) use the one-hue ramp. Status colors are reserved for status and always ship with an icon and a label.
- Every chart has a hover and keyboard tooltip and a table view (`ChartCard` `table` prop).
- Text never takes a series color.

## Design system

Tokens in `src/styles/tokens.css`. Prussian blue on cool paper, one yellow accent used only as a fill (primary buttons, the hero sight line, demo labels). Archivo (wide for headings) is the interface voice. Source Serif 4 is used where a person is speaking: site prose, advisor notes, the owner summary. Motion is limited to the hero reveal and direct responses to input, and `prefers-reduced-motion` is respected.

## Adding things

- **A demo view:** add the route to `ROUTES` in `src/demo/router.ts`, create `src/demo/views/<Name>.tsx`, register it in `VIEWS` and `NAV` in `src/demo/App.tsx`.
- **A metric:** extend `PeriodSummary` and `summarize()` in `src/lib/metrics.ts`, add a test in `metrics.test.ts`.
- **A CSV column:** add it to `MonthRecord` (`types.ts`) and `toRecords()` (`dataset.ts`), document it in the data dictionary, and add an integrity check if it has an arithmetic relationship.
- **Another company:** `dataset.ts` currently exports one parsed series. To support several, export a map keyed by `company_id` and pass the selected series through `DemoProvider` instead of importing `RECORDS` directly in views.

See `docs/ARCHITECTURE.md` for more.
