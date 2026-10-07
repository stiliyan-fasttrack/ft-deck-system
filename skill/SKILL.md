---
name: ft-deck
description: >
  Build Fast Track strategy decks as editable PowerPoint (.pptx) from data, in the exact visual system of the TMC
  final presentation (black canvas, one idea + one yellow number per slide, Plaak/Riforma/Mono type, native charts,
  dark persona photos): deck.json → build_deck.js → render → agent QA. Includes the measured design system, 19 slide
  archetypes, Higgsfield media (images, music, SFX, voice-over) and HyperFrames animated infographics as video slides,
  plus Workflow templates for parallel chapter agents. Use whenever the user wants a Fast Track / TMC-style deck, says
  "make the presentation", "put this data into slides", "like the final TMC deck", asks for infographics in PowerPoint,
  or wants a reference deck analysed into a reusable system.
---

# ft-deck — data → Fast Track deck, built by agents, edited by colleagues

One deliverable: **a .pptx that looks like `TMC FINAL 17.7.26 TEAM PRESENTATION.pptx`** — same chrome, palette, type,
density, chart recipe — generated from a `deck.json` so the numbers come from data and every slide stays native and
editable in PowerPoint. The measured system is `references/design-system.md`; the slide vocabulary is
`references/archetypes.md`; the engine is `scripts/build_deck.js`. Worked example: `templates/tmc-sample.json` (24 of
the 51 reference slides rebuilt; renders in `references/thumbs/rebuilt-sheet-*.png`).

You are the **lead**: intake, storyboard, orchestrate, read renders, give verdicts. Agents author `deck.json` slices
and media; the engine builds; LibreOffice renders; you (or checkers) READ the PNGs. Terse user: decide and show.

## Tool decision (asked once, answered here)
PowerPoint stays the format (colleagues edit). Native charts for everything PowerPoint can chart. SVG/PNG only for
maps, pictograms, flows (`svg` archetype). HyperFrames only for animated infographics exported as MP4 video slides
and for SVG snapshots. Higgsfield for photos, music bed, SFX, voice-over. Better tools exist for each piece in
isolation (Figma for layout, Remotion for motion) but none keeps the output editable in PowerPoint — this stack does.

## The user's touchpoints (everything else is yours)
1. **Data + ask**: files or numbers, the client, the date, what changed since the last deck.
2. **Storyboard sign-off**: the chapter/slide table (archetype + the one number per slide) before any build.
3. **Draft review**: contact sheets after the first build; notes → fix round. Media spend (Higgsfield credits) stated up front.

## Phase map (gates must be true before the next phase)
### 0. Intake
Read the brief + data. Build the "Ask → where it lands" table. If a reference deck is given, run
`scripts/analyze_deck.py ref.pptx` and `scripts/render.sh ref.pptx` and READ the sheets. **Gate:** data located, units
understood, chapter list drafted.
### 1. Research fan-out (`scripts/workflows/research-fanout.js`, parallel, read-only)
Scouts: data audit (gaps, units, hero numbers) · narrative (chapters → claims → numbers) · media plan (photos, video,
VO, with prompts) · reference match (archetype per slide). **Gate:** `research.json` with all four blocks.
### 2. Storyboard (lead writes; user signs)
One row per slide: chapter · archetype · title (≤ 8 words, one `*yellow*` word) · the number · data source · media.
Apply the chapter pattern **card → hero number → context chart → breakdown → so-what**. Progressive builds for
tables/grids. ≤ 20 words per slide; prose → `notes`. **Gate:** storyboard LOCKED by the user.
### 3. Media (`references/media.md`)
Higgsfield: one image per chapter + per persona, VO lines (one per chapter max), optional bed; manifest with credits.
HyperFrames: at most one or two animated infographics (count-up, growth arrows) → MP4 + poster. Agents build these
in `media/`; nothing blocks the slide build (slides take a still until the video lands). **Gate:** manifest exists;
every storyboard media cell points at a file.
### 4. Build (`scripts/workflows/build-chapters.js` → lead merges → `build_deck.js`)
One agent per chapter writes `chapters/<id>.json` (array of slides, archetypes only; `custom` needs a reason).
Lead concatenates into `deck.json`, runs `check_titles.py deck.json` (0 hard fails), then `node ~/.claude/skills/ft-deck/scripts/build_deck.js deck.json`, then
`bash …/render.sh out/deck.pptx` and `python …/check_deck.py out/deck.pptx`. Send the sheets to the user at once.
**Gate:** build has 0 WARN lines you cannot explain, lint 0 hard, `probe_powerpoint.sh` reports no Repair dialog.
### 5. Review (`scripts/workflows/review-deck.js`) + verify/fix (`scripts/workflows/verify-and-fix.js`)
Two reviewers on the rendered deck, in parallel, before any client sees it: a **Sonnet core-message investigator**
(per slide: message present / weak / missing, the sentence it should carry, exact JSON fix, source line) and an
**Opus art director at `effort: xhigh`** (flow, core message, emotion, data, logic; P1/P2/P3). Stage
`reviews/slide-map.md`, the source text and the renders first. Lead applies the fixes, re-runs `check_titles.py`,
rebuilds. Example output: `references/review-core-message-example.md`.
One checker per chapter READS its slide PNGs: one idea/one yellow, no clipping, numbers = data, ≤ 20 words, photos
dark. Failing chapters get a fixer that edits only its JSON slice; lead rebuilds. Max 2 rounds. **Gate:** all pass.
### 6. Deliver
`out/<client>-<date>.pptx` + `deck.json` + `media/manifest.json` + a HANDOFF.md (what each slide shows, data sources,
known gaps, how to rebuild). Tell the user the gaps in plain words.

