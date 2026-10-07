// build-chapters.js — one agent per chapter writes its slice of deck.json (data + archetype per slide) into its own
// file, then the lead merges the slices in order and runs build_deck.js + render.sh. Agents never build the pptx.
// Chapter authors must end their chapter on a "What this means for <client>" slide and return a per-slide ledger
// (claim title, so-what, source line); the lead runs check_titles.py on the merged deck.json before building.
// args: { common: "<template with {{ID}} {{TITLE}} {{OUT}} {{EXTRA}}>", chapters: [{ id, title, out, extra }], verify?: bool, checkCommon?: "...", implModel?, checkModel? }
export const meta = { name: 'ft-deck-build-chapters', description: 'Parallel chapter authors (deck.json slices) with optional per-chapter checker', phases: [{ title: 'Author' }, { title: 'Verify' }] }
const IMPL = { type: 'object', required: ['summary', 'file', 'slides', 'open_questions', 'ledger'], properties: { summary: { type: 'string' }, file: { type: 'string' }, slides: { type: 'number' }, open_questions: { type: 'array', items: { type: 'string' } },
  ledger: { type: 'array', description: 'one entry per slide: the title as a CLAIM, the so-what for the client, the source line that backs it', items: { type: 'object', required: ['index', 'title', 'sowhat', 'source'], properties: { index: { type: 'number' }, title: { type: 'string' }, sowhat: { type: 'string' }, source: { type: 'string' } } } } } }
const CHECK = { type: 'object', required: ['pass', 'evidence', 'failures'], properties: { pass: { type: 'boolean' }, evidence: { type: 'string' }, failures: { type: 'array', items: { type: 'string' } } } }
const fill = (tpl, t, x) => String(tpl).replace(/\{\{(\w+)\}\}/g, (_, k) => ({ ID: t.id, TITLE: t.title || '', OUT: t.out || '', EXTRA: t.extra || '', ...(x || {}) })[k] ?? '')
if (!args.chapters?.length || !args.common) throw new Error('args.chapters and args.common are required')
const stages = [(t) => agent(fill(args.common, t), { model: args.implModel, schema: IMPL, label: 'author:' + t.id, phase: 'Author' })]
if (args.verify) stages.push((impl, t) => agent(fill(args.checkCommon || '', t, { REPORT: JSON.stringify(impl) }), { model: args.checkModel || 'sonnet', schema: CHECK, label: 'verify:' + t.id, phase: 'Verify' }).then((check) => ({ impl, check })))
const res = await pipeline(args.chapters, ...stages)
return res.map((r, i) => (r ? { id: args.chapters[i].id, impl: r.impl || r, check: r.check || null } : null))
