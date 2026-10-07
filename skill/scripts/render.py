#!/usr/bin/env python3
"""render.py deck.pptx [outdir] — cross-platform QA render: LibreOffice → PDF → one PNG per slide + contact sheets.
Works on macOS and Windows (PyMuPDF renders the PDF, Pillow builds the sheets; no ImageMagick needed).
Install: pip install pymupdf pillow   (the project venv has them)"""
import sys, os, subprocess, shutil, glob
IN = os.path.abspath(sys.argv[1]); OUT = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.join(os.path.dirname(IN), 'render'); os.makedirs(OUT, exist_ok=True)
cands = ['/Applications/LibreOffice.app/Contents/MacOS/soffice', r'C:\Program Files\LibreOffice\program\soffice.exe', r'C:\Program Files (x86)\LibreOffice\program\soffice.exe', shutil.which('soffice') or '', shutil.which('libreoffice') or '']
soffice = next((c for c in cands if c and os.path.exists(c)), None)
if not soffice: sys.exit('LibreOffice not found — install it (brew install --cask libreoffice / winget install TheDocumentFoundation.LibreOffice)')
subprocess.run([soffice, '--headless', '--norestore', '--convert-to', 'pdf', '--outdir', OUT, IN], check=True, capture_output=True)
pdf = os.path.join(OUT, os.path.splitext(os.path.basename(IN))[0] + '.pdf')
import fitz; from PIL import Image
for f in glob.glob(os.path.join(OUT, 'slide-*.png')) + glob.glob(os.path.join(OUT, 'sheet-*.png')): os.remove(f)
doc = fitz.open(pdf); paths = []
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1600 / page.rect.width, 1600 / page.rect.width)); p = os.path.join(OUT, f'slide-{i:02d}.png'); pix.save(p); paths.append(p)
tw, th, cols, per = 560, 315, 3, 15
for k in range(0, len(paths), per):
    chunk = paths[k:k + per]; rows = (len(chunk) + cols - 1) // cols; sheet = Image.new('RGB', (cols * (tw + 12), rows * (th + 12)), (34, 34, 34))
    for j, p in enumerate(chunk):
        im = Image.open(p).convert('RGB'); im.thumbnail((tw, th)); sheet.paste(im, (6 + (j % cols) * (tw + 12), 6 + (j // cols) * (th + 12)))
    sheet.save(os.path.join(OUT, f'sheet-{k // per}.png'))
print(f'rendered {len(paths)} slides → {OUT} (sheet-0..{(len(paths) - 1) // per}.png); slide-NN.png is 0-based')
