// Content reconciliation: every approved string from "ZIU AI Website Content
// v1.0" must appear, verbatim, on the page it belongs to. Also checks SEO
// titles/descriptions and the standard CTA destinations.
// Usage: node tools/reconcile.mjs   (after npm run build)
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const read = (p) => fs.readFileSync(path.join(DIST, p === '/' ? 'index.html' : `${p}index.html`), 'utf8');
const text = (html) => norm(html
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"'));

const GLOBAL = [
  'Practical AI automation for growing businesses.',
  'Services', 'Use cases', 'Engagements', 'Case studies', 'How we work', 'About', 'Resources',
  'Book a scoping call',
  'ZIU AI designs, builds and runs AI automation for businesses in North America, the UK and Europe, the UAE and India.',
  'Careers', 'FAQ', 'Tool guide', 'Automation check', 'USA & Canada', 'UK & Europe', 'UAE & Gulf', 'India',
  '[email]', '+91 93940 67145', '[business address]',
  'Privacy policy', 'Terms', 'Cookie settings', '© 2026 [Registered company name]. All rights reserved.',
];

const PAGES = {
  '/': {
    title: 'ZIU AI | AI Automation for Growing Businesses',
    description: 'ZIU AI finds the processes costing your team the most time, automates one in about 30 days with a fixed quote, and keeps it running.',
    must: [
      'Hand the repetitive work to systems you can trust.',
      'ZIU AI finds the processes costing your team the most time, automates one in about 30 days, and keeps it running.',
      'Take the 5-minute automation check',
      'Built and tested in our own operations first.',
      '[Insert one measured result from your own business, e.g. "New enquiries answered in under 5 minutes, down from 6 hours, measured over 8 weeks".]',
      'We run our own business on what we build.', 'Automations in daily use at ZIU AI, measured every month.',
      'Lead intake and first reply', 'Proposal and quote drafting', 'Invoicing and payment follow-up', '[baseline]', '[result]', '[period]', 'Measured over',
      'We build with the tools you already use, including',
      'Most AI efforts stall between the demo and daily work.',
      'Usually because no one owned the process, the data or the follow-through. We do.',
      'Your team copies the same information between tools every day.',
      'You bought AI tools, but few people use them for real work.',
      'A pilot looked promising and then never became part of the routine.',
      'Where automation pays off first.', 'Six areas where we most often remove manual work.',
      'Capture every enquiry, qualify it, update the CRM and send a first reply within minutes.',
      'Answer common questions from your own documents and hand complex cases to a person with full context.',
      'Read invoices and receipts, match them to orders, and chase overdue payments politely and on time.',
      'Book, confirm and reschedule appointments; keep jobs, stock and calendars in step.',
      'Send contracts, collect documents and set up accounts for new starters without a checklist on paper.',
      "Pull figures from your tools into one weekly summary that arrives before Monday's meeting.",
      'See all use cases',
      'Start small, with a fixed quote.', 'A short discovery you keep, then one working automation in about 30 days. No hourly billing.',
      'A map of your key processes, the three best candidates for automation, and an estimate of time saved for each. Yours to keep.',
      'One process automated end to end, tested with your team and launched.',
      'Monitoring, fixes and monthly improvements, on a simple monthly plan.',
      '1–2 weeks', 'About 30 days', 'Ongoing, cancel with [30] days\' notice',  'Typical duration',
      'You receive a fixed written quote before any work starts. If discovery shows automation is not worth it for you, we will say so, and you can stop there.',
      'See how engagements work',
      'Four steps, with a deliverable at each.', 'You always know what is next, what it costs and what you need to provide.',
      'We interview the people who do the work and map how it runs today.', 'We build the automation in your accounts and test it on real examples.',
      'We switch it on with your team, train them and watch it closely for two weeks.', 'We monitor, fix and improve it, and report results every month.',
      'Your time', '2–4 hours', '1–2 hours a week', '1–2 hours', '30 minutes a month',
      'Results, and how we measured them.', 'Starting with our own operations. Founding-client places are open.',
      'Each case study shows the starting point, what we built, the result and the period measured.', '[Case study title]',
      'We are taking on a small number of founding clients on preferential terms, in exchange for permission to publish a measured case study.',
      'Ask about a founding-client place', 'Read our case studies',
      'Watch an automation run.', 'Real workflows, with the human approval steps left in.',
      'An enquiry email becomes a CRM record and a drafted reply waiting for approval.', '[60–90 second video]',
      'A supplier invoice is read, checked against the order and queued for payment.',
      'A weekly report is assembled from three tools and sent to the team.', 'Watch the demos', 'Watch the demo',
      'You stay in control.', 'Your accounts, your data, your approval on anything that matters.',
      'Automations run in your own accounts. You own them and can switch them off at any time.',
      'A person approves sensitive steps, such as sending money, contracts or customer messages you choose.',
      'We only access the systems a process needs, and we remove our access when you ask.',
      'If something fails, you are alerted and the task is held for review rather than guessed.',
      'We follow the data protection rules that apply in your region and tell you where data is processed.',
      'Read how we handle data',
      'The people who build and run your systems.', 'Every engagement has a named lead you can reach directly.',
      'Krunal Rajput', 'Founder',
      'Questions owners ask before starting.', 'How much does it cost?', 'Will AI replace my staff?',
      'Find out what to automate first.', 'A 30-minute call. You leave with three candidate processes, whether or not we work together.',
      'Or message us on [WhatsApp / email]',
    ],
    mustNot: ['Can we stop after discovery?', 'cancel any time'], // only the first six FAQs on home
  },
  '/services/': {
    title: 'AI Automation Services | ZIU AI',
    description: 'Discovery, workflow automation, AI assistants, integration and ongoing support for growing businesses.',
    must: [
      'From the first map to the system that runs every day.', 'Six services, usually delivered together as one engagement.',
      'Discovery and automation audit', 'We map how work moves through your business, find where time is lost, and rank the opportunities by value and effort.',
      'Process interviews and mapping', 'Ranked list of automation candidates', 'Time-saved estimate for each, with the assumptions shown', 'Clear advice on what not to automate',
      'Workflow automation', 'We connect the tools you already use so information moves without copy and paste.',
      'CRM, email, calendar, accounting and form integrations', 'Built on Zapier, Make, n8n or custom code, chosen for your case', 'Error alerts and a written handover',
      'AI assistants and agents', 'We build assistants that read, draft, sort and answer using your own documents and rules, with a person approving what matters.',
      'Email and enquiry triage', 'Document reading (invoices, forms, contracts)', 'Internal knowledge assistants', 'Customer support assistants with hand-off to staff',
      'Systems integration', 'We connect systems that do not talk to each other, including older software, through their APIs or files.',
      'API integrations', 'Data sync between tools', 'Clean-up of duplicate and missing records',
      'Run and improve', 'We monitor every automation we build, fix issues and improve it each month.',
      'Monitoring and alerts', 'Fixes when a connected tool changes', 'Monthly results report', 'Small improvements included',
      'Training and adoption', 'We help your team use AI tools well in their daily work.',
      'Hands-on workshops by team', 'Written guides for each automation', 'Usage review after launch',
      'See how engagements work',
    ],
  },
  '/use-cases/': {
    title: 'AI Automation Use Cases | ZIU AI',
    description: 'Examples of AI automation for sales, support, finance, operations, HR and reporting.',
    must: [
      'What AI automation does, team by team.', 'Practical tasks we automate, explained in plain terms.',
      'Every web, email and phone enquiry logged in the CRM automatically', 'Leads scored and routed to the right person', 'A first reply drafted within minutes', 'Follow-up reminders so no lead goes quiet',
      'Common questions answered from your help documents', 'Tickets sorted by topic and urgency', 'Complex cases passed to staff with a summary', 'Weekly report of the questions customers ask most',
      'Invoices and receipts read and entered into accounting software', 'Orders, invoices and payments matched', 'Polite, scheduled payment reminders', 'Month-end figures gathered in one place',
      'Appointments booked, confirmed and rescheduled', 'Job and order status updates sent to customers', 'Stock alerts and reorder drafts',
      'Offer letters and contracts prepared from templates', 'Documents collected and checked for completeness', 'Accounts and access set up for new starters',
      'Figures pulled from several tools into one report', 'Weekly summaries delivered by email or chat', 'Alerts when a number moves outside its usual range',
      'Take the automation check', 'Book a scoping call',
    ],
  },
  '/engagements/': {
    title: 'How Engagements Work | ZIU AI',
    description: 'Fixed scope, fixed written quote, no hourly billing. Start with a short discovery and one automation in about 30 days.',
    must: [
      'Clear scope. Fixed quote. No surprises.', 'Every engagement starts small and is agreed in writing before work begins.',
      'Discovery', 'Duration: 1–2 weeks', 'We map your key processes, rank the automation opportunities and estimate the time each could save. You keep the full report, whether or not you continue.',
      'First automation', 'Duration: about 30 days', 'One process automated end to end, tested with your team, launched and monitored closely for two weeks.',
      'Run and improve', 'Monthly plan', 'Monitoring, fixes, a monthly results report and small improvements. Cancel with [30] days\' notice.',
      'Every engagement includes', 'A fixed written quote before work starts', 'No hourly billing', 'A named lead you can contact directly', 'Automations built in your own accounts', 'Full documentation and handover', 'The option to stop after discovery',
      'What we need from you', 'A decision-maker for the 30-minute scoping call', 'Access to the people who do the work today', 'Admin access to the tools involved, for the build period', 'Prompt feedback during testing',
    ],
  },
  '/case-studies/': {
    title: 'Case Studies | ZIU AI',
    description: 'Measured results from AI automation projects, with the baseline and method shown for each.',
    must: [
      'Results, and how we measured them.', 'Every case states the starting point, the change and the period measured.',
      'ZIU AI internal', 'The situation', 'What we built', 'The result', 'In their words', 'Timeline',
      '[2–3 sentences: the team, the process and the problem, with the baseline figure]',
      '[2–3 sentences in plain language: tools connected, what the automation does, where a person approves]',
      '[Before] to [After], measured over [period] using [method, e.g. CRM timestamps]',
      '"[Quote]" — [Full name], [Role], [Company] (with written permission)', '[Weeks from discovery to launch]',
      'Become a founding client.',
      'We are working with a small number of founding clients on preferential terms. In return, we ask for permission to publish a measured case study and a named review when the work is complete.',
      'Ask about a founding-client place',
    ],
  },
  '/how-we-work/': {
    title: 'How We Work | ZIU AI',
    description: 'Our four-step method for AI automation: map, build, launch, run. With human approval and clear data handling.',
    must: [
      'A simple method, written down.', 'Four steps, a deliverable at each, and a person accountable for every one.',
      'We interview the people who do the work, document the process as it runs today, and agree the measure of success.',
      'We build in your accounts, test with real examples, and show progress every week.',
      'We switch on with your team, train them, and monitor closely for two weeks.',
      'We monitor, fix and improve, and send a results report every month.',
      'Safety, data and control',
      'You own the accounts and the automations. Nothing is locked to us.', 'Human approval is built in for sensitive actions.',
      'Least access: we use only the permissions a process needs.', 'Failures alert a person and pause the task, rather than guessing.',
      'We document where your data is processed and which AI services are used.', 'When an engagement ends, we hand over everything and remove our access.',
      'Our principles', 'We tell you when something is not worth automating.', 'We measure before we claim.',
      'We choose tools for your situation, not ours.', 'We write in plain language.', 'We stay until it works in daily use.',
    ],
  },
  '/industries/': {
    must: [
      'Automation shaped to how your sector works.',
      'Professional services', 'Accounting, legal and consulting firms', 'Client intake, document collection, engagement letters, time-entry reminders and billing follow-up.',
      'Real estate and property', 'Agencies and property managers', 'Lead capture from portals, viewing bookings, tenant requests and maintenance tracking.',
      'E-commerce and retail', 'Online and multi-channel sellers', 'Order updates, returns, customer questions, stock alerts and supplier reorders.',
      'Healthcare clinics', 'Private clinics and practices', 'Appointment booking and reminders, intake forms and administrative follow-up. We do not automate clinical decisions.',
      '[Add a case study for this sector when available]',
    ],
  },
  '/about/': {
    title: 'About ZIU AI',
    description: 'Meet the team behind ZIU AI and the principles we work by.',
    must: [
      'We build automation we would trust in our own business.', 'Because we do.', 'Our story',
      "[2–3 sentences in the founder's voice: why ZIU AI was started, the problem you saw in businesses, and what you do differently. Facts only.]",
      'What ZIU AI stands for', '[Explain the name, if it has a meaning you want to share. Otherwise delete this block.]',
      '[Relevant experience as fact.]', '[LinkedIn link]', 'Where we work',
      'We work with businesses in the USA and Canada, the UK and Europe, the UAE and the Gulf, and India.', '[State team locations and time zones covered.]',
    ],
  },
  '/resources/': {
    must: [
      'How much does it cost?', 'Every engagement is quoted at a fixed price after a short scoping call, based on the processes involved. There is no hourly billing, and you see the full quote before any work starts.',
      'How long does it take?', 'Discovery takes 1–2 weeks. A first automation is usually live in about 30 days. More complex systems take longer, and we will say so up front.',
      'Which tools do you use?', 'We build on the tools you already have where possible, and add Zapier, Make, n8n or custom code depending on volume, cost and data needs. We explain the choice in writing.',
      'What happens if an automation breaks?', 'You are alerted and the task is paused for review. On a Run and improve plan, we fix it within [agreed response time].',
      'Is our data safe?', 'Automations run in your accounts with the minimum access needed. We tell you where data is processed, follow the data protection rules in your region, and remove our access when you ask.',
      'Will AI replace my staff?', 'Our work removes repetitive tasks so people can spend time on customers and decisions. A person stays in charge of anything sensitive.',
      'Can we stop after discovery?', 'Yes. You keep the discovery report and are under no obligation to continue.',
      'What should not be automated?', 'Rare, high-judgement or fast-changing tasks are usually better left to people. We will tell you if a process falls into that group.',
      'Zapier, Make, n8n or custom code: how we choose.', 'Best when', 'Watch out for',
      'Simple, low-volume workflows between popular apps; fastest to set up', 'Cost can rise with task volume',
      'Multi-step workflows with branching and data shaping', 'Complex scenarios need careful documentation',
      'Higher volumes, custom logic, or a need to self-host for data control', 'Self-hosting needs maintenance',
      'Unusual systems, strict performance or security needs', 'Higher build cost; needs a maintainer',
      'Where could automation help you? Find out in 5 minutes.', 'Start the automation check',
    ],
  },
  '/automation-check/': {
    must: ['Where could automation help you? Find out in 5 minutes.', 'Team size', 'Tools used', 'Who approves the work today?', 'Region', 'Hours a week'],
  },
  '/regions/usa-canada/': { must: ['AI automation for businesses in the USA and Canada.', 'USD / CAD', '[Time zones covered]', "We follow applicable US state privacy laws, such as the CCPA in California, and Canada's PIPEDA.", 'Email, phone, booking calendar', '[Office or representative, only if real]', 'Invoicing currency', 'Working hours', 'Data protection', 'How to reach us', 'Local presence'] },
  '/regions/uk-europe/': { must: ['AI automation for businesses in the UK and Europe.', 'GBP / EUR', 'We follow UK GDPR and EU GDPR, sign a data processing agreement on request, and can keep processing in the EU or UK where required.'] },
  '/regions/uae-gulf/': { must: ['AI automation for businesses in the UAE and the Gulf.', 'AED', 'Gulf Standard Time [confirm coverage]', 'We follow the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and state where data is processed.', 'WhatsApp, email, booking calendar. Arabic version planned.'] },
  '/regions/india/': { must: ['AI automation for businesses in India.', 'INR', 'IST [confirm coverage]', 'We follow the Digital Personal Data Protection Act, 2023.', 'WhatsApp, email, booking calendar'] },
  '/contact/': {
    title: 'Contact ZIU AI',
    description: 'Book a 30-minute scoping call with ZIU AI.',
    must: [
      "Tell us what takes too much of your team's time.", 'Book a 30-minute scoping call, or send a message and we will reply within [one business day].',
      'Name', 'Work email', 'Company and website', 'Region', 'Team size', 'What would you like to automate?', 'Preferred contact', 'Email', 'Phone', 'WhatsApp',
      'We use your details only to reply to your enquiry. See our privacy policy.',
      'We reply within [one business day] to confirm a time.', 'On the call, we ask about your processes and tools.',
      'You leave with three candidate processes, whether or not we work together.', 'If it makes sense, we send a fixed written quote for discovery.',
      'Book a scoping call',
    ],
  },
};

// Use-case detail pages carry their overview bullets.
const ucPages = { 'sales-lead-follow-up': 'Sales and lead follow-up', 'customer-support': 'Customer support', 'finance-invoicing': 'Finance and invoicing', 'operations-scheduling': 'Operations and scheduling', 'hr-onboarding': 'HR and onboarding', reporting: 'Reporting' };
for (const [slug, name] of Object.entries(ucPages)) PAGES[`/use-cases/${slug}/`] = { must: [name] };

// Link destinations from the "Standard call-to-action wording" table.
const CTA_RULES = [
  ['Book a scoping call', /^(\/contact\/)?#book$/],
  ['Take the automation check', /^\/automation-check\/$/],
  ['Take the 5-minute automation check', /^\/automation-check\/$/],
  ['See how it works', /^\/how-we-work\/$/],
];

let fails = 0;
const fail = (m) => { fails++; console.log('  ✗ ' + m); };
for (const [p, spec] of Object.entries(PAGES)) {
  const html = read(p);
  const t = text(html);
  const before = fails;
  console.log(p);
  for (const m of [...GLOBAL, ...spec.must]) if (!t.includes(norm(m))) fail(`missing: ${m}`);
  for (const m of spec.mustNot || []) if (t.includes(norm(m))) fail(`should not appear: ${m}`);
  if (spec.title && !html.includes(`<title>${spec.title.replace(/&/g, '&amp;')}</title>`) && !html.includes(`<title>${spec.title}</title>`)) fail(`SEO title should be "${spec.title}"`);
  if (spec.description && !html.includes(`<meta name="description" content="${spec.description}">`)) fail(`meta description should be "${spec.description}"`);
  for (const [, href, label] of html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(?:<span>)?([^<]+)/g)) {
    for (const [l, re] of CTA_RULES) if (norm(label) === l && !re.test(href)) fail(`"${l}" links to ${href}`);
  }
  if (fails === before) console.log('  ✓ all approved copy present');
}
console.log(fails ? `\n${fails} gap(s) found` : '\nReconciliation passed: no gaps');
process.exitCode = fails ? 1 : 0;
