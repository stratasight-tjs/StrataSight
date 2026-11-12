# StrataSight website and platform demo

A static site with two parts:

| Part | URL | What it is |
| --- | --- | --- |
| Public website | `/` | Who StrataSight is, what an engagement involves, how to get in touch. The hero chart is live and interactive. |
| Platform demo | `/demo/` | An interactive preview of the advisory platform, driven by a synthetic dataset for one fictional company. |

Everything runs in the browser. There is no backend, database, login, analytics, or third-party request. Fonts are bundled with the site.

> **All data is fictional.** The figures describe Aster Ridge Property Services (DEMO), a made-up landscaping company. See `docs/DATA_DICTIONARY.md`. Nothing in the demo is client data, a financial statement, or evidence of StrataSight results.

## Before you publish

1. **Confirm the contact address.** `src/config/site.ts` uses `hello@stratasight.net` as a placeholder. Change it to a mailbox that exists. The same address also appears once in the `<noscript>` block of `index.html`.
2. **Read the copy.** The site text was written from the project brief. It makes no claims about credentials, clients, pricing, or outcomes, and you should keep it that way unless a claim is true and you can support it.
3. **Decide whether the demo should be indexed.** `demo/index.html` carries `noindex` so search engines list the main site only. Remove that tag if you want the demo to be searchable.

## Run it locally

Requires Node.js 20.19 or newer (22 is what the deploy workflow uses).

```bash
npm install
npm run dev        # http://localhost:5173/ and http://localhost:5173/demo/
```

Other commands:

```bash
npm test           # unit tests for the CSV parser, metrics, and integrity checks
npm run build      # type-check, then build to dist/
npm run preview    # serve dist/ at http://localhost:4173/ exactly as a static host would
```

## Publish to GitHub Pages with stratasight.net

Nothing here deploys by itself. These are the steps for when you are ready.

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings > Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) runs on every push to `main`: it installs dependencies, runs the tests, builds, and publishes `dist/`. You can also start it by hand from the **Actions** tab.
4. Still in **Settings > Pages**, enter `stratasight.net` under **Custom domain** and save. When the DNS check passes, tick **Enforce HTTPS**.
5. DNS is yours to change. If the domain already serves a GitHub Pages site, the records are probably in place. For reference, GitHub Pages expects:
   - apex `stratasight.net`: four `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and optionally the matching `AAAA` records from the GitHub docs)
   - `www`: a `CNAME` record to `<your-github-username>.github.io`

   Check these against the current [GitHub Pages custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) before changing anything.

Notes:

- `public/CNAME` contains `stratasight.net` and is copied into the build. It is what GitHub reads if you ever switch to branch-based publishing. With the Actions workflow, the custom domain in Settings is what counts.
- If the existing site is published from a different repository, remove the custom domain there first. A domain can point at only one Pages site.
- To preview on `https://<username>.github.io/<repo>/` before moving the domain, leave the custom domain blank. The build uses relative asset paths, so it works under a sub-path without changes.

### Why navigation will not break on a static host

- The site has two real HTML files: `index.html` and `demo/index.html`. Both exist on disk, so both URLs load directly and survive a refresh.
- Views inside the demo use hash routes (`/demo/#/revenue`, `/demo/#/review`). The part after `#` never reaches the server, so every deep link resolves to `demo/index.html`.
- Asset URLs are relative (`base: './'` in `vite.config.ts`), so the build works at the domain root or under a sub-path.
- `public/404.html` is a self-contained page that links back to `/` and `/demo/` for mistyped addresses.
- `public/.nojekyll` stops GitHub from running Jekyll over the output.

This was checked by building, serving `dist/` with a plain static server, and loading both entry points, deep links, an unknown hash, and every demo view in headless Chrome at desktop, tablet, and phone widths.

## How the demo treats data

- The CSV at `src/data/stratasight_demo_company_monthly.csv` is the only data source. It is parsed in the browser at load.
- **Flows** (revenue, costs, counts, hours) are summed across the months in a period.
- **Snapshots** (cash, receivables, payables, backlog, contract counts, crew size) are never summed. A period shows the value at its final month.
- **Ratios** are computed from summed numerators and denominators, not by averaging monthly ratios.
- **Comparisons** are like for like: the same calendar months one year earlier. If any month has no counterpart, no change is shown.
- 2026 is always labeled as year to date.
- Nothing is labeled EBITDA, SDE, net income, normalized earnings, or valuation.
- Each panel carries one of two tags: **Calculated from demo records** (derived from the CSV) or **Illustrative** (hand-written examples of recommendations, documents, and meeting notes, kept in `src/demo/illustrative.ts`).
- Twelve arithmetic checks run against every row in the browser and in the unit tests.

Visitor actions in the demo (marking a month reviewed, changing a recommendation status) live in memory only and reset on reload.

## What a real product still needs

This repository is a public demonstration. It provides no account security and must not be used to collect or display real client information. Client workspaces, document intake, and anything confidential need a separately designed backend with authentication, access control, encrypted storage, audit history, and an independent security review.

## Project layout

```
index.html                 Public site entry
demo/index.html            Platform demo entry
public/                    Copied as-is into the build (CNAME, 404.html, favicon, robots.txt)
src/
  config/site.ts           Contact address and cross-links
  data/                    The synthetic CSV
  lib/                     Data layer: CSV parser, types, metrics, period filters, integrity checks, formatting, tests
  charts/                  Reusable SVG charts and figures (no chart library)
  components/              Shared UI (logo)
  site/                    Public website
  demo/                    Demo shell, state, router, illustrative content
    views/                 One file per demo view
  styles/                  Design tokens and stylesheets
docs/
  ARCHITECTURE.md          How the pieces fit and how to extend them
  DATA_DICTIONARY.md       Definition of every CSV column
CLAUDE.md                  Working notes for Claude Code sessions
```

## Third-party software

All free and open source: React, Vite, TypeScript, Vitest, d3-scale and d3-shape (chart math), Lucide (icons), and the Archivo and Source Serif 4 typefaces (SIL Open Font License, bundled through Fontsource). No paid libraries, component kits, or APIs.
