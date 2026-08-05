// Copies the deep-dive markdown out of the DeepDives checkout into content/.
//
// The copied markdown is committed to this repo so the site build never depends
// on 18 nested submodules being present. Run this whenever a dive changes:
//
//   npm run sync:dives
//   npm run sync:dives -- --source ../elsewhere/DeepDives

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DIVES, DIVE_DOCS, REFERENCE, SOURCE_ROOT } from './dives/catalog.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'content')

function sourceRoot() {
  const flag = process.argv.indexOf('--source')
  const raw = flag !== -1 ? process.argv[flag + 1] : SOURCE_ROOT
  return path.resolve(root, raw)
}

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.writeFileSync(to, fs.readFileSync(from, 'utf-8'))
}

function main() {
  const src = sourceRoot()
  if (!fs.existsSync(src)) {
    console.error(`No DeepDives checkout at ${src}`)
    console.error('Pass one with: npm run sync:dives -- --source <path>')
    process.exit(1)
  }

  fs.rmSync(contentDir, { recursive: true, force: true })

  let copied = 0
  const missing = []

  for (const dive of DIVES) {
    const diveSrc = path.join(src, dive.dir)
    if (!fs.existsSync(diveSrc)) {
      missing.push(dive.dir)
      continue
    }
    for (const doc of DIVE_DOCS) {
      const from = path.join(diveSrc, doc.file)
      if (!fs.existsSync(from)) continue
      copy(from, path.join(contentDir, 'dives', dive.slug, doc.file))
      copied++
    }
  }

  // The series README is not a page of its own (the index replaces it), but the
  // index takes its opening lines from here so the two cannot drift.
  const seriesReadme = path.join(src, 'README.md')
  if (fs.existsSync(seriesReadme)) {
    copy(seriesReadme, path.join(contentDir, 'series-readme.md'))
    copied++
  } else {
    missing.push('README.md')
  }

  for (const ref of REFERENCE) {
    const from = path.join(src, ref.file)
    if (!fs.existsSync(from)) {
      missing.push(ref.file)
      continue
    }
    copy(from, path.join(contentDir, 'reference', ref.file))
    copied++
  }

  console.log(`Synced ${copied} markdown files from ${src}`)
  if (missing.length) {
    console.error(`Missing from the source checkout: ${missing.join(', ')}`)
    process.exit(1)
  }
}

main()
