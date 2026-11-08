// Content reconciliation: every approved string from the site copy (v2.0,
// 8 November 2026) must appear, verbatim, on the page it belongs to. Also
// checks SEO titles/descriptions, the standard CTA destinations, that every
// placeholder is still present, and that no British spelling slipped in.
// Usage: node tools/reconcile.mjs   (after npm run build)
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const read = (p) => fs.readFileSync(path.join(DIST, p === '/' ? 'index.html' : `${p}index.html`), 'utf8');
const text = (html) => norm(html
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"'));

// American English only. Any of these on any page is a failure.
const BRITISH = /enquir|programme|organis|colour|behaviour|favour|centre|licence|judgement|cheque|optimis|analys(e|ing)\b/i;

const GLOBAL = [
  'AI consulting, custom automation and software for growing businesses.',
  'Services', 'Solutions', 'How we work', 'Pricing', 'About',
  'Book a 30-minute call',
  'ZIU AI advises on where AI pays off, then builds and runs the automations, tools and software, for businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.',
  'AI strategy and roadmap', 'Discovery and automation audit', 'Workflow automation', 'AI assistants and agents', 'Custom tools and software', 'Systems integration', 'Run and improve', 'Training and adoption',
  'Sales and lead follow-up', 'Customer support', 'Finance and invoicing', 'Operations and scheduling', 'HR and onboarding', 'Reporting', 'Industries',
  'Results', 'Careers', 'Automation check', 'Savings calculator', 'FAQ', 'Tool guide', 'USA & Canada', 'UK & Europe', 'UAE & Gulf', 'India',
  '[email]', '+91 93940 67145', '[business address]',
  'Privacy policy', 'Terms', 'Cookie settings', '© 2026 [Registered company name]. All rights reserved.',
];

const FOUR_STEPS = [
  'We interview the people who do the work', 'We build', 'We switch', 'We monitor, fix and improve',
  'Your time', '2–4 hours', '1–2 hours a week', '1–2 hours', '30 minutes a month',
];

const PAGES = {
  '/': {
    title: 'ZIU AI | AI Consulting, Automation and Custom Software',
    description: 'ZIU AI helps growing businesses decide where AI pays off, builds the automations, tools and software, and keeps them running. Fixed prices. First process live in about 30 days.',
    must: [
      'AI consulting, custom automation and software',
      'We find where AI pays off, then build it.',
      'ZIU AI works out where AI will save your business the most, builds the automation or tool, and keeps it running. First process live in about 30 days.',
      'Take the 5-minute check',
      'Built and tested in our own operations first.',
      '[Insert one measured result from your own business, e.g. "New inquiries answered in under 5 minutes, down from 6 hours, measured over 8 weeks".]',
      // 01 What we do
      'Advise. Build. Run.', 'Three ways to work with us. Start with one, add the others when they pay for themselves.',
      'Decide where AI pays off', 'A clear view of where AI will save your business the most, what it will cost, and what to do first.',
      'Build the automation or tool', 'Automations, AI assistants and custom software, built in your own accounts and tested on your real work.',
      'Keep it running', 'Monitoring, fixes, monthly improvements and training, so what we build stays in daily use.',
      'See all services',
      // 02 Who it is for
      'Built for companies that run on people and spreadsheets.', 'Owner-led and mid-size businesses, 10 to 500 people, in any sector where work still moves by hand.',
      'A good fit if', 'Not a fit if',
      'You have 10 to 500 people and work still moves by email, spreadsheets and copy and paste', 'You own the decision and want a fixed price, not an hourly bill',
      'You want one process fixed properly before you commit to more', 'You want to own what gets built and understand how it works',
      'You want a chatbot on the website and nothing behind it', 'You need a large system rebuilt in a quarter', 'You want AI to make decisions no one checks', 'You are looking for the cheapest hourly rate',
      // 03 The problem
      'Most AI projects stall after the demo.', 'Usually because no one owned the process, the data or the follow-through. We do.',
      'Your team copies the same information between tools every day.', 'You bought AI tools, but few people use them for real work.', 'A pilot looked promising and never became part of the routine.',
      // 04 Solutions
      'Where AI pays off first.', 'Six jobs we most often take off a team. Each one links to what we set up and how.',
      'Every inquiry logged, qualified and answered within minutes, with the CRM kept up to date.',
      'Common questions answered from your own documents. Complex cases handed to a person with the full story.',
      'Invoices read and matched to orders. Overdue payments chased politely, on time, every time.',
      'Appointments booked, confirmed and rescheduled. Jobs, stock and calendars kept in step.',
      'Contracts sent, documents collected and accounts set up for new starters, without a paper checklist.',
      "Figures from all your tools in one weekly summary, in your inbox before Monday's meeting.",
      'See all solutions', 'By industry',
      // 05 How it works
      'Four steps. Something you keep at each.', 'You always know what is next, what it costs and what we need from you.', ...FOUR_STEPS, 'See how we work',
      // 06 Results
      'Measured results, starting with our own business.', 'Automations in daily use at ZIU AI, measured every month. Every result shows the starting point, the change and the period.',
      'Lead intake and first reply', 'Proposal and quote drafting', 'Invoicing and payment follow-up', '[baseline]', '[result]', '[period]', 'Measured over',
      'Every case study we publish shows the starting point, what we built, the result and the period measured. No result is published before it has been measured for at least four weeks.',
      '[Case study title]', '[Before]', '[After]',
      'Founding clients', 'A reduced price for the first clients who let us publish a measured result.', 'Ask about a founding-client place', 'See our results',
      'We build with the tools you already use, including',
      // 07 Pricing
      'Start small. Fixed price. No hourly billing.', 'A short discovery you keep, then one working automation in about 30 days. Every price is agreed in writing before work starts.',
      'Typical duration', 'Starting price', 'From [price]', 'From [price] a month', '1–2 weeks', 'About 30 days', "Monthly plan, cancel with [30] days' notice",
      'Discovery', 'First automation', 'Run and improve',
      'We map your key processes, rank the processes worth automating and estimate the time each could save. You keep the full report, whether or not you continue.',
      'One process automated end to end, tested with your team, launched and watched closely for two weeks.',
      'Monitoring, fixes, a monthly results report and small improvements.',
      'You receive a fixed written quote before any work starts. If discovery shows automation is not worth it for you, we say so, and you can stop there.',
      'Estimate what a task costs you', 'See pricing',
      // 08 See it working
      'Watch an automation run.', 'Real workflows. A person still approves each step that matters.',
      'An inquiry email becomes a CRM record and a drafted reply waiting for approval.', '[60–90 second video]',
      'A supplier invoice is read, checked against the order and queued for payment.',
      'A weekly report is assembled from three tools and sent to the team.', 'Watch the demos', 'Watch the demo',
      '[Demo video to be supplied: 60–90 seconds, showing the human approval step]',
      // 09 Safety
      'You stay in control.', 'Your accounts, your data, your sign-off on anything that matters.',
      'Automations run in your own accounts. You own them and can switch them off at any time.',
      'A person approves sensitive steps, such as sending money, contracts, and any customer messages you choose.',
      'Only the access we need', 'We only access the systems a process needs, and we remove our access when you ask.',
      'Paused and flagged, not guessed', 'If something fails, you are alerted and the task is paused for review rather than guessed.',
      'We follow the data protection rules that apply in your region and tell you where data is processed.',
      'Read how we handle data',
      // 10 Team
      'Who you will work with.', 'You deal with the founder directly, from the first call to the monthly report.',
      'Krunal Rajput', 'Founder', '[Photo of Krunal Rajput]', '[One sentence on relevant experience, stated as fact.]',
      // 11 FAQ (first six)
      'Questions owners ask before starting.', 'How much does it cost?', 'How long does it take?', 'Do you only do automation, or also consulting?',
      'Can you build custom software for us?', 'Who owns what you build?', 'Which tools do you use?', 'All questions',
      // 12 Get started
      'Find out where AI pays off for you.', 'A 30-minute call. You leave with three processes worth automating, whether or not we work together.',
      'Or message us on [WhatsApp / email]',
    ],
    mustNot: ['Can we stop after discovery?', 'scoping call', 'Engagements'], // only the first six FAQs on home; no jargon
  },
  '/services/': {
    title: 'AI Consulting, Automation and Software Services | ZIU AI',
    description: 'AI strategy, discovery, workflow automation, AI assistants, custom software, integration, and ongoing support for growing businesses.',
    must: [
      'AI consulting, automation and software, delivered as one team.', 'Start with the one you need. Most clients add the rest over time.',
      'Advise', 'Build', 'Run', 'Decide where AI pays off', 'Build the automation or tool', 'Keep it running',
      'We assess where AI pays off in your business and give you a ranked, costed roadmap you can act on with or without us.',
      'Review of your processes, tools and data', 'Ranked opportunities by value, cost and risk', 'A written roadmap with first, second and third steps', 'Clear advice on what not to automate',
      'We map how work moves through your business, find where time is lost, and rank the opportunities by value and effort.',
      'Process interviews and mapping', 'Ranked list of processes worth automating', 'Time-saved estimate for each, with the assumptions shown', 'A fixed quote for the first build',
      'We connect the tools you already use so information moves without copy and paste.',
      'CRM, email, calendar, accounting and form integrations', 'Built on Zapier, Make, n8n or custom code, chosen for your case', 'Error alerts and a written handover',
      'Assistants that read, draft, sort and answer using your own documents and rules, with a person approving what matters.',
      'Email and inquiry triage', 'Document reading (invoices, forms, contracts)', 'Internal knowledge assistants', 'Customer support assistants with hand-off to staff',
      'When no off-the-shelf tool fits, we design and build the internal tool, portal or application your team needs. You own the code.',
      'Internal tools, dashboards and client portals', 'Small applications built around one process', 'AI features added to software you already run', 'Source code, documentation and hosting set up in your name',
      'We connect systems that do not talk to each other, including older software, through their APIs or files.',
      'API integrations', 'Data sync between tools', 'Clean-up of duplicate and missing records',
      'We monitor every automation we build, fix issues and improve it each month.',
      'Monitoring and alerts', 'Fixes when a connected tool changes', 'Monthly results report', 'Small changes each month at no extra cost',
      'We train your team on each automation and check usage after launch, so it gets used.',
      'Hands-on workshops by team', 'Written guides for each automation', 'Usage review after launch',
      'Not sure which you need?', 'See pricing',
    ],
  },
  '/use-cases/': {
    title: 'AI Automation Solutions by Team and Industry | ZIU AI',
    description: 'What AI can take off your team: sales, support, finance, operations, HR and reporting, plus the sectors we know best.',
    must: [
      "What AI can take off your team's plate.", 'Six jobs we automate most often, team by team, and the sectors we know best.',
      'By team', 'Six jobs, team by team.', 'Each one links to what we set up, how it gets built and where a person stays in charge.',
      'Every web, email and phone inquiry logged in the CRM automatically', 'Leads scored and routed to the right person', 'A first reply drafted within minutes', 'Follow-up reminders so no lead goes quiet',
      'Common questions answered from your help documents', 'Tickets sorted by topic and urgency', 'Complex cases passed to staff with a summary', 'Weekly report of the questions customers ask most',
      'Invoices and receipts read and entered into accounting software', 'Orders, invoices and payments matched', 'Polite, scheduled payment reminders', 'Month-end figures gathered in one place',
      'Appointments booked, confirmed and rescheduled', 'Job and order status updates sent to customers', 'Stock alerts and reorder drafts',
      'Offer letters and contracts prepared from templates', 'Documents collected and checked for completeness', 'Accounts and access set up for new starters',
      'Figures pulled from several tools into one report', 'Weekly summaries delivered by email or chat', 'Alerts when a number moves outside its usual range',
      'By industry', 'Shaped to how your sector works.', 'See all industries',
      'Professional services', 'Real estate and property', 'E-commerce and retail', 'Healthcare clinics', '[Add a case study for this sector when available]',
      'Take the 5-minute check', 'Book a 30-minute call',
    ],
  },
  '/pricing/': {
    title: 'Pricing | ZIU AI',
    description: 'Fixed prices, no hourly billing. Starting prices for discovery, a first automation and a monthly run-and-improve plan.',
    must: [
      'Clear scope. Fixed price. Cancel anytime.', 'Three ways to start. Every project is quoted in writing before work begins, and there is no hourly billing.',
      'Discovery', '1–2 weeks', 'From [price]', 'You know work is being lost but not where to start.',
      'We map your key processes, rank the processes worth automating and estimate the time each could save. You keep the full report, whether or not you continue.',
      'Interviews with the people who do the work', 'A process map and a ranked list of opportunities', 'A time-saved estimate for each, with the assumptions shown', 'A fixed quote for the first build',
      'First automation', 'About 30 days', 'You have one process that clearly needs fixing.',
      'One process automated end to end, tested with your team, launched and watched closely for two weeks.',
      'One automation or tool, built in your accounts', 'Testing on your real examples', 'Training for the people who use it', 'Two weeks of close monitoring after launch',
      'Run and improve', 'Monthly plan', 'From [price] a month', 'You want what we built to keep working and get better.',
      "Monitoring, fixes, a monthly results report and small improvements. Cancel with [30] days' notice.",
      'Monitoring and alerts', 'Fixes when a connected tool changes', 'A results report every month', 'Small changes each month at no extra cost',
      'Every project includes', 'A fixed written quote before work starts', 'No hourly billing', 'A named lead you can contact directly', 'Automations and code built in your own accounts', 'Full documentation and handover', 'The option to stop after discovery',
      'What we need from you', 'A decision-maker for the 30-minute call', 'Access to the people who do the work today', 'Admin access to the tools involved, for the build period', 'Prompt feedback during testing',
      'How quoting works', 'Three steps to a fixed price.',
      'A 30-minute call. We ask about your processes, tools and what a good result looks like.',
      'Within [one business day], a written quote for discovery or a first build, with what is included and what is not.',
      'You decide. The quote stands for 30 days and nothing starts until you say so.',
      'The alternatives', 'Why not hire, do it yourself, or call a big firm?', 'What usually happens', 'With ZIU AI',
      'Hire in-house', 'Do it yourself with no-code tools', 'A large consultancy',
      'A named person, a fixed written quote, and a first result in about 30 days.',
    ],
  },
  '/case-studies/': {
    title: 'Results | ZIU AI',
    description: 'Measured results from AI automation projects, with the baseline, method and period shown for each.',
    must: [
      'Results, and how we measured them.', 'Every case states the starting point, the change and the period measured. Nothing is published before it has run for at least four weeks.',
      'ZIU AI internal', 'Starting with our own operations.', 'Each case study shows the starting point, what we built, the result and the period measured.',
      'Lead intake and first reply: [what changed]', 'The situation', 'What we built', 'The result', 'In their words', 'Timeline',
      '[2–3 sentences: the team, the process and the problem, with the baseline figure]',
      '[2–3 sentences in plain language: tools connected, what the automation does, where a person approves]',
      '[Before] to [After], measured over [period] using [method, e.g. CRM timestamps]',
      '"[Quote]" — [Full name], [Role], [Company] (with written permission)', '[Weeks from discovery to launch]',
      'Founding clients', 'Become a founding client.',
      'We are working with a small number of founding clients at a reduced price. In return, we ask for permission to publish a measured case study and a named review when the work is complete.',
      'Ask about a founding-client place',
    ],
  },
  '/how-we-work/': {
    title: 'How We Work | ZIU AI',
    description: 'Our four-step method: map, build, launch, run. Fixed prices, human approval and clear data handling.',
    must: [
      'How a project runs, start to finish.', 'Four steps, a fixed price, and one person accountable throughout. We tell you when something is not worth automating.',
      'We interview the people who do the work, document the process as it runs today, and agree the measure of success.',
      'We build in your accounts, test with real examples, and show progress every week.',
      'We switch on with your team, train them, and monitor closely for two weeks.',
      'We monitor, fix and improve, and send a results report every month.',
      'Your time', '2–4 hours', '1–2 hours a week', '1–2 hours', '30 minutes a month',
      'Safety, data and control',
      'You own the accounts, the automations and the code. Nothing is locked to us.', 'Human approval is built in for sensitive actions.',
      'Only the access we need: we use only the permissions a process needs.', 'Failures alert a person and pause the task, rather than guessing.',
      'We document where your data is processed and which AI services are used.', 'When a project ends, we hand over everything and remove our access.',
      'Our principles', 'We tell you when something is not worth automating.', 'We measure before we claim.',
      'We choose tools for your situation, not ours.', 'We write in plain language.', 'We stay until it works in daily use.',
    ],
  },
  '/industries/': {
    must: [
      'Automation shaped to your sector.', 'The same method, applied to the work your sector does every day.',
      'Professional services', 'Accounting, legal and consulting firms', 'Client intake, document collection, engagement letters, timesheet reminders and billing follow-up.',
      'Real estate and property', 'Agencies and property managers', 'Lead capture from portals, viewing bookings, tenant requests and maintenance tracking.',
      'E-commerce and retail', 'Online and multi-channel sellers', 'Order updates, returns, customer questions, stock alerts and supplier reorders.',
      'Healthcare clinics', 'Private clinics and practices', 'Appointment booking and reminders, intake forms and administrative follow-up. We do not automate clinical decisions.',
      'Typical first project:', 'Client intake and document collection, end to end.', 'Portal leads answered and booked within minutes.',
      'Order and delivery questions answered from live order data.', 'Booking, reminders and intake forms in one flow.',
      '[Add a case study for this sector when available]',
    ],
  },
  '/about/': {
    title: 'About ZIU AI',
    description: 'A founder-led AI consulting and automation firm working with businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.',
    must: [
      'We build what we would run ourselves.',
      'ZIU AI is a founder-led firm. We advise on where AI pays off, build it, and run it, for businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.',
      'Why ZIU AI exists', 'Our story',
      "[2–3 sentences in the founder's voice: why ZIU AI was started, the problem you saw in businesses, and what you do differently. Facts only.]",
      'The name', 'What ZIU AI stands for', '[Explain the name, if it has a meaning you want to share. Otherwise delete this block.]',
      'Who you will work with.', 'You deal with the founder directly, from the first call to the monthly report.',
      '[Photo of Krunal Rajput]', '[Relevant experience as fact.]', '[LinkedIn link]', 'Where we work',
      'We work with businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.', '[State team locations and time zones covered.]',
    ],
  },
  '/resources/': {
    must: [
      'Guides, tools and answers before you start.',
      'How much does it cost?', 'Every project is quoted at a fixed price after a 30-minute call, based on the processes involved. Starting prices are on the pricing page. There is no hourly billing, and you see the full quote before any work starts.',
      'How long does it take?', 'Discovery takes 1–2 weeks. A first automation is usually live in about 30 days. Custom software and larger systems take longer, and we tell you how long before you commit.',
      'Do you only do automation, or also consulting?', 'Both. We advise on where AI pays off and in what order, then build and run what you decide to go ahead with. You can take the advice alone.',
      'Can you build custom software for us?', 'Yes. When no off-the-shelf tool fits, we design and build internal tools, portals and small applications around your process. You own the code and the documentation.',
      'Who owns what you build?', 'You do. Automations run in your accounts, code lives in your repositories, and every project ends with documentation and a handover. Nothing is locked to us.',
      'Which tools do you use?', 'We build on the tools you already have where possible, and add Zapier, Make, n8n or custom code depending on volume, cost and data needs. We explain the choice in writing.',
      'What happens after launch?', 'We watch every automation closely for two weeks after launch. After that, a Run and improve plan covers monitoring, fixes and monthly improvements. Without a plan, you still have full documentation and can run it yourself.',
      'What happens if an automation breaks?', 'You are alerted and the task is paused for review. On a Run and improve plan, we fix it within [agreed response time].',
      'Is our data safe?', 'Automations run in your accounts with only the access they need. We tell you where data is processed and which AI services are used, follow the data protection rules in your region, and remove our access when you ask.',
      'Will AI replace my staff?', 'Our work removes repetitive tasks so people can spend time on customers and decisions. A person stays in charge of anything sensitive.',
      'Can we stop after discovery?', 'Yes. You keep the discovery report and are under no obligation to continue.',
      'What should not be automated?', 'Rare, high-judgment or fast-changing tasks are usually better left to people. We tell you if a process falls into that group.',
      'Zapier, Make, n8n or custom code: how we choose.', 'Best when', 'Watch out for',
      'Simple, low-volume workflows between popular apps; fastest to set up', 'Cost can rise with task volume',
      'Workflows with several steps and if/then rules', 'Complex scenarios need careful documentation',
      'n8n (an automation tool that can run on your own servers)', 'Higher volumes, custom logic, or a need to keep data on your own servers', 'Self-hosting needs maintenance',
      'Unusual systems, strict performance or security needs', 'Higher build cost; needs a maintainer',
      'What is one repetitive task costing you?', 'Enter your own figures. The estimate uses only what you type, and the formula is shown.',
      'This is your own estimate from the figures above. It is not a quote or a promise.', 'Send these numbers with my inquiry',
      'Find your first automation in 5 minutes.', 'Answer a few questions. We email you a short list of likely candidates and, if useful, an invitation to a 30-minute call.', 'Take the 5-minute check',
    ],
  },
  '/automation-check/': {
    title: 'Automation Check | ZIU AI',
    description: 'Find your first automation in 5 minutes.',
    must: ['Find your first automation in 5 minutes.', 'Answer a few questions. We email you a short list of likely candidates and, if useful, an invitation to a 30-minute call.',
      'Team size', 'Tools used', 'Who approves the work today?', 'Region', 'Hours a week', 'We use your details only to reply to your inquiry. See our privacy policy.'],
  },
  '/regions/usa-canada/': { must: ['Working with businesses in the USA and Canada.', 'The same services and fixed prices, with invoicing, hours and data protection set for your region.', 'USD / CAD', '[Time zones covered]', "We follow applicable US state privacy laws, such as the CCPA in California, and Canada's PIPEDA.", 'Email, phone, booking calendar', '[Office or representative, only if real]', 'Invoicing currency', 'Working hours', 'Data protection', 'How to reach us', 'Local presence'] },
  '/regions/uk-europe/': { must: ['Working with businesses in the UK and Europe.', 'GBP / EUR', 'We follow UK GDPR and EU GDPR, sign a data processing agreement on request, and can keep processing in the EU or UK where required.'] },
  '/regions/uae-gulf/': { must: ['Working with businesses in the UAE and the Gulf.', 'AED', 'Gulf Standard Time [confirm coverage]', 'We follow the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and state where data is processed.', 'WhatsApp, email, booking calendar. Arabic version planned.'] },
  '/regions/india/': { must: ['Working with businesses in India.', 'INR', 'IST [confirm coverage]', 'We follow the Digital Personal Data Protection Act, 2023.', 'WhatsApp, email, booking calendar'] },
  '/contact/': {
    title: 'Contact ZIU AI',
    description: 'Book a 30-minute call with ZIU AI, or send a message.',
    must: [
      "Tell us what takes too much of your team's time.", 'Book a 30-minute call, or send a message and we will reply within [one business day].',
      'Book a call', '[Booking calendar embed: 30-minute call]', 'What happens next', 'Send a message',
      'Name', 'Work email', 'Company and website', 'Region', 'Team size', 'What would you like to automate or build?', 'Preferred contact', 'Email', 'Phone', 'WhatsApp',
      'We use your details only to reply to your inquiry. See our privacy policy.',
      'We reply within [one business day] to confirm a time.', 'On the call, we ask about your processes and tools.',
      'You leave with three processes worth automating, whether or not we work together.', 'If it makes sense, we send a fixed written quote for discovery or a first build.',
      'Krunal Rajput, Founder',
    ],
  },
  '/careers/': { must: ['Work with us', '[Careers content not yet supplied.]'] },
  '/privacy/': { must: ['Privacy policy', '[Privacy policy to be supplied and reviewed by legal counsel before launch.]'] },
  '/terms/': { must: ['Terms', '[Terms to be supplied and reviewed by legal counsel before launch.]'] },
};

// Solution detail pages carry their name, their build list and their proof placeholder.
const ucPages = { 'sales-lead-follow-up': 'Sales and lead follow-up', 'customer-support': 'Customer support', 'finance-invoicing': 'Finance and invoicing', 'operations-scheduling': 'Operations and scheduling', 'hr-onboarding': 'HR and onboarding', reporting: 'Reporting' };
for (const [slug, name] of Object.entries(ucPages)) {
  PAGES[`/use-cases/${slug}/`] = {
    must: [name, `What we set up for ${name.toLowerCase()}.`, 'What a typical build includes', 'Built in your accounts, in about 30 days.',
      `[Add a measured case study for ${name.toLowerCase()} when available: baseline, result, period and method.]`, 'See how we work'],
    mustNot: ['Four steps'], // the method is told once, on How we work and the homepage
  };
}

// Link destinations for the standard calls to action.
const CTA_RULES = [
  ['Book a 30-minute call', /^(\/contact\/)?#book$/],
  ['Take the 5-minute check', /^\/automation-check\/$/],
  ['See how we work', /^\/how-we-work\/$/],
  ['See pricing', /^\/pricing\/$/],
];

// Pages that must not exist any more.
const GONE = ['/engagements/'];

let fails = 0;
const fail = (m) => { fails++; console.log('  ✗ ' + m); };
for (const [p, spec] of Object.entries(PAGES)) {
  const html = read(p);
  const t = text(html);
  const before = fails;
  console.log(p);
  for (const m of [...GLOBAL, ...spec.must]) if (!t.includes(norm(m))) fail(`missing: ${m}`);
  for (const m of spec.mustNot || []) if (t.includes(norm(m))) fail(`should not appear: ${m}`);
  const br = t.match(BRITISH); if (br) fail(`British spelling: "${br[0]}" near "${t.slice(Math.max(0, br.index - 30), br.index + 30)}"`);
  if (spec.title && !html.includes(`<title>${spec.title.replace(/&/g, '&amp;')}</title>`) && !html.includes(`<title>${spec.title}</title>`)) fail(`SEO title should be "${spec.title}"`);
  if (spec.description && !html.includes(`<meta name="description" content="${spec.description.replace(/&/g, '&amp;')}">`) && !html.includes(`<meta name="description" content="${spec.description}">`)) fail(`meta description should be "${spec.description}"`);
  for (const [, href, label] of html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(?:<span>)?([^<]+)/g)) {
    for (const [l, re] of CTA_RULES) if (norm(label) === l && !re.test(href)) fail(`"${l}" links to ${href}`);
  }
  if (fails === before) console.log('  ✓ all approved copy present');
}
for (const p of GONE) if (fs.existsSync(path.join(DIST, p, 'index.html'))) fail(`${p} should no longer be built`);
console.log(fails ? `\n${fails} gap(s) found` : '\nReconciliation passed: no gaps');
process.exitCode = fails ? 1 : 0;
