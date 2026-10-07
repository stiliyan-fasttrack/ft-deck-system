# Slide archetypes — `deck.json` → `scripts/build_deck.js`

Every slide is `{ "type": "<archetype>", ...options }`. Common options on any slide: `section` (starts a PowerPoint
section), `notes` (speaker notes — put the explanation here, not on the slide), `audio` (voice-over file placed as a
small media icon bottom-right), `bare` (no top/right rules). Inline markup in any string: `*text*` = yellow run;
arrays of strings = separate lines. Paths resolve against the deck.json folder, then the skill's `assets/`.
Geometry is inches on a 13.333 × 7.5 canvas; the numbers below are the reference slide they copy.

| type | copies ref slide | required | optional | what it draws |
|---|---|---|---|---|
| `cover` | 1 | `date`, `title` (2 lines, 2nd `*yellow*`) | `image` (photo right, faded), `dim`, `size` (115) | mono date tag at y 3.6, Plaak 115 title from y 4.3 |
| `chapter` | 2, 16, 23 | `title` | `image` or `video`+`poster`, `dim`, `size` (166), `y` (top-anchor), `sub` | full-bleed media + giant title bottom-left; `y` set → title top-anchored (use for 3–4 line titles at 115–138) |
| `statement` | 37, 42, 44 | `title` (lines) | `size`, `y` | chapter without media |
| `stat-bubble` | 4, 12 | `year`, `value` | `image`, `variant` `grey`/`dark`, `cx cy d`, `size` (138), `side` (88 pt text right) | one circle with mono year + Plaak value over a map/photo |
| `before-after` | 5 | `from{year,value}`, `to{year,value}` | `unit` | grey circle → 5 arrows → ringed black circle, target in yellow 166 |
| `stat-list` | 6 | `rows[{value,label}]` (≤ 4) | `badge{year,value}`, `size` (100) | yellow Plaak numbers + Riforma 44 labels, hairlines between |
| `bar` | 7, 8, 11 | `title`, `categories`, `values` | `dir` `col`/`bar`, `highlight` [idx] (default last), `formatCode` (`0"$"`, `0.0"%"`), `valueSize` (66), `catSize` (24), `gap`, `max`, `image`, `dim`, `icons` [paths under each bar], `frame` idx (red dashed frame) | native bar chart, grey vs yellow, labels outEnd, axis hidden |
| `hero-number` | 9 | `value` | `pictograms` (true), `cols` (20), `rows` (4), `pictoColor`, `image`, `size` (287), `color`, `label`, `x y` | giant number over a pictogram wall |
| `pie-hero` | 10 | `value`, `share` (0–1) | `label` (88 pt right), `image`, `explode` (2) | 2-slice pie, value inside, share % on the sliver |
| `pie` | 13, 14, 15, 32–36 | `title`, `labels`, `values` | `badge{year,value}`, `highlight` N or [idx], `explode` %, `format` (`{v}$`, `{p}%`), `labelSize` (28), `valueSize` (36), `ring` (true/1.12), `labelRadius` (1.14), `image` (top-right 3.6×2.2), `icons[{src,x,y,w,h}]`, `x y w h`, `valueLabels`, `catLabels`, `unit` | labelled pie; value labels inside by angle, category labels outside, tiny slices pushed out in steps |
| `segment-strip` | 17 | `panels[{image,label}]` | — | N portrait panels + Plaak 24 labels |
| `score-grid` | 18–22 | `columns`, `rows[{image,scores,score,highlight}]` | `weights`, `scoreLabel`, `lines` | attractiveness index; `scores` null → empty bordered cells (progressive build) |
| `pie-callout` | 24–30 | `title`, `labels`, `values` | `callout` [heading, line, line] (→ yellow ellipse + connector lines, pie shrinks to top-left), `highlight`, `explode` (8), `format`, `catLabels`, `image`, `unit` | share-of-whole pie with the key segment's economics called out |
| `segment-divider` | 31, 34 | `title` (lines, `*yellow*`) | `image`, `stats` [heading, …] (grey bubble), `size` (96) | segment chapter card with persona photo |
| `table` | 38–41, 43 | `title`, `rows[[label, v1, v2, …]]` | `columns`, `chip` `dark`/`white`, `totalColumn`, `footer` [label, …, total] (yellow bar), `valueSize` (32), `chipW`, `colX`, `image` | chips + value columns; `%` values auto-Plaak-yellow, `$` values Riforma white |
| `list-3` | 46, 50 | `title`, `sections[{head,items}]` | `image` (left 3.71×6.36), `itemSize` (22) | pains / needs / gains |
| `claim-bars` | 47, 48, 51 | `title`, `rows[{label,text,claimed}]` | `note` (lines, `*yellow*`) | solid grey = claimed %, dashed yellow = white space |
| `svg` | — | `src` | `title`, `x y w h` | any SVG (HyperFrames snapshot, hand-written infographic) rasterised at 3× and placed |
| `custom` | — | `elements[]` | — | raw primitives: `{text,x,y,w,h,font:'display'|'text'|'mono',fontSize,color,align}`, `{circle,cx,cy,d,fill,line}`, `{line,x1,y1,x2,y2,width,arrow}`, `{rect,x,y,w,h,fill,line,dash}`, `{image,x,y,w,h}`, `{pie,…}`, `{bar,…}` |

