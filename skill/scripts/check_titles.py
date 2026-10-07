#!/usr/bin/env python3
"""check_titles.py deck.json [--client TMC] — core-message lint on the deck SOURCE (so `custom` slides and subs are read).
Rule: a title is a claim, not a topic — subject + verb + number-or-contrast + what it means for the client.
Hard fails T1–T6, warnings W1–W5 (spec: reviews/core-message-sonnet.md §D2). Exit 1 on any hard fail.
Self-test: `check_titles.py --selftest` runs the 10 reference titles."""
import sys, re, json, collections
VERBS = r"\b(is|are|was|were|sits?|stands?|wins?|loses?|charges?|sells?|says?|shows?|does|do|pays?|paid|costs?|exists?|has|have|shares?|runs?|lets?|means|proves?|trails?|discounts?|opens?|names?|fix|test|add|keep|stop|predicts?|holds?|needs?|puts?|makes?|changed|split|came|teaches|buy|breaks?|cancel|moves?|let|designs?|earns?|teach|take|took|differ|speaks?|offers?|carries|carry|reaches|cost)\b"
NUM = r"(\d|\bRs\b|\$|%|\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|thousand|million|billion)\b)"
CONTRAST = r"\b(not|no|never|only|against|than|but|before|instead|so|while|yet|none|first|then|fix|test|add|keep|stop|pick|confirm|rebuild|means)\b"
COUNT_WORD = r"(\d+|one|two|three|four|five|six|seven|eight|nine|ten)"
def norm(t):
    if isinstance(t, list): t = ' '.join(t)
    t = re.sub(r'\*', '', str(t or '')); t = re.sub(r'\s*\(\d+ of \d+\)\s*$', '', t); return t.strip()
def classify(title, client):
    t = norm(title); l = t.lower(); fails = []
    if not t: return ['T3 empty']
    V = re.search(VERBS, l) or re.search(r'[=:;]', l); N = re.search(NUM, t); C = re.search(CONTRAST, l) or (client and client.lower() in l)
    if re.match(r'^(what|how|who|where|which|why)\b', l) and not N and not (client and client.lower() in l): fails.append('T1 question/topic without a number')
    if re.match(rf'^(the )?{COUNT_WORD} (conclusions?|differences?|points?|reasons?|things?|ways?|insights?|findings?|hypotheses|signals?|positions?)\b', l) and not V: fails.append('T2 "N things" list title')
    if not V: fails.append('T3 no verb')
    if re.match(r'^\w+( \w+){0,5} (against|vs\.?|between) ', l) and not V and not N: fails.append('T4 "X against Y" without verdict')
    if V and not N and not C: fails.append('W6 verb but no number and no contrast/client (judgement call)')
    return fails
