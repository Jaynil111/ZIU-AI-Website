import { btn, link, kicker, pageHero, ctaBand, sectionIndex, icon, founderFeature, CTA } from './components.mjs';
import { USE_CASES, SERVICE_DETAILS, PILLARS, ENGAGEMENTS, FAQS, INDUSTRIES, REGIONS, TOOLS, COMPARE, OWNER, phoneLink } from './data.mjs';
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
${pageHero({ kick: 'Services', title: 'AI consulting, automation and software, delivered as one team.', sub: 'Start with advice, build what pays off, and keep it running. Start with the one you need. Most clients add the rest over time.', actions: btn(CTA.book) + btn(CTA.pricing, 'ghost-light') })}
<section class="section" aria-label="Our services">
  <div class="wrap with-aside">
    <nav class="aside-nav" data-section-index aria-label="Services on this page">
      <ol>${SERVICE_DETAILS.map((s, i) => `<li><a href="#${s.id}"><span class="si__n">${pad(i)}</span><span class="si__l">${s.name}</span></a></li>`).join('')}</ol>
    </nav>
    <div class="service-list">
      ${PILLARS.map((p) => `
      <div class="service-group" id="group-${p.id}" data-reveal>${kicker(p.name, p.title)}</div>
      ${p.services.map((id) => { const s = SERVICE_DETAILS.find((x) => x.id === id); const i = SERVICE_DETAILS.indexOf(s); return `<article class="service" id="${s.id}" aria-labelledby="${s.id}-t" data-reveal>
        <p class="service__n">${pad(i)}${icon(s.id, 'icon--lg')}</p>
        <h2 id="${s.id}-t" class="h2">${s.name}</h2>
        <p class="lede">${s.body}</p>
        ${bullets(s.items)}
      </article>`; }).join('')}`).join('')}
      <p class="aside-note" data-reveal>Not sure which you need? ${link('Book a 30-minute call', '/contact/#book')} and we will tell you.</p>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) + btn(CTA.pricing, 'ghost-light') })}`;

const useCases = () => `
${pageHero({ kick: 'Solutions', title: 'What AI can take off your team’s plate.', sub: 'Six jobs we automate most often, team by team, and the sectors we know best.', actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}
<section class="section" aria-label="Solutions by team">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('01', 'By team')}<h2 class="h1">Six jobs, team by team.</h2></div>
      <p class="lede">Each one links to what we set up, how it gets built and where a person stays in charge.</p>
    </div>
    <ol class="uc-grid">
      ${USE_CASES.map((u, i) => `<li class="uc" data-reveal>
        <p class="uc__n">${icon(u.icon, 'icon--lg')}<span>${pad(i)}</span></p>
        <h3 class="h3"><a href="/use-cases/${u.slug}/">${u.name}</a></h3>
        ${bullets(u.items, 'ticks ticks--sm')}
        <p class="uc__more" aria-hidden="true">Read more →</p>
      </li>`).join('')}
    </ol>
  </div>
</section>
<section class="section section--rule" id="industries" aria-labelledby="ind-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('02', 'By industry')}<h2 id="ind-title" class="h1">Shaped to how your sector works.</h2></div>
      <p class="lede">${link('See all industries', '/industries/')}</p>
    </div>
    <div class="sectors">
      ${INDUSTRIES.map((s, i) => `<article class="sector" data-reveal>
        <p class="sector__n">${icon(s.id, 'icon--lg')}<span>${pad(i)}</span></p>
        <h3 class="h2">${s.name}</h3>
        <p class="sector__for"><span>For</span> ${s.for}</p>
        <p>${s.body}</p>
        <p class="sector__proof"><span>Proof</span> [Add a case study for this sector when available]</p>
      </article>`).join('')}
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}`;

const useCasePage = (u, i) => {
  const prev = USE_CASES[(i + USE_CASES.length - 1) % USE_CASES.length];
  const next = USE_CASES[(i + 1) % USE_CASES.length];
  return `
