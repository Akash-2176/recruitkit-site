# RecruitKit

Free JD → Boolean/X-ray search strings for US IT recruiters. Paste a requirement, get
ready strings for LinkedIn, Dice, Monster/Indeed, Google X-ray and GitHub X-ray, with
titles, skills, location and work-auth terms pulled out.

Live at **https://recruitkit.ezuraarc.com** · by [EzuraArc](https://ezuraarc.com)

## How it works

Static site, no build step, no dependencies, no backend. The whole engine is regex
tables and string assembly in [`assets/rk.js`](assets/rk.js) — nothing is uploaded,
nothing is logged, there is no API key anywhere. That's a product claim as much as an
implementation detail: the hero says "nothing uploaded", and it stays true because
there's nowhere for data to go.

| Path | What it is |
|---|---|
| `index.html` | The whole public site: tool, Submission Kit section, pricing |
| `assets/rk.js` | The engine. `SK` skill table, `TT` title map, `ST` states, `parse()`, `build()` |
| `assets/rk.css` | Design system. Dark theme, tokens on `:root`, no framework |
| `for/<firm>/` | Per-prospect pages, `noindex`, each with a role-matched sample JD and demo video |
| `test/` | Regression suite (see below) |
| `validation.md` | Which Submission Kit artifact to build — the open question |

## Tests

```
node test/run.js
```

210 checks over the six per-firm sample JDs (the inputs shown in the demo videos) plus
adversarial cases: real vendor requirement emails, missing title labels, junk text,
empty input. The harness runs the **real** `assets/rk.js` inside a minimal fake DOM
rather than a retyped copy, so the tests can't drift from what ships.

If you change a regex or a lookup table in `rk.js`, run this before pushing. The six
firm JDs are covered because those outputs appear in demo videos already sent to
prospects — if parsing changes, the videos become wrong.

## Status

The free tool is live and finished. The paid "Submission Kit" is **not built**, and the
site says so. Before building it we're asking firms which of the four artifacts —
resume reformatting, skill matrix, RTR, submission email — actually costs them the most
time. See [`validation.md`](validation.md).

## Deploying

Push to `main`. GitHub Pages serves from the branch root; the `CNAME` file pins the
custom domain. DNS is a CNAME at Dynadot: `recruitkit` → `akash-2176.github.io`.
