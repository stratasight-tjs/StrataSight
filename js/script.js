/* ═══════════════════════════════════════════════════════
   StrataSight — script.js
   Shared developer DNA with Fortune Financial Planning.
   Matching patterns: nav underline, hamburger open/close,
   IntersectionObserver reveals, scroll-based nav state.
═══════════════════════════════════════════════════════ */

/* ─── PAGE SLUG ─── */
function currentPageSlug() {
  const meta = document.querySelector('meta[name="page-slug"]');
  if (meta) return meta.content;
  const file = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  return ['home', 'about', 'services', 'contact'].includes(file) ? file : 'home';
}

/* ─── NAV ACTIVE STATE ─── */
function setNavActive() {
  const slug = currentPageSlug();
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === slug);
  });
}

/* ─── NAV SCROLL STYLE — same logic as FFP ─── */
function updateNavStyle() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const slug = currentPageSlug();
  if (slug !== 'home') {
    nav.classList.add('solid');
    nav.classList.remove('scrolled');
  } else {
    nav.classList.remove('solid');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
}
window.addEventListener('scroll', updateNavStyle, { passive: true });

/* ─── HAMBURGER — same open/close structure as FFP ─── */
function initHamburger() {
  const ham = document.getElementById('ham');
  const drawer = document.getElementById('drawer');
  if (!ham || !drawer) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
}
window.closeDrawer = function () {
  const ham = document.getElementById('ham');
  const drawer = document.getElementById('drawer');
  if (ham) ham.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
};

/* ─── SCROLL REVEAL — IntersectionObserver, same as FFP ─── */
function initReveals() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => observer.observe(el));
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
  const btn = document.getElementById('ssSubmitBtn');
  if (!btn) return;
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('ss-email')?.value?.trim() || '';
    if (!email || !email.includes('@')) {
      formFeedback('Please enter a valid email address.', false);
      return;
    }
    const prevText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Wire this to Formspree, Netlify, or your backend:
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, ... })
    // });
    await new Promise(r => setTimeout(r, 900)); // stub — remove when wired

    formFeedback("Your message has been received. We'll follow up within one business day.", true);
    ['ss-first','ss-last','ss-email','ss-company','ss-revenue','ss-topic','ss-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = ''; }
    });
  });
}

function formFeedback(msg, success) {
  let fb = document.getElementById('ss-feedback');
  if (!fb) {
    fb = document.createElement('p');
    fb.id = 'ss-feedback';
    Object.assign(fb.style, {
      fontFamily: 'var(--font-body)',
      fontSize: '0.84rem',
      fontWeight: '300',
      lineHeight: '1.65',
      marginTop: '0.9rem',
      padding: '0.85rem 1.1rem',
      borderRadius: '3px',
    });
    document.getElementById('ssSubmitBtn')?.insertAdjacentElement('afterend', fb);
  }
  fb.textContent = msg;
  fb.style.background = success ? 'rgba(201,168,76,0.1)' : 'rgba(180,60,60,0.1)';
  fb.style.color = success ? 'var(--gold-lt)' : '#e07070';
  fb.style.border = success ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(180,60,60,0.2)';
}

/* ─── FOOTER YEAR ─── */
function setYear() {
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  setNavActive();
  updateNavStyle();
  initHamburger();
  initReveals();
  initContactForm();
  setYear();
});
