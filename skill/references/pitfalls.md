# Pitfalls (each one cost time once)

- **Font names.** The reference deck says "Plaak 3 Trial Regular" and "Monument Grotesk Mono"; the licensed files
  installed here are family `Plaak 3 Pradel` (macOS family name — `system_profiler SPFontsDataType` → Family; the OTF nameID 1 "Plaak 3 Pradel Regular" is NOT what PowerPoint matches) and `ABC Monument Grotesk Mono`. Write the macOS family names or
  PowerPoint silently substitutes. Riforma LL = `Riforma LL`.
- **LibreOffice renders serif fallbacks** when it cannot find a face; its private font dir is
  `/Applications/LibreOffice.app/Contents/Resources/fonts/truetype` — `scripts/install_fonts.sh` copies the three
  faces there (one-time). Also strip embedded `.fntdata` fonts from a reference copy before rendering
  (`EOT out of spec` noise) — or just ignore the warning.
- **pptxgenjs:** colours without `#`; one `new pptxgen()` per file; `LAYOUT_WIDE` = 13.333 × 7.5; `margin: 0` on every
  text box that must align with shapes; no gradient fills (the engine fakes the photo fade with a cached PNG);
  no pie explosion option (the engine injects `<c:explosion>` into `ppt/charts/chartN.xml` after writing — chart files
  are numbered in creation order); `dataLabelPosition: 'outEnd'` corrupts stacked bars; `layout:{x:0,y:0,w:1,h:1}`
  makes the pie fill its frame so angle-based label placement is exact.
- **Plaak is condensed and caps-only** — 115 pt titles fit two words per 6 in; line spacing 0.82 or lines collide/clip.
  Four-line statements at 138 pt do not fit; use 128 or three lines.
- **Pie with > 8 slices**: outside labels pile up at the top; the engine staggers tiny slices but prefer grouping.
- **`sizing: 'cover'` on photos** crops to the box; on persona photos keep the face in the right third (the fade
  covers the left).
- **Words.** Agents drift to 40-word slides. The reference median is 8. The build warns > 60, the lint flags > 30.
  Move prose to `notes`.
- **Video in PPTX:** H.264 + yuv420p only; a poster PNG avoids a black first frame. LibreOffice renders the poster.
- **Audio autoplay** cannot be set by pptxgenjs; colleagues set "Start automatically" in PowerPoint if needed.
- **`timeout` is not on macOS.** Agents: every shell command < 150 s or they are killed as stalled.
- **Reference photos are the client's** (TMC): fine for internal demos, not for other clients' decks — generate with Higgsfield.
- **Embed the fonts.** The reference deck ships its fonts as EOT in `ppt/fonts/*.fntdata` + `<p:embeddedFontLst>` +
  `embedTrueTypeFonts="1"`. The engine does the same (ttf2eot, `meta.embedFonts` default true) so a colleague without
  the licensed faces still sees Plaak/Riforma/Mono. Proven by the alias test: `meta.fontAlias` renames every typeface
  to a non-existent name and the render still shows the right glyphs.
- **PowerPoint AppleScript** `save … as save as PNG` fails (-50) on this build; QA renders stay on LibreOffice.
- **Animations:** pptxgenjs has none; the engine writes PowerPoint's own `<p:timing>` structure (tmRoot → mainSeq →
  one `<p:par delay="indefinite">` per click → clickEffect/withEffect fade). `<p:bldP>` only for `<p:sp>` targets;
  pictures/charts animate as whole objects. `validate.py` checks it against pml.xsd. A local `const step` in `A.table`
  once shadowed the reveal helper → named `reveal` now.
- **PowerPoint "found a problem… Repair"** with a deck that passes XSD validation and renders in LibreOffice: it was the
  chart build-by-category animation (`<p:graphicEl><p:chart type="category"…/>` targets). PowerPoint for Mac repairs
  the file whatever the nesting. Native charts now get a whole-chart entrance (wipe / wheel) + `bldChart allAtOnce`;
  bar charts become Morph-grown rectangles when Morph is on (`shapes:false` keeps a native chart). Always run
  `scripts/probe_powerpoint.sh deck.pptx` before handing a deck over — it is the only check that catches this.
- **Bisecting a Repair:** `FT_NO_MORPH=1`, `FT_NO_CHARTBUILD=1`, `FT_CB=category|whole|nobld` env switches on
  `build_deck.js` build variants; `probe_powerpoint.sh` tells which one PowerPoint accepts.
