/*
 * What search engines and answer engines read, built from the same words the page shows (content.ts).
 * Many crawlers, including the ones behind AI answer engines, do not run JavaScript, so the page also ships as
 * plain HTML. Visitors whose browsers run JavaScript never see that copy; the interactive page replaces it.
 * Nothing here adds a claim the page does not make: no reviews, ratings, addresses, prices, or client results.
 */
import { SITE } from '../config/site';
import { FIT, HEADINGS, HERO, INTROS, LEGAL, OUR_JOB, PRINCIPLES, SERVICES, STEPS, TEAM, WHO, YOUR_JOB } from './content';

export const SITE_URL = `https://${SITE.domain}/`;
export const DESCRIPTION =
  'StrataSight helps owners of privately held businesses understand what the company is worth and why, improve operations and growth over a period of years, and reach a sale in a strong position.';

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const pairs = (items: string[][]) => `<ul>${items.map(([t, b]) => `<li><strong>${esc(t)}.</strong> ${esc(b)}</li>`).join('')}</ul>`;

/** The page as plain HTML, for readers that do not run JavaScript. */
export function staticHtml(): string {
  return [
    `<header><h1>${esc(HERO.title)}</h1><p>${esc(HERO.lede)}</p><p><a href="#/contact">Schedule a discovery call</a></p></header>`,
    `<main>`,
    `<section><h2>${esc(HEADINGS.fit)}</h2><ol>${FIT.map((f) => `<li><strong>${esc(f.title)}.</strong> ${esc(f.body)}</li>`).join('')}</ol></section>`,
    `<section id="services"><h2>${esc(HEADINGS.services)}</h2><p>${esc(INTROS.services)}</p>${SERVICES.map(
      (s) => `<article><h3>${esc(s.title)}</h3>${s.body.map((p) => `<p>${esc(p)}</p>`).join('')}<p>What is included:</p>${list(s.included)}</article>`,
    ).join('')}</section>`,
    `<section id="who"><h2>${esc(HEADINGS.who)}</h2><p>${esc(INTROS.who)}</p>${list(WHO)}</section>`,
    `<section><h2>${esc(HEADINGS.ourJob)}</h2><h3>What we do</h3>${pairs(OUR_JOB)}<h3>What we ask of you</h3>${pairs(YOUR_JOB)}</section>`,
    `<section id="engagement"><h2>${esc(HEADINGS.how)}</h2><ol>${STEPS.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join('')}</ol></section>`,
    `<section id="about"><h2>${esc(HEADINGS.principles)}</h2>${INTROS.about.map((p) => `<p>${esc(p)}</p>`).join('')}${pairs(PRINCIPLES)}<h3>${esc(HEADINGS.team)}</h3><ul>${TEAM.map(
      (m) => `<li><strong>${esc(m.name)}</strong>, ${esc(m.role)}. ${esc(m.bio)} ${esc(m.skills.join(', '))}.</li>`,
    ).join('')}</ul></section>`,
    `<section id="contact"><h2>${esc(HEADINGS.contact)}</h2><p>Email <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a> to arrange a first conversation.</p></section>`,
    `</main>`,
    `<footer><p>${esc(LEGAL.advisory)}</p><p>${esc(LEGAL.synthetic)}</p></footer>`,
  ].join('');
}

/** Structured data: who StrataSight is and the three services, as schema.org describes a professional service. */
export function jsonLd(): string {
  const org = `${SITE_URL}#organization`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': org,
        name: SITE.name,
        url: SITE_URL,
        email: SITE.contactEmail,
        description: HERO.lede,
        logo: `${SITE_URL}apple-touch-icon.png`,
        image: `${SITE_URL}og.png`,
        knowsAbout: ['Business valuation', 'Exit planning', 'Operational efficiency', 'Growth strategy', 'Privately held companies'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Advisory services',
          itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.body[0], provider: { '@id': org } } })),
        },
      },
      { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: SITE.name, description: DESCRIPTION, publisher: { '@id': org } },
    ],
  };
  // A closing script tag inside the data would end the script early.
  return JSON.stringify(data).replace(/<\//g, '<\\/');
}

/** llms.txt: a plain summary for AI tools, following the llms.txt convention. */
export function llmsTxt(): string {
  return [
    `# ${SITE.name}`,
    '',
    `> ${HERO.lede}`,
    '',
    `Site: ${SITE_URL}`,
    `Contact: ${SITE.contactEmail}`,
    '',
    '## Services',
    '',
    ...SERVICES.flatMap((s) => [`### ${s.title}`, '', ...s.body, '', 'Included:', ...s.included.map((i) => `- ${i}`), '']),
    `## ${HEADINGS.who}`,
    '',
    ...WHO.map((w) => `- ${w}`),
    '',
    `## ${HEADINGS.how}`,
    '',
    ...STEPS.map((s, i) => `${i + 1}. ${s.title}. ${s.body}`),
    '',
    '## Principles',
    '',
    ...PRINCIPLES.map(([t, b]) => `- ${t}: ${b}`),
    '',
    '## Team',
    '',
    ...TEAM.map((m) => `- ${m.name} (${m.role}): ${m.bio}`),
    '',
    '## Scope',
    '',
    LEGAL.advisory,
    '',
  ].join('\n');
}
