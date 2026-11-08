// Site copy, v2.0 (8 November 2026). American English.

export const POSITIONING = 'AI consulting, custom automation and software for growing businesses.';

// What we do: three pillars, used on the homepage, the Services page and the footer.
export const PILLARS = [
  { id: 'advise', name: 'Advise', title: 'Decide where AI pays off', body: 'A clear view of where AI will save your business the most, what it will cost, and what to do first.', services: ['strategy', 'discovery'] },
  { id: 'build', name: 'Build', title: 'Build the automation or application', body: 'Automations, AI assistants and custom software, built in your own accounts and tested on your real work.', services: ['workflow', 'assistants', 'software', 'integration'] },
  { id: 'run', name: 'Run', title: 'Keep it running', body: 'Monitoring, fixes, monthly improvements and training, so what we build stays in daily use.', services: ['run', 'training'] },
];

export const USE_CASES = [
  {
    slug: 'sales-lead-follow-up', icon: 'sales', name: 'Sales and lead follow-up',
    example: 'Every inquiry logged, qualified and answered within minutes, with the CRM kept up to date.',
    items: ['Every web, email and phone inquiry logged in the CRM automatically', 'Leads scored and routed to the right person', 'A first reply drafted within minutes', 'Follow-up reminders so no lead goes quiet'],
    build: ['Your inbox, website form and phone log connected to the CRM', 'A scoring rule you agree with us, in plain language', 'Reply drafts in your tone, approved by a person before sending', 'A weekly list of leads with no follow-up'],
  },
  {
    slug: 'customer-support', icon: 'support', name: 'Customer support',
    example: 'Common questions answered from your own documents. Complex cases handed to a person with the full story.',
    items: ['Common questions answered from your help documents', 'Tickets sorted by topic and urgency', 'Complex cases passed to staff with a summary', 'Weekly report of the questions customers ask most'],
    build: ['An assistant that answers only from your approved documents', 'Clear hand-off rules: what it answers, what it passes on', 'A summary and suggested reply for every escalated case', 'A monthly review of what customers asked and where answers were missing'],
  },
  {
    slug: 'finance-invoicing', icon: 'finance', name: 'Finance and invoicing',
    example: 'Invoices read and matched to orders. Overdue payments chased politely, on time, every time.',
    items: ['Invoices and receipts read and entered into accounting software', 'Orders, invoices and payments matched', 'Polite, scheduled payment reminders', 'Month-end figures gathered in one place'],
    build: ['Document reading connected to your accounting software', 'Three-way matching with exceptions flagged for a person', 'A reminder schedule you set, with every message approved or templated', 'A month-end pack assembled automatically'],
  },
  {
    slug: 'operations-scheduling', icon: 'operations', name: 'Operations and scheduling',
    example: 'Appointments booked, confirmed and rescheduled. Jobs, stock and calendars kept in step.',
    items: ['Appointments booked, confirmed and rescheduled', 'Job and order status updates sent to customers', 'Stock alerts and reorder drafts'],
    build: ['Your calendar, job system and messaging connected', 'Customer updates triggered by real status changes', 'Stock thresholds you set, with reorder drafts for approval'],
  },
  {
    slug: 'hr-onboarding', icon: 'hr', name: 'HR and onboarding',
    example: 'Contracts sent, documents collected and accounts set up for new starters, without a paper checklist.',
    items: ['Offer letters and contracts prepared from templates', 'Documents collected and checked for completeness', 'Accounts and access set up for new starters'],
    build: ['Your templates turned into a guided checklist', 'Document collection with automatic completeness checks', 'Account and access set-up requests raised in the right systems'],
  },
  {
    slug: 'reporting', icon: 'reporting', name: 'Reporting',
    example: 'Figures from all your applications in one weekly summary, in your inbox before Monday’s meeting.',
    items: ['Figures pulled from several applications into one report', 'Weekly summaries delivered by email or chat', 'Alerts when a number moves outside its usual range'],
    build: ['Connections to the applications that hold your numbers', 'One report layout, agreed with you, delivered on a schedule', 'Alert thresholds for the figures that matter most'],
  },
];

