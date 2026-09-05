// Injects the Cloudflare Web Analytics beacon into every built page.
//
// This runs over dist/ rather than the templates because the site has four
// kinds of page and only two of them go through a template: the React shell in
// index.html, the generated dive pages, and the hand-written HTML under
// public/writing/ and public/no-twitter/, which no build step otherwise
// touches. Walking the output catches all of them, and catches any page added
// later without anyone remembering to wire it up.
//
// The token comes from the CF_BEACON_TOKEN environment variable, set in the
// Cloudflare Pages project settings. With no token this is a no-op, so local
// builds and `npm run dev` stay unmeasured and previews do not pollute the
// numbers.
//
// Why a beacon at all, when Cloudflare already counts requests at the edge:
// the edge counts every crawler too. This only runs in a browser that executes
// JavaScript, which is the closest thing to a human count this site can get.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js'

function htmlFiles(dir) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    // The SSR bundle is a build artifact that never reaches a browser.
    if (entry.isDirectory()) {
      if (entry.name !== 'ssr') found.push(...htmlFiles(full))
    } else if (entry.name.endsWith('.html')) {
      found.push(full)
    }
  }
  return found
}

function main() {
  const token = process.env.CF_BEACON_TOKEN?.trim()
  if (!token) {
    console.log('Analytics: CF_BEACON_TOKEN not set, no beacon injected.')
    return
  }
  if (!fs.existsSync(distDir)) {
    console.error('Analytics: no dist/ to inject into. Run the build first.')
    process.exit(1)
  }

  const tag = `<script defer src="${BEACON_SRC}" data-cf-beacon='${JSON.stringify({ token })}'></script>`

  let injected = 0
  const skipped = []
  for (const file of htmlFiles(distDir)) {
    const html = fs.readFileSync(file, 'utf-8')
    if (html.includes(BEACON_SRC)) continue
    if (!html.includes('</head>')) {
      skipped.push(path.relative(distDir, file))
      continue
    }
    fs.writeFileSync(file, html.replace('</head>', `  ${tag}\n  </head>`))
    injected++
  }

  console.log(`Analytics: beacon injected into ${injected} page(s).`)

  // A page with no </head> is a malformed template, not a page that opted out.
  if (skipped.length) {
    console.error(`\nAnalytics: no </head> in ${skipped.length} page(s), left unmeasured:`)
    skipped.forEach((f) => console.error('  ' + f))
    process.exit(1)
  }
}

main()
