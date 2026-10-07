// research-fanout.js — parallel scouts before a deck is storyboarded. Each scout returns a schema'd block; none touches
// the project. args: { brief: "<the user's ask + data location>", data: "<path(s) to the data files>", scouts?: [...] }
export const meta = { name: 'ft-deck-research', description: 'Parallel scouts: data audit, narrative, media plan, reference match', phases: [{ title: 'Research' }] }
const SCHEMA = { type: 'object', required: ['summary', 'findings', 'risks'], properties: { summary: { type: 'string' }, findings: { type: 'array', items: { type: 'string' } }, risks: { type: 'array', items: { type: 'string' } } } }
const TL = '!! COMMAND TIME LIMIT: every shell command < 150 s. Read-only: do not write into the project. !!\n'
const base = `${TL}Brief: ${args.brief}\nData: ${args.data}\nRead ~/.claude/skills/ft-deck/references/design-system.md first (the visual system you are serving).\n`
const scouts = args.scouts || [
  { key: 'data', prompt: base + 'DATA AUDIT: open every data file; list each metric with unit, period, source cell; flag gaps, inconsistent units (e.g. "0,7$ b" vs "$ 33.5"), totals that do not add up, and which numbers are big enough to carry a whole slide (hero numbers). Return findings as one line per metric.' },
  { key: 'narrative', prompt: base + 'NARRATIVE: propose the chapter structure (reference: market → attractiveness index → segment economics → targets → summary → needs/pains/gains). For each chapter: the one-line claim, the one number, the slide archetypes from references/archetypes.md in order, ≤ 20 words per slide. Return as findings, one chapter per line.' },
  { key: 'media', prompt: base + 'MEDIA PLAN: which slides need a photo (persona, place, product), a pictogram wall, a map, an animated infographic (HyperFrames mp4), a voice-over line, music/SFX. For each: a Higgsfield prompt (dark, desaturated, documentary, no text/logos, 16:9) or the HyperFrames beat list. Keep it to what the story needs: one chapter video, one or two persona photos, one VO line per chapter at most.' },
  { key: 'reference', prompt: base + 'REFERENCE MATCH: for every proposed slide, name the closest TMC reference slide (references/archetypes.md thumbs) and what must change for the new data; flag any slide that has no archetype (candidate for the custom/svg escape hatch).' },
]
const res = await parallel(scouts.map((s) => () => agent(s.prompt, { label: 'scout:' + s.key, schema: SCHEMA, phase: 'Research' })))
return Object.fromEntries(scouts.map((s, i) => [s.key, res[i]]))
