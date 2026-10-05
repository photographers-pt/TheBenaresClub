/*
 * i18n.js — selector de idioma y traductor para todo el sitio (PT / EN / ES)
 *
 * Cómo funciona
 *  - El idioma activo vive en localStorage ('site-lang'). Se puede forzar con ?lang=pt|en|es.
 *  - Traduce el texto visible del DOM (nodos de texto + atributos alt, title, placeholder,
 *    aria-label) buscándolo en el diccionario de /i18n-dict.js. El texto original de cada
 *    nodo se recuerda, así que se puede cambiar de idioma las veces que se quiera.
 *  - Un MutationObserver traduce también lo que las páginas generan después con JavaScript
 *    (fichas de películas, productos, modales, carrito...).
 *  - Los elementos con data-lang="pt|en|es" (formato antiguo) se siguen mostrando/ocultando
 *    igual que antes y el traductor no los toca.
 *  - Para excluir algo de la traducción: data-i18n-skip o translate="no".
 *
 * API: window.i18n = { lang(), setLang(l), t(texto), missing() }
 *      Evento: document 'langchange' con detail.lang
 *
 * Para añadir un texto nuevo: añadir una fila [pt, en, es] a /i18n-dict.js.
 */
(function () {
  'use strict';

  var LANGS = ['pt', 'en', 'es'];
  var HTML_LANG = { pt: 'pt-PT', en: 'en', es: 'es' };
  var STORAGE_KEY = 'site-lang';
  var ATTRS = ['alt', 'title', 'placeholder', 'aria-label'];
  var ATTR_SEL = '[alt],[title],[placeholder],[aria-label]';
  var META_SEL = 'meta[name="description"],meta[property="og:description"],meta[property="og:title"],meta[name="twitter:description"]';
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, TEXTAREA: 1, IFRAME: 1 };
  var SEPARATORS = [' · ', ' — ', ' – ', ' | ', ' • '];
  var AFFIX = '[→↗↘←↑↓✓✔«»•★\\s\\uFE0F\\p{Extended_Pictographic}]*';
  var AFFIX_RE = new RegExp('^(' + AFFIX + ')([\\s\\S]*?)(' + AFFIX + ')$', 'u');

  /* ── almacenamiento seguro ─────────────────────────────── */
  function storeGet() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* modo privado */ } }

  function readLang() {
    var m = /[?&]lang=(pt|en|es)(?:&|#|$)/.exec(location.search);
    if (m) { storeSet(m[1]); return m[1]; }
    var s = storeGet();
    return LANGS.indexOf(s) >= 0 ? s : 'pt';
  }

  /* ── diccionario ───────────────────────────────────────── */
  var index = new Map();
  var patterns = [];
  var keep = new Map();
  var keepRe = [];

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function hasLetters(s) { return /\p{L}/u.test(s); }

  function buildIndex() {
    var dict = window.I18N_DICT || {};
    (dict.entries || []).forEach(function (e) {
      for (var i = 0; i < LANGS.length; i++) {
        var k = norm(e[i] == null ? '' : e[i]);
        if (k && !index.has(k)) index.set(k, e);
      }
    });
    patterns = dict.patterns || [];
    (dict.keep || []).forEach(function (k) { keep.set(norm(k), 1); });
    keepRe = dict.keepRe || [];
  }

  /* Traduce un texto ya normalizado. Devuelve null si no hay traducción. */
  function translateNorm(n, li, depth) {
    if (!n) return null;
    var e = index.get(n);
    if (e) return e[li];

    for (var i = 0; i < patterns.length; i++) {
      var p = patterns[i];
      var m = p.re.exec(n);
      if (m) {
        if (typeof p.fn === 'function') {
          var r = p.fn(m, LANGS[li], function (s) { var t = translateNorm(norm(s), li, depth + 1); return t == null ? s : t; });
          if (r != null) return r;
        } else if (p.t) {
          return p.t[li].replace(/\$(\d)/g, function (_, d) { return m[+d] == null ? '' : m[+d]; });
        }
      }
    }

    if (depth < 3) {
      // símbolos al principio/final (→ ↗ ✓ emojis...) se conservan y se traduce el resto
      var am = AFFIX_RE.exec(n);
      if (am && (am[1] || am[3]) && am[2]) {
        var core = translateNorm(am[2], li, depth + 1);
        if (core != null) return am[1] + core + am[3];
      }
      // "A · B — C": se traduce cada trozo por separado
      for (var s = 0; s < SEPARATORS.length; s++) {
        var sep = SEPARATORS[s];
        if (n.indexOf(sep) > 0) {
          var parts = n.split(sep), changed = false;
          var out = parts.map(function (part) {
            var t = translateNorm(part.trim(), li, depth + 1);
            if (t != null) { changed = true; return t; }
            return part;
          });
          if (changed) return out.join(sep);
        }
      }
    }
    return null;
  }

  /* Traduce conservando los espacios de los extremos. null = sin traducción. */
  function translate(str, lang) {
    var n = norm(str);
    if (!n || !hasLetters(n)) return null;
    var t = translateNorm(n, LANGS.indexOf(lang), 0);
    if (t == null) return null;
    var lead = /^\s*/.exec(str)[0], trail = /\s*$/.exec(str)[0];
    return lead + t + trail;
  }

  /* ── estado ────────────────────────────────────────────── */
  var current = 'pt';
  var textOrig = new WeakMap();   // nodo de texto -> texto original de la página
  var textOut = new WeakMap();    // nodo de texto -> último texto que escribimos nosotros
  var attrState = new WeakMap();  // elemento -> { attr: { orig, out } }

  function isSkipped(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    while (el && el.nodeType === 1) {
      if (SKIP_TAGS[el.tagName] || el.hasAttribute('data-lang') || el.hasAttribute('data-i18n-skip') || el.getAttribute('translate') === 'no') return true;
      el = el.parentNode;
    }
    return false;
  }

  function processText(node) {
    if (isSkipped(node)) return;
    var cur = node.nodeValue;
    var written = textOut.get(node);
    var orig = textOrig.get(node);
    if (orig === undefined || cur !== written) { orig = cur; textOrig.set(node, orig); }   // la página cambió el texto
    var t = translate(orig, current);
    var target = t == null ? orig : t;
    textOut.set(node, target);
    if (cur !== target) node.nodeValue = target;
  }

  function processAttr(el, attr) {
    if (isSkipped(el)) return;
    var cur = el.getAttribute(attr);
    if (cur == null) return;
    var st = attrState.get(el); if (!st) { st = {}; attrState.set(el, st); }
    var rec = st[attr];
    if (!rec || cur !== rec.out) { rec = st[attr] = { orig: cur, out: cur }; }
    var t = translate(rec.orig, current);
    var target = t == null ? rec.orig : t;
    rec.out = target;
    if (cur !== target) el.setAttribute(attr, target);
  }

  function processElementAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) if (el.hasAttribute(ATTRS[i])) processAttr(el, ATTRS[i]);
  }

  function processTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    var base = root.nodeType === 9 ? root.documentElement : root;
    if (!base || (base.nodeType === 1 && isSkipped(base))) return;
    var w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) processText(n);
    if (base.nodeType === 1) {
      processElementAttrs(base);
      var els = base.querySelectorAll(ATTR_SEL);
      for (var i = 0; i < els.length; i++) processElementAttrs(els[i]);
    }
  }

  function processMeta() {
    var metas = document.querySelectorAll(META_SEL);
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i], st = attrState.get(m); if (!st) { st = {}; attrState.set(m, st); }
      var rec = st.content || (st.content = { orig: m.getAttribute('content') || '' });
      var t = translate(rec.orig, current);
      m.setAttribute('content', t == null ? rec.orig : t);
    }
  }

  /* ── observador: traduce el contenido que se añade con JS ── */
  var observer = null;
  function startObserver() {
    if (observer || !window.MutationObserver) return;
    observer = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.type === 'childList') {
          for (var j = 0; j < r.addedNodes.length; j++) processTree(r.addedNodes[j]);
        } else if (r.type === 'characterData') {
          processText(r.target);
        } else if (r.type === 'attributes') {
          processAttr(r.target, r.attributeName);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  /* ── elementos data-lang (formato antiguo) ─────────────── */
  function syncDataLang() {
    for (var i = 0; i < LANGS.length; i++) {
      var l = LANGS[i];
      var els = document.querySelectorAll('[data-lang="' + l + '"]');
      for (var j = 0; j < els.length; j++) els[j].classList.toggle('active', l === current);
    }
  }

  /* ── selector de idioma (PT | EN | ES) ─────────────────── */
  function syncSwitchers() {
    var btns = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-set-lang') === current;
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function switcherHTML(cls) {
    return '<div id="lang-switch" class="lang-switch ' + cls + '" role="group" aria-label="Idioma" translate="no">' +
      LANGS.map(function (l) {
        return '<button type="button" class="lang-opt" data-set-lang="' + l + '" lang="' + l + '" aria-pressed="false">' + l.toUpperCase() + '</button>';
      }).join('') + '</div>';
  }

  function injectStyle() {
    if (document.getElementById('i18n-style')) return;
    var st = document.createElement('style');
    st.id = 'i18n-style';
    st.textContent =
      '.lang-switch{display:inline-flex;align-items:stretch;border:1px solid rgba(240,232,216,.22);border-radius:4px;overflow:hidden;background:rgba(0,0,0,.35);z-index:50}' +
      '.lang-switch .lang-opt{font-family:inherit;font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;line-height:1;color:rgba(240,232,216,.6);background:transparent;border:0;padding:.4rem .5rem;cursor:pointer;transition:color .2s,background .2s}' +
      '.lang-switch .lang-opt+.lang-opt{border-left:1px solid rgba(240,232,216,.14)}' +
      '.lang-switch .lang-opt:hover{color:rgba(240,232,216,.98)}' +
      '.lang-switch .lang-opt[aria-pressed="true"]{color:#000;background:#f0e8d8;cursor:default}' +
      '.lang-switch .lang-opt:focus-visible{outline:2px solid #f0e8d8;outline-offset:-2px}' +
      '.lang-switch--header{position:absolute;right:calc(1rem + 36px + .5rem);top:50%;transform:translateY(-50%)}' +
      '@media (max-width:560px){.lang-switch--header{right:auto;left:1rem}}' +   // el logo va centrado: en móvil el selector pasa a la izquierda para no taparlo
      '@media (max-width:340px){.lang-switch .lang-opt{padding:.38rem .36rem;font-size:.56rem;letter-spacing:.08em}}' +
      '.lang-switch--floating{position:fixed;top:.75rem;right:.75rem}';
    (document.head || document.documentElement).appendChild(st);
  }

  function ensureSwitcher() {
    if (document.querySelector('[data-set-lang]')) { syncSwitchers(); return; }
    if (!document.body) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = switcherHTML('lang-switch--floating');
    document.body.appendChild(wrap.firstChild);
    syncSwitchers();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-set-lang]') : null;
    if (b) setLang(b.getAttribute('data-set-lang'));
  });

  /* ── API ───────────────────────────────────────────────── */
  function setLang(lang, opts) {
    opts = opts || {};
    if (LANGS.indexOf(lang) < 0) lang = 'pt';
    var changed = lang !== current;
    current = lang;
    if (opts.persist !== false) storeSet(lang);
    document.documentElement.lang = HTML_LANG[lang];
    syncDataLang();
    processTree(document);
    processMeta();
    syncSwitchers();
    if (changed || opts.init) document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* Textos que siguen sin traducción en el DOM actual (para revisar el diccionario). */
  function missing() {
    var out = {};
    function consider(orig, depth) {
      var n = norm(orig);
      if (!n || !hasLetters(n) || keep.has(n) || /@|https?:\/\//.test(n)) return;
      for (var r = 0; r < keepRe.length; r++) if (keepRe[r].test(n)) return;
      if (translateNorm(n, 1, 0) != null || translateNorm(n, 2, 0) != null) return;
      if (/…$/.test(n)) {   // texto cortado por la página: vale si es el principio de una frase conocida
        var head = n.slice(0, -1);
        var known = false;
        index.forEach(function (_, k) { if (!known && k.indexOf(head) === 0) known = true; });
        if (known) return;
      }
      var am = AFFIX_RE.exec(n);
      if (am && am[2] && am[2] !== n) { consider(am[2], depth); return; }
      for (var s = 0; s < SEPARATORS.length; s++) {
        if (n.indexOf(SEPARATORS[s]) > 0) {
          n.split(SEPARATORS[s]).forEach(function (part) { consider(part, (depth || 0) + 1); });
          return;
        }
      }
      out[n] = (out[n] || 0) + 1;
    }
    var w = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) { if (!isSkipped(n)) consider(textOrig.has(n) ? textOrig.get(n) : n.nodeValue); }
    var els = document.querySelectorAll(ATTR_SEL);
    for (var i = 0; i < els.length; i++) {
      if (isSkipped(els[i])) continue;
      for (var j = 0; j < ATTRS.length; j++) {
        var a = els[i].getAttribute(ATTRS[j]);
        if (a == null) continue;
        var st = attrState.get(els[i]);
        consider(st && st[ATTRS[j]] ? st[ATTRS[j]].orig : a);
      }
    }
    return Object.keys(out);
  }

  window.i18n = {
    lang: function () { return current; },
    setLang: setLang,
    t: function (s) { var t = translate(String(s), current); return t == null ? s : t; },
    missing: missing,
    LANGS: LANGS
  };

  /* ── arranque ──────────────────────────────────────────── */
  buildIndex();
  current = readLang();
  document.documentElement.lang = HTML_LANG[current];
  injectStyle();
  startObserver();

  function onReady() {
    setLang(current, { init: true, persist: false });
    // la cabecera compartida se inserta en su propio DOMContentLoaded; esperamos a que acabe
    setTimeout(function () { ensureSwitcher(); processTree(document); }, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();   // cargado tarde (p. ej. desde shared.js)

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && LANGS.indexOf(e.newValue) >= 0 && e.newValue !== current) setLang(e.newValue, { persist: false });
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { var l = readLang(); if (l !== current) setLang(l, { persist: false }); }
  });
})();
