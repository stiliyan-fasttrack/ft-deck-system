# Fast Track deck visual system — the deep analysis of "TMC FINAL 17.7.26 TEAM PRESENTATION.pptx"

Reference deck: 51 slides, 16:9 (13.333 × 7.5 in), 3 masters / 5 layouts in use, 28 native charts (25 pie, 3 bar),
2 embedded MP4 backgrounds, 17 PNG + 7 JPG photos, 6 embedded fonts. Everything below was measured from the XML
(`scripts/analyze_deck.py --geometry`) and the headless renders (`references/thumbs/`), not guessed.

## 1. The idea in one line
**One black slide, one idea, one number in yellow.** Median 8 words per slide. The deck reads like a film: chapter
card → the number → the number in context (chart) → the breakdown (table) → the implication (claim bars). Text is
there to label numbers, never to explain them (explanations go to speaker notes: slides 46/50 carry the research
detail in notes, not on the slide).

## 2. Canvas and chrome (identical on every slide)
| Element | Geometry (in) | Spec |
|---|---|---|
| Canvas | 13.333 × 7.5 | fill `#000000`, no gradients, no rounded corners anywhere |
| Top rule | x 0 → 12.59, y 0.75 | white hairline (0.1 pt in the file; render at 0.5 pt) |
| Right rule | x 12.59, y 0 → 7.5 | white hairline; everything lives left of it |
| Logo | (12.79, 0.17) 0.37 × 0.42 | white "F" mark = three stacked bars (`assets/logo-f.png`) |
| Footer tag | right margin, rotated 270°, 6 pt mono, grey | "[INPUT TEXT] – KEEP SQUARE BRACKETS" placeholder = project tag |
| Title zone | (0.07, 0.14) 11.99 × 0.79 | Plaak 42 pt, white, one line, sits ON the top rule band |
| Content zone | x 0.07 → 12.33, y 0.94 → 7.3 | charts default to (0.41, 0.94) 11.3 × 6.2 |
| Unit caption | (0.07, 6.87) | "MILLION USD" Riforma 18–24 pt bottom-left when a chart has units |

Margins are tiny (0.07 in) on purpose: the hairline frame does the containing, the content runs to the edges.

## 3. Palette (hex, measured)
| Role | Hex | Where |
|---|---|---|
| Canvas | `000000` | every background; chart areas transparent |
| Text / labels | `FFFFFF` | all labels, white numbers for "now"/context |
| **Accent** | `FEF37F` (older slides `FFF469`) | THE number, the 2030 target, the chosen segment, the chosen row, "white space" dashes, the one word in a title |
| Grey light | `B2B2B2` | the "2026 / before" circle, the context bar in a 2-bar chart |
| Grey mid | `7F7F7F` / `808080` | pictogram figures, mid pie slices, stat bubble on dividers |
| Grey dark | `262626` | label chips in tables, claim bars, dark pie slices |
| Grid | `E7E6E6` | empty score-grid cells (2.5–3 pt border) |
| Pie greys | `D9D9D9 A6A6A6 7F7F7F 595959 3F3F3F 262626` | non-highlighted slices, cycled |
| Red | `C00000` | one dashed frame around INDIA on the "% buying cosmetics" bar chart (the only red in 51 slides) |

**Colour logic:** yellow = what we are talking about; grey = what it is compared with; white = labels. Never two
yellow ideas on one slide. The 2026→2030 progression is always grey → yellow.

