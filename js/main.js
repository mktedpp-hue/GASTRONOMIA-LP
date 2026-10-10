(function () {
  'use strict';

  var config = window.LANDING_CONFIG || {};

  /* Imágenes opcionales: si el archivo aún no existe, se oculta y queda el respaldo visual. */
  document.querySelectorAll('.js-optional-img').forEach(function (img) {
    function fail() { img.parentElement.classList.add('img-missing'); img.remove(); }
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail);
  });

  /* Política de privacidad */
  document.querySelectorAll('.js-privacy-link').forEach(function (a) {
    if (config.privacyUrl) {
      a.href = config.privacyUrl;
    } else {
      a.removeAttribute('target');
      a.addEventListener('click', function (e) { e.preventDefault(); });
      a.title = 'Enlace pendiente de configurar';
    }
  });

  /* Menú móvil */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var toggleLabel = toggle.querySelector('.sr-only');

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) setMenu(false);
  });

  /* Desplazamiento interno: cierra el menú y lleva el foco a la sección */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    a.addEventListener('click', function (e) {
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
      if (id === 'formulario') {
        var first = document.getElementById('f-nombre');
        setTimeout(function () { first.focus({ preventScroll: true }); }, prefersReducedMotion() ? 0 : 600);
      }
    });
  });

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Temario desplegable */
  document.querySelectorAll('.module-toggle').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Ocultar temario' : 'Ver temario';
      panel.hidden = !open;
      btn.closest('.module').classList.toggle('is-open', open);
    });
  });

  /* Formulario */
  var form = document.getElementById('lead-form');
  var status = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.querySelector('.btn-label');
  var sending = false;

  var MSG = {
    required: 'Completa este campo.',
    phone: 'Revisa tu número de WhatsApp.',
    email: 'Ingresa un correo válido.',
    sending: 'Enviando…',
    success: '¡Gracias! Recibimos tu solicitud. El equipo de la Escuela Peruana de Parrilleros te contactará para brindarte información del curso.',
    error: 'No pudimos enviar tu solicitud. Inténtalo nuevamente.'
  };

  var fields = {
    nombre: form.elements.nombre,
    whatsapp: form.elements.whatsapp,
    codigo: form.elements.codigo_pais,
    correo: form.elements.correo,
    objetivo: form.elements.objetivo,
    consent: form.elements.consentimiento
  };

  function setError(input, message) {
    var box = document.getElementById(input.getAttribute('aria-describedby'));
    box.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.closest('.field').classList.toggle('has-error', !!message);
    return !message;
  }

  function phoneDigits() {
    return fields.whatsapp.value.replace(/[\s\-().]/g, '');
  }

  var validators = {
    nombre: function () {
      return setError(fields.nombre, fields.nombre.value.trim().length < 2 ? MSG.required : '');
    },
    whatsapp: function () {
      var raw = fields.whatsapp.value.trim();
      if (!raw) return setError(fields.whatsapp, MSG.required);
      var digits = phoneDigits();
      var ok = /^\d+$/.test(digits);
      if (ok && fields.codigo.value === '+51') ok = /^9\d{8}$/.test(digits);
      else if (ok) ok = digits.length >= 6 && digits.length <= 14;
      return setError(fields.whatsapp, ok ? '' : MSG.phone);
    },
    correo: function () {
      var v = fields.correo.value.trim();
      var ok = !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      return setError(fields.correo, ok ? '' : MSG.email);
    },
    consent: function () {
      return setError(fields.consent, fields.consent.checked ? '' : MSG.required);
    }
  };

  Object.keys(validators).forEach(function (key) {
    var input = fields[key];
    input.addEventListener('blur', function () {
      if (input.type !== 'checkbox' && !input.value.trim() && input.getAttribute('aria-invalid') !== 'true') return;
      validators[key]();
    });
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', function () {
      if (input.getAttribute('aria-invalid') === 'true') validators[key]();
    });
  });
  fields.codigo.addEventListener('change', function () {
    if (fields.whatsapp.value.trim()) validators.whatsapp();
  });

  function setStatus(type, text) {
    status.className = 'form-status' + (type ? ' is-' + type : '');
    status.textContent = text;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;

    var results = Object.keys(validators).map(function (k) { return validators[k](); });
    if (results.indexOf(false) !== -1) {
      setStatus('', '');
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Honeypot: los bots completan este campo; se descarta sin aviso.
    if (form.elements.website.value) return;

    var payload = {
      nombre: fields.nombre.value.trim(),
      whatsapp: fields.codigo.value + ' ' + phoneDigits(),
      correo: fields.correo.value.trim(),
      objetivo: fields.objetivo.value,
      consentimiento: true,
      curso: 'Gastronomía en Brasas',
      origen: window.location.href,
      fecha: new Date().toISOString()
    };

    sending = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitLabel.textContent = MSG.sending;
    setStatus('', MSG.sending);

    send(payload)
      .then(function () {
        form.reset();
        form.classList.add('is-sent');
        setStatus('success', MSG.success);
      })
      .catch(function (err) {
        if (window.console) console.warn('[formulario]', err);
        setStatus('error', MSG.error);
      })
      .then(function () {
        sending = false;
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitLabel.textContent = 'Solicitar información';
      });
  });

  function send(payload) {
    if (!config.formEndpoint) {
      return Promise.reject(new Error('Falta configurar formEndpoint en js/config.js'));
    }
    return fetch(config.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Respuesta ' + res.status);
      return res;
    });
  }
})();