## Hard rules
- **Every slide states its message at full size.** Title = claim, not topic: subject + verb + number-or-contrast + what it
  means for the client ("Price does not predict sales; deep discounts cost margin", never "Six conclusions on price").
  Split series get a different claim per slide. Chapter `sub` = the chapter's claim. Every chapter ends on a "What this
  means for <client>" slide. Notes may add evidence, never hold the only copy of a claim or a caveat. Run
  `scripts/check_titles.py deck.json` before any build; 0 hard fails is the gate (Sonnet review 2026-10-07: 9 of 47 slides
  carried their message — the rest were topics with the so-what in notes).
- **The headline survives its own rows; one yellow names the highlight; each chapter opens on the client's number;
  numbers reconcile both ways (`check_numbers.py`); the deck ends on a decision slide.** Full text: design-system §12.
- **Never monotonous.** ≤ 50 % of a chapter in one archetype, never five slides without a photo/graphic; set
  `meta.photoPool` and let auto-vary alternate layouts (design-system §13; lint W10/W11).
- **Density is the brand.** Median 8 words; one highlighted number; never a text-only slide. Split, do not shrink.
- **Yellow means "this".** One yellow idea per slide; grey = context; white = labels. No other accent colours (the
  single red dashed frame in the reference is the exception that proves it).
- **Native first.** Charts, tables, shapes as PowerPoint objects. Images only for photos, maps, pictograms, videos.
- **Fonts by macOS family name** (`Plaak 3 Pradel`, `Riforma LL`, `ABC Monument Grotesk Mono`) and always embedded (EOT, like the reference); render via
  LibreOffice only after `install_fonts.sh`.
- **Numbers from data, never typed twice.** deck.json is the single source; the build log lists every chart.
- **Agents < 150 s per shell command**, read-only outside their slice, no credentials; Higgsfield spend stated and
  logged; client photos only for that client.
- **Read the renders.** No verdict on an agent's word; the lead looks at the sheets before the user does.

## References and scripts
| File | Read when |
|---|---|
| `references/design-system.md` | before any storyboard: canvas, chrome, palette, type scale, density, chart recipe, narrative skeleton |
| `references/archetypes.md` | writing deck.json: every type, its options, the reference slide it copies |
| `references/media.md` | phase 3: Higgsfield commands that worked + costs; HyperFrames video/SVG recipe; placement |
| `references/pitfalls.md` | before prompting agents or touching the engine |
| `references/thumbs/` | reference renders (`tmc-NN.png`, `archetype-sheet.png`) and the rebuilt sample |
| `scripts/build_deck.js deck.json [out]` | the engine (needs its own `npm i` once — done) |
| `scripts/render.sh deck.pptx [dir]` | PDF + PNG per slide + sheets (LibreOffice headless, macOS) |
| `scripts/render.py deck.pptx [dir]` | same, cross-platform (LibreOffice + PyMuPDF + Pillow; Windows too) |
| `scripts/probe_powerpoint.ps1 deck.pptx` | Windows twin of the Repair probe (PowerPoint COM) |
| `scripts/check_deck.py deck.pptx` | density/geometry lint (python-pptx in the project venv) |
| `scripts/check_titles.py deck.json [--client X]` | core-message lint: topic titles (T1–T6), repeated titles, yellow ≠ highlight (W7), archetype streaks (W8), chapter without a hero number (W9), chapter without a so-what, client only in notes |
| `scripts/probe_powerpoint.sh deck.pptx` | opens in PowerPoint, reports whether the Repair dialog appeared (XSD + LibreOffice miss this); run before every hand-over |
| `scripts/check_numbers.py deck.json source.md` | number fidelity both ways: source numbers missing from the deck, deck numbers absent from the source |
| `scripts/analyze_deck.py ref.pptx [--geometry]` | inventory a new reference deck |
| `scripts/install_fonts.sh` | one-time: brand fonts into LibreOffice |
| `scripts/workflows/*.js` | Workflow tool templates (research-fanout, build-chapters, review-deck, verify-and-fix) |
