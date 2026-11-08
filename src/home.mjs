import { btn, link, kicker, cglass, logoMark, sectionIndex, icon, founderFeature, CTA } from './components.mjs';
import { USE_CASES, PILLARS, SERVICE_DETAILS, ENGAGEMENTS, FIT } from './data.mjs';
import { FAQS, OWNER, phoneLink } from './data.mjs';

const faq = (items) => `<div class="faq">${items.map((f) => `
  <details class="faq__item">
    <summary><span>${f.q}</span><i aria-hidden="true"></i></summary>
    <div class="faq__a"><p>${f.a}</p></div>
  </details>`).join('')}</div>`;
export { faq };

export const homeIndex = sectionIndex([
  ['top', 'Top'], ['what', 'What we do'], ['fit', 'Who it is for'], ['problem', 'The problem'], ['solutions', 'Solutions'],
  ['how', 'How it works'], ['results', 'Results'], ['pricing', 'Pricing'], ['demos', 'See it working'],
  ['safety', 'Safety and control'], ['team', 'Team'], ['faq', 'FAQs'], ['start', 'Get started'],
]);

const serviceName = (id) => SERVICE_DETAILS.find((s) => s.id === id).name;

export const home = () => `
<section class="hero" id="top" data-theme="dark" aria-labelledby="hero-title">
  <canvas class="hero__canvas" aria-hidden="true"></canvas>
  ${cglass('cglass--hero')}
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <p class="kicker kicker--light hero__kick"><span class="kicker__t">AI consulting, custom automation and software</span></p>
    <h1 id="hero-title" class="display hero__title">We find where AI pays off, then build&nbsp;it.</h1>
    <p class="hero__sub">ZIU AI works out where AI will save your business the most, builds the automation or tool, and keeps it running. First process live in about 30 days.</p>
    <div class="actions hero__actions">
      ${btn(CTA.book)}
      ${btn(CTA.check, 'ghost-light')}
    </div>
    <p class="hero__proof"><span class="pulse" aria-hidden="true"></span><span>Built and tested in our own operations first. [Insert one measured result from your own business, e.g. “New inquiries answered in under 5 minutes, down from 6 hours, measured over 8 weeks”.]</span></p>
  </div>
  <a class="hero__scroll" href="#what"><span>Scroll</span><i aria-hidden="true"></i></a>
</section>

<div class="intro" aria-label="Intro">
  <div class="intro__brand">${logoMark('mark--intro')}<span>ZIU AI</span></div>
  <div class="intro__load">
    <ol class="intro__steps" aria-hidden="true">
      <li data-load-step>Typefaces</li><li data-load-step>Glass</li><li data-load-step>Light</li>
    </ol>
    <p class="intro__status" role="status" aria-live="polite">Loading</p>
  </div>
  <div class="intro__sting" aria-hidden="true">
    <video class="logo-video sting__video" src="/assets/media/ziu-logo.mp4" muted playsinline preload="auto" disablepictureinpicture></video>
  </div>
  <p class="intro__hint" aria-hidden="true">Scroll to move through the glass</p>
  <button class="intro__skip" type="button">Skip intro <span aria-hidden="true">→</span></button>
</div>

<section class="section what" id="what" aria-labelledby="what-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('01', 'What we do')}<h2 id="what-title" class="h1">Advise. Build. Run.</h2></div>
      <p class="lede">Three ways to work with us. Start with one, add the others when they pay for themselves.</p>
    </div>
    <ol class="eng pillars">
      ${PILLARS.map((p) => `<li class="eng__item" data-reveal>
        <p class="eng__dur">${p.name}</p>
        <h3 class="h2">${p.title}</h3>
        <p>${p.body}</p>
        <ul class="pillar__services">${p.services.map((id) => `<li><a href="/services/#${id}">${serviceName(id)}</a></li>`).join('')}</ul>
      </li>`).join('')}
    </ol>
    <div class="actions" data-reveal>${btn({ label: 'See all services', href: '/services/' }, 'ghost')}</div>
  </div>
</section>

<section class="section fit" id="fit" aria-labelledby="fit-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('02', 'Who it is for')}<h2 id="fit-title" class="h1">Built for companies that run on people and spreadsheets.</h2></div>
      <p class="lede">Owner-led and mid-size businesses, 10 to 500 people, in any sector where work still moves by hand.</p>
    </div>
    <div class="two-lists">
      <div data-reveal>${kicker('A', 'A good fit if')}<ul class="ticks ticks--lg">${FIT.yes.map((t) => `<li>${t}</li>`).join('')}</ul></div>
      <div data-reveal>${kicker('B', 'Not a fit if')}<ul class="ticks ticks--lg ticks--plain">${FIT.no.map((t) => `<li>${t}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>

