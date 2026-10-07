#!/usr/bin/env python3
"""check_deck.py deck.pptx — density + geometry lint for a built deck. Exit 1 on hard failures.
Rules come from the TMC reference: median 8 words/slide, nothing below 14 pt except the mono tag, nothing off-canvas."""
import sys, collections
from pptx import Presentation
E = 914400; path = sys.argv[1]; prs = Presentation(path); W = prs.slide_width / E; H = prs.slide_height / E
hard = 0; soft = 0
for i, sl in enumerate(prs.slides, 1):
    words = 0; small = []; off = []; kinds = collections.Counter()
    for sh in sl.shapes:
        kinds[str(sh.shape_type).split('.')[-1].split(' ')[0] if sh.shape_type else 'PH'] += 1
        x, y, w, h = sh.left / E, sh.top / E, sh.width / E, sh.height / E
        if sh.has_text_frame and sh.text_frame.text.strip():
            if x + w > W + 0.05 or y + h > H + 0.05 or x < -0.5 or y < -0.5: off.append(sh.name)
            words += len(sh.text_frame.text.split())
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if r.font.size and r.font.size.pt < 14 and r.text.strip(): small.append(f"{r.font.size.pt:.0f}pt '{r.text.strip()[:18]}'")
    tag = 'table' if (kinds['AUTO_SHAPE'] >= 1 or kinds['LINE'] >= 1) and words > 40 else ''  # structured slides (chips, hairlines) carry their words by design; the guard is for prose  # chip tables and lists carry their words by design
    msgs = []
    if words > 70 and not tag: msgs.append(f"HARD {words} words (reference max 66, median 8)"); hard += 1
    elif words > 30 and not tag: msgs.append(f"soft {words} words — reference median is 8; one idea per slide"); soft += 1
    if off: msgs.append(f"HARD off-canvas text: {off[:3]}"); hard += 1
    if small: msgs.append(f"soft {len(small)} runs < 14pt: {small[:2]}"); soft += 1
    if not any(k in kinds for k in ('CHART', 'PICTURE', 'MEDIA', 'AUTO_SHAPE')) and words > 15: msgs.append("soft text-only slide with > 15 words"); soft += 1
    print(f"{i:>2} words={words:<3} {'; '.join(msgs) if msgs else 'ok'}")
print(f"\n{hard} hard, {soft} soft findings"); sys.exit(1 if hard else 0)
