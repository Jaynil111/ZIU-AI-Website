// Where the contact form and the automation check send their submissions.
// Fill in ONE provider, then run `npm run build`. Environment variables
// (FORM_PROVIDER, FORM_ENDPOINT, FORM_ACCESS_KEY) override these values.
//
//   provider: 'formspree'  endpoint: 'https://formspree.io/f/<your-form-id>'
//   provider: 'web3forms'  accessKey: '<your access key>'   (endpoint is built in)
//   provider: 'netlify'    (no endpoint: Netlify Forms picks the forms up on deploy)
//   provider: 'custom'     endpoint: any URL that accepts a JSON POST and returns 2xx
//   provider: ''           not connected: forms validate but nothing is sent
export const FORMS = {
  provider: process.env.FORM_PROVIDER ?? 'web3forms',
  endpoint: process.env.FORM_ENDPOINT ?? '',
  // Paste the Web3Forms access key here (it is public by design: Web3Forms
  // keys only allow sending to the email address you registered).
  accessKey: process.env.FORM_ACCESS_KEY ?? '317310fb-5796-4536-9f80-e01844545d63',
  subjectPrefix: 'ZIU AI website',
};

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// Resolved settings used by the page templates.
export function formSettings() {
  const p = (FORMS.provider || '').toLowerCase();
  if (p === 'formspree' && FORMS.endpoint) return { provider: p, action: FORMS.endpoint, honeypot: '_gotcha', subjectField: '_subject', hidden: {} };
  if (p === 'web3forms' && FORMS.accessKey) return { provider: p, action: WEB3FORMS_URL, honeypot: 'botcheck', subjectField: 'subject', hidden: { access_key: FORMS.accessKey, from_name: 'ZIU AI website' } };
  if (p === 'netlify') return { provider: p, action: '/', honeypot: 'bot-field', subjectField: 'subject', hidden: {} };
  if (p === 'custom' && FORMS.endpoint) return { provider: p, action: FORMS.endpoint, honeypot: 'website_url', subjectField: 'subject', hidden: {} };
  return { provider: '', action: '', honeypot: 'website_url', subjectField: 'subject', hidden: {} };
}
