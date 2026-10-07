# FLOW — from data to a client-ready Fast Track deck

Roles: **you** (lead: brief, sign-off, review), **Claude Code** with the `ft-deck` skill (storyboard, deck.json, media,
build, QA), **PowerPoint** (final edits, presenting). Times are for a 40–60 slide deck.

| # | Step | Who | What happens | Done when |
|---|---|---|---|---|
| 0 | Intake (15 min) | you → Claude | Copy `project/` to a new folder. Put the data (xlsx/csv/md/pptx) and the brief in it. In the folder run `claude` and say: *"Use ft-deck. Client X. Data in ./data. Audience: … Build the storyboard first."* | Claude shows an "ask → where it lands" table and the chapter list. |
| 1 | Research fan-out (20 min) | Claude | Four scouts in parallel (data audit, narrative, media plan, reference match) via `scripts/workflows/research-fanout.js`. | `research.json` exists; hero numbers named. |
| 2 | Storyboard (30 min) | Claude → you | One row per slide: chapter, archetype, title as a claim, the number, data source, photo. ≤ 20 words per slide; prose → notes. | You say LOCKED (or edit the table). |
| 3 | Media (parallel) | Claude | Photos from the brand library first (`skill/references/brand-library/`), Higgsfield only for gaps (persona, product), HyperFrames for one animated infographic if the story needs it. | `media/manifest.json`. |
| 4 | Build (10 min) | Claude | `check_titles.py deck.json` → 0 hard fails; `build_deck.js`; `render.py`; `check_deck.py`; `probe_powerpoint.sh`. | Contact sheets sent to you; no Repair dialog. |
| 5 | Review (30 min) | Claude | `scripts/workflows/review-deck.js`: Sonnet core-message investigator + Opus art director (xhigh) in parallel; P1 fixes applied; `check_numbers.py` against the source. | Reports in `reviews/`; P1 list empty. |
| 6 | Your pass (20 min) | you | Open the pptx in PowerPoint, present it to yourself with clicks and Morph. Note changes as "slide N: …". | Notes back to Claude; it edits `deck.json` and rebuilds (10 s). |
| 7 | Deliver | Claude | `out/<client>-<date>.pptx` + `deck.json` + `media/manifest.json` + `HANDOFF.md` (what each slide shows, sources, known gaps, how to rebuild). | You send it. |

Manual commands if you work without Claude Code (macOS paths; Windows: `.venv\Scripts\python`, `install.ps1` put the
skill in `%USERPROFILE%\.claude\skills\ft-deck`):

```bash
S=~/.claude/skills/ft-deck/scripts
.venv/bin/python $S/check_titles.py deck.json --client TMC
node $S/build_deck.js deck.json out/deck.pptx
.venv/bin/python $S/render.py out/deck.pptx out/render
.venv/bin/python $S/check_deck.py out/deck.pptx
.venv/bin/python $S/check_numbers.py deck.json source.md
bash $S/probe_powerpoint.sh out/deck.pptx            # Windows: powershell $S\probe_powerpoint.ps1 out\deck.pptx
```

deck.json in one minute: `meta` (title, date, out, tag, photoPool, animate, morph) + `slides[]`. Each slide is
`{ "type": "<archetype>", ... }`. Types: cover, chapter, statement, hero-number, stat-bubble, before-after, stat-list
(layouts rows / cards / photo / bigrows), bar, pie, pie-hero, pie-callout, versus, quote, table, list-3, claim-bars,
score-grid, segment-strip, segment-divider, svg, custom. Inline `*text*` = yellow. Every slide may carry `notes`,
`source`, `sowhat`, `audio`, `animate:false`, `morph:false`. Full reference: `skill/references/archetypes.md`;
worked example with every type: `project/maps-ft.json`.
