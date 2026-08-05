// Markdown to HTML for the deep-dive pages.
//
// Highlighting happens here, at build time, so the pages ship no JavaScript.
// Shiki is async and markdown-it is not, so fences are highlighted in a first
// pass and looked up by token index while rendering.

import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'
import { createRewriter } from './links.mjs'

const THEME = 'vitesse-dark'
const LANGS = ['bash', 'zsh', 'powershell', 'python', 'json', 'console', 'diff', 'yaml', 'text']
const LANG_ALIAS = { console: 'bash', sh: 'bash', shell: 'bash', jsonl: 'json' }

let highlighterPromise

function highlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ themes: [THEME], langs: LANGS })
  }
  return highlighterPromise
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function stripInline(text) {
  return text.replace(/`([^`]*)`/g, '$1').replace(/\*\*?([^*]*)\*\*?/g, '$1')
}

const md = new MarkdownIt({ html: true, linkify: true, breaks: false })

/**
 * Render one markdown document.
 *
 * @param {string} source
 * @param {{ kind: 'dive' | 'reference', dive?: object, sourceFile: string }} ctx
 * @returns {Promise<{ html: string, title: string, toc: Array, links: string[], unresolved: string[] }>}
 */
export async function render(source, ctx) {
  const hl = await highlighter()
  const rewriter = createRewriter(ctx)
  const tokens = md.parse(source, {})

  // Pass one: highlight every fence.
  const highlighted = new Map()
  tokens.forEach((token, i) => {
    if (token.type !== 'fence') return
    const raw = (token.info || '').trim().split(/\s+/)[0].toLowerCase()
    const lang = LANG_ALIAS[raw] || (LANGS.includes(raw) ? raw : 'text')
    let out
    try {
      out = hl.codeToHtml(token.content, { lang, theme: THEME })
    } catch {
      out = `<pre class="shiki"><code>${escapeHtml(token.content)}</code></pre>`
    }
    const label = raw && raw !== 'text' ? `<span class="dd-code-lang">${escapeHtml(raw)}</span>` : ''
    highlighted.set(i, `<div class="dd-code">${label}${out}</div>`)
  })

  // Pass two: render, collecting headings and rewriting links.
  const toc = []
  const links = []
  const seenSlugs = new Map()
  let title = ''

  const renderer = md.renderer
  const rules = renderer.rules

  rules.fence = (toks, idx) => highlighted.get(idx) ?? ''

  rules.heading_open = (toks, idx) => {
    const tag = toks[idx].tag
    const inline = toks[idx + 1]
    const text = stripInline(inline.content)
    let id = slugify(text)
    // GitHub-style de-duplication, so in-page anchors stay stable.
    const seen = seenSlugs.get(id)
    if (seen !== undefined) {
      seenSlugs.set(id, seen + 1)
      id = `${id}-${seen + 1}`
    } else {
      seenSlugs.set(id, 0)
    }
    if (tag === 'h1' && !title) title = text
    if (tag === 'h2' || tag === 'h3') toc.push({ id, text, level: Number(tag.slice(1)) })
    return `<${tag} id="${id}"><a class="dd-anchor" href="#${id}" aria-hidden="true">#</a>`
  }

  rules.link_open = (toks, idx, options, env, self) => {
    const token = toks[idx]
    const href = token.attrGet('href')
    const next = rewriter.rewrite(href)
    if (next !== href) token.attrSet('href', next)
    links.push(next)
    if (/^https?:/i.test(next)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener')
    }
    return self.renderToken(toks, idx, options)
  }

  rules.image = (toks, idx, options, env, self) => {
    const token = toks[idx]
    const src = token.attrGet('src')
    token.attrSet('src', rewriter.rewrite(src))
    token.attrSet('loading', 'lazy')
    return self.renderToken(toks, idx, options)
  }

  rules.table_open = () => '<div class="dd-table-wrap"><table>'
  rules.table_close = () => '</table></div>'

  const html = renderer.render(tokens, md.options, {})

  return { html, title, toc, links, unresolved: rewriter.unresolved }
}
