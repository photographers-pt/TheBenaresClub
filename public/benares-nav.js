/* =========================================================
   Club Benares — Shared Nav + Cursor
   benares-nav.js
   ========================================================= */

(function () {
  'use strict';

  /* ── Cursor ─────────────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .pill, .event-row, .film-card, .product-card, .member-card, .gallery-card, .project-card')) {
      cursor.classList.add('cursor--large');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .pill, .event-row, .film-card, .product-card, .member-card, .gallery-card, .project-card')) {
      cursor.classList.remove('cursor--large');
    }
  });

  /* ── Nav Injection ──────────────────────────────────────── */
  const path = window.location.pathname;

  function isActive(href) {
    if (href === '/') return path === '/' || path === '/index.html';
    return path.startsWith(href);
  }

  const navLinks = [
    { href: '/eventos/',    label: 'Eventos' },
    { href: '/ok/',         label: '.OK' },
    { href: '/streaming/',  label: 'Streaming' },
    { href: '/proyectos/',  label: 'Proyectos' },
    { href: '/comunidad/',  label: 'Comunidad' },
    { href: '/mercado/',    label: 'Tienda' },
    { href: '/contactos/',  label: 'Contacto' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="/" class="nav__logo">Club Benares</a>
    <div class="nav__links">
      ${navLinks.map(l =>
        `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ''}>${l.label}</a>`
      ).join('')}
    </div>
    <div class="nav__right">
      <span class="nav__lang">ES / PT</span>
      <a href="/ok/" class="btn-ghost" style="font-size:0.7rem;padding:0.45em 1em;">Enviar corto →</a>
    </div>
  `;

  document.body.insertBefore(nav, document.body.firstChild);

  /* ── Footer Injection ───────────────────────────────────── */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__col-title">Club Benares</div>
          <p class="footer__col-about">Un club abierto a cineastas, estudiantes, aficionados y curiosos. Lisboa, desde 2023.</p>
          <p class="footer__col-about" style="margin-top:8px;">@thebenaresclub</p>
        </div>
        <div>
          <div class="footer__col-title">Eventos</div>
          <div class="footer__links">
            <a href="/eventos/">.OK Festival</a>
            <a href="/eventos/">Night Lounge</a>
            <a href="/eventos/">MashUp</a>
            <a href="/eventos/">Circuito Nacional</a>
          </div>
        </div>
        <div>
          <div class="footer__col-title">Comunidad</div>
          <div class="footer__links">
            <a href="/comunidad/">Miembros</a>
            <a href="/comunidad/">Galería</a>
            <a href="/proyectos/">Proyectos</a>
            <a href="/streaming/">Streaming</a>
          </div>
        </div>
        <div>
          <div class="footer__col-title">Tienda</div>
          <div class="footer__links">
            <a href="/mercado/">Accesorios</a>
            <a href="/mercado/">LUTs</a>
            <a href="/mercado/">Educación</a>
            <a href="/mercado/">Merch</a>
          </div>
        </div>
        <div>
          <div class="footer__col-title">Contacto</div>
          <div class="footer__links">
            <a href="/contactos/">hola@thebenaresclub.com</a>
            <a href="/contactos/">Colaborar</a>
            <a href="/contactos/">Prensa</a>
            <a href="/contactos/">Partners</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="footer__legal">© 2026 Club Benares · Lisboa · Todos los derechos reservados</div>
        <div class="footer__wordmark">Club Benares</div>
      </div>
    </div>
  `;
  document.body.appendChild(footer);

  /* ── Filter Pills ───────────────────────────────────────── */
  document.querySelectorAll('.filter-pills').forEach(container => {
    container.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        const target = container.dataset.target;
        if (!target) return;

        document.querySelectorAll(target).forEach(item => {
          if (filter === 'all' || !item.dataset.cat || item.dataset.cat.includes(filter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

})();
