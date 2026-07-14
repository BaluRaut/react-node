# react-node

Skills roadmap to 2028 for a senior Node.js + React engineer.

**Live site:** https://baluraut.github.io/react-node/

## Files
- [`skills-2028-roadmap.md`](skills-2028-roadmap.md) — the **source of truth**. Edit this.
- [`build.js`](build.js) — parses the markdown and regenerates the styled page.
- [`index.html`](index.html) — the hosted page (generated — don't hand-edit).

## How updates work
Edit `skills-2028-roadmap.md` and push to `main`. A GitHub Action
([`.github/workflows/build.yml`](.github/workflows/build.yml)) runs `node build.js`,
regenerates `index.html`, commits it, and GitHub Pages redeploys automatically.

To rebuild locally:

```bash
node build.js
```
