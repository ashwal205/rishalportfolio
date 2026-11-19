/* ==========================================================
   EVERLIGHT STUDIOS — script.js  (vanilla JS, no dependencies)
   ========================================================== */
(function () {
  'use strict';

  /* ---- Edit these to change contact details used by the form ---- */
  var CONFIG = {
    email: 'everlightstudio.co@gmail.com',
    instagram: 'https://www.instagram.com/studios.everlight/'
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var header = $('#siteHeader');
  var navMenu = $('#navMenu');
  var navToggle = $('#navToggle');
  var toTop = $('#toTop');

  /* ---------- Year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Header state + back-to-top visibility ---------- */
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
  }
  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', navMenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- Smooth scrolling (offsets for the fixed header) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    var top = id === '#home' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - 20;
    window.scrollTo({ top: top, behavior: reduceMotion() ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });
  function reduceMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------- Back to top ---------- */
  $$('[data-top]').forEach(function (b) {
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }); });
  });

  /* ---------- Section reveals ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el, i) {
      // light stagger for siblings that enter together
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = $$('a[data-nav]');
  var sections = ['home', 'about', 'portfolio', 'services', 'contact']
    .map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function setActive() {
    var y = window.pageYOffset + window.innerHeight * 0.35;
    var current = 'home';
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---------- Portfolio filter ---------- */
  var gallery = $('#gallery');
  var filters = $$('.filter');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      $$('.g-item', gallery).forEach(function (li) {
        li.classList.toggle('is-hidden', f !== 'all' && li.getAttribute('data-cat') !== f);
      });
      gallery.classList.remove('is-filtering');
      void gallery.offsetWidth; // restart the fade animation
      gallery.classList.add('is-filtering');
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbTitle = $('#lbTitle');
  var lbCat = $('#lbCat');
  var lbCount = $('#lbCount');
  var group = [];
  var idx = 0;
  var lastFocus = null;
  var showToken = 0;

  function collect(name) {
    return $$('a[data-lightbox="' + name + '"]').filter(function (a) {
      var li = a.closest('.g-item');
      return !(li && li.classList.contains('is-hidden'));
    });
  }

  function show(i) {
    idx = (i + group.length) % group.length;
    var a = group[idx];
    var thumb = $('img', a);
    lbImg.classList.add('is-loading');
    var mine = ++showToken; // ignore results from earlier, slower loads
    var probe = new Image();
    probe.onload = probe.onerror = function () {
      if (mine !== showToken) return;
      lbImg.src = a.getAttribute('href');
      lbImg.alt = thumb ? thumb.alt : a.getAttribute('data-title');
      lbImg.classList.remove('is-loading');
    };
    probe.src = a.getAttribute('href');
    lbTitle.textContent = a.getAttribute('data-title') || '';
    lbCat.textContent = a.getAttribute('data-cat-label') || '';
    lbCount.textContent = (idx + 1) + ' / ' + group.length;
    // preload neighbours
    [idx + 1, idx - 1].forEach(function (n) {
      if (group.length > 1) new Image().src = group[(n + group.length) % group.length].getAttribute('href');
    });
  }

  function openLb(link) {
    group = collect(link.getAttribute('data-lightbox'));
    var start = group.indexOf(link);
    if (start < 0) { group = [link]; start = 0; }
    lastFocus = document.activeElement;
    lb.hidden = false;
    lb.classList.toggle('is-single', group.length < 2);
    document.body.classList.add('is-locked');
    show(start);
    requestAnimationFrame(function () { lb.classList.add('is-open'); $('#lbClose').focus(); });
  }

  function closeLb() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () { lb.hidden = true; lbImg.removeAttribute('src'); }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-lightbox]');
    if (a) { e.preventDefault(); openLb(a); }
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
  $('#lbNext').addEventListener('click', function () { show(idx + 1); });
  // click on the dark backdrop closes
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!lb.hidden) closeLb();
      else if (navMenu.classList.contains('is-open')) setMenu(false);
      return;
    }
    if (lb.hidden) return;
    if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'Tab') {
      // keep keyboard focus inside the viewer
      var btns = $$('.lb-btn', lb).filter(function (b) { return b.offsetParent !== null; });
      var first = btns[0], last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // touch swipe
  var sx = 0, sy = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- Service "Enquire" buttons ---------- */
  $$('[data-enquire]').forEach(function (b) {
    b.addEventListener('click', function () {
      var sel = $('#type');
      sel.value = b.getAttribute('data-enquire');
      clearError(sel);
      var contact = document.getElementById('contact');
      window.scrollTo({ top: contact.getBoundingClientRect().top + window.pageYOffset - 20, behavior: reduceMotion() ? 'auto' : 'smooth' });
      setTimeout(function () { $('#name').focus({ preventScroll: true }); }, 700);
    });
  });

  /* ---------- Enquiry form: validation + email link ----------
     This is a static site, so there is no server to receive the form.
     On submit we validate, then open the visitor's email app with the
     enquiry pre-filled (mailto:). See README to swap in Formspree/Netlify. */
  var form = $('#enquiryForm');
  var status = $('#formStatus');

  function fieldOf(el) { return el.closest('.field'); }
  function setError(el, msg) {
    var f = fieldOf(el);
    f.classList.add('has-error');
    el.setAttribute('aria-invalid', 'true');
    $('#' + el.id + '-error').textContent = msg;
  }
  function clearError(el) {
    var f = fieldOf(el);
    f.classList.remove('has-error');
    el.removeAttribute('aria-invalid');
    $('#' + el.id + '-error').textContent = '';
  }

  var rules = {
    name: function (v) { return v.trim().length < 2 ? 'Please enter your name.' : ''; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
    phone: function (v) { return !v.trim() || /^[+()\d\s.-]{6,20}$/.test(v.trim()) ? '' : 'Please enter a valid phone number, or leave it blank.'; },
    type: function (v) { return v ? '' : 'Please choose a type of photography.'; },
    message: function (v) { return v.trim().length < 10 ? 'Please tell us a little about your project (10+ characters).' : ''; }
  };

  function validate(el) {
    var msg = rules[el.name](el.value);
    if (msg) setError(el, msg); else clearError(el);
    return !msg;
  }

  ['name', 'email', 'phone', 'type', 'message'].forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener('blur', function () { if (el.value || el.classList.contains('touched')) validate(el); el.classList.add('touched'); });
    el.addEventListener('input', function () { if (fieldOf(el).classList.contains('has-error')) validate(el); });
    el.addEventListener('change', function () { if (fieldOf(el).classList.contains('has-error')) validate(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    var firstBad = null;
    ['name', 'email', 'phone', 'type', 'message'].forEach(function (n) {
      var el = form.elements[n];
      if (!validate(el) && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }

    var d = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      type: form.elements.type.value,
      message: form.elements.message.value.trim()
    };
    var subject = 'Photography enquiry: ' + d.type + ' (' + d.name + ')';
    var body = 'Hello Everlight Studios,\n\n' + d.message +
      '\n\n---\nName: ' + d.name +
      '\nEmail: ' + d.email +
      (d.phone ? '\nPhone: ' + d.phone : '') +
      '\nType of photography: ' + d.type;

    var href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = href;

    status.className = 'form__status is-ok';
    status.innerHTML = 'Opening your email app with your enquiry ready to send. Nothing opened? ' +
      '<button type="button" id="copyEmail">Copy our email address</button>.';
    var copy = $('#copyEmail');
    copy.addEventListener('click', function () {
      var done = function () { status.textContent = 'Copied: ' + CONFIG.email; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONFIG.email).then(done, function () { status.textContent = 'Please email us at ' + CONFIG.email; });
      } else {
        status.textContent = 'Please email us at ' + CONFIG.email;
      }
    });
  });
})();