${pageHero({ kick: `Solution ${pad(i)} of 06`, title: u.name, sub: u.example, actions: btn(CTA.check) + btn(CTA.book, 'ghost-light') })}
<section class="section" aria-labelledby="uc-what">
  <div class="wrap split">
    <div data-reveal>${kicker('A', 'What we automate')}<h2 id="uc-what" class="h1">What we set up for ${u.name.toLowerCase()}.</h2></div>
    <ol class="big-list" data-reveal>${u.items.map((it, k) => `<li><span>${pad(k)}</span>${it}</li>`).join('')}</ol>
  </div>
</section>
<section class="section section--rule" aria-labelledby="uc-how">
  <div class="wrap split">
    <div data-reveal>${kicker('B', 'What a typical build includes')}<h2 id="uc-how" class="h2">Built in your accounts, in about 30 days.</h2></div>
    <div data-reveal>
      ${bullets(u.build, 'ticks ticks--lg')}
      <p class="aside-note">${link(CTA.how.label, CTA.how.href)}</p>
      <p class="muted">A person approves sensitive steps, such as sending money, contracts, and any customer messages you choose.</p>
    </div>
  </div>
</section>
<section class="section section--rule" aria-label="Proof for this solution">
  <div class="wrap" data-reveal><p class="muted">[Add a measured case study for ${u.name.toLowerCase()} when available: baseline, result, period and method.]</p></div>
</section>
<nav class="pager wrap" aria-label="More solutions">
  <a href="/use-cases/${prev.slug}/"><span>Previous</span>${prev.name}</a>
  <a href="/use-cases/"><span>All</span>Solutions</a>
  <a href="/use-cases/${next.slug}/"><span>Next</span>${next.name}</a>
</nav>
${ctaBand()}`;
};

const pricing = () => `
<!-- Editor: fill in the three starting prices. Once 5–10 projects are complete, consider publishing typical ranges too. -->
${pageHero({ kick: 'Pricing', title: 'Clear scope. Fixed price. Cancel anytime.', sub: 'Three ways to start. Every project is quoted in writing before work begins, and there is no hourly billing.', actions: btn(CTA.book) })}
<section class="section" aria-label="Engagements and starting prices">
  <div class="wrap">
    <ol class="eng" data-progress>
      ${ENGAGEMENTS.map((e) => `<li class="eng__item" data-reveal data-progress-item>
        <p class="eng__dur">${e.duration}</p>
        <h2 class="h2">${e.name}</h2>
        <p class="eng__price">${e.price}</p>
        <p class="eng__suits"><span>Best when</span> ${e.suits}</p>
        <p>${e.body}</p>
        ${bullets(e.includes, 'ticks ticks--sm')}
      </li>`).join('')}
    </ol>
  </div>
</section>
<section class="section section--rule" aria-label="What is included and what we need">
  <div class="wrap two-lists">
    <div data-reveal>${kicker('A', 'Every project includes')}${bullets(['A fixed written quote before work starts', 'No hourly billing', 'A named lead you can contact directly', 'Automations and code built in your own accounts', 'Full documentation and handover', 'The option to stop after discovery'], 'ticks ticks--lg')}</div>
    <div data-reveal>${kicker('B', 'What we need from you')}${bullets(['A decision-maker for the 30-minute call', 'Access to the people who do the work today', 'Admin access to the tools involved, for the build period', 'Prompt feedback during testing'], 'ticks ticks--lg ticks--plain')}<p class="aside-note">${link('Estimate what a task costs you', '/resources/#savings')}</p></div>
  </div>
</section>
<section class="section section--rule" aria-labelledby="quote-title">
  <div class="wrap split">
    <div data-reveal>${kicker('C', 'How quoting works')}<h2 id="quote-title" class="h1">Three steps to a fixed price.</h2></div>
    <ol class="next-steps" data-reveal>
      <li>A 30-minute call. We ask about your processes, tools and what a good result looks like.</li>
      <li>Within [one business day], a written quote for discovery or a first build, with what is included and what is not.</li>
      <li>You decide. The quote stands for 30 days and nothing starts until you say so.</li>
    </ol>
  </div>
