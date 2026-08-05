// Turns links written for GitHub into links that work on the site.
//
// The source markdown is written to be read in a repo, so it links three ways:
// to sibling docs (README.md, ../SECRETS.md), to sibling repos
// (evals-deep-dive/, or the full GitHub URL, since submodules do not resolve
// across repos), and to source files (askrepo/harness.py). Each needs a
// different destination here.
//
// Resolution depends on which doc the link was written in. `TEXTBOOK.md` inside
// a dive means that dive's textbook; the same text inside a series doc means
// the series textbook. The rule: a bare name resolves in the doc's own scope, a
// `../` name resolves in the series scope.

import { DIVE_BY_DIR, DIVE_DOCS, GITHUB_USER, REFERENCE_BY_FILE } from './catalog.mjs'

export const PARENT_REPO = 'ai-engineering-deep-dive'

// The series repo was renamed. Old links to it still appear in the source
// markdown, so accept both spellings rather than emit a dead link.
const PARENT_REPO_ALIASES = [PARENT_REPO, 'ai-deep-dives']

const DIVE_DOC_BY_FILE = new Map(DIVE_DOCS.map((d) => [d.file, d]))
const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp)$/i

function divePath(dive, file) {
  const doc = DIVE_DOC_BY_FILE.get(file)
  if (!doc) return null
  return doc.page ? `/dives/${dive.slug}/${doc.page}/` : `/dives/${dive.slug}/`
}

function referencePath(file) {
  const ref = REFERENCE_BY_FILE.get(file)
  return ref ? `/dives/reference/${ref.slug}/` : null
}

function blobUrl(repo, filePath) {
  const kind = IMAGE_EXT.test(filePath) ? 'raw' : 'blob'
  return `https://github.com/${GITHUB_USER}/${repo}/${kind}/main/${filePath}`
}

function splitFragment(href) {
  const hash = href.indexOf('#')
  if (hash === -1) return [href, '']
  return [href.slice(0, hash), href.slice(hash)]
}

// Absolute GitHub URLs that have an on-site equivalent.
function rewriteGithubUrl(url) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)(\/blob\/[^/]+\/([^?#]+))?\/?$/)
  if (!m) return null
  const [, user, repo, , filePath] = m
  if (user !== GITHUB_USER) return null

  if (PARENT_REPO_ALIASES.includes(repo)) {
    if (!filePath) return '/dives/'
    return referencePath(filePath)
  }

  const dive = DIVE_BY_DIR.get(repo)
  if (!dive) return null
  // Only the repo root has a page here. Deep links stay on GitHub, where the
  // file actually is.
  if (filePath) return null
  return `/dives/${dive.slug}/`
}

/**
 * @param {{ kind: 'dive' | 'reference', dive?: object, sourceFile: string }} ctx
 */
export function createRewriter(ctx) {
  const unresolved = []
  const repo = ctx.kind === 'dive' ? ctx.dive.dir : PARENT_REPO

  function rewrite(href) {
    if (!href) return href
    if (href.startsWith('#')) return href
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      if (href.startsWith('https://github.com/')) {
        const [base, frag] = splitFragment(href)
        const mapped = rewriteGithubUrl(base)
        if (mapped) return mapped + frag
      }
      return href
    }
    if (href.startsWith('/')) return href

    const [rawPath, frag] = splitFragment(href)
    if (!rawPath) return href

    // `../` means "up to the series root" in every doc that uses it.
    const isParentScope = rawPath.startsWith('../')
    const path = rawPath.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '')
    const trimmed = path.replace(/\/$/, '')

    // A sibling dive, by directory name: evals-deep-dive/ or
    // ../rag-deep-dive/TEXTBOOK.md
    const [head, ...rest] = trimmed.split('/')
    const targetDive = DIVE_BY_DIR.get(head)
    if (targetDive) {
      if (rest.length === 0) return `/dives/${targetDive.slug}/` + frag
      if (rest.length === 1) {
        const mapped = divePath(targetDive, rest[0])
        if (mapped) return mapped + frag
      }
      return blobUrl(targetDive.dir, rest.join('/')) + frag
    }

    const isBareFile = !trimmed.includes('/')
    if (isBareFile) {
      // In a dive, a bare doc name is that dive's own doc. With `../`, or in a
      // series doc, it is the series doc of that name.
      if (ctx.kind === 'dive' && !isParentScope) {
        const own = divePath(ctx.dive, trimmed)
        if (own) return own + frag
      }
      const ref = referencePath(trimmed)
      if (ref) return ref + frag
      if (trimmed === 'README.md') return '/dives/' + frag
    }

    // Anything left is a path in the repo the doc came from: a file, or a
    // directory the reader is being pointed at to go browse.
    const targetRepo = isParentScope ? PARENT_REPO : repo
    if (/\.[a-z0-9]+$/i.test(trimmed)) {
      return blobUrl(targetRepo, trimmed) + frag
    }
    if (rawPath.endsWith('/')) {
      return `https://github.com/${GITHUB_USER}/${targetRepo}/tree/main/${trimmed}` + frag
    }

    unresolved.push(href)
    return href
  }

  return { rewrite, unresolved }
}
