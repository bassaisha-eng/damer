/**
 * DAMER — site configuration.
 *
 * FORM_ENDPOINT: where the "Solicitar proposta" form delivers its data.
 * Using FormSubmit (https://formsubmit.co) pointed at comercial@damergrp.com
 * — no account, no API key, nothing that could expose a private address.
 *
 * ACTION NEEDED FROM COMERCIAL@DAMERGRP.COM (one-time):
 * The very first submission FormSubmit receives for a given address is not
 * forwarded — instead it emails that address an activation link. Someone
 * with access to comercial@damergrp.com must open that email and click
 * "Activate Form" once; every submission after that lands in the inbox
 * normally. Easiest way to trigger it: submit the live form yourself once
 * after deploying, then check comercial@damergrp.com (including spam) and
 * confirm.
 *
 * To switch providers later (e.g. Formspree), replace FORM_ENDPOINT with
 * the new service's endpoint — it must accept a POST of multipart/form-data
 * and respond with a 2xx status on success. No private API key ever
 * belongs in this file; it ships to every visitor's browser.
 */
window.DAMER_CONFIG = {
  FORM_ENDPOINT: 'https://formsubmit.co/ajax/comercial@damergrp.com',
  WHATSAPP_NUMBER: '258876647971',
  WHATSAPP_MESSAGE: 'Olá, gostaria de solicitar informações sobre os serviços da DAMER para um evento.',
  EMAIL: 'comercial@damergrp.com',
};