</section>
<section class="section section--rule" aria-labelledby="compare-title">
  <div class="wrap">
    <div data-reveal>${kicker('D', 'The alternatives')}<h2 id="compare-title" class="h1">Why not hire, do it yourself, or call a big firm?</h2></div>
    <div class="table-wrap" data-reveal>
      <table class="tool-table">
        <thead><tr><th scope="col">Option</th><th scope="col">What usually happens</th><th scope="col">With ZIU AI</th></tr></thead>
        <tbody>${COMPARE.map(([o, a, b]) => `<tr><th scope="row">${o}</th><td data-label="What usually happens">${a}</td><td data-label="With ZIU AI">${b}</td></tr>`).join('')}</tbody>
      </table>
    </div>
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
${pageHero({ kick: 'Results', title: 'Results, and how we measured them.', sub: 'Every case states the starting point, the change and the period measured. Nothing is published before it has run for at least four weeks.' })}
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
    <div>${kicker('02', 'Founding clients', 'kicker--light')}<h2 id="founding-title" class="h1">Become a founding client.</h2></div>
    <div><p class="lede lede--light">We are working with a small number of founding clients at a reduced price. In return, we ask for permission to publish a measured case study and a named review when the work is complete.</p>
    <div class="actions">${btn({ label: 'Ask about a founding-client place', href: '/contact/?topic=founding' })}</div></div>
  </div>
</section>`;

const howWeWork = () => `
${pageHero({ kick: 'How we work', title: 'How a project runs, start to finish.', sub: 'Four steps, a fixed price, and one person accountable throughout. We tell you when something is not worth automating.', actions: btn(CTA.book) })}
<section class="section" aria-labelledby="steps-title">
  <div class="wrap">
    <h2 id="steps-title" class="sr-only">The four steps</h2>
    <ol class="method" data-progress>
      ${[
        ['Map', 'We interview the people who do the work, document the process as it runs today, and agree the measure of success.', '2–4 hours'],
        ['Build', 'We build in your accounts, test with real examples, and show progress every week.', '1–2 hours a week'],
        ['Launch', 'We switch on with your team, train them, and monitor closely for two weeks.', '1–2 hours'],
        ['Run', 'We monitor, fix and improve, and send a results report every month.', '30 minutes a month'],
      ].map(([t, d, time], i) => `<li class="method__step" data-reveal data-progress-item><span class="method__n">${i + 1}</span><h3 class="display-sm">${t}.</h3><p>${d}</p><p class="step__time"><span>Your time</span>${time}</p></li>`).join('')}
    </ol>
  </div>
