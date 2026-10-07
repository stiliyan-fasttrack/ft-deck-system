# Media: Higgsfield (images, music, SFX, voice) + HyperFrames (animated infographics → MP4 / SVG)

## Higgsfield CLI (installed: `/opt/homebrew/bin/higgsfield` 1.1.23, authenticated; skill `higgsfield-generate`)
Proven 2026-10-07 (5 jobs, 5.7 credits): `media/higgsfield/` in the PP_AI project holds the outputs + `manifest.json`.
```bash
H=/opt/homebrew/bin/higgsfield
$H account status                                   # credits before/after — write both into the manifest
$H generate cost gpt_image_2 --prompt 'x' --aspect_ratio 16:9 --resolution 2k --quality medium   # 2 cr (high = 6.5)
# images (chapter backgrounds, personas): dark, desaturated, documentary, no text/logos
$H generate create gpt_image_2 --prompt "<prompt>" --aspect_ratio 16:9 --resolution 2k --quality medium --json   # → ["<job_id>"]
# music bed / SFX (Seed Audio bills on output: 0.6–0.9 cr per job, not the 0.1 estimate; no --duration — say it in the prompt)
$H generate create seed_audio --prompt "Minimal dark ambient corporate underscore, slow pulse ~90 bpm, no vocals, loopable, 20 seconds." --json
$H generate create seed_audio --prompt "Single short soft cinematic whoosh transition, about one second, no reverb tail." --json
# voice-over (0.2 cr): text2speech_v2 / seed_speech with a preset voice; Grady = male, middle-aged
$H generate create text2speech_v2 --prompt "<line>" --variant seed_speech --voice_id e2a2d2e6-9ed2-59cd-82af-feaa27f8a678 --voice_type preset --json
$H voices list                                      # 113 presets (name + id); supported_models only visible in a finished job
$H generate wait <job_id> --timeout 110s --quiet --json | jq -r '.status, .result_url'   # images < 110 s, audio seconds
curl -fsSL -o <name>.<ext> "<result_url>"           # CloudFront, public
```
Gotchas: `qwen_audio_tts` rejects preset voices ("Voice preset is not available for Qwen Audio") — use text2speech_v2;
`account transactions` can 503 (retry); a 1 s SFX prompt came out 2.5 s (trim with ffmpeg); 2688×1520 medium is enough
for 1920×1080 slides. Budget on actual charges. Images for a deck: one per chapter + one per persona, reused everywhere.

Prompt frame for this system: "Ultra-dark cinematic / documentary photo, <subject>, deep black shadows, desaturated,
high contrast, no text, no logos, no watermark, 16:9." The engine then dims 40–70 % and fades the text side.

## Placing media in the PPTX (engine)
- Photo: any archetype's `image` (full-bleed or half, `dim`, fade automatic).
- Video chapter: `{ "type": "chapter", "video": "media/hf/x/renders/x.mp4", "poster": "….png", "title": "…" }` → `addMedia` full-bleed (H.264 yuv420p, as the reference's two MP4 backgrounds).
- Voice-over: `"audio": "media/higgsfield/vo-market.mp3"` on the slide → small speaker icon bottom-right (PowerPoint plays on click; set "automatically" in PowerPoint if a self-running show is wanted — pptxgenjs cannot).
- Music bed / SFX: one `audio` on the cover slide for a bed; SFX only in exported video versions (HyperFrames), not in the PPTX.

## HyperFrames (skills `hyperframes`, `hyperframes-core`, `hyperframes-cli`, `-animation`, `motion-graphics`; `/opt/homebrew/bin/npx --yes hyperframes@0.8.139` (the RTK hook rewrites a bare `npx hyperframes`; "11.x" does not exist on npm))
Use it for the two things PowerPoint cannot do natively and colleagues will not edit anyway:
1. **Animated data infographic as a video slide** — count-ups, growing circles, drawing arrows, pictogram fills:
   build `media/hf/<name>/index.html` (1920×1080, 30 fps, 4–8 s, black, the three fonts via @font-face from
   `~/Library/Fonts`, GSAP, seek-safe), `npx hyperframes check`, `render` → H.264 → `chapter.video`. Static
   last frame = `poster` (`npx hyperframes snapshot -t 5.5`). Example built: `media/hf/market-growth/`.
2. **Static infographic as SVG/PNG** — a snapshot of a composition at its final frame, or a hand-written SVG, via the
   `svg` archetype (rasterised at 3× by the engine). Use for maps, flows, custom pictograms. Keep the numbers as live
   text in the PPTX (a text box over the graphic) so they stay editable.
Not for: bar/pie charts (native), titles, anything that must be edited later in PowerPoint.
Time limits: every agent shell command < 150 s; render in the background and poll; `snapshot` ≤ 4 times per call.

## Reference media from the TMC deck (for demos only — client photos)
`PP_AI/assets/ref-photos/` (15 files, mapped to slides in the build log); pictogram `assets/man.svg`; logo `assets/logo-f.png`.

## Fast Track brand image library (USE THIS FIRST — Kristian: "you don't need to generate anything besides some images")
`/Users/kristian/Library/CloudStorage/OneDrive-FastTrackLtd/Projects/FastTrack/Fast Track Ltd.'s files - Brand/3. Assets/Images/`
771 files (723 jpg, 21 png, 14 mp4). Folders: `Images/Frequently used` (42: knife, bullseye, volcano, lava, mountains,
pit crews, "You didn't come this far to only come this far" sign, fog pier, wireframe notebook, gears), `Images/Brand
book` (25: Brutal Honesty knife, boxer, racer, light painting, rocket, "Die Empty" sky), `Images/Desaturate photos with
yellow` (2: grey photo + yellow-tinted element = the brand treatment), `Images/Images - HQ` (68), `Images/Downloaded_Alex/
{black and white,colour}` (86+), `Images/WS photos` (138), `Images/Hell Week` (35), `videos/` (14 mp4: Data, Dashboard,
Global connectivity, Clock fast, Glass breaking, lightbulb breaking, burst, ground cracks…).
OneDrive files are cloud-only: the first read downloads (slow); copy picks into the project `assets/brand/` first.
Picks used in `templates/maps-ft.json`: cover = Brand book/Brutal Honesty.jpg; price = jon-tyson bullseye; messages =
drew-beamer sign; packaging = pexels-picjumbocom-196646 notebook; TMC page = matt-benson fog pier; closing = get out of
the box.jpg (volcano). Generate with Higgsfield only when the library has nothing for the subject (personas, products).
- Contact sheets of the library (6 folders, labelled key → path in `index.json`): `references/brand-library/` — pick from these before touching OneDrive.
