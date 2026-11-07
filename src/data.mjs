// Approved copy from "ZIU AI Website Content v1.0" (2 November 2026).

export const USE_CASES = [
  {
    slug: 'sales-lead-follow-up', icon: 'sales', name: 'Sales and lead follow-up',
    example: 'Capture every enquiry, qualify it, update the CRM and send a first reply within minutes.',
    items: ['Every web, email and phone enquiry logged in the CRM automatically', 'Leads scored and routed to the right person', 'A first reply drafted within minutes', 'Follow-up reminders so no lead goes quiet'],
  },
  {
    slug: 'customer-support', icon: 'support', name: 'Customer support',
    example: 'Answer common questions from your own documents and hand complex cases to a person with full context.',
    items: ['Common questions answered from your help documents', 'Tickets sorted by topic and urgency', 'Complex cases passed to staff with a summary', 'Weekly report of the questions customers ask most'],
  },
  {
    slug: 'finance-invoicing', icon: 'finance', name: 'Finance and invoicing',
    example: 'Read invoices and receipts, match them to orders, and chase overdue payments politely and on time.',
    items: ['Invoices and receipts read and entered into accounting software', 'Orders, invoices and payments matched', 'Polite, scheduled payment reminders', 'Month-end figures gathered in one place'],
  },
  {
    slug: 'operations-scheduling', icon: 'operations', name: 'Operations and scheduling',
    example: 'Book, confirm and reschedule appointments; keep jobs, stock and calendars in step.',
    items: ['Appointments booked, confirmed and rescheduled', 'Job and order status updates sent to customers', 'Stock alerts and reorder drafts'],
  },
  {
    slug: 'hr-onboarding', icon: 'hr', name: 'HR and onboarding',
    example: 'Send contracts, collect documents and set up accounts for new starters without a checklist on paper.',
    items: ['Offer letters and contracts prepared from templates', 'Documents collected and checked for completeness', 'Accounts and access set up for new starters'],
  },
  {
    slug: 'reporting', icon: 'reporting', name: 'Reporting',
    example: 'Pull figures from your tools into one weekly summary that arrives before Monday’s meeting.',
    items: ['Figures pulled from several tools into one report', 'Weekly summaries delivered by email or chat', 'Alerts when a number moves outside its usual range'],
  },
];

export const SERVICE_DETAILS = [
  { id: 'discovery', name: 'Discovery and automation audit', body: 'We map how work moves through your business, find where time is lost, and rank the opportunities by value and effort.',
    items: ['Process interviews and mapping', 'Ranked list of automation candidates', 'Time-saved estimate for each, with the assumptions shown', 'Clear advice on what not to automate'] },
  { id: 'workflow', name: 'Workflow automation', body: 'We connect the tools you already use so information moves without copy and paste.',
    items: ['CRM, email, calendar, accounting and form integrations', 'Built on Zapier, Make, n8n or custom code, chosen for your case', 'Error alerts and a written handover'] },
  { id: 'assistants', name: 'AI assistants and agents', body: 'We build assistants that read, draft, sort and answer using your own documents and rules, with a person approving what matters.',
    items: ['Email and enquiry triage', 'Document reading (invoices, forms, contracts)', 'Internal knowledge assistants', 'Customer support assistants with hand-off to staff'] },
  { id: 'integration', name: 'Systems integration', body: 'We connect systems that do not talk to each other, including older software, through their APIs or files.',
    items: ['API integrations', 'Data sync between tools', 'Clean-up of duplicate and missing records'] },
  { id: 'run', name: 'Run and improve', body: 'We monitor every automation we build, fix issues and improve it each month.',
    items: ['Monitoring and alerts', 'Fixes when a connected tool changes', 'Monthly results report', 'Small improvements included'] },
  { id: 'training', name: 'Training and adoption', body: 'We help your team use AI tools well in their daily work.',
    items: ['Hands-on workshops by team', 'Written guides for each automation', 'Usage review after launch'] },
];

