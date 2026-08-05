// The HTML shell for the deep-dive pages.
//
// These pages are plain static HTML with no client-side JavaScript. Everything
// interactive on them is CSS.

import { DIVES, REFERENCE, SITE_ORIGIN } from './catalog.mjs'

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap'

function head({ title, description, canonical, ogType = 'article' }) {
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="Alexander Vervloet" />
    <link rel="canonical" href="${esc(canonical)}" />

    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#0e1113" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${SITE_ORIGIN}/portrait.duotone.jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${SITE_ORIGIN}/portrait.duotone.jpeg" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${FONTS}" rel="stylesheet" />
    <link rel="stylesheet" href="/styles/dives.css" />`
}

function topBar({ here, repoUrl }) {
  return `<header class="dd-top">
      <div class="dd-top-left">
        <span class="dd-dot"></span>
        <a href="/">av</a>
        <span class="dd-top-sep">/</span>
        <a href="/dives/">dives</a>
        ${here ? `<span class="dd-top-sep">/</span><span class="dd-top-here">${esc(here)}</span>` : ''}
      </div>
      <div class="dd-top-right">
        ${repoUrl ? `<a href="${esc(repoUrl)}" target="_blank" rel="noopener">source</a>` : ''}
        <a class="dd-hide-sm" href="/">about me</a>
      </div>
    </header>`
}

function seriesNav(currentSlug) {
  const group = (label, note, items) => `<p class="dd-rail-head">${label}${
    note ? ` <span style="letter-spacing:0.1em;text-transform:none">${esc(note)}</span>` : ''
  }</p>
      <ul class="dd-nav">${items
        .map(
          (d) =>
            `<li><a href="/dives/${d.slug}/"${d.slug === currentSlug ? ' class="is-current"' : ''}>${
              d.n ? `<span class="dd-nav-n">${d.n}</span>` : ''
            }${esc(d.title)}</a></li>`,
        )
        .join('')}</ul>`

  return [
    group('The core path', '', DIVES.filter((d) => d.track === 'core')),
    group('Bonus dives', '', DIVES.filter((d) => d.track === 'bonus')),
    group('Capstone', '', DIVES.filter((d) => d.track === 'capstone')),
    `<p class="dd-rail-head">Reference</p>
      <ul class="dd-nav">${REFERENCE.map(
        (r) => `<li><a href="/dives/reference/${r.slug}/">${esc(r.title)}</a></li>`,
      ).join('')}</ul>`,
  ].join('\n      ')
}

function diveDocNav(dive, docs, currentPage) {
  if (docs.length < 2) return ''
  return `<p class="dd-rail-head">${esc(dive.title)}</p>
      <ul class="dd-nav">${docs
        .map(
          (d) =>
            `<li><a href="${d.href}"${d.page === currentPage ? ' class="is-current"' : ''}>${esc(
              d.label,
            )}</a></li>`,
        )
        .join('')}</ul>`
}

function tocList(toc) {
  if (toc.length < 3) return ''
  return `<p class="dd-rail-head">On this page</p>
      <ul class="dd-toc">${toc
        .map((t) => `<li class="lvl-${t.level}"><a href="#${t.id}">${esc(t.text)}</a></li>`)
        .join('')}</ul>`
}

function footNav(prev, next) {
  if (!prev && !next) return ''
  const link = (page, dir, cls) =>
    page
      ? `<a href="${page.href}" class="${cls}"><span class="dd-foot-dir">${dir}</span>${esc(
          page.label,
        )}</a>`
      : ''
  return `<nav class="dd-foot">${link(prev, 'Previous', '')}${link(
    next,
    'Next',
    'dd-foot-next',
  )}</nav>`
}

function shell({ meta, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    ${meta}
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

/** A single rendered markdown document. */
export function docPage({
  title,
  pageTitle,
  description,
  canonical,
  eyebrow,
  here,
  repoUrl,
  currentSlug,
  diveNav,
  toc,
  html,
  prev,
  next,
}) {
  return shell({
    meta: head({ title: pageTitle, description, canonical }),
    body: `${topBar({ here, repoUrl })}
    <div class="dd-shell">
      <aside class="dd-rail dd-rail-left">
      ${diveNav}
      ${seriesNav(currentSlug)}
      </aside>
      <main class="dd-main">
        <article class="dd-article">
          ${eyebrow ? `<p class="dd-eyebrow">${esc(eyebrow)}</p>` : ''}
${html}
          ${footNav(prev, next)}
        </article>
      </main>
      <aside class="dd-rail dd-rail-right">
      ${tocList(toc)}
      </aside>
    </div>`,
  })
}

export { diveDocNav, esc }

/** The series index at /dives/. */
export function indexPage({ description, canonical, intro }) {
  const cards = (dives) =>
    `<div class="dd-cards">${dives
      .map(
        (d) => `<a class="dd-card" href="/dives/${d.slug}/">
          <span class="dd-card-n">${d.n ? String(d.n).padStart(2, '0') : d.track === 'capstone' ? 'END' : 'BONUS'}</span>
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.idea)}</p>
          ${d.after ? `<span class="dd-card-after">Slots in after ${esc(d.after)}</span>` : ''}
        </a>`,
      )
      .join('')}</div>`

  const section = (label, note, inner) => `<div class="dd-section-head"><span>${esc(label)}</span>${
    note ? `<span class="dd-section-note">${esc(note)}</span>` : ''
  }</div>
      <div class="dd-section-rule"></div>
      ${inner}`

  return shell({
    meta: head({
      title: 'AI Engineering: Deep Dives',
      description,
      canonical,
      ogType: 'website',
    }),
    body: `${topBar({ here: '', repoUrl: 'https://github.com/alexvervloet/ai-engineering-deep-dive' })}
    <div class="dd-index">
      <h1>AI Engineering: Deep Dives</h1>
      ${intro}
      ${section(
        'The core path',
        'do these in order',
        cards(DIVES.filter((d) => d.track === 'core')),
      )}
      ${section(
        'Bonus dives',
        'standalone, each notes where it slots in',
        cards(DIVES.filter((d) => d.track === 'bonus')),
      )}
      ${section('Capstone', 'everything at once', cards(DIVES.filter((d) => d.track === 'capstone')))}
      ${section(
        'Reference',
        'the shared docs',
        `<ul class="dd-reflist">${REFERENCE.map(
          (r) =>
            `<li><a href="/dives/reference/${r.slug}/"><span class="dd-ref-title">${esc(
              r.title,
            )}</span><span class="dd-ref-blurb">${esc(r.blurb)}</span></a></li>`,
        ).join('')}</ul>`,
      )}
    </div>`,
  })
}