<section class="section problem" id="problem" aria-labelledby="problem-title">
  <div class="wrap">
    <div class="problem__grid">
      <div data-reveal>
        ${kicker('03', 'The problem')}
        <h2 id="problem-title" class="h1">Most AI projects stall after the&nbsp;demo.</h2>
        <p class="lede">Usually because no one owned the process, the data or the follow-through. We do.</p>
      </div>
      <ul class="problem__list" data-reveal>
        <li><span class="problem__n">i</span>Your team copies the same information between tools every day.</li>
        <li><span class="problem__n">ii</span>You bought AI tools, but few people use them for real work.</li>
        <li><span class="problem__n">iii</span>A pilot looked promising and never became part of the routine.</li>
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

<section class="section automate" id="solutions" aria-labelledby="solutions-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('04', 'Solutions')}<h2 id="solutions-title" class="h1">Where AI pays off first.</h2></div>
      <p class="lede">Six jobs we most often take off a team. Each one links to what we set up and how.</p>
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
    <div class="actions" data-reveal>${btn({ label: 'See all solutions', href: '/use-cases/' }, 'ghost')}${btn({ label: 'By industry', href: '/industries/' }, 'ghost')}</div>
  </div>
</section>

<section class="section how" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('05', 'How it works')}<h2 id="how-title" class="h1">Four steps. Something you keep at each.</h2></div>
      <p class="lede">You always know what is next, what it costs and what we need from you.</p>
    </div>
    <div class="steps" data-steps>
      <div class="steps__visual" aria-hidden="true">
        <div class="steps__wall">
          ${['Map', 'Build', 'Launch', 'Run'].map((s, i) => `<div class="steps__pane" data-pane style="--i:${i}"><span>${s}</span></div>`).join('')}
        </div>
      </div>
      <ol class="steps__list">
        ${[
          ['Map', 'We interview the people who do the work and map how it runs today. You keep the map and a ranked list of what to fix first.', '2–4 hours'],
          ['Build', 'We build the automation or tool in your accounts and test it on real examples. You see progress every week.', '1–2 hours a week'],
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
    <p data-reveal>${link(CTA.how.label, CTA.how.href)}</p>
  </div>
</section>

<section class="section proof" id="results" aria-labelledby="results-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('06', 'Results')}<h2 id="results-title" class="h1">Measured results, starting with our own business.</h2></div>
      <p class="lede">Automations in daily use at ZIU AI, measured every month. Every result shows the starting point, the change and the period.</p>
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
    <div class="cases__grid">
      <article class="case-card" data-reveal>
        <p class="case-card__label">Every case study we publish shows the starting point, what we built, the result and the period measured. No result is published before it has been measured for at least four weeks.</p>
        <h3 class="h3">[Case study title]</h3>
        <dl class="case-card__metrics">
          <div><dt>Before</dt><dd>[Before]</dd></div>
          <div><dt>After</dt><dd>[After]</dd></div>
          <div><dt>Measured over</dt><dd>[period]</dd></div>
        </dl>
      </article>
      <aside class="founding" data-reveal>
        <p class="kicker"><span class="kicker__t">Founding clients</span></p>
        <p class="founding__text">A reduced price for the first clients who let us publish a measured result.</p>
        <div class="actions">${btn({ label: 'Ask about a founding-client place', href: '/contact/?topic=founding' })}${btn({ label: 'See our results', href: '/case-studies/' }, 'ghost')}</div>
      </aside>
    </div>
    <p class="tools-line" data-reveal><span class="tools-line__label">We build with the tools you already use, including</span> Microsoft 365 · Google Workspace · HubSpot · Salesforce · Zapier · Make · n8n · <span class="nowrap">leading AI models</span></p>
  </div>
</section>

<section class="section starter" id="pricing" aria-labelledby="pricing-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('07', 'Pricing')}<h2 id="pricing-title" class="h1">Start small. Fixed price. No hourly billing.</h2></div>
      <p class="lede">A short discovery you keep, then one working automation in about 30 days. Every price is agreed in writing before work starts.</p>
    </div>
    <ol class="track" data-progress>
      ${ENGAGEMENTS.map((e, i) => `<li class="track__step" data-reveal data-progress-item>
        <p class="track__dur"><span class="track__lbl">Typical duration</span>${e.duration}${e.id === 'run' ? ', cancel with [30] days’ notice' : ''}</p>
        <p class="track__price"><span class="track__lbl">Starting price</span>${e.price}</p>
        <h3 class="h3"><span>${i + 1}.</span> ${e.name}</h3>
        <p>${e.body.replace(' Cancel with [30] days’ notice.', '')}</p>
      </li>`).join('')}
    </ol>
    <div class="starter__foot" data-reveal>
      <div><p class="note">You receive a fixed written quote before any work starts. If discovery shows automation is not worth it for you, we say so, and you can stop there.</p>
      <p class="note">${link('Estimate what a task costs you', '/resources/#savings')}</p></div>
      <div class="actions">${btn(CTA.book)}${btn(CTA.pricing, 'ghost')}</div>
    </div>
  </div>
</section>

<section class="section section--dark demos" id="demos" data-theme="dark" aria-labelledby="demos-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('08', 'See it working', 'kicker--light')}<h2 id="demos-title" class="h1">Watch an automation run.</h2></div>
      <p class="lede lede--light">Real workflows. A person still approves each step that matters.</p>
    </div>
    ${walkthrough()}
    <ul class="demo-list">
      ${[
        ['Demo 1', 'An inquiry email becomes a CRM record and a drafted reply waiting for approval.', '[60–90 second video]'],
        ['Demo 2', 'A supplier invoice is read, checked against the order and queued for payment.', '[video]'],
        ['Demo 3', 'A weekly report is assembled from three tools and sent to the team.', '[video]'],
      ].map(([n, d, v]) => `<li class="demo" data-reveal>
        <p class="demo__n">${n}</p>
        <p class="demo__d">${d}</p>
        <p class="demo__v">${v}</p>
        <a class="tlink tlink--light" href="#demo-modal" data-demo="${n}: ${d.replace(/"/g, '')}">Watch the demo<span aria-hidden="true"> →</span></a>
      </li>`).join('')}
    </ul>
    <div class="actions" data-reveal><a class="btn btn--ghost-light" href="#demo-modal" data-demo="Demo 1: An inquiry email becomes a CRM record and a drafted reply waiting for approval."><span>Watch the demos</span></a></div>
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
        ${kicker('09', 'Safety, data and control')}
        <h2 id="safety-title" class="h1">You stay in control.</h2>
        <p class="lede">Your accounts, your data, your sign-off on anything that matters.</p>
        <div class="actions">${btn({ label: 'Read how we handle data', href: '/how-we-work/#safety' }, 'ghost')}</div>
      </div>
      <ul class="commitments">
        ${[
          ['accounts', 'Your accounts', 'Automations run in your own accounts. You own them and can switch them off at any time.'],
          ['approval', 'Human approval', 'A person approves sensitive steps, such as sending money, contracts, and any customer messages you choose.'],
          ['access', 'Only the access we need', 'We only access the systems a process needs, and we remove our access when you ask.'],
          ['held', 'Paused and flagged, not guessed', 'If something fails, you are alerted and the task is paused for review rather than guessed.'],
          ['region', 'Regional rules', 'We follow the data protection rules that apply in your region and tell you where data is processed.'],
        ].map(([ic, t, d]) => `<li data-reveal><h3 class="commit__t">${icon(ic, 'icon--commit')}<span>${t}</span></h3><p>${d}</p></li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section class="section team" id="team" aria-labelledby="team-title">
  <div class="wrap">
    <div class="split split--head" data-reveal>
      <div>${kicker('10', 'Team')}<h2 id="team-title" class="h1">Who you will work with.</h2></div>
      <p class="lede">You deal with the founder directly, from the first call to the monthly report.</p>
    </div>
    ${founderFeature()}
  </div>
</section>

<section class="section faq-sec" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-sec__grid">
    <div data-reveal>${kicker('11', 'Frequently asked questions')}<h2 id="faq-title" class="h1">Questions owners ask before starting.</h2>
      <p>${link('All questions', '/resources/#faq')}</p></div>
    <div data-reveal>${faq(FAQS.slice(0, 6))}</div>
  </div>
</section>

<section class="cta-band cta-band--final" id="start" data-theme="dark" aria-labelledby="start-title">
  ${cglass('cglass--band')}
  <div class="wrap cta-band__inner" data-reveal>
    ${kicker('12', 'Get started', 'kicker--light')}
    <h2 id="start-title" class="h1">Find out where AI pays off for you.</h2>
    <p class="lede lede--light">A 30-minute call. You leave with three processes worth automating, whether or not we work together.</p>
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
    <li class="walk__stage" data-stage="An inquiry email arrives.">
      <button type="button" class="walk__dot" data-goto aria-pressed="false"><span class="sr-only">Show step 1</span></button>
      <p class="walk__t">1 · Inquiry arrives</p>
      <div class="walk__card walk__mail"><p class="walk__meta">Inbox · sample</p><p>“Hello, we would like a quote for monthly bookkeeping. Could someone call me this week?”</p></div>
    </li>
    <li class="walk__stage" data-stage="The inquiry is read and the key details are extracted.">
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
