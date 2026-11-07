import { btn, link, kicker, cglass, logoMark, sectionIndex, icon, founderFeature, CTA } from './components.mjs';
import { USE_CASES } from './data.mjs';
import { FAQS, OWNER, phoneLink } from './data.mjs';

const faq = (items) => `<div class="faq">${items.map((f) => `
  <details class="faq__item">
    <summary><span>${f.q}</span><i aria-hidden="true"></i></summary>
    <div class="faq__a"><p>${f.a}</p></div>
  </details>`).join('')}</div>`;
export { faq };

export const homeIndex = sectionIndex([
  ['top', 'Top'], ['proof', 'Proof'], ['problem', 'The problem'], ['automate', 'What we automate'],
  ['starter', 'Starter offer'], ['how', 'How it works'], ['cases', 'Case studies'], ['demos', 'See it working'],
  ['safety', 'Safety and control'], ['team', 'Team'], ['faq', 'FAQs'], ['start', 'Get started'],
]);

export const home = () => `
<section class="hero" id="top" data-theme="dark" aria-labelledby="hero-title">
  <canvas class="hero__canvas" aria-hidden="true"></canvas>
  ${cglass('cglass--hero')}
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <p class="kicker kicker--light hero__kick"><span class="kicker__t">Practical AI automation for growing businesses</span></p>
    <h1 id="hero-title" class="display hero__title">Hand the repetitive work to systems you can&nbsp;trust.</h1>
    <p class="hero__sub">ZIU AI finds the processes costing your team the most time, automates one in about 30 days, and keeps it running.</p>
    <div class="actions hero__actions">
      ${btn(CTA.book)}
      ${btn({ label: 'Take the 5-minute automation check', href: CTA.check.href }, 'ghost-light')}
    </div>
    <p class="hero__proof"><span class="pulse" aria-hidden="true"></span><span>Built and tested in our own operations first. [Insert one measured result from your own business, e.g. “New enquiries answered in under 5 minutes, down from 6 hours, measured over 8 weeks”.]</span></p>
  </div>
  <a class="hero__scroll" href="#proof"><span>Scroll</span><i aria-hidden="true"></i></a>
</section>

<div class="intro" aria-label="Intro">
  <div class="intro__brand">${logoMark('mark--intro')}<span>ZIU AI</span></div>
  <div class="intro__load">
    <ol class="intro__steps" aria-hidden="true">
      <li data-load-step>Typefaces</li><li data-load-step>Glass</li><li data-load-step>Light</li>
    </ol>
    <p class="intro__status" role="status" aria-live="polite">Loading</p>
  </div>
  <p class="intro__hint" aria-hidden="true">Scroll to move through the glass</p>
  <button class="intro__skip" type="button">Skip intro <span aria-hidden="true">→</span></button>
</div>

<!-- 2. Proof strip. Editor: replace with client logos, a review score and partner badges as each is earned. Tool names stay plain text, never logos, until a partnership exists. -->
<section class="section proof" id="proof" aria-labelledby="proof-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('01', 'Proof')}<h2 id="proof-title" class="h1">We run our own business on what we build.</h2></div>
      <p class="lede">Automations in daily use at ZIU AI, measured every month.</p>
    </div>
    <div class="table-wrap" data-reveal>
      <table class="proof-table">
        <caption class="sr-only">Automations in daily use at ZIU AI, with before and after measurements</caption>
        <thead><tr><th scope="col">Automation</th><th scope="col">Before</th><th scope="col">After</th><th scope="col">Measured over</th></tr></thead>
        <tbody>
          <tr data-reveal><th scope="row">Lead intake and first reply</th><td data-label="Before">[baseline]</td><td data-label="After">[result]</td><td data-label="Measured over">[period]</td></tr>
          <tr data-reveal><th scope="row">Proposal and quote drafting</th><td data-label="Before">[baseline]</td><td data-label="After">[result]</td><td data-label="Measured over">[period]</td></tr>
          <tr data-reveal><th scope="row">Invoicing and payment follow-up</th><td data-label="Before">[baseline]</td><td data-label="After">[result]</td><td data-label="Measured over">[period]</td></tr>
        </tbody>
      </table>
    </div>
    <p class="tools-line" data-reveal><span class="tools-line__label">We build with the tools you already use, including</span> Microsoft 365 · Google Workspace · HubSpot · Salesforce · Zapier · Make · n8n · <span class="nowrap">leading AI models</span></p>
  </div>
</section>

<section class="section problem" id="problem" aria-labelledby="problem-title">
  <div class="wrap">
    <div class="problem__grid">
      <div data-reveal>
        ${kicker('02', 'The problem')}
        <h2 id="problem-title" class="h1">Most AI efforts stall between the demo and daily&nbsp;work.</h2>
        <p class="lede">Usually because no one owned the process, the data or the follow-through. We do.</p>
      </div>
      <ul class="problem__list" data-reveal>
        <li><span class="problem__n">i</span>Your team copies the same information between tools every day.</li>
        <li><span class="problem__n">ii</span>You bought AI tools, but few people use them for real work.</li>
        <li><span class="problem__n">iii</span>A pilot looked promising and then never became part of the routine.</li>
      </ul>
    </div>
    <figure class="bridge" data-bridge aria-labelledby="bridge-cap">
      <div class="bridge__end">The demo</div>
      <div class="bridge__span">
        <span style="--i:0">The process</span><span style="--i:1">The data</span><span style="--i:2">The follow-through</span>
      </div>
      <div class="bridge__end bridge__end--to">Daily work</div>
      <figcaption id="bridge-cap" class="sr-only">Getting from a demo to daily work needs an owner for the process, the data and the follow-through.</figcaption>
    </figure>
  </div>
</section>

<section class="section automate" id="automate" aria-labelledby="automate-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('03', 'What we automate')}<h2 id="automate-title" class="h1">Where automation pays off first.</h2></div>
      <p class="lede">Six areas where we most often remove manual work.</p>
    </div>
    <ol class="areas">
      ${USE_CASES.map((u, i) => `<li class="area" data-reveal>
        <a href="/use-cases/${u.slug}/">
          <span class="area__n">${String(i + 1).padStart(2, '0')}</span>
          <span class="area__name">${icon(u.icon, 'icon--area')}<span>${u.name}</span></span>
          <span class="area__ex">${u.example}</span>
          <span class="area__go" aria-hidden="true">→</span>
        </a>
      </li>`).join('')}
    </ol>
    <div class="actions" data-reveal>${btn({ label: 'See all use cases', href: '/use-cases/' }, 'ghost')}</div>
  </div>
</section>

<section class="section starter" id="starter" aria-labelledby="starter-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('04', 'Starter offer')}<h2 id="starter-title" class="h1">Start small, with a fixed quote.</h2></div>
      <p class="lede">A short discovery you keep, then one working automation in about 30 days. No hourly billing.</p>
    </div>
    <ol class="track" data-progress>
      <li class="track__step" data-reveal data-progress-item>
        <p class="track__dur"><span class="track__lbl">Typical duration</span>1–2 weeks</p>
        <h3 class="h3"><span>1.</span> Discovery</h3>
        <p>A map of your key processes, the three best candidates for automation, and an estimate of time saved for each. Yours to keep.</p>
      </li>
      <li class="track__step" data-reveal data-progress-item>
        <p class="track__dur"><span class="track__lbl">Typical duration</span>About 30 days</p>
        <h3 class="h3"><span>2.</span> First automation</h3>
        <p>One process automated end to end, tested with your team and launched.</p>
      </li>
      <li class="track__step" data-reveal data-progress-item>
        <p class="track__dur"><span class="track__lbl">Typical duration</span>Ongoing, cancel with [30] days’ notice</p>
        <h3 class="h3"><span>3.</span> Run and improve</h3>
        <p>Monitoring, fixes and monthly improvements, on a simple monthly plan.</p>
      </li>
    </ol>
    <div class="starter__foot" data-reveal>
      <div><p class="note">You receive a fixed written quote before any work starts. If discovery shows automation is not worth it for you, we will say so, and you can stop there.</p>
      <p class="note">${link('Estimate what a task costs you', '/resources/#savings')}</p></div>
      <div class="actions">${btn(CTA.book)}${btn({ label: 'See how engagements work', href: '/engagements/' }, 'ghost')}</div>
    </div>
  </div>
</section>

<section class="section how" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('05', 'How it works')}<h2 id="how-title" class="h1">Four steps, with a deliverable at each.</h2></div>
      <p class="lede">You always know what is next, what it costs and what you need to provide.</p>
    </div>
    <div class="steps" data-steps>
      <div class="steps__visual" aria-hidden="true">
        <div class="steps__wall">
          ${['Map', 'Build', 'Launch', 'Run'].map((s, i) => `<div class="steps__pane" data-pane style="--i:${i}"><span>${s}</span></div>`).join('')}
        </div>
      </div>
      <ol class="steps__list">
        ${[
          ['Map', 'We interview the people who do the work and map how it runs today.', '2–4 hours'],
          ['Build', 'We build the automation in your accounts and test it on real examples.', '1–2 hours a week'],
          ['Launch', 'We switch it on with your team, train them and watch it closely for two weeks.', '1–2 hours'],
          ['Run', 'We monitor, fix and improve it, and report results every month.', '30 minutes a month'],
        ].map(([t, d, time], i) => `<li class="step" data-step>
          <p class="step__n">Step ${i + 1}</p>
          <h3 class="h2">${t}</h3>
          <p class="step__d">${d}</p>
          <p class="step__time"><span>Your time</span>${time}</p>
        </li>`).join('')}
      </ol>
    </div>
    <p data-reveal>${link('See how it works', '/how-we-work/')}</p>
  </div>
</section>

<section class="section cases" id="cases" aria-labelledby="cases-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('06', 'Case studies')}<h2 id="cases-title" class="h1">Results, and how we measured them.</h2></div>
      <p class="lede">Starting with our own operations. Founding-client places are open.</p>
    </div>
    <div class="cases__grid">
      <article class="case-card" data-reveal>
        <p class="case-card__label">Each case study shows the starting point, what we built, the result and the period measured.</p>
        <h3 class="h3">[Case study title]</h3>
        <dl class="case-card__metrics">
          <div><dt>Before</dt><dd>[Before]</dd></div>
          <div><dt>After</dt><dd>[After]</dd></div>
          <div><dt>Measured over</dt><dd>[period]</dd></div>
        </dl>
      </article>
      <aside class="founding" data-reveal>
        <p class="kicker"><span class="kicker__t">Founding clients</span></p>
        <p class="founding__text">We are taking on a small number of founding clients on preferential terms, in exchange for permission to publish a measured case study.</p>
        <div class="actions">${btn({ label: 'Ask about a founding-client place', href: '/contact/?topic=founding' })}${btn({ label: 'Read our case studies', href: '/case-studies/' }, 'ghost')}</div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--dark demos" id="demos" data-theme="dark" aria-labelledby="demos-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('07', 'See it working', 'kicker--light')}<h2 id="demos-title" class="h1">Watch an automation run.</h2></div>
      <p class="lede lede--light">Real workflows, with the human approval steps left in.</p>
    </div>
    ${walkthrough()}
    <ul class="demo-list">
      ${[
        ['Demo 1', 'An enquiry email becomes a CRM record and a drafted reply waiting for approval.', '[60–90 second video]'],
        ['Demo 2', 'A supplier invoice is read, checked against the order and queued for payment.', '[video]'],
        ['Demo 3', 'A weekly report is assembled from three tools and sent to the team.', '[video]'],
      ].map(([n, d, v]) => `<li class="demo" data-reveal>
        <p class="demo__n">${n}</p>
        <p class="demo__d">${d}</p>
        <p class="demo__v">${v}</p>
        <a class="tlink tlink--light" href="#demo-modal" data-demo="${n}: ${d.replace(/"/g, '')}">Watch the demo<span aria-hidden="true"> →</span></a>
      </li>`).join('')}
    </ul>
    <div class="actions" data-reveal><a class="btn btn--ghost-light" href="#demo-modal" data-demo="Demo 1: An enquiry email becomes a CRM record and a drafted reply waiting for approval."><span>Watch the demos</span></a></div>
  </div>
  <dialog id="demo-modal" class="dialog dialog--video" aria-labelledby="demo-modal-title">
    <div class="dialog__head"><h2 id="demo-modal-title" class="h3" data-modal-title>Demo</h2><button type="button" class="dialog__close" data-close aria-label="Close video">×</button></div>
    <div class="video-slot"><p>[Demo video to be supplied: 60–90 seconds, showing the human approval step]</p></div>
  </dialog>
</section>

<section class="section safety" id="safety" aria-labelledby="safety-title">
  <div class="wrap">
    <div class="safety__grid">
      <div class="safety__head" data-reveal>
        ${kicker('08', 'Safety, data and control')}
        <h2 id="safety-title" class="h1">You stay in control.</h2>
        <p class="lede">Your accounts, your data, your approval on anything that matters.</p>
        <div class="actions">${btn({ label: 'Read how we handle data', href: '/how-we-work/#safety' }, 'ghost')}</div>
      </div>
      <ul class="commitments">
        ${[
          ['accounts', 'Your accounts', 'Automations run in your own accounts. You own them and can switch them off at any time.'],
          ['approval', 'Human approval', 'A person approves sensitive steps, such as sending money, contracts or customer messages you choose.'],
          ['access', 'Least access', 'We only access the systems a process needs, and we remove our access when you ask.'],
          ['held', 'Held, not guessed', 'If something fails, you are alerted and the task is held for review rather than guessed.'],
          ['region', 'Regional rules', 'We follow the data protection rules that apply in your region and tell you where data is processed.'],
        ].map(([ic, t, d]) => `<li data-reveal><h3 class="commit__t">${icon(ic, 'icon--commit')}<span>${t}</span></h3><p>${d}</p></li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section class="section team" id="team" aria-labelledby="team-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('09', 'Team')}<h2 id="team-title" class="h1">The people who build and run your systems.</h2></div>
      <p class="lede">Every engagement has a named lead you can reach directly.</p>
    </div>
    ${founderFeature()}
  </div>
