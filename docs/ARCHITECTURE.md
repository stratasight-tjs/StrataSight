# Architecture

## Shape of the build

Vite builds two HTML entry points into `dist/`:

```
dist/
  index.html        public site       (src/site/main.tsx)
  demo/index.html   platform demo     (src/demo/main.tsx)
  assets/           hashed JS, CSS, fonts, and the demo CSV
  404.html, CNAME, favicon.svg, robots.txt, .nojekyll
```

Both entries share the data layer, the chart components, and the design tokens. The public site imports a small part of the demo's capability (the question cards and the live preview panel) so the marketing page and the product preview can never disagree about a number.

## Layers

```
src/data/*.csv
   |  imported as raw text at build time
   v
src/lib/csv.ts        parse text into rows
src/lib/dataset.ts    rows -> typed MonthRecord[]  (RECORDS, COMPANY, CSV_URL)
src/lib/metrics.ts    summarize(), priorYearSlice(), yearToDate(), trailing(), completeQuarters()
src/lib/periods.ts    filter presets and index ranges
src/lib/checks.ts     arithmetic integrity checks, review-flag helper
src/lib/format.ts     currency, percent, and period formatting
   |
   v
src/charts/           presentational SVG and HTML figures, no knowledge of the dataset
   |
   v
src/site/  and  src/demo/     compose data + charts into pages and views
```

`src/lib` has no React and no DOM access, so it is covered by plain unit tests and could move to a server or a shared package unchanged.

## Demo state and routing

- `src/demo/state.tsx` holds the selected period, the derived month slice and summaries, and two pieces of visitor state (months marked reviewed, recommendation statuses). All of it is in memory.
- `src/demo/router.ts` maps `location.hash` to one of a fixed list of routes. Unknown hashes fall back to the overview.
- `src/demo/ui.tsx` has the shared building blocks: the period filter row, the page header, the provenance tag (`Basis`), and the delta helpers that decide whether an up or down change is favorable.
- `src/demo/insights.ts` builds plain-language observations from computed values for the selected period.
- `src/demo/illustrative.ts` is the single home for hand-written example content.

## Comparison rule

`priorYearSlice()` returns the same calendar months one year earlier, or `null` if any month is missing. Views show a change only when it returns a slice. This is why selecting 2023 shows no deltas and why 2026 year to date compares with January to October 2025 instead of all of 2025.

## Charts

`CartesianChart` covers line, stacked-column, and single-series column charts on a shared layout: nice y ticks from `d3-scale`, thinned x ticks, a crosshair or band highlight, a tooltip that lists every series, arrow-key navigation, and optional review-flag markers. Smaller figures (stat tile, ranked bars, segmented bar, heatmap, funnel, sparkline) live in `figures.tsx`. `ChartCard` wraps any of them with a title, legend, and a table view of the same data.

The hero on the public site (`src/site/StrataHero.tsx`) is not a chart. It is a drawing of layered strata that open up as the page scrolls and under the pointer, where the open layer names what it stands for. It shows no data.

## Toward the real platform

The demo is deliberately honest about what it is not. Moving toward a multi-client product means, roughly in this order:

1. **Backend and identity.** Authenticated accounts for advisors and owners, tenant isolation per client business, encrypted storage, audit logging. Independent security review before any real record is loaded.
2. **Ingestion and provenance.** Uploads tied to import batches, per-figure links to source documents, edits and approvals with history. The `data_source_type`, `review_status`, and `review_note` columns stand in for this today.
3. **A model layer served by an API.** `src/lib/metrics.ts` is the seed: the same definitions applied to every client. Replace the bundled CSV with API responses of the same `MonthRecord` shape and the views keep working.
4. **Persistent engagement objects.** Recommendations, meeting briefs, action items, and document requests become stored records instead of the examples in `illustrative.ts`.
5. **Client portal.** The owner view becomes its own authenticated surface with document submission.
