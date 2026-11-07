# ZIU AI — website

Static, dependency-free site. Content comes from *ZIU AI Website Content v1.0 (2 November 2026)*.

```
npm install        # only installs the two self-hosted font packages
npm run build      # renders all pages into dist/
npm run serve      # http://localhost:4173
npm run dev        # http://localhost:4174 (also accepts test form posts)
```

Requires Node.js 18 or later (and Python 3 only for `npm run serve`).

## Structure

| Path | What it is |
| --- | --- |
| `src/data.mjs` | Approved copy for use cases, services, FAQs, industries, regions, tool guide |
| `src/home.mjs` | Homepage (12 sections), interactive walkthrough |
| `src/pages.mjs` | Every other page + SEO titles/descriptions |
| `src/components.mjs` | Layout, header, footer, buttons, page hero, CSS glass wall |
| `src/assets/glass.js` | WebGL ray-traced vertical glass wall (no libraries) |
| `src/assets/intro.js` | Loader, cinematic intro, scroll-driven camera, skip, replay, hero |
| `src/assets/main.js` | Navigation, reveals, scroll-spy, steps, walkthrough, modal, forms |
| `src/assets/styles.css` | Design system |

## Checks

```
npm run check
```

- `tools/reconcile.mjs` — every approved string from the content document, SEO title/description and CTA destination, page by page
- `tools/check.mjs` — internal links and anchors, one h1 per page, heading order, unique titles/descriptions, form labels, duplicate ids

## Motion

- Cross-page fade transitions (View Transitions API; other browsers navigate normally)
- Reading-progress line in the header; hero content hands over to the page as you scroll
- Glass panes move at different speeds by depth (parallax) on every glass wall
- Headings reveal word by word; line icons draw on; timelines (starter offer, engagements, method) fill with scroll
- Walkthrough plays once when it scrolls into view; FAQ answers open smoothly
- Finale: full-screen "ZIU AI" wordmark fitted to the width (main.js), lit by the cursor or a finger: letters glow at the light, the shadow falls away from it; one constant light sheen; static under reduced motion; slow light red/white aurora behind
- Glass cursor (`cursor.js`, desktop only): exact dot, trailing clear-glass lens that reacts quietly to links and buttons, very subtle hero parallax
- Smooth wheel scrolling on desktop (mouse/trackpad only; touch, keyboard and scrollbar stay native)
- Back button to the homepage skips the intro and restores the scroll position
- Everything is disabled under reduced motion, with complete static states

## Forms (contact + automation check)

Both forms send to the service set in `src/site.config.mjs`. Pick one, fill it in, run `npm run build`:

| Provider | What to set | Notes |
| --- | --- | --- |
| Formspree | `provider: 'formspree'`, `endpoint: 'https://formspree.io/f/<id>'` | Create a form at formspree.io; submissions arrive by email |
| Web3Forms | `provider: 'web3forms'`, `accessKey: '<key>'` | Free key at web3forms.com, sent to the email you register |
| Netlify Forms | `provider: 'netlify'` | Only when the site is hosted on Netlify; enable form detection |
| Custom | `provider: 'custom'`, `endpoint: '<url>'` | Any endpoint that accepts JSON POST (CRM, Zapier/Make webhook) |

Each submission includes every field plus `subject`, `form` (contact / automation-check) and `page`.
A hidden spam-trap field silently drops bot submissions. On failure the visitor keeps their answers,
sees an error with the phone number, and can retry. Without JavaScript the forms post natively.

**Test locally without an account:**

```
FORM_PROVIDER=custom FORM_ENDPOINT=/api/forms-dev npm run build
npm run dev        # http://localhost:4174 — submissions are saved to .form-submissions.jsonl
```
`/api/forms-dev?fail=1` returns an error, to try the failure state. Run `npm run build` again afterwards.

## Glass rendering

- Intro: about a 2.5-second fly-through (`INTRO_SECONDS` in `intro.js`), with Skip; the logo replays it.
- Intro and homepage hero: live ray-traced wall (`glass.js`, `intro.js`) with polished bevels, adaptive resolution up to full device pixels, 2x anti-aliasing in the hero.
- Page headers, call-to-action bands and the founder portrait: sharp 4x anti-aliased stills of the same glass (`glass-still.js`), rendered once each; CSS glass is the fallback.

## Savings calculator

Resources page (`/resources/#savings`). Uses only the visitor's figures (hours, people, cost per hour, currency, share automatable, working weeks) and shows the formula. "Send these numbers with my enquiry" prefills the contact form.

## Placeholders

Any text written as `[like this]` in the source renders as a **yellow highlighted placeholder**.
Search the source for `[` to find them all before launch. Editor notes from the content
document are kept as HTML comments, not published.

## QA switches (append to the URL)

- `?p=0.5` freeze the intro at a given progress (0–1); `?p=1` jumps straight to the hero
- `?gl=0` force the no-WebGL fallback
- `?motion=reduce` simulate reduced-motion preference
- `?smooth=0` turn off smooth wheel scrolling (desktop) for comparison
- `?cursor=0` turn off the glass cursor (desktop)

## Not connected yet

- Booking calendar and demo videos are placeholder slots.
- No canonical URLs, sitemap or Open Graph image: these need the production domain.

## Deploying

`dist/` is generated and not committed. Any static host works:

| Host | Build command | Publish directory |
| --- | --- | --- |
| Netlify / Vercel / Cloudflare Pages | `npm run build` | `dist` |

Links are root-relative (`/services/`), so serve the site from the root of a domain
(a custom domain or a host like the above). A GitHub Pages *project* site, which lives
under `/<repo-name>/`, would need a base path added first.

The Web3Forms access key in `src/site.config.mjs` is a public, client-side key by design;
it can be overridden with the `FORM_ACCESS_KEY` environment variable at build time.