</section>

<section class="section faq-sec" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-sec__grid">
    <div data-reveal>${kicker('10', 'Frequently asked questions')}<h2 id="faq-title" class="h1">Questions owners ask before starting.</h2>
      <p>${link('All questions', '/resources/#faq')}</p></div>
    <div data-reveal>${faq(FAQS.slice(0, 6))}</div>
  </div>
</section>

<section class="cta-band cta-band--final" id="start" data-theme="dark" aria-labelledby="start-title">
  ${cglass('cglass--band')}
  <div class="wrap cta-band__inner" data-reveal>
    ${kicker('11', 'Get started', 'kicker--light')}
    <h2 id="start-title" class="h1">Find out what to automate first.</h2>
    <p class="lede lede--light">A 30-minute call. You leave with three candidate processes, whether or not we work together.</p>
    <div class="actions">${btn(CTA.book)}<a class="tlink tlink--light" href="/contact/">Or message us on [WhatsApp / email]</a></div>
  </div>
</section>`;

export function walkthrough() {
  return `
<div class="walk" data-walkthrough data-autoplay data-reveal>
  <div class="walk__bar">
    <p class="walk__label">Interactive walkthrough · illustrative sample data, not a client</p>
    <div class="walk__controls">
      <button type="button" class="chip" data-play>Play walkthrough</button>
      <button type="button" class="chip chip--quiet" data-reset>Reset</button>
    </div>
  </div>
  <ol class="walk__flow">
    <li class="walk__stage" data-stage="An enquiry email arrives.">
      <button type="button" class="walk__dot" data-goto aria-pressed="false"><span class="sr-only">Show step 1</span></button>
      <p class="walk__t">1 · Enquiry arrives</p>
      <div class="walk__card walk__mail"><p class="walk__meta">Inbox · sample</p><p>“Hello, we would like a quote for monthly bookkeeping. Could someone call me this week?”</p></div>
    </li>
    <li class="walk__stage" data-stage="The enquiry is read and the key details are extracted.">
      <button type="button" class="walk__dot" data-goto aria-pressed="false"><span class="sr-only">Show step 2</span></button>
      <p class="walk__t">2 · Details extracted</p>
      <div class="walk__card"><dl class="walk__fields"><div><dt>Request</dt><dd>Quote</dd></div><div><dt>Service</dt><dd>Bookkeeping</dd></div><div><dt>Timing</dt><dd>This week</dd></div><div><dt>Route to</dt><dd>Sales lead</dd></div></dl></div>
    </li>
    <li class="walk__stage" data-stage="A CRM record is created and assigned.">
      <button type="button" class="walk__dot" data-goto aria-pressed="false"><span class="sr-only">Show step 3</span></button>
      <p class="walk__t">3 · CRM record</p>
      <div class="walk__card"><p class="walk__meta">CRM · new contact</p><p>Status: <strong>New lead</strong><br>Owner: Sales lead<br>Follow-up reminder: set</p></div>
    </li>
    <li class="walk__stage" data-stage="A reply is drafted and waits for a person to approve it.">
      <button type="button" class="walk__dot" data-goto aria-pressed="false"><span class="sr-only">Show step 4</span></button>
      <p class="walk__t">4 · Draft awaits approval</p>
      <div class="walk__card walk__draft">
        <p class="walk__meta">Draft reply</p>
        <p>“Thank you for getting in touch. We can call you this week. Which time suits you best?”</p>
        <button type="button" class="walk__approve" data-approve><span class="walk__approve-idle">Approve and send</span><span class="walk__approve-done">Approved · sent</span></button>
      </div>
    </li>
  </ol>
  <p class="sr-only" aria-live="polite" data-live></p>
</div>`;
}
