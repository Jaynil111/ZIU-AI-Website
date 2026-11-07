import { btn, link, kicker, pageHero, ctaBand, sectionIndex, icon, founderFeature, CTA } from './components.mjs';
import { USE_CASES, SERVICE_DETAILS, FAQS, INDUSTRIES, REGIONS, TOOLS, OWNER, phoneLink } from './data.mjs';
import { home, homeIndex, faq } from './home.mjs';

import { FORMS, formSettings } from './site.config.mjs';

// ---- Form delivery (provider set in src/site.config.mjs) ----
const FS = formSettings();
const formAttrs = (name) => `name="${name}" action="${FS.action || '#'}" method="post" data-form data-provider="${FS.provider}"${FS.provider === 'netlify' ? ' data-netlify="true" netlify-honeypot="bot-field"' : ''} novalidate`;
const formHidden = (name, subject) => `
      ${FS.provider === 'netlify' ? `<input type="hidden" name="form-name" value="${name}">` : ''}
      ${Object.entries(FS.hidden).map(([k, v]) => `<input type="hidden" name="${k}" value="${v}">`).join('')}
      <input type="hidden" name="${FS.subjectField}" value="${FORMS.subjectPrefix}: ${subject}">
      <input type="hidden" name="form" value="${name}">
      <input type="hidden" name="page" value="">
      <p class="hp" aria-hidden="true"><label>Leave this field empty <input type="text" name="${FS.honeypot}" tabindex="-1" autocomplete="off"></label></p>`;
const formError = `<p class="form__error" data-form-error role="alert" tabindex="-1" hidden></p>`;
const notConnected = FS.provider ? '' : '<p class="muted">[Form not connected: set a provider in src/site.config.mjs before launch.]</p>';