</section>
<section class="section section--dark" id="safety" data-theme="dark" aria-labelledby="safety-title">
  <div class="wrap split">
    <div data-reveal>${kicker('A', 'You stay in control', 'kicker--light')}<h2 id="safety-title" class="h1">Safety, data and control</h2></div>
    <ul class="commit-list" data-reveal>
      ${['You own the accounts, the automations and the code. Nothing is locked to us.', 'Human approval is built in for sensitive actions.', 'Only the access we need: we use only the permissions a process needs.', 'Failures alert a person and pause the task, rather than guessing.', 'We document where your data is processed and which AI services are used.', 'When a project ends, we hand over everything and remove our access.'].map((t) => `<li>${t}</li>`).join('')}
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
${ctaBand({ actions: btn(CTA.book) + btn(CTA.pricing, 'ghost-light') })}`;

const industries = () => `
<!-- Editor: choose 3–5 sectors to launch with and delete any you will not target. -->
${pageHero({ kick: 'Industries', title: 'Automation shaped to your sector.', sub: 'The same method, applied to the work your sector does every day.', actions: btn(CTA.book) })}
<section class="section" aria-label="Sectors">
  <div class="wrap">
    <div class="sectors">
      ${INDUSTRIES.map((s, i) => `<article class="sector" id="${s.id}" data-reveal>
        <p class="sector__n">${icon(s.id, 'icon--lg')}<span>${pad(i)}</span></p>
        <h2 class="h2">${s.name}</h2>
        <p class="sector__for"><span>For</span> ${s.for}</p>
        <p>${s.body}</p>
        <p class="sector__for"><span>First</span> Typical first project: ${s.first}</p>
        <p class="sector__proof"><span>Proof</span> [Add a case study for this sector when available]</p>
      </article>`).join('')}
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const about = () => `
${pageHero({ kick: 'About', title: 'We build what we would run ourselves.', sub: 'ZIU AI is a founder-led firm. We advise on where AI pays off, build it, and run it, for businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.' })}
<section class="section" aria-labelledby="story-title">
  <div class="wrap split">
    <div data-reveal>${kicker('01', 'Why ZIU AI exists')}<h2 id="story-title" class="h1">Our story</h2></div>
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
    <div class="split split--head" data-reveal><div>${kicker('03', 'Team')}<h2 id="team-title" class="h1">Who you will work with.</h2></div><p class="lede">You deal with the founder directly, from the first call to the monthly report.</p></div>
    ${founderFeature({ experience: '[Relevant experience as fact.]', extra: '<p>[LinkedIn link]</p>' })}
  </div>
</section>
<section class="section section--dark" data-theme="dark" aria-labelledby="where-title">
  <div class="wrap split">
    <div data-reveal>${kicker('04', 'Regions', 'kicker--light')}<h2 id="where-title" class="h1">Where we work</h2></div>
    <div data-reveal>
      <p class="lede lede--light">We work with businesses in the USA &amp; Canada, the UK &amp; Europe, the UAE &amp; Gulf, and India. [State team locations and time zones covered.]</p>
      <ul class="region-links">${REGIONS.map((r) => `<li><a href="/regions/${r.slug}/">${r.name.replace('&', '&amp;')}<span aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const resources = () => `
${pageHero({ kick: 'Resources', title: 'Guides, tools and answers before you start.', sub: 'Frequently asked questions · Tool choice guide · Savings calculator · Automation check' })}
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
        ${fieldFor('calc-task', 'The task', '<input id="calc-task" name="task" type="text" placeholder="e.g. Copying inquiries into the CRM" maxlength="80">', '(optional)')}
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
          <a class="btn btn--primary" href="/contact/" data-calc-send><span>Send these numbers with my inquiry</span></a>
          ${link(CTA.check.label, CTA.check.href)}
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section section--dark" id="automation-check" data-theme="dark" aria-labelledby="check-title">
  <div class="wrap split" data-reveal>
    <div>${kicker('04', 'Automation check', 'kicker--light')}<h2 id="check-title" class="h1">Find your first automation in 5 minutes.</h2></div>
    <div><p class="lede lede--light">Answer a few questions. We email you a short list of likely candidates and, if useful, an invitation to a 30-minute call.</p>
    <div class="actions">${btn(CTA.check)}</div></div>
  </div>
</section>`;

const field = (label, input, hint = '') => `<div class="field"><label>${label}${hint ? `<span class="field__hint">${hint}</span>` : ''}</label>${input}</div>`;
const fieldFor = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${label}${hint ? ` <span class="field__hint">${hint}</span>` : ''}</label>${input}</div>`;
const regionOptions = `<option value="">Choose a region</option>${REGIONS.map((r) => `<option>${r.name.replace('&', '&amp;')}</option>`).join('')}<option>Elsewhere</option>`;

const automationCheck = () => `
${pageHero({ kick: 'Automation check', title: 'Find your first automation in 5 minutes.', sub: 'Answer a few questions. We email you a short list of likely candidates and, if useful, an invitation to a 30-minute call.' })}
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
          ${fieldFor(`ac-task${n}`, `Task ${n}`, `<input id="ac-task${n}" name="task_${n}" type="text" ${n === 1 ? 'required' : ''} placeholder="${['e.g. Copying inquiries into the CRM', 'e.g. Chasing unpaid invoices', 'e.g. Building the weekly report'][n - 1]}">`)}
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
        <p class="consent">We use your details only to reply to your inquiry. See our <a href="/privacy/">privacy policy</a>.</p>
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
      <p>We will email a short list of likely candidates within [one business day].</p>
      ${notConnected}
      <div class="actions">${btn(CTA.book)}</div>
    </div>
  </div>
