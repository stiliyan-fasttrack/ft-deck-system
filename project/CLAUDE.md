# PP_AI — Fast Track deck system (workspace)

Goal: recreate Fast Track strategy decks from data in the visual system of `TMC FINAL 17.7.26 TEAM PRESENTATION.pptx`,
as editable PowerPoint, built by agents. **The system lives in the global skill `~/.claude/skills/ft-deck/`** — read its
`SKILL.md` first; this folder is the worked example and media staging.

## Layout
- `TMC FINAL 17.7.26 TEAM PRESENTATION.pptx` — the reference (51 slides). `TMC Price, message and packaging maps.pptx` — a dense analytic deck, NOT the target style.
- `maps-ft.json` → `out/maps-ft.pptx` — the dense "Price, message, packaging maps" deck transformed to the FT way: 56 content slides + 5 Morph start-states, click reveals, chart builds, brand-library photos (`assets/brand/`), reviewed by the Sonnet core-message + Opus art-director pass (`reviews/`).
- `tmc-sample.json` → `out/tmc-sample.pptx` — 26 reference slides rebuilt from data with every archetype; `out/render/` = PNG per slide + sheets.
- `assets/ref-photos/` — the client's photos pulled from the reference (TMC only); `assets/icons/` logo + pictogram source.
- `media/higgsfield/` — generated: `market-earth.png`, `persona-mirror.png`, `bed-dark-ambient.(wav|mp3)`, `sfx-whoosh.(wav|mp3)`, `vo-market.mp3`, `manifest.json` (5.7 credits, 2026-10-07).
- `media/hf/market-growth/` — HyperFrames animated infographic (2026 0,7$ B → 2030 1,2$ B) → `renders/market-growth.mp4` + poster, used as a video chapter slide.
- `.venv/` (python-pptx, markitdown, fonttools) · `node_modules/` (pptxgenjs, sharp) — the skill's scripts carry their own deps too.

## Commands
```bash
node ~/.claude/skills/ft-deck/scripts/build_deck.js tmc-sample.json          # → out/tmc-sample.pptx
bash ~/.claude/skills/ft-deck/scripts/render.sh out/tmc-sample.pptx out/render # LibreOffice → PNG + sheets
.venv/bin/python ~/.claude/skills/ft-deck/scripts/check_deck.py out/tmc-sample.pptx
.venv/bin/python ~/.claude/skills/pptx/scripts/office/validate.py out/tmc-sample.pptx
```
Fonts: Plaak 3 Pradel / Riforma LL / ABC Monument Grotesk Mono are licensed and installed in ~/Library/Fonts (and copied
into LibreOffice by `install_fonts.sh`). Write the macOS family names (`Plaak 3 Pradel`, not "…Regular"), never the reference's "Plaak 3 Trial"; the engine embeds the three fonts into every PPTX.
