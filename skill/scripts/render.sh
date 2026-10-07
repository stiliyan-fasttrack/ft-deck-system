#!/usr/bin/env bash
# render.sh deck.pptx [outdir] — headless render for QA: PDF + one PNG per slide + contact sheets (3 columns).
# Needs LibreOffice (brew install --cask libreoffice) and ImageMagick. Fonts: run install_fonts.sh once.
set -euo pipefail
IN="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; OUT="${2:-$(dirname "$IN")/render}"; mkdir -p "$OUT"
SOFF=/Applications/LibreOffice.app/Contents/MacOS/soffice
"$SOFF" --headless --norestore --convert-to pdf --outdir "$OUT" "$IN" 2>&1 | grep -v -e 'EOT out of spec' -e Fontconfig || true
PDF="$OUT/$(basename "${IN%.*}").pdf"; [ -f "$PDF" ] || { echo "render failed: no PDF"; exit 1; }
rm -f "$OUT"/slide-*.png "$OUT"/sheet-*.png
magick -density 96 "$PDF" -resize 1600x900 -background white -alpha remove -quality 90 "$OUT/slide-%02d.png"
N=$(ls "$OUT"/slide-*.png | wc -l | tr -d ' ')
i=0; k=0; while [ $i -lt "$N" ]; do files=(); for j in $(seq $i $((i+14))); do f=$(printf "$OUT/slide-%02d.png" $j); [ -f "$f" ] && files+=("$f"); done
  magick montage -font /System/Library/Fonts/Helvetica.ttc -label '' "${files[@]}" -tile 3x5 -geometry 560x315+6+6 -background '#222' "$OUT/sheet-$k.png"; i=$((i+15)); k=$((k+1)); done
echo "rendered $N slides → $OUT (sheet-0..$((k-1)).png); slide-NN.png is 0-based"
