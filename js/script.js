/* ═══════════════════════════════════
   StrataSight — script.js
═══════════════════════════════════ */

// Page slug
function pageSlug() {
  const m = document.querySelector('meta[name="page-slug"]');
  if (m) return m.content;
  const f = location.pathname.split('/').pop().replace('.html','') || 'home';
  return ['home','about','services','contact'].includes(f) ? f : 'home';
}

// Nav active + scroll state
function navSetup() {
  const nav = document.getElementById('nav');
  const slug = pageSlug();
  if (!nav) return;

  // Active link
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset && a.dataset.page === slug) a.classList.add('active');
  });

  // Scroll behavior
  const isHome = slug === 'home';
  function update() {
    if (!isHome) {
      nav.classList.add('solid');
    } else {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// Hamburger
function initHam() {
  const ham = document.getElementById('ham');
  const drawer = document.getElementById('drawer');
  if (!ham || !drawer) return;
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Reveal on scroll
function initReveals() {
  const els = document.querySelectorAll('.reveal-up, .reveal-slide');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

// Counter animation
function animateCounters() {
  document.querySelectorAll('.mi-val[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target % 1 === 0 ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(tick); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
  });
}

// Contact form
function initForm() {
  const btn = document.getElementById('ssSubmitBtn');
  if (!btn) return;
  btn.addEventListener('click', async e => {
    e.preventDefault();
    const email = document.getElementById('ss-email')?.value?.trim() || '';
    if (!email || !email.includes('@')) {
      showFeedback('Please enter a valid email address.', false);
      return;
    }
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // ── Wire Formspree here ──
    // const res = await fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ... }) });

    await new Promise(r => setTimeout(r, 900)); // stub
    showFeedback("We'll be in touch within one business day.", true);
    ['ss-first','ss-last','ss-email','ss-company','ss-revenue','ss-topic','ss-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.tagName === 'SELECT' ? el.selectedIndex = 0 : el.value = '';
    });
    btn.textContent = orig;
    btn.disabled = false;
  });
}

function showFeedback(msg, ok) {
  let fb = document.getElementById('ss-feedback');
  if (!fb) {
    fb = document.createElement('p');
    fb.id = 'ss-feedback';
    Object.assign(fb.style, {
      fontFamily: 'var(--font-body)', fontSize: '0.83rem', fontWeight: '400',
      lineHeight: '1.6', marginTop: '0.75rem', padding: '0.8rem 1rem',
      borderRadius: '8px',
    });
    document.getElementById('ssSubmitBtn')?.insertAdjacentElement('afterend', fb);
  }
  fb.textContent = msg;
  fb.style.background = ok ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.07)';
  fb.style.color = ok ? 'var(--green)' : '#dc2626';
  fb.style.border = ok ? '1px solid rgba(22,163,74,0.2)' : '1px solid rgba(220,38,38,0.2)';
}

// Year
function setYear() {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
}

// Number ticker for hero card (cosmetic)
function heroTicker() {
  const val = document.querySelector('.metric-val');
  if (!val) return;
  const nums = ['$3.8M', '$4.0M', '$4.1M', '$4.2M'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % nums.length;
    val.style.opacity = '0';
    val.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      val.textContent = nums[i];
      val.style.transition = 'opacity 0.3s, transform 0.3s';
      val.style.opacity = '1';
      val.style.transform = 'none';
    }, 200);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  navSetup();
  initHam();
  initReveals();
  animateCounters();
  initForm();
  setYear();
  heroTicker();
});