## 4. Typography (three licensed faces, all installed in ~/Library/Fonts)
| Face | File name in ~/Library/Fonts | Family name to write in PPTX | Role |
|---|---|---|---|
| Plaak 3 Pradel (33 Regular) | `205TF-Plaak-33-Pradel-Regular.otf` | `Plaak 3 Pradel` (the macOS family name; NOT the OTF nameID-1 "Plaak 3 Pradel Regular", which PowerPoint ignores) | DISPLAY: titles, every number, section heads. Caps-only by design, condensed → huge sizes fit. The reference file names it "Plaak 3 Trial Regular" (trial copy) — write the licensed name |
| Riforma LL Regular | `RiformaLL-Regular.otf` | `Riforma LL` | TEXT: labels, bullet items, $ values in tables, pie category labels |
| ABC Monument Grotesk Mono | `ABCMonumentGroteskMono-Regular.otf` | `ABC Monument Grotesk Mono` | META: years in bubbles, "[17 JULY 2026]" date tag, weights row, footer tag. The reference writes "Monument Grotesk Mono"; the installed family is `ABC Monument Grotesk Mono` |

Garamond/Arial/Avenir appear only as theme defaults never visible. No serif anywhere (a LibreOffice render without
the fonts installed shows serif fallbacks — that is an artefact; see `pitfalls.md`).

### Type scale (pt) as used
| Plaak (display) | Riforma (text) | Mono (meta) |
|---|---|---|
| 287 hero number (slide 9 "1,5b") | 44 stat-list labels | 60 year in the big map bubble |
| 166 chapter titles, "1,2$ b" target | 36 $ values in target tables | 48 / 32 years in before-after circles |
| 138 statement titles, "0,7$ b" | 32 segment names on the segments pie | 28 date tag on the cover |
| 115 cover title | 28 pie category labels (big slices) | 18 weights row, 16 year in the small badge |
| 96–100 stat-list numbers, divider titles | 24 body bullets, chip labels, small pie labels, units | 6 footer tag |
| 88 "Using cosmetics", bubble value | 20 tiny pie labels | |
| 44 badge value, 42 slide title, 40 section heads / scores / claim % | 18 unit caption | |
| 36 table numbers, 28 column heads, 24 strip labels | | |

Rule of thumb: the number is ≥ 2× the size of its label; the label never exceeds 44 pt.

## 5. Density (counted)
| Measure | Reference |
|---|---|
| Words per slide | median 8 · 60 % of slides ≤ 12 · p80 = 23 · max 66 (summary table) |
| Numbers per slide | one hero number, or one chart with one highlighted slice/bar |
| Text-only slides | 0 (every slide has a chart, photo, shape system or giant number) |
| Bullets | only in the pains/needs/gains archetype: 3 sections × ≤ 3 bullets × ≤ 8 words |
| Sentences | 2 slides in 51 have full sentences (the "white space" conclusions), ≤ 2 sentences each |
| Progressive builds | the same slide repeated with one more element: score grid empty → weights → filled → highlighted (18→22); pie → exploded → callout → persona (24→30) |

If a slide needs more than ~20 words, split it or move the words to notes.

## 6. Numbers and units (house style, with the reference's inconsistencies resolved)
- Decimal comma in hero numbers: `0,7$ B`, `1,2$ B`, `1,5B`, `58,5`. Currency symbol AFTER the number in display sizes: `31$`, `264$`.
- Tables use `$ 33.5` (space, point) and `4%`; the reference mixes both — pick one per deck (default: hero = comma + trailing `$`; tables = `$ 33.5`).
- Years in the mono face, never in Plaak. "2030" is the target year everywhere.
- Units once per slide, bottom-left, Riforma 18 pt caps: `MILLION USD`.
- Percent signs in Plaak render small/raised (`58.5%`): intended.

## 7. Imagery
- Photos: full-bleed or half-slide, desaturated/dark, under a 40–70 % black overlay, with a horizontal black→transparent fade on the text side (gradient stops: opaque to 42 %, 32 % alpha at 71 %, 7 % at 82 %, clear at 95 %). The engine reproduces this with `photo(…, {dim, fade})`.
- Persona photos recur: one photo per segment (man checking his face in a mirror = problem-solution seekers; man fixing hair = ritual repeaters) on every slide about that segment. Consistency beats variety.
- World map: light grey continents on black (slides 3/4/9); the earth-from-orbit video (slide 2) and a hand-stacking-coins video (slide 7) as chapter backgrounds; money, Taj Mahal arch, barber-shop photos as mood.
- Pictogram walls: ~26 × 4 "man" glyphs in `7F7F7F`/`3F3F3F` (`assets/man.svg`), a giant yellow number over them.
- Icons: thin-line white product icons around the category pie; country flags under the bar chart; the Amazon logo next to the channel pie. Icons ≈ 0.8–1.6 in.
- No illustrations, no 3D, no stock-photo smiles, no gradients except the photo fade.

