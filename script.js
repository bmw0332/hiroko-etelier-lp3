/* =========================================================
   Etelier LP — script.js
   ========================================================= */
(function () {
  'use strict';

  var CFG = window.ETELIER_CONFIG || {};

  /* ---------- Apply LINE URL from single config ---------- */
  if (CFG.LINE_URL && CFG.LINE_URL.indexOf('[') === -1) {
    document.querySelectorAll('a[href="[LINE登録URL]"]').forEach(function (a) {
      a.setAttribute('href', CFG.LINE_URL);
    });
  }

  /* ---------- Load GA4 if ID provided ---------- */
  if (CFG.GA4_ID && CFG.GA4_ID.indexOf('G-') === 0) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CFG.GA4_ID);
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count up (stats / big numbers) ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduceMotion) { return; }
    var isPadded = el.textContent.trim().length === 2 && el.textContent.trim()[0] === '0';
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = Math.floor(p * target);
      el.textContent = isPadded ? ('0' + val).slice(-2) : val;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = isPadded ? ('0' + target).slice(-2) : target;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Sticky CTA: hide when hero or final CTA visible ---------- */
  var sticky = document.getElementById('stickyCta');
  var finalCta = document.querySelector('.final-cta');
  if (sticky && 'IntersectionObserver' in window) {
    var hideOn = [document.querySelector('.hero'), finalCta].filter(Boolean);
    var visibleCount = 0;
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visibleCount += e.isIntersecting ? 1 : -1;
      });
      sticky.style.opacity = visibleCount > 0 ? '0' : '1';
      sticky.style.pointerEvents = visibleCount > 0 ? 'none' : 'auto';
    }, { threshold: 0.3 });
    hideOn.forEach(function (el) { sio.observe(el); });
  }

  /* ---------- GA4 events ---------- */
  function track(name, params) {
    if (typeof window.gtag === 'function') { window.gtag('event', name, params || {}); }
    else if (window.dataLayer) { window.dataLayer.push(Object.assign({ event: name }, params || {})); }
  }

  // CTA clicks
  document.querySelectorAll('[data-cta]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      track('line_cta_click', { placement: btn.getAttribute('data-cta') });
    });
  });

  // FAQ open/close
  document.querySelectorAll('.faq-item').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() });
    });
  });

  // Scroll depth + section reach
  var depthHit = {};
  [25, 50, 75, 90].forEach(function (d) { depthHit[d] = false; });
  function onScroll() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    [25, 50, 75, 90].forEach(function (d) {
      if (!depthHit[d] && scrolled >= d) { depthHit[d] = true; track('scroll_depth', { percent: d }); }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });

  // section reach (cases + gift)
  var sectionMap = [
    { sel: '.case-pink', name: 'case1' },
    { sel: '.case-lav', name: 'case2' },
    { sel: '.gift', name: 'gift' }
  ];
  if ('IntersectionObserver' in window) {
    sectionMap.forEach(function (m) {
      var el = document.querySelector(m.sel);
      if (!el) return;
      var o = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { track('section_reach', { section: m.name }); o.unobserve(el); }
        });
      }, { threshold: 0.3 });
      o.observe(el);
    });
  }
})();