export const FAQS = [
  { q: 'How much does it cost?', a: 'Every engagement is quoted at a fixed price after a short scoping call, based on the processes involved. There is no hourly billing, and you see the full quote before any work starts.' },
  { q: 'How long does it take?', a: 'Discovery takes 1–2 weeks. A first automation is usually live in about 30 days. More complex systems take longer, and we will say so up front.' },
  { q: 'Which tools do you use?', a: 'We build on the tools you already have where possible, and add Zapier, Make, n8n or custom code depending on volume, cost and data needs. We explain the choice in writing.' },
  { q: 'What happens if an automation breaks?', a: 'You are alerted and the task is paused for review. On a Run and improve plan, we fix it within [agreed response time].' },
  { q: 'Is our data safe?', a: 'Automations run in your accounts with the minimum access needed. We tell you where data is processed, follow the data protection rules in your region, and remove our access when you ask.' },
  { q: 'Will AI replace my staff?', a: 'Our work removes repetitive tasks so people can spend time on customers and decisions. A person stays in charge of anything sensitive.' },
  { q: 'Can we stop after discovery?', a: 'Yes. You keep the discovery report and are under no obligation to continue.' },
  { q: 'What should not be automated?', a: 'Rare, high-judgement or fast-changing tasks are usually better left to people. We will tell you if a process falls into that group.' },
];

export const INDUSTRIES = [
  { id: 'professional-services', name: 'Professional services', for: 'Accounting, legal and consulting firms', body: 'Client intake, document collection, engagement letters, time-entry reminders and billing follow-up.' },
  { id: 'real-estate', name: 'Real estate and property', for: 'Agencies and property managers', body: 'Lead capture from portals, viewing bookings, tenant requests and maintenance tracking.' },
  { id: 'ecommerce', name: 'E-commerce and retail', for: 'Online and multi-channel sellers', body: 'Order updates, returns, customer questions, stock alerts and supplier reorders.' },
  { id: 'healthcare', name: 'Healthcare clinics', for: 'Private clinics and practices', body: 'Appointment booking and reminders, intake forms and administrative follow-up. We do not automate clinical decisions.' },
];

export const REGIONS = [
  { slug: 'usa-canada', name: 'USA and Canada', short: 'USA & Canada', title: 'AI automation for businesses in the USA and Canada.',
    rows: [['Invoicing currency', 'USD / CAD'], ['Working hours', '[Time zones covered]'], ['Data protection', 'We follow applicable US state privacy laws, such as the CCPA in California, and Canada’s PIPEDA.'], ['How to reach us', 'Email, phone, booking calendar'], ['Local presence', '[Office or representative, only if real]']] },
  { slug: 'uk-europe', name: 'UK and Europe', short: 'UK & Europe', title: 'AI automation for businesses in the UK and Europe.',
    rows: [['Invoicing currency', 'GBP / EUR'], ['Working hours', '[Time zones covered]'], ['Data protection', 'We follow UK GDPR and EU GDPR, sign a data processing agreement on request, and can keep processing in the EU or UK where required.'], ['How to reach us', 'Email, phone, booking calendar'], ['Local presence', '[Office or representative, only if real]']] },
  { slug: 'uae-gulf', name: 'UAE and Gulf', short: 'UAE & Gulf', title: 'AI automation for businesses in the UAE and the Gulf.',
    rows: [['Invoicing currency', 'AED'], ['Working hours', 'Gulf Standard Time [confirm coverage]'], ['Data protection', 'We follow the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and state where data is processed.'], ['How to reach us', 'WhatsApp, email, booking calendar. Arabic version planned.'], ['Local presence', '[Office or representative, only if real]']] },
  { slug: 'india', name: 'India', short: 'India', title: 'AI automation for businesses in India.',
    rows: [['Invoicing currency', 'INR'], ['Working hours', 'IST [confirm coverage]'], ['Data protection', 'We follow the Digital Personal Data Protection Act, 2023.'], ['How to reach us', 'WhatsApp, email, booking calendar'], ['Local presence', '[Office or representative, only if real]']] },
];

export const TOOLS = [
  ['Zapier', 'Simple, low-volume workflows between popular apps; fastest to set up', 'Cost can rise with task volume'],
  ['Make', 'Multi-step workflows with branching and data shaping', 'Complex scenarios need careful documentation'],
  ['n8n', 'Higher volumes, custom logic, or a need to self-host for data control', 'Self-hosting needs maintenance'],
  ['Custom code', 'Unusual systems, strict performance or security needs', 'Higher build cost; needs a maintainer'],
];

// Supplied by the owner on 6 November 2026.
export const OWNER = { name: 'Krunal Rajput', role: 'Founder', phone: '+91 93940 67145', tel: '+919394067145' };
export const phoneLink = (cls = '') => `<a class="${cls}" href="tel:${OWNER.tel}">${OWNER.phone}</a>`;