export const SERVICE_DETAILS = [
  { id: 'strategy', pillar: 'advise', name: 'AI strategy and roadmap', body: 'We assess where AI pays off in your business and give you a ranked, costed roadmap you can act on with or without us.',
    items: ['Review of your processes, applications and data', 'Ranked opportunities by value, cost and risk', 'A written roadmap with first, second and third steps', 'Clear advice on what not to automate'] },
  { id: 'discovery', pillar: 'advise', name: 'Discovery and automation audit', body: 'We map how work moves through your business, find where time is lost, and rank the opportunities by value and effort.',
    items: ['Process interviews and mapping', 'Ranked list of processes worth automating', 'Time-saved estimate for each, with the assumptions shown', 'A tailored proposal for the first build'] },
  { id: 'workflow', pillar: 'build', name: 'Workflow automation', body: 'We connect the applications you already use so information moves without copy and paste.',
    items: ['CRM, email, calendar, accounting and form integrations', 'Built on Zapier, Make, n8n or custom code, chosen for your case', 'Error alerts and a written handover'] },
  { id: 'assistants', pillar: 'build', name: 'AI assistants and agents', body: 'Assistants that read, draft, sort and answer using your own documents and rules, with a person approving what matters.',
    items: ['Email and inquiry triage', 'Document reading (invoices, forms, contracts)', 'Internal knowledge assistants', 'Customer support assistants with hand-off to staff'] },
  { id: 'software', pillar: 'build', name: 'Software/Applications', body: 'When no off-the-shelf application fits, we design and build the internal application, portal or application your team needs. You own the code.',
    items: ['Internal applications, dashboards and client portals', 'Small applications built around one process', 'AI features added to software you already run', 'Source code, documentation and hosting set up in your name'] },
  { id: 'integration', pillar: 'build', name: 'Systems integration', body: 'We connect systems that do not talk to each other, including older software, through their APIs or files.',
    items: ['API integrations', 'Data sync between applications', 'Clean-up of duplicate and missing records'] },
  { id: 'run', pillar: 'run', name: 'Run and improve', body: 'We monitor every automation we build, fix issues and improve it each month.',
    items: ['Monitoring and alerts', 'Fixes when a connected application changes', 'Monthly results report', 'Improvements included in your agreed support scope'] },
  { id: 'training', pillar: 'run', name: 'Training and adoption', body: 'We train your team on each automation and check usage after launch, so it gets used.',
    items: ['Hands-on workshops by team', 'Written guides for each automation', 'Usage review after launch'] },
];

// Engagements: all pricing is individually scoped from customer requirements.
export const ENGAGEMENTS = [
  { id: 'discovery', name: 'Discovery', duration: '1–2 weeks', price: 'Custom quote', suits: 'You know work is being lost but not where to start.',
    body: 'We map your key processes, rank the processes worth automating and estimate the time each could save. You keep the full report, whether or not you continue.',
    includes: ['Interviews with the people who do the work', 'A process map and a ranked list of opportunities', 'A time-saved estimate for each, with the assumptions shown', 'A tailored proposal for the first build'] },
  { id: 'first', name: 'First automation', duration: 'About 30 days', price: 'Custom quote', suits: 'You have one process that clearly needs fixing.',
    body: 'One process automated end to end, tested with your team, launched and watched closely for two weeks.',
    includes: ['One automation or application, built in your accounts', 'Testing on your real examples', 'Training for the people who use it', 'Two weeks of close monitoring after launch'] },
  { id: 'run', name: 'Run and improve', duration: 'Monthly plan', price: 'Custom quote', suits: 'You want what we built to keep working and get better.',
    body: 'Monitoring, fixes, a monthly results report and improvements based on your support requirements.',
    includes: ['Monitoring and alerts', 'Fixes when a connected application changes', 'A results report every month', 'Improvements included in your agreed support scope'] },
];

export const FAQS = [
  { q: 'How much does it cost?', a: 'Pricing depends on your requirements, project scope, complexity, integrations and support needs. We review these with you and prepare a tailored proposal before work begins. Any changes to scope or cost are discussed with you first.' },
  { q: 'How long does it take?', a: 'Discovery takes 1–2 weeks. A first automation is usually live in about 30 days. Custom software and larger systems take longer, and we tell you how long before you commit.' },
  { q: 'Do you only do automation, or also consulting?', a: 'Both. We advise on where AI pays off and in what order, then build and run what you decide to go ahead with. You can take the advice alone.' },
  { q: 'Can you build custom software for us?', a: 'Yes. When no off-the-shelf application fits, we design and build internal applications, portals and small applications around your process. You own the code and the documentation.' },
  { q: 'Who owns what you build?', a: 'You do. Automations run in your accounts, code lives in your repositories, and every project ends with documentation and a handover. Nothing is locked to us.' },
  { q: 'Which applications do you use?', a: 'We build on the applications you already have where possible, and add Zapier, Make, n8n or custom code depending on volume, cost and data needs. We explain the choice in writing.' },
  { q: 'What happens after launch?', a: 'We watch every automation closely for two weeks after launch. After that, a Run and improve plan covers monitoring, fixes and monthly improvements. Without a plan, you still have full documentation and can run it yourself.' },
  { q: 'What happens if an automation breaks?', a: 'You are alerted and the task is paused for review. On a Run and improve plan, we investigate and resolve issues according to the response times agreed in your support plan.' },
  { q: 'Is our data safe?', a: 'Automations run in your accounts with only the access they need. We tell you where data is processed and which AI services are used, follow the data protection rules in your region, and remove our access when you ask.' },
  { q: 'Will AI replace my staff?', a: 'Our work removes repetitive tasks so people can spend time on customers and decisions. A person stays in charge of anything sensitive.' },
  { q: 'Can we stop after discovery?', a: 'Yes. You keep the discovery report and are under no obligation to continue.' },
  { q: 'What should not be automated?', a: 'Rare, high-judgment or fast-changing tasks are usually better left to people. We tell you if a process falls into that group.' },
];