def main():
    if '--selftest' in sys.argv:
        ex = [("Perfume is one band: Rs 449 to 799, and TMC's Rs 499 sits inside it", True), ("TMC discounts 80%; winners sell near list", True), ("Brand power is engagement, not followers", True), ("Rivals let a man try for Rs 59 to 149; no TMC mini was found", True), ("Fix price coherence first, then pick one of two positions", True), ("Six conclusions on price", False), ("What the category maps show", False), ("Five differences between packs", False), ("Trying a rival against trying TMC", False), ("What works in a message, and what does not", False)]
        ok = True
        for t, want in ex:
            f = classify(t, 'TMC'); got = not f; ok &= got == want; print(f"{'PASS' if got == want else 'WRONG':<5} {'claim' if got else 'topic':<5} {t[:60]:<60} {f}")
        print('selftest', 'ok' if ok else 'FAILED'); sys.exit(0 if ok else 1)
    path = sys.argv[1]; client = sys.argv[sys.argv.index('--client') + 1] if '--client' in sys.argv else 'TMC'
    d = json.load(open(path)); slides = d['slides']; hard = 0; seen = collections.Counter(); chapters = []; cur = None
    def title_of(s):
        if s.get('type') == 'custom': els = [e for e in s.get('elements', []) if e.get('text') is not None and (e.get('y') or 9) < 1]; return max(els, key=lambda e: e.get('fontSize', 0))['text'] if els else ''
        return s.get('title', '')
    for s in slides: seen[norm(title_of(s)).lower()] += 1
    for i, s in enumerate(slides):
        typ = s.get('type'); t = title_of(s); msgs = []
        if s.get('title_ok') or typ in ('cover',): print(f"{i:02d} ok    ({typ}, exempt)"); continue
        if typ in ('chapter', 'statement'):
            sub = s.get('sub', ''); f = classify(sub, client) if sub else ['W2 chapter without a claim sub']
            if any(x.startswith('T') for x in f): msgs.append('W2 chapter/statement sub is a topic: ' + norm(sub)[:50])
        else:
            f = classify(t, client); msgs += f; hard += any(x.startswith('T') for x in f)
            if seen[norm(t).lower()] > 1: msgs.append('T5 title repeated on another slide'); hard += 1
        if len(norm(t)) > 70: msgs.append('W5 title > 70 chars')
        if norm(t).count('*') > 2 or (isinstance(t, str) and t.count('*') > 2): msgs.append('W5 more than one *yellow* span')
        notes = s.get('notes', '') or ''; vis = json.dumps({k: v for k, v in s.items() if k != 'notes'}, ensure_ascii=False)
        if client.lower() in notes.lower() and client.lower() not in vis.lower(): msgs.append(f'W3 {client} is named only in notes')
        if typ == 'chapter' and s.get('section'): chapters.append([i, []])
        if chapters: chapters[-1][1].append((i, typ, norm(t)))
        # W7: the *yellow* run must name the highlighted element (art-director rule 2)
        if isinstance(t, str) and '*' in t and (s.get('highlight') or s.get('highlightRows') or typ == 'versus'):
            span = re.findall(r'\*([^*]+)\*', t); hl = ''
            if typ == 'bar' and s.get('categories'): hl = ' '.join(s['categories'][i2] for i2 in (s.get('highlight') or []) if i2 < len(s['categories']))
            if typ == 'table' and s.get('highlightRows'): hl = ' '.join(s['rows'][r][0] for r in s['highlightRows'] if r < len(s['rows']))
            if typ == 'versus': hl = (s.get('right') or {}).get('label', '')
            ok7 = any(client.lower() in sp.lower() for sp in span) or any(w.lower().strip("'s:;,") in hl.lower() for sp in span for w in sp.split() if len(w) > 2)
            if span and hl and not ok7: msgs.append(f'W7 yellow run "{span[0]}" does not name the highlighted element ({hl[:30]})')
        print(f"{i:02d} {'FAIL ' if any(m.startswith('T') for m in msgs) else 'warn ' if msgs else 'ok   '} {typ:<14} {norm(t)[:58]:<58} {'; '.join(msgs)}")
    # W8: streaks — never more than three consecutive slides of one archetype; chapter opens on the client's number within 2 slides
    run = 1
    for i in range(1, len(slides)):
        run = run + 1 if slides[i]['type'] == slides[i-1]['type'] else 1
        if run == 4: print(f"W8 four consecutive '{slides[i]['type']}' slides ending at {i:02d} — vary the archetype")
    for i, s in enumerate(slides):
        if s.get('type') == 'chapter' and s.get('section'):
            nxt = [x['type'] for x in slides[i+1:i+3]]
            if not any(x in ('hero-number', 'versus', 'before-after', 'stat-bubble') for x in nxt): print(f"W9 chapter at {i:02d} does not open on the client's number (hero-number / versus / before-after within 2 slides)")
    # W10/W11: monotony — one archetype > 50% of a chapter; more than 4 slides running without a photo or graphic
    VISUAL = ('chapter', 'hero-number', 'versus', 'before-after', 'stat-bubble', 'bar', 'pie', 'pie-callout', 'segment-strip', 'score-grid', 'cover', 'custom', 'quote')
    for i, sl in chapters:
        from collections import Counter as _C; c = _C(tt for _, tt, _ in sl); top, cnt = c.most_common(1)[0]
        if len(sl) >= 6 and cnt > len(sl) / 2: print(f"W10 chapter at {i:02d}: {cnt} of {len(sl)} slides are '{top}' — vary layouts (stat-list layout cards/photo/bigrows, quote, versus, hero-number)")
    dry = 0
    for i, s in enumerate(slides):
        visual = s.get('type') in VISUAL or s.get('image') or s.get('video') or s.get('layout') in ('cards', 'photo')
        dry = 0 if visual else dry + 1
        if dry == 5: print(f"W11 five slides without a photo or graphic ending at {i:02d} — add a photo (meta.photoPool), a hero number or a versus")
    for i, sl in chapters:
        last = sl[-1]; 
        if not re.search(r'means for|so what|next|decide|fix|test|what this', last[2].lower()): print(f"W4 chapter starting at slide {i:02d} does not end on a 'what this means' slide (last: {last[2][:40]})")
        mention = sum(1 for _, _, tt in sl if client.lower() in tt.lower() or re.search(VERBS, tt.lower()))
        if mention < len(sl) / 3: print(f"W1 chapter starting at slide {i:02d}: fewer than 1 in 3 titles name {client} or act")
    print(f"\n{hard} hard fails (topic titles) in {len(slides)} slides"); sys.exit(1 if hard else 0)
if __name__ == '__main__': main()
