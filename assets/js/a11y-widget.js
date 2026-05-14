/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  ZAGREVAT — a11y-widget.js                          ║
 * ║  Widget de Accesibilidad nativo · WCAG 2.2 AA        ║
 * ║  Compatible con main.js y components_menu.js         ║
 * ║  Sin dependencias · ES5+ · IIFE                      ║
 * ╚══════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  /* ── Referencias DOM ──────────────────────────────── */
  var trigger  = document.getElementById('awTrigger');
  var panel    = document.getElementById('awPanel');
  var closeBtn = document.getElementById('awClose');
  var resetBtn = document.getElementById('awReset');
  var fsUpBtn  = document.getElementById('awFsUp');
  var fsDnBtn  = document.getElementById('awFsDown');
  var fsVal    = document.getElementById('awFsVal');
  var announce = document.getElementById('a11y-announce');
  var readLine = document.getElementById('awReadingLine');
  var body     = document.body;

  /* Guard — salir si el widget no está en el DOM */
  if (!trigger || !panel) return;

  /* ── Estado inicial (desde localStorage) ─────────── */
  var FS_STEP = 10, FS_MIN = 80, FS_MAX = 160;
  var state = loadState();

  /* ════════════════════════════════════════════════════
     ABRIR / CERRAR PANEL
     ════════════════════════════════════════════════════ */
  var lastFocus = null;

  function getFocusable() {
    return Array.from(panel.querySelectorAll(
      'button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  function openPanel() {
    lastFocus = document.activeElement;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Cerrar menú de accesibilidad');
    say('Menú de accesibilidad abierto');
    /* Esperar a que termine la animación antes de mover el foco */
    setTimeout(function () {
      var items = getFocusable();
      if (items.length) items[0].focus();
    }, 300);
  }

  function closePanel() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Abrir menú de accesibilidad');
    say('Menú de accesibilidad cerrado');
    if (lastFocus) lastFocus.focus();
  }

  trigger.addEventListener('click', function () {
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  /* Escape cierra el panel (sin interferir con el menú móvil de main.js) */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  /* Focus trap dentro del panel */
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var items = getFocusable();
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  /* ════════════════════════════════════════════════════
     TAMAÑO DE TEXTO
     ════════════════════════════════════════════════════ */
  function applyFontSize(announce_it) {
    document.documentElement.style.fontSize = state.fontSize + '%';
    if (fsVal) fsVal.textContent = state.fontSize + '%';
    if (announce_it) say('Tamaño de texto: ' + state.fontSize + '%');
    saveState();
  }

  fsUpBtn.addEventListener('click', function () {
    if (state.fontSize >= FS_MAX) return;
    state.fontSize = Math.min(state.fontSize + FS_STEP, FS_MAX);
    applyFontSize(true);
  });
  fsDnBtn.addEventListener('click', function () {
    if (state.fontSize <= FS_MIN) return;
    state.fontSize = Math.max(state.fontSize - FS_STEP, FS_MIN);
    applyFontSize(true);
  });

  /* ════════════════════════════════════════════════════
     FEATURES — definición y binding
     ════════════════════════════════════════════════════ */
  var features = [
    { id: 'awContrast', cls: 'aw-contrast-high', label: 'Contraste alto'         },
    { id: 'awInvert',   cls: 'aw-invert',         label: 'Invertir colores'       },
    { id: 'awLinks',    cls: 'aw-links',           label: 'Resaltar enlaces'       },
    { id: 'awDyslexia', cls: 'aw-dyslexia',        label: 'Fuente para dislexia'  },
    { id: 'awNoAnim',   cls: 'aw-no-anim',         label: 'Animaciones detenidas' },
    { id: 'awCursor',   cls: 'aw-big-cursor',      label: 'Cursor grande'          },
    { id: 'awSpacing',  cls: 'aw-spacing',         label: 'Espaciado de texto'    },
    { id: 'awLineH',    cls: 'aw-lineheight',       label: 'Altura de línea'       },
    { id: 'awSat',      cls: 'aw-grayscale',        label: 'Sin saturación'        },
    { id: 'awHideImg',  cls: 'aw-hide-img',         label: 'Imágenes ocultas'      },
    { id: 'awReading',  cls: 'aw-reading',          label: 'Guía de lectura'       },
    { id: 'awFocus',    cls: 'aw-focus',            label: 'Foco de teclado'       },
  ];

  features.forEach(function (f) {
    var btn = document.getElementById(f.id);
    if (!btn) return;

    /* Restaurar estado guardado silenciosamente */
    if (state[f.cls]) setOn(btn, f, true);

    btn.addEventListener('click', function () {
      btn.classList.contains('is-on') ? setOff(btn, f) : setOn(btn, f, false);
    });
  });

  function setOn(btn, f, silent) {
    btn.classList.add('is-on');
    btn.setAttribute('aria-checked', 'true');
    btn.setAttribute('aria-label', f.label + ': activado');
    body.classList.add(f.cls);
    var dot = btn.querySelector('.aw-dots i');
    if (dot) dot.classList.add('active');
    state[f.cls] = true;
    if (!silent) { say(f.label + ' activado'); saveState(); }
  }

  function setOff(btn, f) {
    btn.classList.remove('is-on');
    btn.setAttribute('aria-checked', 'false');
    btn.setAttribute('aria-label', f.label + ': desactivado');
    body.classList.remove(f.cls);
    btn.querySelectorAll('.aw-dots i').forEach(function (d) { d.classList.remove('active'); });
    state[f.cls] = false;
    say(f.label + ' desactivado');
    saveState();
  }

  /* ════════════════════════════════════════════════════
     GUÍA DE LECTURA — sigue el mouse
     ════════════════════════════════════════════════════ */
  document.addEventListener('mousemove', function (e) {
    if (readLine && body.classList.contains('aw-reading')) {
      readLine.style.top = (e.clientY - 1) + 'px';
    }
  }, { passive: true });

  /* ════════════════════════════════════════════════════
     RESET TOTAL
     ════════════════════════════════════════════════════ */
  resetBtn.addEventListener('click', function () {
    features.forEach(function (f) {
      var btn = document.getElementById(f.id);
      if (btn && btn.classList.contains('is-on')) setOff(btn, f);
    });
    state.fontSize = 100;
    document.documentElement.style.fontSize = '100%';
    if (fsVal) fsVal.textContent = '100%';
    saveState();
    say('Configuraciones de accesibilidad restablecidas');
  });

  /* ════════════════════════════════════════════════════
     LIVE ANNOUNCE (lectores de pantalla)
     ════════════════════════════════════════════════════ */
  function say(msg) {
    if (!announce) return;
    announce.textContent = '';
    setTimeout(function () { announce.textContent = msg; }, 60);
  }

  /* ════════════════════════════════════════════════════
     PERSISTENCIA — localStorage
     ════════════════════════════════════════════════════ */
  function saveState() {
    try { localStorage.setItem('zag-a11y', JSON.stringify(state)); } catch (e) {}
  }
  function loadState() {
    try {
      return Object.assign({ fontSize: 100 }, JSON.parse(localStorage.getItem('zag-a11y') || '{}'));
    } catch (e) { return { fontSize: 100 }; }
  }

  /* Aplicar font-size guardado al iniciar */
  if (state.fontSize !== 100) applyFontSize(false);

  /* ════════════════════════════════════════════════════
     API PÚBLICA (útil para testing o integraciones)
     window.ZagA11y.open() / .close() / .reset()
     ════════════════════════════════════════════════════ */
  window.ZagA11y = {
    open:     openPanel,
    close:    closePanel,
    reset:    function () { resetBtn.click(); },
    getState: function () { return Object.assign({}, state); }
  };

})();
