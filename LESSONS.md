# Lessons

## 2026-09-10 — sitemap lastmod dates commit one build behind

Expected: a build that only touched the homepage would leave the other 40
sitemap entries alone.

What happened: 40 of them moved forward by up to three weeks. `lastmod()` in
`scripts/build-dives.mjs` reads the last commit date of each source file, so a
sitemap generated *before* its content commit lands records the previous commit
date. Regenerating the sitemap and committing it in the same breath as the
content it describes always dates it one commit behind, and the correction only
shows up on the next unrelated build.

Next time: commit the content first, then run the build, then commit the
sitemap. The dates are only right when git already knows about the change.

## 2026-09-05 — the site has four kinds of page, and only two go through a template

Expected: adding an analytics beacon meant editing one or two head templates,
`index.html` for the React shell and `head()` in `scripts/dives/layout.mjs` for
the generated pages.

What happened: that misses the hand-written HTML under `public/writing/` and
`public/no-twitter/`. Those files are copied into `dist/` verbatim, so no build
step touches them and no template owns them. Editing templates would have left
three pages silently unmeasured, including both essays, which are the pages most
likely to be linked from outside.

Next time: for anything that has to appear on every page, walk `dist/` after the
build instead of editing templates. The output is where the four page types
finally look the same. `scripts/inject-analytics.mjs` does this, and it exits
non-zero if it finds a page with no `</head>` rather than skipping it quietly.

## 2026-09-05 — a month of traffic numbers that nothing was measuring

Expected: a traffic spike could be attributed to specific pages from analytics.

What happened: the site has never had an analytics script. The only numbers
available were Cloudflare's edge request counts, which include every crawler.
The site publishes 107 URLs of AI-engineering content with `Allow: /` and no
rules for GPTBot, ClaudeBot, or PerplexityBot, so an unknown and probably large
share of the count was bots. 10,000 views over 2,000 visitors is 5 pages per
visitor, which is high for humans and ordinary for something working through a
sitemap.

Next time: install measurement before the content that needs measuring, not
after. A month of traffic with no way to attribute it is a month of data lost.

## Cloudflare Pages `_headers` merges rules instead of ranking them

Expected the usual most-specific-wins behaviour, and wrote a `/*` catch-all
setting `Cache-Control: public, max-age=0, must-revalidate` for HTML alongside
`/assets/*` and `/fonts/*` set to `immutable`.

Pages does neither most-specific-wins nor last-match-wins. The docs say an
incoming request matching several patterns "will inherit all rules' headers",
and "if a header is applied twice in the `_headers` file, the values are joined
with a comma separator". The immutable assets would have been served
`Cache-Control: public, max-age=31536000, immutable, public, max-age=0,
must-revalidate`.

Next time: treat `_headers` patterns as a set union, not a cascade. Any header
name that appears under two patterns capable of matching the same path is a
bug. The catch-all may only carry headers no other rule sets. HTML needed no
rule at all, because the Pages default is already `max-age=0, must-revalidate`.

This also rules out convenience globs. `/*.png` looks harmless until Vite emits
an imported image into `/assets/`, at which point that file matches both
patterns and gets two cache policies. The favicons are listed one path at a
time for that reason.

## `fetchPriority` typechecks but react-dom 18.3.1 does not implement it

`@types/react` 18.3 has `fetchPriority` in `ImgHTMLAttributes`, so `tsc -b`
passed clean. At render time react-dom warned "React does not recognize the
`fetchPriority` prop on a DOM element" and emitted the camelCase spelling
verbatim. HTML attribute names are case-insensitive so it would probably have
worked, but it warns on every render and depends on parser leniency.

Spreading the lowercase attribute (`{...{ fetchpriority: 'high' }}`) renders a
clean `fetchpriority="high"` and still typechecks. Worth remembering that the
types and the renderer ship on separate schedules, and a green `tsc` says
nothing about whether react-dom knows an attribute.
