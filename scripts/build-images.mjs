// Generates the responsive portrait variants that Portrait.tsx renders.
//
// The master in assets-src/ is 2582x2333 at ~1.9 MB. It used to sit in public/
// and get served as-is, which made it the LCP element and put the root page at
// 13s in Cloudflare RUM. Nothing on the page ever shows it above about 450 CSS
// px wide, so the whole file was a rounding error away from pure waste.
//
// Widths are chosen from what the layout actually asks for. The hero grid is
// `1.4fr 1fr` inside a 1240px container with 56px padding and a 56px gap, so
// the portrait column is (1240 - 112 - 56) / 2.4 = 447 CSS px. The box is 3/4
// and object-fit is cover, so height binds: at DPR 2 that is 1192 device px
// tall, and a 1.107 aspect master has to be 1328 wide to cover it. Mobile is
// full-bleed minus 48px of padding, which on a DPR 3 phone lands slightly
// higher, hence 1660. 664 is the 1x desktop case.
//
// Output goes to public/ (gitignored, like public/dives/) so the generated
// files never enter git. portrait.duotone.jpeg keeps its exact name because
// the Open Graph, Twitter card, and schema.org tags in index.html all point at
// that URL, and a 404 there breaks every link preview of the site.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'assets-src/portrait.duotone.jpeg')
const OUT = path.join(root, 'public')

export const WIDTHS = [664, 1328, 1660]

// The name the social tags depend on. Also the <img src> fallback for anything
// that does not understand srcset.
const CANONICAL = 'portrait.duotone.jpeg'
const CANONICAL_WIDTH = 1328

const JPEG = { quality: 82, mozjpeg: true, progressive: true }
const WEBP = { quality: 80, effort: 5 }

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Images: no master at ${path.relative(root, SRC)}`)
    process.exit(1)
  }

  fs.mkdirSync(OUT, { recursive: true })
  const written = []

  for (const w of WIDTHS) {
    // withoutEnlargement guards against a future master smaller than 1660.
    const base = () => sharp(SRC).resize({ width: w, withoutEnlargement: true })
    for (const [ext, opts, fn] of [
      ['jpeg', JPEG, 'jpeg'],
      ['webp', WEBP, 'webp'],
    ]) {
      const file = path.join(OUT, `portrait-${w}.${ext}`)
      await base()[fn](opts).toFile(file)
      written.push(file)
    }
  }

  await sharp(SRC)
    .resize({ width: CANONICAL_WIDTH, withoutEnlargement: true })
    .jpeg(JPEG)
    .toFile(path.join(OUT, CANONICAL))
  written.push(path.join(OUT, CANONICAL))

  const before = fs.statSync(SRC).size
  console.log(`Images: master ${(before / 1024).toFixed(0)} KB ->`)
  for (const f of written.sort()) {
    console.log(`  ${path.relative(OUT, f).padEnd(24)} ${(fs.statSync(f).size / 1024).toFixed(1)} KB`)
  }
}

main()
