import { btn, link, productPortfolio, kicker, pageHero, ctaBand, sectionIndex, icon, founderFeature, CTA } from './components.mjs';
import { USE_CASES, SERVICE_DETAILS, PILLARS, ENGAGEMENTS, FAQS, INDUSTRIES, REGIONS, APPLICATIONS, COMPARE, OWNER } from './data.mjs';
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
      <p class="aside-note" data-reveal>Not sure which you need? ${link('Book a call', '/contact/#book')} and we will tell you.</p>
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

<nav class="pager wrap" aria-label="More solutions">
  <a href="/use-cases/${prev.slug}/"><span>Previous</span>${prev.name}</a>
  <a href="/use-cases/"><span>All</span>Solutions</a>
  <a href="/use-cases/${next.slug}/"><span>Next</span>${next.name}</a>
</nav>
${ctaBand()}`;
};

const pricing = () => `
<!-- Pricing is scoped individually; do not publish standard package amounts. -->
${pageHero({ kick: 'Pricing', title: 'Your requirements. Your scope. Your quote.', sub: 'Every business needs something different. We review your requirements, integrations and support needs, then prepare a proposal tailored to your project.', actions: btn(CTA.book) })}
<section class="section" aria-label="Engagements and custom pricing">
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
    <div data-reveal>${kicker('A', 'Every project includes')}${bullets(['A proposal based on your requirements before work starts', 'Scope, pricing and billing terms agreed with you', 'A named lead you can contact directly', 'Automations and code built in your own accounts', 'Full documentation and handover', 'The option to stop after discovery'], 'ticks ticks--lg')}</div>
    <div data-reveal>${kicker('B', 'What we need from you')}${bullets(['A decision-maker for the 30-minute call', 'Access to the people who do the work today', 'Admin access to the applications involved, for the build period', 'Prompt feedback during testing'], 'ticks ticks--lg ticks--plain')}<p class="aside-note">${link('Estimate what a task costs you', '/resources/#savings')}</p></div>
  </div>
</section>
<section class="section section--rule" aria-labelledby="quote-title">
  <div class="wrap split">
    <div data-reveal>${kicker('C', 'How quoting works')}<h2 id="quote-title" class="h1">From your requirements to a tailored proposal.</h2></div>
    <ol class="next-steps" data-reveal>
      <li>A 30-minute call. We ask about your processes, applications and what a good result looks like.</li>
      <li>We assess the scope, complexity, integrations and support needed, then share a tailored proposal with clear inclusions.</li>
      <li>We agree on the scope, pricing and billing terms together. Work begins after your approval; scope changes are discussed before proceeding.</li>
    </ol>
  </div>
