(function () {
  'use strict';

  var CONFIG = window.DAMER_CONFIG || {};

  /* ------------------------------------------------------------------
   * Sticky header
   * ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ------------------------------------------------------------------
   * Mobile navigation
   * ------------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var navClose = document.getElementById('nav-close');
  var mobileNav = document.getElementById('mobile-nav');
  var lastFocused = null;

  function openMobileNav() {
    lastFocused = document.activeElement;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navClose.focus();
    document.addEventListener('keydown', onMobileNavKeydown);
  }
  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onMobileNavKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onMobileNavKeydown(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = mobileNav.querySelectorAll('a, button');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  navToggle.addEventListener('click', openMobileNav);
  navClose.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ------------------------------------------------------------------
   * Smooth-scroll offset for the fixed header
   * ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header.classList.contains('is-scrolled') ? 72 : 96;
      var top = target.getBoundingClientRect().top + window.scrollY - (headerH + 12);
      window.scrollTo({ top: top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      if (history.pushState) history.pushState(null, '', '#' + id);
      // move focus for accessibility once the scroll settles
      window.setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 400);
    });
  });

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ------------------------------------------------------------------
   * Exclusive accordion (Services) — opening one closes the others
   * ------------------------------------------------------------------ */
  function setupExclusiveAccordion(rootId) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var triggers = Array.prototype.slice.call(root.querySelectorAll('.accordion__trigger'));
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        triggers.forEach(function (t) {
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (t === trigger) {
            t.setAttribute('aria-expanded', String(!expanded));
            if (panel) panel.hidden = expanded;
          } else {
            t.setAttribute('aria-expanded', 'false');
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) p.hidden = true;
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------
   * Independent accordion (FAQ) — each item toggles on its own
   * ------------------------------------------------------------------ */
  function setupIndependentAccordion(rootId) {
    var root = document.getElementById(rootId);
    if (!root) return;
    root.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  setupExclusiveAccordion('services-accordion');
  setupIndependentAccordion('faq-accordion');

  /* ------------------------------------------------------------------
   * Method stepper (tabs pattern, with arrow-key support)
   * ------------------------------------------------------------------ */
  var methodData = [
    { title: 'CONHECER', desc: 'Conhecemos o evento: programa, convidados, VIP, traje e o que se deve e não se deve fazer.' },
    { title: 'PREPARAR', desc: 'Seleccionamos e formamos a equipa, ensaiamos o alinhamento e confirmamos funções.' },
    { title: 'EXECUTAR', desc: 'No dia, um coordenador DAMER dirige a equipa no local. Convidados recebidos, protocolo cumprido, problemas resolvidos antes de serem visíveis.' },
    { title: 'ACOMPANHAR', desc: 'Após o evento, regressamos para uma avaliação estruturada. O padrão mantém-se exigente.' },
  ];
  var methodSteps = Array.prototype.slice.call(document.querySelectorAll('.method__step'));
  var methodPanelNum = document.getElementById('method-panel-num');
  var methodPanelTitle = document.getElementById('method-panel-title');
  var methodPanelDesc = document.getElementById('method-panel-desc');
  var methodPanel = document.getElementById('method-panel');

  function activateStep(index) {
    methodSteps.forEach(function (step, i) {
      var active = i === index;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-selected', String(active));
      step.setAttribute('tabindex', active ? '0' : '-1');
    });
    var data = methodData[index];
    var num = String(index + 1).padStart(2, '0');
    methodPanelNum.textContent = num;
    methodPanelTitle.textContent = data.title;
    methodPanelDesc.textContent = data.desc;
    methodPanel.setAttribute('aria-labelledby', 'method-tab-' + index);
  }

  methodSteps.forEach(function (step, i) {
    step.addEventListener('click', function () { activateStep(i); });
    step.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % methodSteps.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + methodSteps.length) % methodSteps.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = methodSteps.length - 1;
      if (next !== null) {
        e.preventDefault();
        activateStep(next);
        methodSteps[next].focus();
      }
    });
  });

  /* ------------------------------------------------------------------
   * Experience gallery lightbox (with prev/next + keyboard + focus trap)
   * ------------------------------------------------------------------ */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-src]'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var currentIndex = -1;
  var lightboxLastFocused = null;

  function showLightbox(index) {
    currentIndex = index;
    var item = galleryItems[index];
    lightboxImage.src = item.getAttribute('data-lightbox-src');
    lightboxImage.alt = item.getAttribute('data-lightbox-caption') || '';
    lightboxCaption.textContent = item.getAttribute('data-lightbox-caption') || '';
  }

  function openLightbox(index) {
    lightboxLastFocused = document.activeElement;
    showLightbox(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKeydown);
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onLightboxKeydown);
    if (lightboxLastFocused) lightboxLastFocused.focus();
  }
  function nextImage() { showLightbox((currentIndex + 1) % galleryItems.length); lightboxNext.focus(); }
  function prevImage() { showLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length); lightboxPrev.focus(); }

  function onLightboxKeydown(e) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowRight') { nextImage(); return; }
    if (e.key === 'ArrowLeft') { prevImage(); return; }
    if (e.key === 'Tab') {
      var focusable = [lightboxClose, lightboxPrev, lightboxNext];
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      if (e.shiftKey) {
        focusable[(idx <= 0 ? focusable.length - 1 : idx - 1)].focus();
      } else {
        focusable[(idx === -1 ? 0 : (idx + 1) % focusable.length)].focus();
      }
    }
  }

  if (lightbox) {
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------
   * Proposal form — real submission, honest states, no fake success
   * ------------------------------------------------------------------ */
  var form = document.getElementById('proposal-form');

  if (form) {
  var submitButton = document.getElementById('submit-button');
  var formStatus = document.getElementById('form-status');
  var successBlock = document.getElementById('proposal-success');
  var successBody = document.getElementById('proposal-success-body');
  var isSubmitting = false;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var wrapper = field.closest('.field');
    var errorEl = wrapper.querySelector('.field__error');
    if (message) {
      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    } else {
      wrapper.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
    }
  }

  function validateForm() {
    var valid = true;
    var name = document.getElementById('field-name');
    var email = document.getElementById('field-email');

    if (!name.value.trim()) {
      setFieldError('field-name', 'Indique o seu nome.');
      valid = false;
    } else {
      setFieldError('field-name', '');
    }

    if (!email.value.trim()) {
      setFieldError('field-email', 'Indique um email profissional.');
      valid = false;
    } else if (!EMAIL_RE.test(email.value.trim())) {
      setFieldError('field-email', 'Verifique o formato do email.');
      valid = false;
    } else {
      setFieldError('field-email', '');
    }

    return valid;
  }

  function showStatus(message, tone) {
    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.setAttribute('data-tone', tone || 'info');
  }
  function hideStatus() {
    formStatus.hidden = true;
    formStatus.removeAttribute('data-tone');
  }

  function buildWhatsAppSummaryLink(data) {
    var lines = [
      'Olá, gostaria de solicitar uma proposta à DAMER.',
      'Nome: ' + (data.name || '-'),
      'Empresa/Instituição: ' + (data.company || '-'),
      'Email: ' + (data.email || '-'),
      'Telefone: ' + (data.phone || '-'),
      'Tipo de evento: ' + (data.eventType || '-'),
      'Data: ' + (data.eventDate || '-'),
      'Local: ' + (data.location || '-'),
      'Convidados: ' + (data.guests || '-'),
      'Serviços: ' + (data.servicos && data.servicos.length ? data.servicos.join(', ') : '-'),
      'Mensagem: ' + (data.message || '-'),
    ];
    var text = encodeURIComponent(lines.join('\n'));
    return 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER + '?text=' + text;
  }

  function collectFormData() {
    var fd = new FormData(form);
    var servicos = fd.getAll('servico');
    return {
      name: fd.get('name') || '',
      company: fd.get('company') || '',
      email: fd.get('email') || '',
      phone: fd.get('phone') || '',
      eventType: fd.get('eventType') || '',
      eventDate: fd.get('eventDate') || '',
      location: fd.get('location') || '',
      guests: fd.get('guests') || '',
      message: fd.get('message') || '',
      consent: fd.get('consent') === 'on',
      servicos: servicos,
    };
  }

  function setLoading(loading) {
    isSubmitting = loading;
    submitButton.disabled = loading;
    submitButton.classList.toggle('is-loading', loading);
  }

  function showSuccess(message) {
    form.hidden = true;
    successBody.textContent = message;
    successBlock.hidden = false;
    successBlock.setAttribute('tabindex', '-1');
    successBlock.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    hideStatus();

    if (!validateForm()) {
      showStatus('Verifique os campos assinalados antes de enviar.', 'error');
      var firstInvalid = form.querySelector('.has-error input');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = collectFormData();
    var endpoint = CONFIG.FORM_ENDPOINT;

    if (!endpoint) {
      // No backend configured yet — be honest about it rather than faking
      // a delivered submission, and hand the visitor a working fallback.
      var waLink = buildWhatsAppSummaryLink(data);
      showStatus('O envio directo pelo site ainda não está ligado a um serviço de recepção. Use o botão abaixo para enviar os mesmos dados por WhatsApp — a equipa DAMER responde por essa via.', 'info');
      var existingLink = document.getElementById('form-fallback-link');
      if (!existingLink) {
        var wrap = document.createElement('div');
        wrap.className = 'btn-row field--full';
        wrap.style.marginTop = '12px';
        wrap.innerHTML = '<a id="form-fallback-link" class="btn btn-outline-dark btn-sm" target="_blank" rel="noopener">ENVIAR POR WHATSAPP</a>';
        formStatus.insertAdjacentElement('afterend', wrap);
        existingLink = document.getElementById('form-fallback-link');
      }
      existingLink.href = waLink;
      return;
    }

    setLoading(true);

    var fd = new FormData(form);
    fetch(endpoint, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        return response.json().catch(function () { return null; }).then(function (body) {
          return { ok: response.ok, body: body };
        });
      })
      .then(function (result) {
        setLoading(false);
        // FormSubmit returns HTTP 200 even on the one-time "please confirm
        // this address" reply for a brand-new endpoint — that submission
        // was NOT delivered, so only trust an explicit success flag.
        var bodySaysFailure = result.body && (result.body.success === false || result.body.success === 'false');
        if (result.ok && !bodySaysFailure) {
          showSuccess('Recebemos o pedido do seu evento. A equipa DAMER entrará em contacto para compreender o evento e apresentar a abordagem adequada.');
        } else if (result.body && /confirm/i.test(result.body.message || '')) {
          showStatus('O endereço comercial@damergrp.com ainda não confirmou a recepção automática de mensagens (passo único, feito por email). Entretanto, use o WhatsApp ou o email abaixo — a sua mensagem chega na mesma.', 'info');
        } else {
          showStatus('Não foi possível confirmar o envio (erro do servidor). Tente novamente ou contacte-nos directamente por WhatsApp ou email.', 'error');
        }
      })
      .catch(function () {
        setLoading(false);
        showStatus('Não foi possível ligar ao serviço de envio. Verifique a sua ligação ou contacte-nos directamente por WhatsApp ou email.', 'error');
      });
  });
  } // end if (form)

  /* ------------------------------------------------------------------
   * Scroll-reveal for major sections
   * ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('main > section, .site-footer');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el, i) {
      if (i === 0) return; // hero is visible on load, skip
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
