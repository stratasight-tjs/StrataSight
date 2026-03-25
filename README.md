# StrataSight
### Business Growth Advisory

Website for [stratasight.net](https://stratasight.net)

## Stack
- Vanilla HTML / CSS / JS — no framework, no build step
- Fonts: Instrument Serif + Geist + Geist Mono (Google Fonts)
- Hosting: GitHub Pages (static)

## Structure
```
StrataSight/
├── index.html
├── CNAME
├── README.md
├── assets/
│   └── favicon.svg
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── pages/
    ├── about.html
    ├── services.html
    └── contact.html
```

## Local Dev
```bash
python3 -m http.server 8080
# or
npx serve .
```

## Contact Form
Wire up Formspree in js/script.js — look for the stub comment in `initForm()`.

## Deployment (GitHub Pages)
1. Push to GitHub
2. Settings → Pages → source: main branch, root /
3. Custom domain: stratasight.net — CNAME file handles this
4. DNS: point @ to GitHub Pages IPs, www as CNAME to yourusername.github.io
