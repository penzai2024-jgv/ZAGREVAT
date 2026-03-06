  /* ── THEME ──────────────────────────────────────── */
  const root     = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent      = isDark ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  });

  /* ── MOBILE MENU ────────────────────────────────── */
  const menuBtn   = document.getElementById('menuBtn');
  const mobMenu   = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  function focusable() {
    return [...mobMenu.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')];
  }

  function openMenu() {
    mobMenu.classList.add('is-open');
    mobMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.classList.add('no-scroll');
    setTimeout(() => { const f = focusable(); if (f.length) f[0].focus(); }, 420);
  }

  function closeMenu() {
    mobMenu.classList.remove('is-open');
    mobMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.classList.remove('no-scroll');
    menuBtn.focus();
  }

  menuBtn.addEventListener('click', () => mobMenu.classList.contains('is-open') ? closeMenu() : openMenu());
  menuClose.addEventListener('click', closeMenu);

  // close on any [data-close] link click
  mobMenu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMenu));

  // Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobMenu.classList.contains('is-open')) closeMenu(); });

  // Focus trap
  mobMenu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const items = focusable();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });

  /* ── SCROLL REVEAL ──────────────────────────────── */
  new IntersectionObserver((entries, o) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 80);
        o.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' })
  .observe.bind(null); // trick to avoid re-declaring; real observe below

  const revObs = new IntersectionObserver((entries, o) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 80);
        o.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

  /* ── METRIC BARS ────────────────────────────────── */
  const barObs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        o.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  document.querySelectorAll('.mfill').forEach(b => barObs.observe(b));
