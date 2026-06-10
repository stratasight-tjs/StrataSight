/* ═══════════════════════════════════
   StrataSight — script.js
═══════════════════════════════════ */

function pageSlug() {
  const m = document.querySelector('meta[name="page-slug"]');
  if (m) return m.content;
  const f = location.pathname.split('/').pop().replace('.html','') || 'home';
  return ['home','about','services','contact'].includes(f) ? f : 'home';
}

function navSetup() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const slug = pageSlug();

  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === slug) a.classList.add('active');
  });

  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

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

function animateCounters() {
  document.querySelectorAll('.mi-val[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target % 1 === 0
        ? Math.round(target * ease)
        : (target * ease).toFixed(1);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(tick); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
  });
}

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
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, ... })
    // });

    await new Promise(r => setTimeout(r, 900));
    showFeedback("We'll be in touch within one business day.", true);
    ['ss-first','ss-last','ss-email','ss-company','ss-revenue','ss-goal','ss-message'].forEach(id => {
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
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      lineHeight: '1.6',
      marginTop: '0.75rem',
      padding: '0.8rem 1rem',
      borderRadius: '8px',
    });
    document.getElementById('ssSubmitBtn')?.insertAdjacentElement('afterend', fb);
  }
  fb.textContent = msg;
  fb.style.background = ok ? 'rgba(0,200,122,0.07)' : 'rgba(255,68,102,0.07)';
  fb.style.color = ok ? 'var(--green)' : 'var(--red)';
  fb.style.border = ok ? '1px solid var(--green-border)' : '1px solid rgba(255,68,102,0.25)';
}

function setYear() {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
}

function heroTicker() {
  const val = document.querySelector('.dash-metric-val');
  if (!val) return;
  const nums = ['$1.08M', '$1.14M', '$1.19M', '$1.24M'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % nums.length;
    val.style.transition = 'opacity 0.2s, transform 0.2s';
    val.style.opacity = '0';
    val.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      val.textContent = nums[i];
      val.style.opacity = '1';
      val.style.transform = 'none';
    }, 220);
  }, 3200);
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