## 8. Charts (native PowerPoint, so colleagues can edit the data)
**Pie (25 of 28):** no legend, no title; `varyColors`; highlighted slices `FEF37F`, the rest cycled greys; black
slice borders (1.5–2 pt) or none with an explosion of 5–26 % for the breakdown pies; `firstSliceAng` 0 or 12; value
labels hand-placed as text boxes (Plaak 28–54 pt) and category names as Riforma 20–28 pt boxes around the pie; a thin
white ring circle slightly larger than the pie on the market pies; chart area transparent. A two-slice pie with the
small slice exploded 2–8 % is the "share of a whole" device (2 % use cosmetics; 511 of 1 212).
**Bar (3):** single series, grey `B2B2B2` with the target bar `FEF37F`; value labels `outEnd` in Plaak 66–115 pt;
category axis in Mono 28 pt with a thin grey axis line; value axis deleted; no gridlines; gap width 39–58 %; plot
area transparent over a dimmed photo.
**Never:** 3D, donut holes, legends, data tables, more than one series, gridlines, axis titles, rounded corners.

## 9. Slide archetypes (geometry in `archetypes.md`; thumbnails in `thumbs/`)
cover · chapter (photo/video) · statement · stat-bubble (map) · before-after (arrows) · stat-list · bar · hero-number
(pictograms) · pie-hero (share of whole) · pie (labelled, badge) · segment-strip · score-grid (progressive) ·
pie-callout (yellow ellipse) · segment-divider · table (chips) · summary table (white chips + yellow total row) ·
list-3 (pains/needs/gains) · claim-bars (white space) · custom / svg (escape hatches).

## 10. Narrative skeleton of the reference (51 slides, 7 chapters)
1. Cover (date tag + 2-line title, second line yellow)
2. THE MARKET (chapter video) → map 2026 0,7$ b → before-after 2026→2030 → stat list (44M / 31$ / 58,5) → bar avg spend → bar GM → 1,5B pictograms → 2 % use cosmetics → % buying by country → 1,2$ b 2030 → category pie → channel pie → segment pie
3. ATTRACTIVENESS INDEX (chapter) → 5 persona strip → score grid empty → + weights → + weights (2) → filled + highlighted → reordered
4. TARGET SEGMENT ECONOMICS 2030 (statement) → 6-segment pie → … (5 progressive pie-callout builds) → segment 1 callout → segment 2 callout
5. Segment deep dives (divider → category pie → channel pie) × 2
6. TMC TARGETS (statement) → 4 target tables (category/channel × 2 segments) → SUMMARY statement → summary table
7. NEEDS, PAINS, GAINS (statement) → per segment: divider → list-3 → claim bars (2–3) → conclusion

Pattern per chapter: **card → hero number → context chart → breakdown → so-what.** Reuse it for any dataset.

## 11. Every slide carries a message (added after the 2026-10-07 core-message review)
The reference deck's titles are claims with a number or a named subject: "AMAZON IS THE LEADING CHANNEL", "Problem-solution
seekers WILL SPEND THE MOST", "How many competitors claim". A transformed deck drifts into topics ("Six conclusions on
price") because the source's conclusions were shortened out of the titles. Rules:
1. **Title = claim.** Subject + verb + number or contrast + so-what for the client. ≤ 63 characters, one `*yellow*` span
   on the thing claimed. Test: read it aloud with the slide hidden; the viewer must know what to believe or do.