## Rules the archetypes enforce (and you must keep when using `custom`)
- One highlighted (yellow) element per slide. Highlight = the thing the title claims.
- Numbers in Plaak, labels in Riforma, years in Mono. Number ≥ 2× its label size.
- ≤ 20 words on a slide unless it is a table; the build warns above 60; `check_deck.py` flags > 30.
- Photos: `dim` 40–70, fade from the text side; never a bright photo behind text.
- Pies: ≤ 8 slices readable; more → group into "Other" or use `valueLabels:false` + `explode` 12 (slides 32–36).
- Charts stay native (editable). Only SVG/PNG for things PowerPoint cannot chart (maps, pictograms, flows).

## Worked example
`templates/tmc-sample.json` rebuilds 24 of the 51 reference slides from data with these archetypes; rendered result in
`thumbs/rebuilt-sheet-0.png` / `-1.png`, reference in `thumbs/tmc-NN.png` and `thumbs/archetype-sheet.png`.

## Added 2026-10-07 (second worked example: the dense "Price, message, packaging maps" deck → 41 FT slides, `templates/maps-ft.json`)
- `stat-list` now takes up to 6 rows, `size`/`labelSize`/`valueW`, a `title`, works without `badge` (numbers start at x 0.4), and each row may carry `sub` (grey explanation; label+sub flow in one box). Use it for numbered conclusions ("01" … "06", 3 per slide) and A/B options.
- `versus`: `left{label,value,sub}` (grey) vs `right{label,value,sub}` (ringed, yellow = the subject), `note`. Comparisons like engagement 11.5% vs 0.05%.
- `table` extras: `chipSize`, `colWs` [per-column widths] + `colX`, `highlightRows` [idx] (yellow chip), `displayCols`; short `%` values go Plaak-yellow automatically, sentences stay Riforma.
- Transform recipe for a dense deck: each source slide → (claim as title with one `*yellow*` phrase) + ONE of: bar (lists of prices), table (brand × attribute, ≤ 18 pt), stat-list (numbered conclusions, 3 per slide), versus (one comparison), statement/chapter with a brand photo. Source prose → `notes`. 24 dense slides became 41 FT slides.

## Click reveals (added 2026-10-07 — Kristian: "introduce animation on click to show different ideas")
Default ON. Every idea-level element appears on its own click with a 400 ms fade (PowerPoint entrance "Fade", standard
`<p:timing>` main sequence written by the engine after pptxgenjs): stat-list rows, table rows (header stays), list-3
sections, claim-bars rows (+ note), versus left → right → note, before-after circle → arrows → target, pie-callout
pie → callout, score-grid rows, segment-strip panels, hero-number value. Titles, badges, photos, charts on `bar`/`pie`
slides stay static. Switch off per deck `meta.animate: false` or per slide `"animate": false` (print/PDF handouts
show the final state either way; LibreOffice renders the final state). Implementation: helpers tag shapes
`objectName = "anim:<click>:…"` while `reveal(click, fn)` runs; the post-process groups by click number.

## Dense-content rule (same date — "do not cut text on text-heavy slides, split the messages")
Keep the source text verbatim in tables and stat-list `sub` lines; split instead of trimming: ≤ 3 rows per table slide
at 18–20 pt (`(1 of 2)` in the title), 3 numbered items per stat-list. Each row = one click.

## Added 2026-10-07 (evening): so-what line, Morph, chart builds
- Any slide may carry `sowhat` (string, `*yellow*` allowed): a Riforma 22 line in the bottom band, revealed on the last
  click; tables, stat-lists, list-3 and bars leave room for it automatically.
- **Morph** (`meta.morph`, per-slide `morph:false`): `before-after`, `versus`, `stat-bubble`, `hero-number`, `claim-bars`,
  `pie-callout` get an auto-generated start-state twin slide (tiny circles, arrow stubs, 60-pt number, empty bars)
  and a PowerPoint Morph transition (1.2 s) into the final slide — circles grow, arrows draw, numbers scale, bars
  fill. Shapes are paired by `!!mN.` names. Morph slides have no click groups (the morph is the animation). Older
  PowerPoint falls back to a fade. Print/PDF shows both states; hide the start slide before printing if unwanted.
- **Bars under Morph** are drawn as rectangles + text (`shapeBars`) so the start-state slide morphs them growing
  from zero; `"shapes": false` on a `bar` slide (or custom element) keeps a native chart instead. Native charts
  (pies, opted-out bars) get a whole-chart entrance on click 1 (bars wipe, pies wheel). Per-category builds are NOT
  used: PowerPoint for Mac flags them for repair (pitfalls.md).
- `check_titles.py deck.json`: core-message lint (see design-system §11); `title_ok: true` exempts a slide.

## Variety (added 2026-10-07 night — Kristian: "the skill should not produce monotonous slides, they look too same")
- `stat-list.layout`: `rows` (default) · `cards` (2–4 numbers across, number on top, label + grey sub under; one card per
  click) · `photo` (rows on the left two thirds, `image` on the right third with the fade) · `bigrows` (≤ 3 rows, 100-pt
  values). `table.image` and `list-3.image` give those a photo side too.
- `quote`: `{brand, quote, proof, speaks, highlight, image}` — one brand, one line in big Plaak with the chip; the
  emotional evidence slide for message chapters (use for the client and one exemplar; the rest stay in tables).
- **Auto-vary** (`meta.autoVary`, default on): when the same archetype runs twice, the engine alternates stat-list
  layouts (cards → photo → bigrows) and gives every second 2-column table and repeated list-3 a photo from
  `meta.photoPool` (array of paths; the reference deck recycles one persona photo per segment the same way). Explicit
  `layout` / `image` always wins. The lint reports W10 (one archetype > 50% of a chapter) and W11 (five slides without a
  photo or graphic).
