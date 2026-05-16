/* ============================================================
   Club Benares — Shared Nav + Cursor + UI Logic
   benares-nav.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Apply saved theme immediately (belt-and-suspenders) ── */
  (function () {
    var t = localStorage.getItem('theme');
    if (t === 'light') document.documentElement.classList.add('light');
  })();

  /* ── Custom Cursor ─────────────────────────────────────────── */
  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var cx = mx;
  var cy = my;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.classList.remove('cursor--hidden');
  });

  document.addEventListener('mouseleave', function () {
    cursor.classList.add('cursor--hidden');
  });

  document.addEventListener('mouseenter', function () {
    cursor.classList.remove('cursor--hidden');
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    cx = lerp(cx, mx, 0.15);
    cy = lerp(cy, my, 0.15);
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  var hoverSelector = 'a, button, .filter-pill, .motivo-chip, .event-row, .film-card, .product-card, .member-card, .gallery-card, .project-card, .plan-card, .team-card, .ticker__item';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverSelector)) {
      cursor.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverSelector)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  /* ── Nav Injection ─────────────────────────────────────────── */
  var path = window.location.pathname;

  function isActive(href) {
    if (href === '/') return path === '/' || path === '/index.html';
    return path.startsWith(href);
  }

  /* Nav link definitions — keys match i18n keys */
  var navDefs = [
    { href: '/eventos/',   key: 'nav.eventos' },
    { href: '/ok/',        key: 'nav.ok' },
    { href: '/streaming/', key: 'nav.streaming' },
    { href: '/proyectos/', key: 'nav.proyectos' },
    { href: '/comunidad/', key: 'nav.comunidad' },
    { href: '/mercado/',   key: 'nav.mercado' },
    { href: '/contactos/', key: 'nav.contactos' },
  ];

  function buildNavLinks() {
    return navDefs.map(function (l) {
      var cls = isActive(l.href) ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + ' data-i18n="' + l.key + '">' + l.key + '</a>';
    }).join('');
  }

  function buildDrawerLinks() {
    return navDefs.map(function (l) {
      var cls = isActive(l.href) ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + ' data-i18n="' + l.key + '">' + l.key + '</a>';
    }).join('') +
    '<a href="/ok/" style="color:var(--white);margin-top:0.5rem" data-i18n="nav.cta">nav.cta</a>';
  }

  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML =
    '<a href="/" class="nav__logo">Club Benares</a>' +
    '<div class="nav__links">' +
      buildNavLinks() +
    '</div>' +
    '<div class="nav__right">' +
      '<div class="lang-switcher">' +
        '<button class="lang-btn" data-lang="pt">PT</button>' +
        '<span class="lang-sep">·</span>' +
        '<button class="lang-btn" data-lang="es">ES</button>' +
        '<span class="lang-sep">·</span>' +
        '<button class="lang-btn" data-lang="en">EN</button>' +
      '</div>' +
      '<button class="theme-toggle" aria-label="Toggle theme">☾</button>' +
      '<a href="/ok/" class="btn-ghost btn-sm" data-i18n="nav.cta">nav.cta</a>' +
    '</div>' +
    '<button class="nav__burger" aria-label="Menú">' +
      '<span></span><span></span><span></span>' +
    '</button>';

  var drawer = document.createElement('div');
  drawer.className = 'nav__drawer';
  drawer.innerHTML = buildDrawerLinks();

  document.body.insertBefore(nav, document.body.firstChild);
  document.body.insertBefore(drawer, document.body.children[1]);

  /* ── Lang switcher wiring ───────────────────────────────────── */
  function updateLangButtons(lang) {
    nav.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  nav.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.dataset.lang;
      if (window.BenaresI18n) {
        window.BenaresI18n.setLang(lang);
      }
      updateLangButtons(lang);
    });
  });

  /* Set initial active state */
  var savedLang = localStorage.getItem('lang') || 'pt';
  updateLangButtons(savedLang);

  /* ── Theme toggle wiring ────────────────────────────────────── */
  var themeBtn = nav.querySelector('.theme-toggle');

  function updateThemeIcon() {
    var isLight = document.documentElement.classList.contains('light');
    themeBtn.textContent = isLight ? '☀' : '☾';
  }

  updateThemeIcon();

  themeBtn.addEventListener('click', function () {
    var isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
  });

  /* ── Burger ──────────────────────────────────────────────────── */
  var burger = nav.querySelector('.nav__burger');
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });

  /* ── Footer Injection ──────────────────────────────────────── */
  var footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML =
    '<div class="container">' +
      '<div class="footer__grid">' +
        '<div>' +
          '<div class="footer__brand">Club Benares</div>' +
          '<p class="footer__desc" data-i18n="footer.desc">footer.desc</p>' +
          '<p class="footer__desc" style="margin-top:0.5rem;color:var(--gray-600);">@thebenaresclub</p>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title" data-i18n="footer.events">footer.events</div>' +
          '<div class="footer__links">' +
            '<a href="/eventos/">.OK Festival</a>' +
            '<a href="/eventos/">Night Lounge</a>' +
            '<a href="/eventos/">MashUp</a>' +
            '<a href="/eventos/">Circuito Nacional</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title" data-i18n="footer.community">footer.community</div>' +
          '<div class="footer__links">' +
            '<a href="/comunidad/">Miembros</a>' +
            '<a href="/comunidad/">Galería</a>' +
            '<a href="/proyectos/">Proyectos</a>' +
            '<a href="/streaming/">Streaming</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title" data-i18n="footer.shop">footer.shop</div>' +
          '<div class="footer__links">' +
            '<a href="/mercado/">Accesorios</a>' +
            '<a href="/mercado/">LUTs</a>' +
            '<a href="/mercado/">Educación</a>' +
            '<a href="/mercado/">Merch</a>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title" data-i18n="footer.contact">footer.contact</div>' +
          '<div class="footer__links">' +
            '<a href="/contactos/">charlie@thebenaresclub.com</a>' +
            '<a href="/contactos/">Colaborar</a>' +
            '<a href="/contactos/">Prensa</a>' +
            '<a href="/contactos/">Partners</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
        '<div class="footer__legal" data-i18n="footer.legal">footer.legal</div>' +
        '<div class="footer__wordmark">Club Benares</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(footer);

  /* ── Apply i18n after nav + footer injection ─────────────────── */
  if (window.BenaresI18n) {
    window.BenaresI18n.apply();
  }

  /* ── Filter Pills ──────────────────────────────────────────── */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var pills = group.querySelectorAll('.filter-pill');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        var filter = pill.dataset.filter;
        var targetSel = group.dataset.filterTarget;
        if (!targetSel) return;

        document.querySelectorAll(targetSel).forEach(function (item) {
          if (filter === 'all' || !item.dataset.cat || item.dataset.cat.split(' ').indexOf(filter) !== -1) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  /* ── Motivo Chips (contact form) ───────────────────────────── */
  document.querySelectorAll('.motivo-chips').forEach(function (group) {
    group.querySelectorAll('.motivo-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        group.querySelectorAll('.motivo-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
      });
    });
  });

  /* ── Countdown Timer ───────────────────────────────────────── */
  var countdownEl = document.getElementById('countdown-timer');
  if (countdownEl) {
    var target = new Date('2026-06-04T20:00:00');
    var days    = countdownEl.querySelector('[data-unit="days"]');
    var hours   = countdownEl.querySelector('[data-unit="hours"]');
    var minutes = countdownEl.querySelector('[data-unit="minutes"]');
    var seconds = countdownEl.querySelector('[data-unit="seconds"]');

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var now  = new Date();
      var diff = Math.max(0, target - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000)  / 60000);
      var s = Math.floor((diff % 60000)    / 1000);
      if (days)    days.textContent    = pad(d);
      if (hours)   hours.textContent   = pad(h);
      if (minutes) minutes.textContent = pad(m);
      if (seconds) seconds.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── Funding Bar Animate ───────────────────────────────────── */
  var bars = document.querySelectorAll('.funding-bar__fill[data-pct]');
  if (bars.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.pct + '%';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    bars.forEach(function (bar) {
      bar.style.width = '0%';
      io.observe(bar);
    });
  }

})();