</section>`;

const regionPage = (r) => {
  const others = REGIONS.filter((o) => o.slug !== r.slug);
  return `
<!-- Editor: confirm each data protection statement with legal counsel before publishing. -->
${pageHero({ kick: `Regions · ${r.name.replace('&', '&amp;')}`, title: r.title, sub: 'The same services and fixed prices, with invoicing, hours and data protection set for your region.', actions: btn(CTA.book) })}
<section class="section" aria-label="${r.name.replace('&', '&amp;')} details">
  <div class="wrap split">
    <div data-reveal>${kicker('01', 'The details')}<p class="lede">What changes by region, and what does not.</p></div>
    <dl class="def-table def-table--lg" data-reveal>${r.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
  </div>
</section>
<nav class="pager wrap" aria-label="Other regions">${others.map((o) => `<a href="/regions/${o.slug}/"><span>Region</span>${o.name.replace('&', '&amp;')}</a>`).join('')}</nav>
${ctaBand()}`;
};

const contact = () => `
${pageHero({ kick: 'Contact', title: 'Tell us what takes too much of your team’s time.', sub: 'Book a 30-minute call, or send a message and we will reply within [one business day].', actions: btn({ label: 'Book a 30-minute call', href: '#book' }) })}
<section class="section" aria-label="Book or message">
  <div class="wrap contact">
    <div class="contact__book" id="book" data-reveal>
      ${kicker('A', 'Book a call')}
      <h2 class="h2">Book a 30-minute call</h2>
      <div class="booking-slot"><p>[Booking calendar embed: 30-minute call]</p></div>
      ${kicker('B', 'What happens next')}
      <ol class="next-steps">
        <li>We reply within [one business day] to confirm a time.</li>
        <li>On the call, we ask about your processes and tools.</li>
        <li>You leave with three processes worth automating, whether or not we work together.</li>
        <li>If it makes sense, we send a fixed written quote for discovery or a first build.</li>
      </ol>
      <p class="contact__direct">${OWNER.name}, ${OWNER.role}<br>${phoneLink('tlink')} · [email]<br>[business address]</p>
    </div>
    <div class="contact__form" data-reveal>
      ${kicker('C', 'Send a message')}
      <form class="form" ${formAttrs('contact')}>${formHidden('contact', 'Contact inquiry')}
        <div class="field-row">
          ${fieldFor('c-name', 'Name', `<input id="c-name" name="name" type="text" autocomplete="name" required>`)}
          ${fieldFor('c-email', 'Work email', `<input id="c-email" name="email" type="email" autocomplete="email" required>`)}
        </div>
        ${fieldFor('c-company', 'Company and website', `<input id="c-company" name="company" type="text" autocomplete="organization">`)}
        <div class="field-row">
          ${fieldFor('c-region', 'Region', `<select id="c-region" name="region" required>${regionOptions}</select>`)}
          ${fieldFor('c-size', 'Team size', `<select id="c-size" name="team_size"><option value="">Choose</option><option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option></select>`)}
        </div>
        ${fieldFor('c-msg', 'What would you like to automate or build?', `<textarea id="c-msg" name="message" rows="5" required></textarea>`)}
        <fieldset class="field"><legend class="field__label">Preferred contact</legend>
          <div class="checks">${['Email', 'Phone', 'WhatsApp'].map((t, i) => `<label class="check"><input type="radio" name="preferred" value="${t}" ${i === 0 ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>
        </fieldset>
        <p class="consent">We use your details only to reply to your inquiry. See our <a href="/privacy/">privacy policy</a>.</p>
        ${formError}
        <button type="submit" class="btn btn--primary"><span>Send message</span></button>
      </form>
      <div class="form-done" data-form-done tabindex="-1" hidden>
        <h2 class="h2">Thank you.</h2>
        <p>We will reply within [one business day].</p>
        ${notConnected}
      </div>
    </div>
  </div>
</section>`;

const placeholderPage = (kick, title, body) => `
${pageHero({ kick, title })}
<section class="section"><div class="wrap narrow"><p class="lede">${body}</p></div></section>`;

export const PAGES = [
  { path: '/', title: 'ZIU AI | AI Consulting, Automation and Custom Software', description: 'ZIU AI helps growing businesses decide where AI pays off, builds the automations, tools and software, and keeps them running. Fixed prices. First process live in about 30 days.', main: home(), home: true, index: homeIndex },
  { path: '/services/', title: 'AI Consulting, Automation and Software Services | ZIU AI', description: 'AI strategy, discovery, workflow automation, AI assistants, custom software, integration, and ongoing support for growing businesses.', main: services() },
  { path: '/use-cases/', title: 'AI Automation Solutions by Team and Industry | ZIU AI', description: 'What AI can take off your team: sales, support, finance, operations, HR and reporting, plus the sectors we know best.', main: useCases() },
  ...USE_CASES.map((u, i) => ({ path: `/use-cases/${u.slug}/`, title: `${u.name} automation | ZIU AI`, description: u.example, main: useCasePage(u, i) })),
  { path: '/pricing/', title: 'Pricing | ZIU AI', description: 'Fixed prices, no hourly billing. Starting prices for discovery, a first automation and a monthly run-and-improve plan.', main: pricing() },
  { path: '/case-studies/', title: 'Results | ZIU AI', description: 'Measured results from AI automation projects, with the baseline, method and period shown for each.', main: caseStudies() },
  { path: '/how-we-work/', title: 'How We Work | ZIU AI', description: 'Our four-step method: map, build, launch, run. Fixed prices, human approval and clear data handling.', main: howWeWork() },
  { path: '/industries/', title: 'Industries | ZIU AI', description: 'AI automation for professional services, real estate and property, e-commerce and retail, and healthcare clinics.', main: industries() },
  { path: '/about/', title: 'About ZIU AI', description: 'A founder-led AI consulting and automation firm working with businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.', main: about() },
  { path: '/resources/', title: 'Resources | ZIU AI', description: 'Frequently asked questions, a tool choice guide, a savings calculator and a 5-minute automation check.', main: resources() },
  { path: '/automation-check/', title: 'Automation Check | ZIU AI', description: 'Find your first automation in 5 minutes.', main: automationCheck() },
  ...REGIONS.map((r) => ({ path: `/regions/${r.slug}/`, title: `AI Consulting and Automation in ${r.name.replace('&', '&amp;')} | ZIU AI`, description: r.title, main: regionPage(r) })),
  { path: '/contact/', title: 'Contact ZIU AI', description: 'Book a 30-minute call with ZIU AI, or send a message.', main: contact() },
  { path: '/careers/', title: 'Careers | ZIU AI', description: 'Careers at ZIU AI.', main: placeholderPage('Careers', 'Work with us', '[Careers content not yet supplied.]') },
  { path: '/privacy/', title: 'Privacy policy | ZIU AI', description: 'ZIU AI privacy policy.', main: placeholderPage('Legal', 'Privacy policy', '[Privacy policy to be supplied and reviewed by legal counsel before launch.]') },
  { path: '/terms/', title: 'Terms | ZIU AI', description: 'ZIU AI terms.', main: placeholderPage('Legal', 'Terms', '[Terms to be supplied and reviewed by legal counsel before launch.]') },
];

export const NOT_FOUND = { path: '/404.html', title: 'Page not found | ZIU AI', description: 'Page not found.', main: placeholderPage('404', 'This page is not here.', 'Try the <a class="tlink" href="/">home page</a> or <a class="tlink" href="/contact/">get in touch</a>.') };
