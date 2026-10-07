#!/usr/bin/env bash
# ft-deck installer for macOS. Run once:  bash install.sh
# Installs: Homebrew (if missing), Node.js, Python 3, LibreOffice, ImageMagick; the ft-deck skill into ~/.claude/skills;
# its Node packages; a Python venv for the project; the three brand fonts. Ends with a smoke build.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
say() { printf '\n\033[1;33m▶ %s\033[0m\n' "$*"; }
say "1/7 Homebrew"; command -v brew >/dev/null 2>&1 || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
say "2/7 Node.js, Python, ImageMagick, LibreOffice"
for f in node python@3.12 imagemagick; do brew list "$f" >/dev/null 2>&1 || brew install "$f"; done
[ -d /Applications/LibreOffice.app ] || brew install --cask libreoffice
say "3/7 Skill → ~/.claude/skills/ft-deck"; mkdir -p ~/.claude/skills; rsync -a --delete "$HERE/skill/" ~/.claude/skills/ft-deck/
say "4/7 Node packages for the engine"; (cd ~/.claude/skills/ft-deck/scripts && npm install --silent --no-audit --no-fund)
say "5/7 Python environment for the project"; cd "$HERE/project"; [ -d .venv ] || python3 -m venv .venv; .venv/bin/pip install -q --upgrade pip; .venv/bin/pip install -q -r requirements.txt
say "6/7 Fonts (Fast Track licence — internal use only)"; mkdir -p ~/Library/Fonts; cp -n "$HERE/skill/assets/fonts/"*.otf ~/Library/Fonts/ 2>/dev/null || true
LOF=/Applications/LibreOffice.app/Contents/Resources/fonts/truetype; [ -d "$LOF" ] && cp -f "$HERE/skill/assets/fonts/"*.otf "$LOF/" || true
say "7/7 Smoke build"; node ~/.claude/skills/ft-deck/scripts/build_deck.js "$HERE/project/maps-ft.json" "$HERE/project/out/smoke-test.pptx" | tail -1
printf '\n\033[1;32m✔ Installed. Open project/out/smoke-test.pptx in PowerPoint. Next: read README.md → "Make a deck".\033[0m\n'
printf 'Optional: Claude Code (npm i -g @anthropic-ai/claude-code) picks the skill up automatically from ~/.claude/skills.\n'