const pad = (i) => String(i + 1).padStart(2, '0');
const bullets = (items, cls = 'ticks') => `<ul class="${cls}">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

const services = () => `
${pageHero({ kick: 'Services', title: 'From the first map to the system that runs every day.', sub: 'Six services, usually delivered together as one engagement.', actions: btn(CTA.book) + btn({ label: 'See how engagements work', href: '/engagements/' }, 'ghost-light') })}
<section class="section" aria-label="Our services">
  <div class="wrap with-aside">
    <nav class="aside-nav" data-section-index aria-label="Services on this page">
      <ol>${SERVICE_DETAILS.map((s, i) => `<li><a href="#${s.id}"><span class="si__n">${pad(i)}</span><span class="si__l">${s.name}</span></a></li>`).join('')}</ol>
    </nav>
    <div class="service-list">
      ${SERVICE_DETAILS.map((s, i) => `<article class="service" id="${s.id}" aria-labelledby="${s.id}-t" data-reveal>
        <p class="service__n">${pad(i)}${icon(s.id, 'icon--lg')}</p>
        <h2 id="${s.id}-t" class="h2">${s.name}</h2>
        <p class="lede">${s.body}</p>
        ${bullets(s.items)}
      </article>`).join('')}
      <p class="aside-note" data-reveal>${link('Industries', '/industries/')}</p>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) + btn({ label: 'See how engagements work', href: '/engagements/' }, 'ghost-light') })}`;

const useCases = () => `
${pageHero({ kick: 'Use cases', title: 'What AI automation does, team by team.', sub: 'Practical tasks we automate, explained in plain terms.', actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}
<section class="section" aria-label="Use cases by team">
  <div class="wrap">
    <ol class="uc-grid">
      ${USE_CASES.map((u, i) => `<li class="uc" data-reveal>
        <p class="uc__n">${icon(u.icon, 'icon--lg')}<span>${pad(i)}</span></p>
        <h2 class="h3"><a href="/use-cases/${u.slug}/">${u.name}</a></h2>
        ${bullets(u.items, 'ticks ticks--sm')}
        <p class="uc__more" aria-hidden="true">Read more →</p>
      </li>`).join('')}
    </ol>
    <p class="aside-note" data-reveal>${link('Industries', '/industries/')}</p>
  </div>
</section>
${ctaBand({ actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}`;

const useCasePage = (u, i) => {
  const prev = USE_CASES[(i + USE_CASES.length - 1) % USE_CASES.length];
  const next = USE_CASES[(i + 1) % USE_CASES.length];
  return `
${pageHero({ kick: `Use case ${pad(i)} of 06`, title: u.name, sub: u.example, actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}
<section class="section" aria-labelledby="uc-what">
  <div class="wrap split">
    <div data-reveal>${kicker('A', 'What we automate')}<h2 id="uc-what" class="h1">Practical tasks, explained in plain terms.</h2></div>
    <ol class="big-list" data-reveal>${u.items.map((it, k) => `<li><span>${pad(k)}</span>${it}</li>`).join('')}</ol>
  </div>
</section>
<section class="section section--rule" aria-labelledby="uc-how">
  <div class="wrap split">
    <div data-reveal>${kicker('B', 'How it gets built')}<h2 id="uc-how" class="h2">Four steps, with a deliverable at each.</h2></div>
    <div data-reveal>
      <ol class="mini-steps"><li><strong>Map.</strong> We interview the people who do the work and map how it runs today.</li><li><strong>Build.</strong> We build the automation in your accounts and test it on real examples.</li><li><strong>Launch.</strong> We switch it on with your team, train them and watch it closely for two weeks.</li><li><strong>Run.</strong> We monitor, fix and improve it, and report results every month.</li></ol>
      <p>${link('See how it works', '/how-we-work/')}</p>
      <p class="muted">A person approves sensitive steps, such as sending money, contracts or customer messages you choose.</p>
    </div>
  </div>
</section>
<section class="section section--rule" aria-label="Proof for this use case">
  <div class="wrap" data-reveal><p class="muted">[Add a measured case study for ${u.name.toLowerCase()} when available: baseline, result, period and method.]</p></div>
</section>
<nav class="pager wrap" aria-label="More use cases">
  <a href="/use-cases/${prev.slug}/"><span>Previous</span>${prev.name}</a>
  <a href="/use-cases/"><span>All</span>Use cases</a>
  <a href="/use-cases/${next.slug}/"><span>Next</span>${next.name}</a>
</nav>
${ctaBand()}`;
};

const engagements = () => `
<!-- Editor: once 5–10 projects are complete, consider publishing typical price ranges here. -->
${pageHero({ kick: 'Engagements', title: 'Clear scope. Fixed quote. No surprises.', sub: 'Every engagement starts small and is agreed in writing before work begins.', actions: btn(CTA.book) })}
<section class="section" aria-label="The three engagements">
  <div class="wrap">
    <ol class="eng" data-progress>
      <li class="eng__item" data-reveal data-progress-item><p class="eng__dur">Duration: 1–2 weeks</p><h2 class="h2">Discovery</h2><p>We map your key processes, rank the automation opportunities and estimate the time each could save. You keep the full report, whether or not you continue.</p></li>
      <li class="eng__item" data-reveal data-progress-item><p class="eng__dur">Duration: about 30 days</p><h2 class="h2">First automation</h2><p>One process automated end to end, tested with your team, launched and monitored closely for two weeks.</p></li>
      <li class="eng__item" data-reveal data-progress-item><p class="eng__dur">Monthly plan</p><h2 class="h2">Run and improve</h2><p>Monitoring, fixes, a monthly results report and small improvements. Cancel with [30] days’ notice.</p></li>
    </ol>
  </div>
</section>
<section class="section section--rule" aria-label="What is included and what we need">
  <div class="wrap two-lists">
    <div data-reveal>${kicker('A', 'Every engagement includes')}${bullets(['A fixed written quote before work starts', 'No hourly billing', 'A named lead you can contact directly', 'Automations built in your own accounts', 'Full documentation and handover', 'The option to stop after discovery'], 'ticks ticks--lg')}</div>
    <div data-reveal>${kicker('B', 'What we need from you')}${bullets(['A decision-maker for the 30-minute scoping call', 'Access to the people who do the work today', 'Admin access to the tools involved, for the build period', 'Prompt feedback during testing'], 'ticks ticks--lg ticks--plain')}<p class="aside-note">${link('Estimate what a task costs you', '/resources/#savings')}</p></div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const caseTemplate = [
  ['Title', '[Client or “ZIU AI internal”]: [what changed]'],
  ['The situation', '[2–3 sentences: the team, the process and the problem, with the baseline figure]'],
  ['What we built', '[2–3 sentences in plain language: tools connected, what the automation does, where a person approves]'],
  ['The result', '[Before] to [After], measured over [period] using [method, e.g. CRM timestamps]'],
  ['In their words', '“[Quote]” — [Full name], [Role], [Company] (with written permission)'],
  ['Timeline', '[Weeks from discovery to launch]'],
];

const caseStudies = () => `
<!-- Editor: publish three internal case studies, labelled "ZIU AI internal", measured for at least four weeks. -->
${pageHero({ kick: 'Case studies', title: 'Results, and how we measured them.', sub: 'Every case states the starting point, the change and the period measured.' })}
<section class="section" aria-labelledby="internal-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('01', 'ZIU AI internal')}<h2 id="internal-title" class="h1">Starting with our own operations.</h2></div>
      <p class="lede">Each case study shows the starting point, what we built, the result and the period measured.</p>
    </div>
    <div class="case-stack">
      ${['Lead intake and first reply', 'Proposal and quote drafting', 'Invoicing and payment follow-up'].map((t) => `<article class="case-full" data-reveal>
        <header><p class="case-full__tag">ZIU AI internal</p><h3 class="h2">${t}: [what changed]</h3></header>
        <dl class="case-full__body">${caseTemplate.slice(1).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section section--dark" data-theme="dark" aria-labelledby="founding-title">
  <div class="wrap split" data-reveal>
    <div>${kicker('02', 'Founding-client programme', 'kicker--light')}<h2 id="founding-title" class="h1">Become a founding client.</h2></div>
    <div><p class="lede lede--light">We are working with a small number of founding clients on preferential terms. In return, we ask for permission to publish a measured case study and a named review when the work is complete.</p>
    <div class="actions">${btn({ label: 'Ask about a founding-client place', href: '/contact/?topic=founding' })}</div></div>
  </div>
</section>`;

const howWeWork = () => `
${pageHero({ kick: 'How we work', title: 'A simple method, written down.', sub: 'Four steps, a deliverable at each, and a person accountable for every one.', actions: btn(CTA.book) })}
<section class="section" aria-labelledby="steps-title">
  <div class="wrap">
    <h2 id="steps-title" class="sr-only">The four steps</h2>
    <ol class="method" data-progress>
      ${[
        ['Map', 'We interview the people who do the work, document the process as it runs today, and agree the measure of success.'],
        ['Build', 'We build in your accounts, test with real examples, and show progress every week.'],
        ['Launch', 'We switch on with your team, train them, and monitor closely for two weeks.'],
        ['Run', 'We monitor, fix and improve, and send a results report every month.'],
      ].map(([t, d], i) => `<li class="method__step" data-reveal data-progress-item><span class="method__n">${i + 1}</span><h3 class="display-sm">${t}.</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>
<section class="section section--dark" id="safety" data-theme="dark" aria-labelledby="safety-title">
  <div class="wrap split">
    <div data-reveal>${kicker('A', 'You stay in control', 'kicker--light')}<h2 id="safety-title" class="h1">Safety, data and control</h2></div>
    <ul class="commit-list" data-reveal>
      ${['You own the accounts and the automations. Nothing is locked to us.', 'Human approval is built in for sensitive actions.', 'Least access: we use only the permissions a process needs.', 'Failures alert a person and pause the task, rather than guessing.', 'We document where your data is processed and which AI services are used.', 'When an engagement ends, we hand over everything and remove our access.'].map((t) => `<li>${t}</li>`).join('')}
    </ul>
  </div>
</section>
<section class="section" aria-labelledby="principles-title">
  <div class="wrap split">
    <div data-reveal>${kicker('B', 'Principles')}<h2 id="principles-title" class="h1">Our principles</h2></div>
    <ol class="principles" data-reveal>
      ${['We tell you when something is not worth automating.', 'We measure before we claim.', 'We choose tools for your situation, not ours.', 'We write in plain language.', 'We stay until it works in daily use.'].map((t) => `<li>${t}</li>`).join('')}
    </ol>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const industries = () => `
<!-- Editor: choose 3–5 sectors to launch with and delete any you will not target. -->
${pageHero({ kick: 'Industries', title: 'Automation shaped to how your sector works.', actions: btn(CTA.book) })}
<section class="section" aria-label="Sectors">
  <div class="wrap">
    <div class="sectors">
      ${INDUSTRIES.map((s, i) => `<article class="sector" id="${s.id}" data-reveal>
        <p class="sector__n">${icon(s.id, 'icon--lg')}<span>${pad(i)}</span></p>
        <h2 class="h2">${s.name}</h2>
        <p class="sector__for"><span>For</span> ${s.for}</p>
        <p>${s.body}</p>
        <p class="sector__proof"><span>Proof</span> [Add a case study for this sector when available]</p>
      </article>`).join('')}
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const about = () => `
${pageHero({ kick: 'About', title: 'We build automation we would trust in our own business.', sub: 'Because we do.' })}
<section class="section" aria-labelledby="story-title">
  <div class="wrap split">
    <div data-reveal>${kicker('01', 'About')}<h2 id="story-title" class="h1">Our story</h2></div>
    <div data-reveal><p class="lede">[2–3 sentences in the founder’s voice: why ZIU AI was started, the problem you saw in businesses, and what you do differently. Facts only.]</p></div>
  </div>
</section>
<section class="section section--rule" aria-labelledby="name-title">
  <div class="wrap split">
    <div data-reveal>${kicker('02', 'The name')}<h2 id="name-title" class="h2">What ZIU AI stands for</h2></div>
    <div data-reveal><p class="lede">[Explain the name, if it has a meaning you want to share. Otherwise delete this block.]</p></div>
  </div>
</section>
<section class="section section--rule" aria-labelledby="team-title">
  <div class="wrap">
    <div class="split split--head" data-reveal><div>${kicker('03', 'Team')}<h2 id="team-title" class="h1">The people who build and run your systems.</h2></div><p class="lede">Every engagement has a named lead you can reach directly.</p></div>
    ${founderFeature({ experience: '[Relevant experience as fact.]', extra: '<p>[LinkedIn link]</p>' })}
  </div>
</section>
<section class="section section--dark" data-theme="dark" aria-labelledby="where-title">
  <div class="wrap split">
    <div data-reveal>${kicker('04', 'Regions', 'kicker--light')}<h2 id="where-title" class="h1">Where we work</h2></div>
    <div data-reveal>
      <p class="lede lede--light">We work with businesses in the USA and Canada, the UK and Europe, the UAE and the Gulf, and India. [State team locations and time zones covered.]</p>
      <ul class="region-links">${REGIONS.map((r) => `<li><a href="/regions/${r.slug}/">${r.name}<span aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const resources = () => `
${pageHero({ kick: 'Resources', title: 'Questions owners ask before starting.', sub: 'Frequently asked questions · Tool choice guide · Savings calculator · Automation check' })}
<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-sec__grid">
    <div data-reveal>${kicker('01', 'FAQ')}<h2 id="faq-title" class="h1">Frequently asked questions</h2></div>
    <div data-reveal>${faq(FAQS)}</div>
  </div>
</section>
<section class="section section--rule" id="tool-guide" aria-labelledby="tools-title">
  <div class="wrap">
    <div data-reveal>${kicker('02', 'Tool choice guide')}<h2 id="tools-title" class="h1">Zapier, Make, n8n or custom code: how we choose.</h2></div>
    <div class="table-wrap" data-reveal>
      <table class="tool-table">
        <thead><tr><th scope="col">Option</th><th scope="col">Best when</th><th scope="col">Watch out for</th></tr></thead>
        <tbody>${TOOLS.map(([o, b, w]) => `<tr><th scope="row">${o}</th><td data-label="Best when">${b}</td><td data-label="Watch out for">${w}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section section--rule" id="savings" aria-labelledby="savings-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('03', 'Savings calculator')}<h2 id="savings-title" class="h1">What is one repetitive task costing you?</h2></div>
      <p class="lede">Enter your own figures. The estimate uses only what you type, and the formula is shown.</p>
    </div>
    <div class="calc" data-calc data-reveal>
      <form class="calc__inputs form" onsubmit="return false" aria-label="Your figures">
        ${fieldFor('calc-task', 'The task', '<input id="calc-task" name="task" type="text" placeholder="e.g. Copying enquiries into the CRM" maxlength="80">', '(optional)')}
        <div class="field-row field-row--even">
          ${fieldFor('calc-hours', 'Hours a week, per person', '<input id="calc-hours" name="hours" type="number" min="0" max="80" step="0.5" value="5" inputmode="decimal" required>')}
          ${fieldFor('calc-people', 'People who do it', '<input id="calc-people" name="people" type="number" min="1" max="500" step="1" value="2" inputmode="numeric" required>')}
        </div>
        <div class="field-row field-row--even">
          ${fieldFor('calc-rate', 'Cost per hour', '<input id="calc-rate" name="rate" type="number" min="0" max="100000" step="1" value="30" inputmode="decimal" required>', '(salary and overheads)')}
          ${fieldFor('calc-cur', 'Currency', `<select id="calc-cur" name="currency">${['USD', 'CAD', 'GBP', 'EUR', 'AED', 'INR'].map((c) => `<option>${c}</option>`).join('')}</select>`)}
        </div>
        <div class="field">
          <label for="calc-share">Share you think could be automated <output class="calc__share" for="calc-share" data-share>50%</output></label>
          <input id="calc-share" name="share" type="range" min="10" max="90" step="5" value="50" class="range">
          <p class="field__note">Your estimate. Discovery replaces it with a measured figure.</p>
        </div>
        ${fieldFor('calc-weeks', 'Working weeks a year', '<input id="calc-weeks" name="weeks" type="number" min="1" max="52" step="1" value="46" inputmode="numeric" required>')}
      </form>
      <div class="calc__result" aria-labelledby="calc-result-title">
        <p class="calc__label" id="calc-result-title">Your estimate</p>
        <dl class="calc__nums" aria-live="polite">
          <div class="calc__big"><dt>Hours back each year</dt><dd data-out="yearHours">0</dd></div>
          <div><dt>Hours back each week</dt><dd data-out="weekHours">0</dd></div>
          <div><dt>Working days a year</dt><dd data-out="days">0</dd></div>
          <div class="calc__cost"><dt>Value of that time a year</dt><dd data-out="cost">0</dd></div>
        </dl>
        <p class="calc__formula" data-out="formula"></p>
        <p class="calc__note">This is your own estimate from the figures above. It is not a quote or a promise.</p>
        <div class="actions">
          <a class="btn btn--primary" href="/contact/" data-calc-send><span>Send these numbers with my enquiry</span></a>
          ${link('Take the automation check', '/automation-check/')}
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section section--dark" id="automation-check" data-theme="dark" aria-labelledby="check-title">
  <div class="wrap split" data-reveal>
    <div>${kicker('04', 'Automation check', 'kicker--light')}<h2 id="check-title" class="h1">Where could automation help you? Find out in 5 minutes.</h2></div>
    <div><p class="lede lede--light">Result: a short summary of likely candidates by email, and an invitation to a scoping call.</p>
    <div class="actions">${btn({ label: 'Start the automation check', href: '/automation-check/' })}</div></div>
  </div>
</section>`;

const field = (label, input, hint = '') => `<div class="field"><label>${label}${hint ? `<span class="field__hint">${hint}</span>` : ''}</label>${input}</div>`;
const fieldFor = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${label}${hint ? ` <span class="field__hint">${hint}</span>` : ''}</label>${input}</div>`;
const regionOptions = `<option value="">Choose a region</option>${REGIONS.map((r) => `<option>${r.name}</option>`).join('')}<option>Elsewhere</option>`;

const automationCheck = () => `
${pageHero({ kick: 'Automation check', title: 'Where could automation help you? Find out in 5 minutes.', sub: 'Result: a short summary of likely candidates by email, and an invitation to a scoping call.' })}
<section class="section" aria-label="Automation check questionnaire">
  <div class="wrap form-wrap">
    <form class="form form--steps" ${formAttrs('automation-check')}>${formHidden('automation-check', 'Automation check')}
      <div class="form__progress"><p data-step-count aria-live="polite">Step 1 of 4</p><div class="form__bar" data-step-bar></div></div>
      <fieldset data-form-step>
        <legend class="h2">Your team</legend>
        ${fieldFor('ac-size', 'Team size', `<select id="ac-size" name="team_size" required><option value="">Choose</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select>`)}
        ${fieldFor('ac-region', 'Region', `<select id="ac-region" name="region" required>${regionOptions}</select>`)}
      </fieldset>
      <fieldset data-form-step hidden>
        <legend class="h2">Your three most repetitive tasks</legend>
        <p class="muted">And roughly how many hours a week each one takes.</p>
        ${[1, 2, 3].map((n) => `<div class="field-row">
          ${fieldFor(`ac-task${n}`, `Task ${n}`, `<input id="ac-task${n}" name="task_${n}" type="text" ${n === 1 ? 'required' : ''} placeholder="${['e.g. Copying enquiries into the CRM', 'e.g. Chasing unpaid invoices', 'e.g. Building the weekly report'][n - 1]}">`)}
          ${fieldFor(`ac-hours${n}`, 'Hours a week', `<input id="ac-hours${n}" name="hours_${n}" type="number" min="0" max="168" step="0.5" inputmode="decimal" ${n === 1 ? 'required' : ''}>`)}
        </div>`).join('')}
      </fieldset>
      <fieldset data-form-step hidden>
        <legend class="h2">Tools and approvals</legend>
        <div class="field"><p class="field__label" id="ac-tools-l">Tools used</p>
          <div class="checks" role="group" aria-labelledby="ac-tools-l">${['Microsoft 365', 'Google Workspace', 'HubSpot', 'Salesforce', 'Zapier', 'Make', 'n8n', 'Accounting software', 'Other'].map((t) => `<label class="check"><input type="checkbox" name="tools" value="${t}"><span>${t}</span></label>`).join('')}</div>
        </div>
        ${fieldFor('ac-other', 'Other tools', `<input id="ac-other" name="tools_other" type="text">`, '(optional)')}
        ${fieldFor('ac-approve', 'Who approves the work today?', `<input id="ac-approve" name="approver" type="text" required placeholder="e.g. Office manager, finance lead">`)}
      </fieldset>
      <fieldset data-form-step hidden>
        <legend class="h2">Where should we send your summary?</legend>
        ${fieldFor('ac-name', 'Name', `<input id="ac-name" name="name" type="text" autocomplete="name" required>`)}
        ${fieldFor('ac-email', 'Work email', `<input id="ac-email" name="email" type="email" autocomplete="email" required>`)}
        <p class="consent">We use your details only to reply to your enquiry. See our <a href="/privacy/">privacy policy</a>.</p>
      </fieldset>
      ${formError}
      <div class="form__nav">
        <button type="button" class="btn btn--ghost" data-prev hidden><span>Back</span></button>
        <button type="button" class="btn btn--primary" data-next><span>Continue</span></button>
        <button type="submit" class="btn btn--primary" hidden><span>Send my answers</span></button>
      </div>
    </form>
    <div class="form-done" data-form-done tabindex="-1" hidden>
      <h2 class="h2">Thank you.</h2>
      <p>We will email a short summary of likely candidates.</p>
      ${notConnected}
      <div class="actions">${btn(CTA.book)}</div>
    </div>
  </div>
</section>`;

const regionPage = (r) => {
  const others = REGIONS.filter((o) => o.slug !== r.slug);
  return `
<!-- Editor: confirm each data protection statement with legal counsel before publishing. -->
${pageHero({ kick: `Regions · ${r.name}`, title: r.title, actions: btn(CTA.book) })}
<section class="section" aria-label="${r.name} details">
  <div class="wrap split">
    <div data-reveal>${kicker('01', 'Region')}<h2 class="h2">${r.name}</h2></div>
    <dl class="def-table def-table--lg" data-reveal>${r.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  </div>
</section>
<nav class="pager wrap" aria-label="Other regions">${others.map((o) => `<a href="/regions/${o.slug}/"><span>Region</span>${o.name}</a>`).join('')}</nav>
${ctaBand()}`;
};

const contact = () => `
${pageHero({ kick: 'Contact', title: 'Tell us what takes too much of your team’s time.', sub: 'Book a 30-minute scoping call, or send a message and we will reply within [one business day].', actions: btn({ label: 'Book a scoping call', href: '#book' }) })}
<section class="section" aria-label="Book or message">
  <div class="wrap contact">
    <div class="contact__book" id="book" data-reveal>
      ${kicker('A', 'Book a scoping call')}
      <h2 class="h2">Book a scoping call</h2>
      <div class="booking-slot"><p>[Booking calendar embed: 30-minute scoping call]</p></div>
      ${kicker('C', 'What happens next')}
      <ol class="next-steps">
        <li>We reply within [one business day] to confirm a time.</li>
        <li>On the call, we ask about your processes and tools.</li>
        <li>You leave with three candidate processes, whether or not we work together.</li>
        <li>If it makes sense, we send a fixed written quote for discovery.</li>
      </ol>
      <p class="contact__direct">${OWNER.name}, ${OWNER.role}<br>${phoneLink('tlink')} · [email]<br>[business address]</p>
    </div>
    <div class="contact__form" data-reveal>
      ${kicker('B', 'Send a message')}
      <form class="form" ${formAttrs('contact')}>${formHidden('contact', 'Contact enquiry')}
        <div class="field-row">
          ${fieldFor('c-name', 'Name', `<input id="c-name" name="name" type="text" autocomplete="name" required>`)}
          ${fieldFor('c-email', 'Work email', `<input id="c-email" name="email" type="email" autocomplete="email" required>`)}
        </div>
        ${fieldFor('c-company', 'Company and website', `<input id="c-company" name="company" type="text" autocomplete="organization">`)}
        <div class="field-row">
          ${fieldFor('c-region', 'Region', `<select id="c-region" name="region" required>${regionOptions}</select>`)}
          ${fieldFor('c-size', 'Team size', `<select id="c-size" name="team_size"><option value="">Choose</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select>`)}
        </div>
        ${fieldFor('c-msg', 'What would you like to automate?', `<textarea id="c-msg" name="message" rows="5" required></textarea>`)}
        <fieldset class="field"><legend class="field__label">Preferred contact</legend>
          <div class="checks">${['Email', 'Phone', 'WhatsApp'].map((t, i) => `<label class="check"><input type="radio" name="preferred" value="${t}" ${i === 0 ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>
        </fieldset>
        <p class="consent">We use your details only to reply to your enquiry. See our <a href="/privacy/">privacy policy</a>.</p>
        ${formError}
        <button type="submit" class="btn btn--primary"><span>Send message</span></button>
      </form>
      <div class="form-done" data-form-done tabindex="-1" hidden>
        <h2 class="h2">Thank you.</h2>
        <p>We will reply within [one business day] to confirm a time.</p>
        ${notConnected}
      </div>
    </div>
  </div>
</section>`;

const placeholderPage = (kick, title, body) => `
${pageHero({ kick, title })}
<section class="section"><div class="wrap narrow"><p class="lede">${body}</p></div></section>`;

export const PAGES = [
  { path: '/', title: 'ZIU AI | AI Automation for Growing Businesses', description: 'ZIU AI finds the processes costing your team the most time, automates one in about 30 days with a fixed quote, and keeps it running.', main: home(), home: true, index: homeIndex },
  { path: '/services/', title: 'AI Automation Services | ZIU AI', description: 'Discovery, workflow automation, AI assistants, integration and ongoing support for growing businesses.', main: services() },
  { path: '/use-cases/', title: 'AI Automation Use Cases | ZIU AI', description: 'Examples of AI automation for sales, support, finance, operations, HR and reporting.', main: useCases() },
  ...USE_CASES.map((u, i) => ({ path: `/use-cases/${u.slug}/`, title: `${u.name} automation | ZIU AI`, description: u.example, main: useCasePage(u, i) })),
  { path: '/engagements/', title: 'How Engagements Work | ZIU AI', description: 'Fixed scope, fixed written quote, no hourly billing. Start with a short discovery and one automation in about 30 days.', main: engagements() },
  { path: '/case-studies/', title: 'Case Studies | ZIU AI', description: 'Measured results from AI automation projects, with the baseline and method shown for each.', main: caseStudies() },
  { path: '/how-we-work/', title: 'How We Work | ZIU AI', description: 'Our four-step method for AI automation: map, build, launch, run. With human approval and clear data handling.', main: howWeWork() },
  { path: '/industries/', title: 'Industries | ZIU AI', description: 'AI automation for professional services, real estate and property, e-commerce and retail, and healthcare clinics.', main: industries() },
  { path: '/about/', title: 'About ZIU AI', description: 'Meet the team behind ZIU AI and the principles we work by.', main: about() },
  { path: '/resources/', title: 'Resources | ZIU AI', description: 'Frequently asked questions, a tool choice guide and a 5-minute automation check.', main: resources() },
  { path: '/automation-check/', title: 'Automation Check | ZIU AI', description: 'Where could automation help you? Find out in 5 minutes.', main: automationCheck() },
  ...REGIONS.map((r) => ({ path: `/regions/${r.slug}/`, title: `AI Automation in ${r.short} | ZIU AI`, description: r.title, main: regionPage(r) })),
  { path: '/contact/', title: 'Contact ZIU AI', description: 'Book a 30-minute scoping call with ZIU AI.', main: contact() },
  { path: '/careers/', title: 'Careers | ZIU AI', description: 'Careers at ZIU AI.', main: placeholderPage('Careers', 'Careers', '[Careers content not yet supplied.]') },
  { path: '/privacy/', title: 'Privacy policy | ZIU AI', description: 'ZIU AI privacy policy.', main: placeholderPage('Legal', 'Privacy policy', '[Privacy policy to be supplied and reviewed by legal counsel before launch.]') },
  { path: '/terms/', title: 'Terms | ZIU AI', description: 'ZIU AI terms.', main: placeholderPage('Legal', 'Terms', '[Terms to be supplied and reviewed by legal counsel before launch.]') },
];

export const NOT_FOUND = { path: '/404.html', title: 'Page not found | ZIU AI', description: 'Page not found.', main: placeholderPage('404', 'This page is not here.', 'Try the <a class="tlink" href="/">home page</a> or <a class="tlink" href="/contact/">get in touch</a>.') };
