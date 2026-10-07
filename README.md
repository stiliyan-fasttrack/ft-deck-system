# ft-deck — Fast Track decks from data, built by Claude, edited in PowerPoint

This package turns data and a brief into a Fast Track strategy deck in the house style of the TMC final presentation:
black canvas, one idea and one yellow number per slide, Plaak / Riforma / Monument Mono type, click reveals, Morph
animations, photos from the brand library. Output is a normal `.pptx` — colleagues edit it in PowerPoint afterwards.

What is inside

| Folder | What it is |
|---|---|
| `skill/` | The `ft-deck` skill for Claude Code: the engine (`scripts/build_deck.js`), checks, renderer, the measured design system (`references/design-system.md`), 20 slide archetypes (`references/archetypes.md`), brand fonts (`assets/fonts`, Fast Track licence, internal use only), brand-library contact sheets, worked examples. |
| `project/` | A ready workspace: two finished decks (`out/maps-ft.pptx`, `out/tmc-sample.pptx`) with their sources (`maps-ft.json`, `tmc-sample.json`), the photos, generated media (Higgsfield images, voice-over, music, a HyperFrames animation), the two review reports (`reviews/`). Copy this folder to start a new deck. |
| `reference/` | The two original TMC decks the system was measured against. |
| `install.sh` / `install.ps1` | One-shot installers for macOS / Windows. |
| `FLOW.md` | The end-to-end flow for a new deck, step by step, with the prompts to give Claude Code. |

## 0. Get it

```bash
git clone https://github.com/stiliyan-fasttrack/ft-deck-system.git
cd ft-deck-system
```

Private repository — ask Kristian for access. Pull again to get engine and skill updates (`git pull`), then re-run the
installer to refresh `~/.claude/skills/ft-deck`.

## 1. Install (10 minutes, once)

macOS — open Terminal in this folder:

```bash
bash install.sh
```

Windows 10/11 — open PowerShell in this folder:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\install.ps1
```

Both installers put Node.js, Python 3, LibreOffice (headless rendering for QA) and the three fonts on the machine,
copy the skill to `~/.claude/skills/ft-deck`, install its packages, create `project/.venv`, and build a smoke-test deck
(`project/out/smoke-test.pptx`). If that file opens in PowerPoint without a "Repair" prompt, you are done.

Optional, for the agent flow: Claude Code (`npm install -g @anthropic-ai/claude-code`, then `claude` inside
`project/`). It finds the skill in `~/.claude/skills` by itself; say "use ft-deck" or just describe the deck you want.

## 2. Make a deck — the short version

1. Copy `project/` to a new folder, put your data files in it, pick photos from the brand library (contact sheets in
   `skill/references/brand-library/`, source folder on OneDrive: `Fast Track Ltd.'s files - Brand/3. Assets/Images`).
2. Write `deck.json` (one object per slide, see `maps-ft.json` and `skill/references/archetypes.md`), or let Claude Code
   write it: open `claude` in the folder and say what the deck is for and where the data is.
3. Check, build, render, probe:

```bash
# macOS (inside the project folder; on Windows use .venv\Scripts\python and the .ps1 probe)
.venv/bin/python ~/.claude/skills/ft-deck/scripts/check_titles.py deck.json      # titles are claims, not topics
node ~/.claude/skills/ft-deck/scripts/build_deck.js deck.json                    # → out/deck.pptx
.venv/bin/python ~/.claude/skills/ft-deck/scripts/render.py out/deck.pptx        # PNG per slide + contact sheets
.venv/bin/python ~/.claude/skills/ft-deck/scripts/check_deck.py out/deck.pptx    # density / geometry lint
bash ~/.claude/skills/ft-deck/scripts/probe_powerpoint.sh out/deck.pptx          # opens in PowerPoint, reports Repair
```

4. Open `out/deck.pptx` in PowerPoint. Every row or idea appears on a click; graphic slides morph from a start-state
   slide (the one before them). Fonts travel inside the file.

## 3. What makes it "the Fast Track way"

- Title = claim with a number and a consequence for the client, never a topic (`check_titles.py` enforces it).
- One yellow element per slide, and it is the thing the title claims (the client's bar, row, circle).
- Median 8 words on a slide; the explanation lives in the speaker notes; dense content is split, never trimmed.
- Every chapter: card → the client's number → context chart → breakdown → "what this means for <client>".
- Never five slides without a photo, chart or hero number; layouts alternate (rows, cards, photo side, quote).
- Before a deck leaves the building: the two-reviewer pass (Sonnet core-message + Opus art director) in
  `skill/scripts/workflows/review-deck.js`, then `check_numbers.py` against the source text.

## 4. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| PowerPoint: "found a problem… Repair" | Run `probe_powerpoint.sh` on the file to confirm; rebuild. Known cause (fixed in the engine): per-category chart builds. If it recurs, build with `FT_NO_MORPH=1` then `FT_NO_CHARTBUILD=1` to isolate, see `skill/references/pitfalls.md`. |
| Fonts look wrong in PowerPoint | The fonts are embedded; if PowerPoint still substitutes, install `skill/assets/fonts/*.otf` by double-click. The family names the engine writes are `Plaak 3 Pradel`, `Riforma LL`, `ABC Monument Grotesk Mono`. |
| Render shows serif fonts | LibreOffice cannot see the fonts: `bash skill/scripts/install_fonts.sh` (macOS) or install the fonts system-wide (Windows). |
| `render.py`: LibreOffice not found | Install LibreOffice (`brew install --cask libreoffice` / `winget install TheDocumentFoundation.LibreOffice`). |
| Higgsfield / HyperFrames steps | Optional. `skill/references/media.md` has the exact commands; they need the Higgsfield CLI and credits. |

Licences: fonts are licensed to Fast Track Ltd (do not redistribute outside the company); `reference/` and the TMC
photos in `project/assets/ref-photos` are client material for internal use only.
