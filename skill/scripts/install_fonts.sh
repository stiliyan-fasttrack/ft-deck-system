#!/usr/bin/env bash
# Copies the licensed brand fonts into LibreOffice's private font dir so headless renders use them (one-time).
set -e; D=/Applications/LibreOffice.app/Contents/Resources/fonts/truetype; [ -d "$D" ] || { echo "LibreOffice not installed"; exit 1; }
for f in RiformaLL-Regular.otf RiformaLL-Heavy.otf 205TF-Plaak-33-Pradel-Regular.otf 205TF-Plaak-23-Pradel-Light.otf 205TF-Plaak-43-Pradel-Bold.otf ABCMonumentGroteskMono-Regular.otf; do cp -f ~/Library/Fonts/$f "$D/" && echo "installed $f"; done