2. **Where the so-what lives, by archetype.** `bar`/`pie`: in the title ("…TMC stands alone at 80%"). `table`: title
   names the finding, the client's row is `highlightRows`, the verdict is `footer` or `sowhat`. Numbered `stat-list`:
   the title states what the items add up to; split series never repeat a title. `versus`: both numbers and the verdict
   in the title. `chapter`/`statement`: `sub` is the chapter's claim, not its topic. Every chapter closes on
   "What this means for <client>" (3–5 rows).
3. **Caveats that change the reading go on the slide** (≥ 16 pt), never only in notes ("six home pages were not read",
   "evidence rests on trade press").
4. **Keep the source title's second clause** when transforming ("…and they hold the margin").
5. **Never leave a number unexplained.** Data without "what it means for the client" fails even when correct.
Title formula, five rewrites from the TMC price/message/pack deck:
| Before | After |
|---|---|
| Six conclusions on price | Price does not predict sales; *deep discounts* cost margin |
| What the category maps show | Price room is *narrow*: a premium exists in three places |
| The six differences that matter | Persona brands name a man; winners name *a number* |
| Five differences between packs | Winning packs *break the black* and prove the claim |
| Trying a rival against trying TMC | Trying a rival costs Rs 59 to 149; *trying TMC, Rs 499 to 599* |
Chapter subs: "WHAT EACH BRAND CHARGES" → "TMC'S PRICE PROBLEM IS COHERENCE, NOT LEVEL".

## 12. Art-director rules (Opus review of the TMC price/message/pack deck, 2026-10-07)
1. **The headline must survive its own rows.** Any title with a relation word (predicts, only, all, every, similar,
   opposite, never, wins) is tested against every bar, row and note on the slide; one counter-example rewrites the
   title to the fact. ("Price does not predict sales; discount does" died against its own 0%-discount bars.)
2. **One yellow, the same thing twice.** The `*yellow*` run in the title names the highlighted bar, row or circle
   (the client). Concept words stay white. `check_titles.py` W7.
3. **Every chapter opens on the client's number.** Within two slides of the chapter card: a `hero-number`, `versus`
   or `before-after` with the client in yellow (W9). Stat-list `value`s hold data (80%, 524, 0.05%), ordinals on at
   most one slide per chapter. Never more than three consecutive slides of one archetype (W8).
4. **Fidelity both ways, then end on a decision.** `check_numbers.py deck.json source.md`: every source number is
   on a slide or in notes; every deck number exists in the source or is labelled as derived with its arithmetic
   (Muuchstac "13%" was an unlabelled midpoint of 10–17%). Caveats travel with their number ("claim", "needs a manual
   check", (I)). The last content slide is a decision slide with ≤ 3 asks; every non-card slide has notes.
5. **Render lint for the display face and the frame.** No `~`, `≈`, `→` in Plaak strings (the engine warns): write
   "about" / "c." and use an en dash for ranges (Plaak renders a hyphen as a minus). `versus.sub` ≤ 4 words; nothing
   below y 7.3 in; no photos with hard crop edges, legible words that compete with the title, or off-palette hues.
   INR decks keep the decimal point ("Rs 2,499" collides with the house decimal comma).
Flow pattern that passed: market → what brand power is → the data → the client's number → the pause → conclusions →
"what this means for <client>"; the deck ends on "Three decisions" + "How the evidence was collected".

## 13. Variety is part of the system
The reference deck repeats a *frame* (black, hairlines, yellow number) but never a *layout* three times running: map →
circles → stat list → bar → pictogram wall → pie → photo strip → grid. A transformed deck drifts into numbered lists.
Rules: ≤ 50 % of a chapter in one archetype; never five slides without a photo, chart, hero number or versus; every
chapter has at least one photo-bearing slide besides its card; conclusions alternate rows / cards / photo; quotes get
a `quote` slide, not only a table row. `meta.photoPool` + auto-vary enforce the floor; the author provides the ceiling.
