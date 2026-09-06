/**
 * DAMER — site configuration.
 *
 * FORM_ENDPOINT: where the "Solicitar proposta" form delivers its data.
 * Using Formspree (https://formspree.io), form notifications set to
 * comercial@damergrp.com. Formspree holds only the form ID here — no
 * private API key, nothing that could expose a private address.
 *
 * If you ever need to change the destination address, do it in the
 * Formspree dashboard (Form settings → notification email) — not here.
 *
 * To switch providers later, replace FORM_ENDPOINT with the new service's
 * endpoint — it must accept a POST of multipart/form-data and respond with
 * a 2xx status on success. No private API key ever belongs in this file;
 * it ships to every visitor's browser.
 */
window.DAMER_CONFIG = {
  FORM_ENDPOINT: 'https://formspree.io/f/mqpkdnnz',
  WHATSAPP_NUMBER: '258876647971',
  WHATSAPP_MESSAGE: 'Olá, gostaria de solicitar informações sobre os serviços da DAMER para um evento.',
  EMAIL: 'comercial@damergrp.com',
};
