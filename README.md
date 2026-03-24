# StrataSight
### Business Value Advisory

Website repository for [stratasight.net](https://stratasight.net)

---

## Live Site

> stratasight.net

---

## Design Direction

StrataSight and Fortune Financial Planning share the same developer. The sites share structural and behavioral patterns but use entirely different aesthetics:

| | Fortune Financial Planning | StrataSight |
|---|---|---|
| Background | Warm white / off-white | Deep navy (#0f1923) |
| Accent | Sage green | Amber gold (#c9a84c) |
| Display font | Cormorant Garamond (delicate serif) | Playfair Display (editorial serif) |
| Body font | DM Sans | Outfit |
| Tone | Warm, quiet, fiduciary | Confident, analytical, advisory |

**Shared developer fingerprints (intentional):**
- Nav underline slide from left on hover/active (`scaleX` transform)
- Hamburger `open` class with span rotation animation
- `IntersectionObserver` scroll reveal system (`.reveal` / `.in` + `d1–d5` delay classes)
- `scrolled` / `solid` nav state classes based on page and scroll position
- CSS custom properties throughout

---

## Tech Stack

| Layer | Details |
|---|---|
| Hosting | GitHub Pages (static) |
| Frontend | Vanilla HTML / CSS / JS — no framework, no build step |
| Fonts | Google Fonts — Playfair Display + Outfit |

---

## Project Structure

```
StrataSight/
├── index.html              # Home page
├── CNAME                   # GitHub Pages custom domain
├── css/
│   └── styles.css          # All styles (~700 lines, no preprocessor)
├── js/
│   └── script.js           # Nav, hamburger, reveals, form handler
├── pages/
│   ├── about.html          # About / mission / team
│   ├── services.html       # Full service detail + process + who it's for
│   └── contact.html        # Contact form
└── assets/
    ├── favicon.svg         # Logo mark SVG
    └── hero.mp4            # ← ADD THIS (dark aerial / data viz footage)
```

---

## Wiring Up the Contact Form

The form in `pages/contact.html` uses a JS stub. Replace the stub in `js/script.js`:

**Formspree (recommended, free tier):**
```js
const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first:   document.getElementById('ss-first').value,
    last:    document.getElementById('ss-last').value,
    email:   document.getElementById('ss-email').value,
    company: document.getElementById('ss-company').value,
    revenue: document.getElementById('ss-revenue').value,
    topic:   document.getElementById('ss-topic').value,
    message: document.getElementById('ss-message').value,
  })
});
if (!res.ok) throw new Error('Submit failed');
```

Remove the `await new Promise(...)` stub line.

---

## Hero Video

Save any dark atmospheric video as `assets/hero.mp4`. The video renders at ~7% opacity behind the hero text. Plays at low opacity so the grid and text remain legible regardless of footage choice.

Good options (Pexels free license):
- City aerial night: https://www.pexels.com/video/time-lapse-video-of-city-buildings-1853755/
- Abstract data: https://www.pexels.com/video/digital-technology-background-3129671/
- Dark financial: https://www.pexels.com/video/stock-exchange-financial-data-3191113/

---

## Local Development

No build step. Open `index.html` directly or run:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Use a local server to avoid relative path issues between pages.

---

## Deployment (GitHub Pages)

1. Push repo to GitHub
2. Settings → Pages → source: `main` branch, root `/`
3. Custom domain: `stratasight.net` — CNAME file handles this
4. DNS: point `@` to GitHub Pages IPs, `www` as CNAME to `yourusername.github.io`
