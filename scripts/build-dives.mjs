// Generates the static deep-dive pages into public/dives/.
//
// Output goes to public/ rather than dist/ so that `npm run dev` serves the
// same pages the build ships, and so vite copies them into dist as-is. The
// directory is generated, so it is gitignored; the markdown it is built from is
// what this repo tracks.
//
// The build fails on a broken internal link. With 250-odd rewritten links, a
// silent 404 is the most likely way this goes wrong, so it is checked rather
// than trusted.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DIVES, DIVE_DOCS, REFERENCE, SITE_ORIGIN, repoUrl } from './dives/catalog.mjs'
import { render } from './dives/markdown.mjs'
import { docPage, diveDocNav, indexPage } from './dives/layout.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'content')
const outDir = path.join(root, 'public', 'dives')

// Routes that exist outside this generator, for the sitemap.
const STATIC_ROUTES = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/writing/i-was-an-ai-skeptic/', changefreq: 'yearly', priority: '0.8' },
]

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : null
}

function write(route, html) {
  const dir = path.join(outDir, route.replace(/^\/dives\/?/, ''))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

// First real sentence of a doc, for the meta description.
function describe(markdown, fallback) {
  const body = markdown.replace(/^#.*$/m, '')
  for (const block of body.split(/\n\s*\n/)) {
    const line = block.trim()
    if (!line || line.startsWith('#') || line.startsWith('>') || line.startsWith('|')) continue
    if (line.startsWith('```') || line.startsWith('-') || line.startsWith('*')) continue
    const plain = line
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (plain.length < 40) continue
    return plain.length > 180 ? plain.slice(0, 177).replace(/[,;:\s]\S*$/, '') + '...' : plain
  }
  return fallback
}

/** Every page, in the order someone would read the series front to back. */
function buildPageList() {
  const pages = []

  for (const dive of DIVES) {
    const docs = DIVE_DOCS.map((doc) => ({
      ...doc,
      file: path.join(contentDir, 'dives', dive.slug, doc.file),
      href: doc.page ? `/dives/${dive.slug}/${doc.page}/` : `/dives/${dive.slug}/`,
    })).filter((doc) => fs.existsSync(doc.file))

    for (const doc of docs) {
      pages.push({
        kind: 'dive',
        dive,
        doc,
        docs,
        route: doc.href,
        label: docs.length > 1 && doc.page ? `${dive.title}: ${doc.label}` : dive.title,
      })
    }
  }

  for (const ref of REFERENCE) {
    pages.push({
      kind: 'reference',
      ref,
      route: `/dives/reference/${ref.slug}/`,
      label: ref.title,
      doc: { file: path.join(contentDir, 'reference', ref.file), label: ref.title },
    })
  }

  return pages
}

async function main() {
  if (!fs.existsSync(contentDir)) {
    console.error('No content/ directory. Run `npm run sync:dives` first.')
    process.exit(1)
  }

  fs.rmSync(outDir, { recursive: true, force: true })

  const pages = buildPageList()
  const routes = new Set(['/dives/'])
  const internalLinks = []
  const unresolved = []

  for (const page of pages) routes.add(page.route)

  // ── The index ──
  const seriesReadme = read(path.join(contentDir, 'series-readme.md'))
  if (!seriesReadme) {
    console.error('Missing content/series-readme.md. Run `npm run sync:dives`.')
    process.exit(1)
  }
  // Everything above the first blockquote is the lede; below it the README
  // starts listing dives, which the cards already do.
  const lede = seriesReadme.split('\n').slice(1)
  const stop = lede.findIndex((l) => l.trimStart().startsWith('>'))
  const ledeSource = lede.slice(0, stop === -1 ? 8 : stop).join('\n')
  const ledeRendered = await render(ledeSource, { kind: 'reference', sourceFile: 'series-readme' })
  const indexDescription = describe(
    ledeSource,
    'A hands-on, build-it-from-scratch series on engineering with large language models.',
  )
  write(
    '/dives/',
    indexPage({
      description: indexDescription,
      canonical: `${SITE_ORIGIN}/dives/`,
      intro: ledeRendered.html.replace(/<p>/g, '<p class="dd-lede">'),
    }),
  )
  internalLinks.push(...ledeRendered.links.map((l) => ({ href: l, from: '/dives/' })))

  // ── Every doc page ──
  for (const [i, page] of pages.entries()) {
    const source = read(page.doc.file)
    if (source === null) {
      console.error(`Missing source markdown: ${page.doc.file}`)
      process.exit(1)
    }

    const ctx =
      page.kind === 'dive'
        ? { kind: 'dive', dive: page.dive, sourceFile: page.doc.file }
        : { kind: 'reference', sourceFile: page.doc.file }

    const rendered = await render(source, ctx)
    unresolved.push(...rendered.unresolved.map((u) => `${page.route}: ${u}`))
    internalLinks.push(...rendered.links.map((l) => ({ href: l, from: page.route })))

    const isDive = page.kind === 'dive'
    const prev = i > 0 ? pages[i - 1] : { href: '/dives/', label: 'All dives' }
    const next = i < pages.length - 1 ? pages[i + 1] : null

    write(
      page.route,
      docPage({
        pageTitle: `${rendered.title || page.label} - Alex Vervloet`,
        description: describe(source, page.label),
        canonical: SITE_ORIGIN + page.route,
        eyebrow: isDive
          ? page.dive.track === 'core'
            ? `Core path - ${page.dive.n} of 8`
            : page.dive.track === 'capstone'
              ? 'Capstone'
              : page.dive.track === 'companion'
                ? 'Companion, outside the sequence'
                : 'Bonus dive'
          : 'Series reference',
        here: page.label,
        repoUrl: isDive ? repoUrl(page.dive) : 'https://github.com/alexvervloet/ai-engineering-deep-dive',
        currentSlug: isDive ? page.dive.slug : null,
        diveNav: isDive ? diveDocNav(page.dive, page.docs, page.doc.page) : '',
        toc: rendered.toc,
        html: rendered.html,
        prev: prev.route ? { href: prev.route, label: prev.label } : prev,
        next: next ? { href: next.route, label: next.label } : null,
      }),
    )
  }

  // ── Sitemap ──
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    ...STATIC_ROUTES,
    { loc: '/dives/', changefreq: 'weekly', priority: '0.9' },
    ...pages.map((p) => ({ loc: p.route, changefreq: 'monthly', priority: '0.7' })),
  ]
  fs.writeFileSync(
    path.join(root, 'public', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_ORIGIN}${u.loc === '/' ? '' : u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
  )

  // ── Checks ──
  const broken = []
  for (const { href, from } of internalLinks) {
    if (!href.startsWith('/dives')) continue
    const [route] = href.split('#')
    const normalized = route.endsWith('/') ? route : `${route}/`
    if (!routes.has(normalized)) broken.push(`${from} -> ${href}`)
  }

  const checked = internalLinks.filter((l) => l.href.startsWith('/dives')).length
  console.log(
    `Generated ${pages.length + 1} deep-dive pages into public/dives/ (${checked} internal links checked)`,
  )

  if (unresolved.length) {
    console.error(`\n${unresolved.length} link(s) no rule could resolve:`)
    unresolved.forEach((u) => console.error('  ' + u))
  }
  if (broken.length) {
    console.error(`\n${broken.length} internal link(s) point at a page that does not exist:`)
    ;[...new Set(broken)].forEach((b) => console.error('  ' + b))
  }
  if (unresolved.length || broken.length) process.exit(1)
}

main()