export const INDUSTRIES = [
  { id: 'professional-services', name: 'Professional services', for: 'Accounting, legal and consulting firms', body: 'Client intake, document collection, engagement letters, timesheet reminders and billing follow-up.', first: 'Client intake and document collection, end to end.' },
  { id: 'real-estate', name: 'Real estate and property', for: 'Agencies and property managers', body: 'Lead capture from portals, viewing bookings, tenant requests and maintenance tracking.', first: 'Portal leads answered and booked within minutes.' },
  { id: 'ecommerce', name: 'E-commerce and retail', for: 'Online and multi-channel sellers', body: 'Order updates, returns, customer questions, stock alerts and supplier reorders.', first: 'Order and delivery questions answered from live order data.' },
  { id: 'healthcare', name: 'Healthcare clinics', for: 'Private clinics and practices', body: 'Appointment booking and reminders, intake forms and administrative follow-up. We do not automate clinical decisions.', first: 'Booking, reminders and intake forms in one flow.' },
];

export const REGIONS = [
  { slug: 'usa-canada', name: 'USA & Canada', long: 'the USA and Canada', title: 'Working with businesses in the USA and Canada.',
    rows: [['Invoicing currency', 'USD / CAD'], ['Data protection', 'Data handling, access and hosting requirements are agreed for each project before work begins.'], ['How to reach us', 'Email: krunal@ziuai.ai']] },
  { slug: 'uk-europe', name: 'UK & Europe', long: 'the UK and Europe', title: 'Working with businesses in the UK and Europe.',
    rows: [['Invoicing currency', 'GBP / EUR'], ['Data protection', 'Data handling, access and hosting requirements are agreed for each project before work begins.'], ['How to reach us', 'Email: krunal@ziuai.ai']] },
  { slug: 'uae-gulf', name: 'UAE & Gulf', long: 'the UAE and the Gulf', title: 'Working with businesses in the UAE and the Gulf.',
    rows: [['Invoicing currency', 'AED'], ['Data protection', 'Data handling, access and hosting requirements are agreed for each project before work begins.'], ['How to reach us', 'Email: krunal@ziuai.ai']] },
  { slug: 'india', name: 'India', long: 'India', title: 'Working with businesses in India.',
    rows: [['Invoicing currency', 'INR'], ['Data protection', 'Data handling, access and hosting requirements are agreed for each project before work begins.'], ['How to reach us', 'Email: krunal@ziuai.ai']] },
];

export const APPLICATIONS = [
  ['Zapier', 'Simple, low-volume workflows between popular apps; fastest to set up', 'Cost can rise with task volume'],
  ['Make', 'Workflows with several steps and if/then rules', 'Complex scenarios need careful documentation'],
  ['n8n (an automation application that can run on your own servers)', 'Higher volumes, custom logic, or a need to keep data on your own servers', 'Self-hosting needs maintenance'],
  ['Custom code', 'Unusual systems, strict performance or security needs', 'Higher build cost; needs a maintainer'],
];

// Who we work best with (homepage "Who it is for").
export const FIT = {
  yes: ['Your work still moves by email, spreadsheets and copy and paste', 'You own the decision and want a proposal tailored to your requirements', 'You want one process fixed properly before you commit to more', 'You want to own what gets built and understand how it works'],
  no: ['You want a chatbot on the website and nothing behind it', 'You need a large system rebuilt in a quarter', 'You want AI to make decisions no one checks', 'You are looking for the cheapest hourly rate'],
};

// Why ZIU AI rather than the alternatives (pricing page).
export const COMPARE = [
  ['Hire in-house', 'A salary before the first result, and one person who has to know strategy, automation applications and software.', 'You get a team that does this every week, with scope and pricing tailored to your project, and a handover you can take in-house later.'],
  ['Do it yourself with no-code applications', 'Fast to start, slow to finish. Automations break quietly when an application changes, and no one is watching.', 'We build on the same applications where they fit, add monitoring and alerts, and fix things when they break.'],
  ['A large consultancy', 'Long discovery, large teams, and a bill that grows with the hours.', 'A named person, a tailored proposal, and a delivery plan based on your requirements.'],
];

// Supplied by the owner on 6 November 2026.
export const OWNER = { name: 'Krunal Rajput', role: 'CEO & Founder', email: 'krunal@ziuai.ai', address: '11th Floor, Shaligram Corporates, Iscon Ambali Road, Ahmedabad 380058' };
