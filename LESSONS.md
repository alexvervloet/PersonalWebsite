# Lessons

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