</section>
<section class="section section--rule" aria-labelledby="compare-title">
  <div class="wrap">
    <div data-reveal>${kicker('D', 'The alternatives')}<h2 id="compare-title" class="h1">Why not hire, do it yourself, or call a big firm?</h2></div>
    <div class="table-wrap" data-reveal>
      <table class="application-table">
        <thead><tr><th scope="col">Option</th><th scope="col">What usually happens</th><th scope="col">With ZIU AI</th></tr></thead>
        <tbody>${COMPARE.map(([o, a, b]) => `<tr><th scope="row">${o}</th><td data-label="What usually happens">${a}</td><td data-label="With ZIU AI">${b}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const portfolio = () => `
${pageHero({ kick: 'Product portfolio', title: 'Software we have created.', sub: 'Explore our products and applications.' })}
<section class="section" aria-labelledby="products-title"><div class="wrap"><h2 id="products-title" class="sr-only">Our products</h2>${productPortfolio()}</div></section>
${ctaBand()}`;

const howWeWork = () => `
${pageHero({ kick: 'How we work', title: 'How a project runs, start to finish.', sub: 'Four steps, pricing tailored to your requirements, and one person accountable throughout. We tell you when something is not worth automating.', actions: btn(CTA.book) })}
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
      ${['We tell you when something is not worth automating.', 'We measure before we claim.', 'We choose applications for your situation, not ours.', 'We write in plain language.', 'We stay until it works in daily use.'].map((t) => `<li>${t}</li>`).join('')}
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
    <div data-reveal><p class="lede">Zinzuwadia Group began 20 years ago as an audit and advisory business. Over the years, the group has grown to encompass six verticals. ZIU AI is its latest addition, extending that foundation into AI consulting, automation and custom software.</p></div>
  </div>
</section>
<section class="section section--rule" aria-labelledby="team-title">
  <div class="wrap">
    <div class="split split--head" data-reveal><div>${kicker('02', 'Team')}<h2 id="team-title" class="h1">Who you will work with.</h2></div><p class="lede">You deal with the founder directly, from the first call to the monthly report.</p></div>
    ${founderFeature()}
  </div>
</section>
<section class="section section--dark" data-theme="dark" aria-labelledby="where-title">
  <div class="wrap split">
    <div data-reveal>${kicker('03', 'Regions', 'kicker--light')}<h2 id="where-title" class="h1">Where we work</h2></div>
    <div data-reveal>
      <p class="lede lede--light">We work with businesses in the USA &amp; Canada, the UK &amp; Europe, the UAE &amp; Gulf, and India.</p>
      <ul class="region-links">${REGIONS.map((r) => `<li><a href="/regions/${r.slug}/">${r.name.replace('&', '&amp;')}<span aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </div>
  </div>
</section>
${ctaBand({ actions: btn(CTA.book) })}`;

const resources = () => `
${pageHero({ kick: 'Resources', title: 'Guides, applications and answers before you start.', sub: 'Frequently asked questions · Application choice guide · Savings calculator · Automation check' })}
<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-sec__grid">
    <div data-reveal>${kicker('01', 'FAQ')}<h2 id="faq-title" class="h1">Frequently asked questions</h2></div>
    <div data-reveal>${faq(FAQS)}</div>
  </div>
</section>
<section class="section section--rule" id="application-guide" aria-labelledby="applications-title">
  <div class="wrap">
    <div data-reveal>${kicker('02', 'Application choice guide')}<h2 id="applications-title" class="h1">Zapier, Make, n8n or custom code: how we choose.</h2></div>
    <div class="table-wrap" data-reveal>
      <table class="application-table">
        <thead><tr><th scope="col">Option</th><th scope="col">Best when</th><th scope="col">Watch out for</th></tr></thead>
        <tbody>${APPLICATIONS.map(([o, b, w]) => `<tr><th scope="row">${o}</th><td data-label="Best when">${b}</td><td data-label="Watch out for">${w}</td></tr>`).join('')}</tbody>
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
    <div>${kicker('04', 'Automation check', 'kicker--light')}<h2 id="check-title" class="h1">Find your first automation.</h2></div>
    <div><p class="lede lede--light">Tell us about one repetitive task. We will suggest where to start.</p>
    <div class="actions">${btn(CTA.check)}</div></div>
  </div>
</section>`;

const fieldFor = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${label}${hint ? ` <span class="field__hint">${hint}</span>` : ''}</label>${input}</div>`;

const automationCheck = () => `
${pageHero({ kick: 'Quick automation check', title: 'Find your first automation.', sub: 'Tell us about one repetitive task. We will suggest where to start.' })}
<section class="section section--compact" aria-label="Quick automation check">
  <div class="wrap form-wrap">
    <form class="form form--single" ${formAttrs('automation-check')}>${formHidden('automation-check', 'Quick automation check')}
      <div class="field-row">
        ${fieldFor('ac-name', 'Name', `<input id="ac-name" name="name" type="text" autocomplete="name" required>`)}
        ${fieldFor('ac-email', 'Work email', `<input id="ac-email" name="email" type="email" autocomplete="email" required>`)}
      </div>
      ${fieldFor('ac-task', 'Which task would you like to automate?', `<textarea id="ac-task" name="task" rows="3" required placeholder="Briefly describe the repetitive work."></textarea>`)}
      ${fieldFor('ac-applications', 'Applications you use', `<input id="ac-applications" name="applications" type="text" placeholder="e.g. Microsoft 365, your CRM or accounting software">`, '(optional)')}
      <p class="consent">We use your details only to reply to your inquiry. See our <a href="/privacy/">privacy policy</a>.</p>
      ${formError}
      <button type="submit" class="btn btn--primary"><span>Send my request</span></button>
    </form>
    <div class="form-done" data-form-done tabindex="-1" hidden><h2 class="h2">Request received.</h2><p>We will review your task and reply by email.</p></div>
  </div>
</section>`;

const regionPage = (r) => {
  const others = REGIONS.filter((o) => o.slug !== r.slug);
  return `
${pageHero({ kick: `Regions · ${r.name.replace('&', '&amp;')}`, title: r.title, sub: 'The same services with pricing tailored to your requirements, and invoicing and data handling agreed for your project.', actions: btn(CTA.book) })}
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
<section class="booking-page" id="book" aria-labelledby="booking-title">
  <div class="wrap booking-layout">
    <div class="booking-intro">
      ${kicker('01', 'Let’s talk')}
      <h1 class="display" id="booking-title">Book a call.</h1>
      <p class="lede">Tell us what you want to build or automate. We will email you to arrange a 30-minute conversation.</p>
      <p class="contact__direct">${OWNER.name}, ${OWNER.role}<br><a class="tlink" href="mailto:${OWNER.email}">${OWNER.email}</a></p>
      <p class="contact__address">${OWNER.address}</p>
    </div>
    <div class="booking-form">
      <form class="form form--single" ${formAttrs('contact')}>${formHidden('contact', 'Call request')}
        <div class="field-row">
          ${fieldFor('c-name', 'Name', `<input id="c-name" name="name" type="text" autocomplete="name" required>`)}
          ${fieldFor('c-email', 'Work email', `<input id="c-email" name="email" type="email" autocomplete="email" required>`)}
        </div>
        ${fieldFor('c-company', 'Company', `<input id="c-company" name="company" type="text" autocomplete="organization">`, '(optional)')}
        ${fieldFor('c-msg', 'What would you like to build or automate?', `<textarea id="c-msg" name="message" rows="3" required placeholder="A sentence or two is enough."></textarea>`)}
        <p class="consent">We use your details only to reply to your inquiry. See our <a href="/privacy/">privacy policy</a>.</p>
        ${formError}
        <button type="submit" class="btn btn--primary"><span>Request a call</span></button>
      </form>
      <div class="form-done" data-form-done tabindex="-1" hidden><h2 class="h2">Request received.</h2><p>We will email you to arrange a time for your call.</p></div>
    </div>
  </div>
</section>`;

const simplePage = (kick, title, body) => `
${pageHero({ kick, title })}
<section class="section"><div class="wrap narrow"><p class="lede">${body}</p></div></section>`;


const informationPage = (title, sections) => `
${pageHero({ kick: 'ZIU AI LLP', title })}
<section class="section"><div class="wrap narrow legal-copy">
  <p class="muted">Updated 8 November 2026</p>
  ${sections.map(([heading, body]) => `<section><h2 class="h3">${heading}</h2>${body}</section>`).join('')}
</div></section>`;

const privacy = () => informationPage('Privacy policy', [
  ['Who we are', `<p>ZIU AI LLP operates this website. For questions about your information, email <a href="mailto:${OWNER.email}">${OWNER.email}</a> or write to us at ${OWNER.address}.</p>`],
  ['Information you share', '<p>Our contact and automation-check forms collect your name, email address and message. You can also choose to share your company name or the applications you use. A submission includes the page from which it was sent. Please avoid sending passwords, financial account details or sensitive personal information through these forms.</p>'],
  ['How inquiries are handled', '<p>We use the details you provide to respond to your inquiry, understand your requirements and arrange a conversation. Submitting an inquiry does not subscribe you to a marketing newsletter.</p>'],
  ['Form delivery and service providers', '<p>Our forms use Web3Forms to process submissions and deliver them by email. Web3Forms and its infrastructure providers may process submission data and technical information, including IP addresses, for delivery and spam prevention in multiple countries. Its <a href="https://web3forms.com/privacy" rel="noopener">privacy policy</a> describes its processing and retention practices. Email and website hosting providers may also process messages and technical logs to operate these services.</p>'],
  ['Cookies and browser storage', '<p>This website does not include analytics or marketing cookies. It uses browser session storage to remember your homepage scroll position during navigation. You can clear browser storage in your browser settings. Fonts and visual assets are served with the website.</p>'],
  ['Your information and requests', `<p>To ask about information you have sent us, or request access, correction or deletion, email <a href="mailto:${OWNER.email}">${OWNER.email}</a>. We may need to confirm your identity to handle a request. Any retention needed for an ongoing engagement or an applicable legal obligation will be considered when responding.</p>`],
  ['Other websites and updates', '<p>Product and other external links take you to websites with their own privacy practices. This policy describes the current website; updates will appear here with a revised date.</p>'],
]);

const terms = () => informationPage('Terms', [
  ['About this website', `<p>This website is operated by ZIU AI LLP, ${OWNER.address}. Contact us at <a href="mailto:${OWNER.email}">${OWNER.email}</a> with questions about the website or our services.</p>`],
  ['Information and estimates', '<p>Service descriptions and workflow examples explain the kinds of work we can discuss with you. Timelines and savings calculations are indicative and depend on your requirements, systems, data and team availability. They are not a binding quotation or a guarantee of results.</p>'],
  ['Project agreements and pricing', '<p>Every project is priced according to its requirements. Scope, deliverables, fees, billing, timelines, support, ownership and any cancellation terms are set out in a separate written agreement. Submitting a form or requesting a call does not create a paid engagement. Changes to an agreed scope are discussed before proceeding.</p>'],
  ['Using the website', '<p>Please use the website lawfully. Do not attempt to disrupt its operation, gain unauthorized access or submit malicious or misleading material. Share only information you are entitled to provide.</p>'],
  ['Content and external links', '<p>Website branding and content belong to their respective owners. Third-party materials remain subject to their own licenses. External links, including portfolio products, may have separate terms and privacy policies.</p>'],
  ['Privacy and contact', `<p>Our <a href="/privacy/">privacy policy</a> explains how website inquiries are handled. For assistance or to report an issue, email <a href="mailto:${OWNER.email}">${OWNER.email}</a>.</p>`],
  ['Audio credits', '<p id="credits">The interactive homepage uses recordings from <a href="https://github.com/sfzinstruments/SalamanderGrandPiano" rel="noopener">Salamander Grand Piano</a> by Alexander Holm, licensed under <a href="https://creativecommons.org/licenses/by/3.0/" rel="noopener license">CC BY 3.0</a>. Selected recordings are converted to MP3 and pitch-shifted during playback.</p>'],
]);

export const PAGES = [
  { path: '/', title: 'ZIU AI | AI Consulting, Automation and Custom Software', description: 'ZIU AI helps growing businesses decide where AI pays off, builds the automations, applications and software, and keeps them running. Pricing based on your requirements. First process live in about 30 days.', main: home(), home: true, index: homeIndex },
  { path: '/services/', title: 'AI Consulting, Automation and Software Services | ZIU AI', description: 'AI strategy, discovery, workflow automation, AI assistants, custom software, integration, and ongoing support for growing businesses.', main: services() },
  { path: '/use-cases/', title: 'AI Automation Solutions by Team and Industry | ZIU AI', description: 'What AI can take off your team: sales, support, finance, operations, HR and reporting, plus the sectors we know best.', main: useCases() },
  ...USE_CASES.map((u, i) => ({ path: `/use-cases/${u.slug}/`, title: `${u.name} automation | ZIU AI`, description: u.example, main: useCasePage(u, i) })),
  { path: '/pricing/', title: 'Pricing | ZIU AI', description: 'Custom pricing based on your requirements, scope, complexity and support needs. Request a tailored proposal for your project.', main: pricing() },
  { path: '/portfolio/', title: 'Product Portfolio | ZIU AI', description: 'Explore products and applications created by ZIU AI.', main: portfolio() },
  { path: '/case-studies/', title: 'Explore Our Products | ZIU AI', description: 'View the ZIU AI product portfolio and explore DTAXO.', main: portfolio() },
  { path: '/how-we-work/', title: 'How We Work | ZIU AI', description: 'Our four-step method: map, build, launch, run. Custom pricing, human approval and clear data handling.', main: howWeWork() },
  { path: '/industries/', title: 'Industries | ZIU AI', description: 'AI automation for professional services, real estate and property, e-commerce and retail, and healthcare clinics.', main: industries() },
  { path: '/about/', title: 'About ZIU AI', description: 'A founder-led AI consulting and automation firm working with businesses in the USA & Canada, the UK & Europe, the UAE & Gulf, and India.', main: about() },
  { path: '/resources/', title: 'Resources | ZIU AI', description: 'Frequently asked questions, an application choice guide, a savings calculator and a quick automation check.', main: resources() },
  { path: '/automation-check/', title: 'Automation Check | ZIU AI', description: 'Find your first automation.', main: automationCheck() },
  ...REGIONS.map((r) => ({ path: `/regions/${r.slug}/`, title: `AI Consulting and Automation in ${r.name.replace('&', '&amp;')} | ZIU AI`, description: r.title, main: regionPage(r) })),
  { path: '/contact/', title: 'Book a Call | ZIU AI', description: 'Tell us what you want to build or automate. Request a call with ZIU AI in one simple step.', main: contact() },
  { path: '/careers/', title: 'Careers | ZIU AI', description: 'Careers at ZIU AI.', main: simplePage('Careers', 'Work with us', `Interested in building practical AI and automation solutions? Email <a href="mailto:${OWNER.email}">${OWNER.email}</a> with a short introduction, your experience and links to your work to discuss opportunities with ZIU AI.`) },
  { path: '/privacy/', title: 'Privacy policy | ZIU AI', description: 'ZIU AI privacy policy.', main: privacy() },
  { path: '/terms/', title: 'Terms | ZIU AI', description: 'ZIU AI terms.', main: terms() },
];

export const NOT_FOUND = { path: '/404.html', title: 'Page not found | ZIU AI', description: 'Page not found.', main: simplePage('404', 'This page is not here.', 'Try the <a class="tlink" href="/">home page</a> or <a class="tlink" href="/contact/">get in touch</a>.') };
