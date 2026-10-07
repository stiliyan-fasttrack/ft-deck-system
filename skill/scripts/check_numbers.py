#!/usr/bin/env python3
"""check_numbers.py deck.json source.md — fidelity both ways (art-director rule 4).
Every number in the source should appear on a slide or in notes; every number in the deck should exist in the source
(or be flagged as derived). Numbers = Rs/$/% figures and plain integers ≥ 10. Prints the two diffs; exit 1 if a deck
number is not in the source (the dangerous direction)."""
import sys, re, json
NUM = re.compile(r"(?:Rs\s?|\$|INR\s?)?\d[\d,]*(?:\.\d+)?\s?(?:%|M\b|lakh|crore|ml|g\b)?", re.I)
def nums(text):
    out = set()
    for m in NUM.finditer(text):
        t = m.group(0).strip(); core = re.sub(r"[^\d.]", "", t)
        if not core or (core.replace('.', '').isdigit() and float(core) < 10 and not re.search(r"[%$]|Rs", t)): continue
        out.add(core.rstrip('.'))
    return out
def walk(o, acc):
    LAYOUT = {'image', 'video', 'poster', 'audio', 'source', 'size', 'labelSize', 'valueSize', 'valueW', 'fontSize', 'x', 'y', 'w', 'h', 'max', 'gap', 'dim', 'catSize', 'chipW', 'chipSize', 'colWs', 'colX', 'explode', 'd', 'cols', 'itemSize', 'click', 'n', 'highlight', 'highlightRows', 'frame', 'labelRadius', 'startAngle', 'border', 'minShare', 'decimals', 'type', 'font', 'align', 'valign', 'color'}
    if isinstance(o, dict): [walk(v, acc) for k, v in o.items() if k not in LAYOUT]
    elif isinstance(o, list): [walk(v, acc) for v in o]
    elif isinstance(o, str): acc.append(o)
    elif isinstance(o, (int, float)) and not isinstance(o, bool): acc.append(str(o))
deck = json.load(open(sys.argv[1])); src = open(sys.argv[2], encoding='utf8').read()
acc = []; walk(deck['slides'], acc); deck_text = ' '.join(acc)
D, S = nums(deck_text), nums(src)
years = {str(y) for y in range(1990, 2040)}
missing_in_deck = sorted(S - D - years, key=lambda x: float(x)); not_in_source = sorted(D - S - years, key=lambda x: float(x))
print(f"source numbers: {len(S)}, deck numbers: {len(D)}")
print(f"\nIN SOURCE, NOT IN DECK ({len(missing_in_deck)}): " + ', '.join(missing_in_deck))
print(f"\nIN DECK, NOT IN SOURCE ({len(not_in_source)}) — each must be derived and labelled: " + ', '.join(not_in_source))
sys.exit(1 if not_in_source else 0)
