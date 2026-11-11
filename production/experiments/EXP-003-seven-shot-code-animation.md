# EXP-003 — Seven-shot code animation / 2026-11-11

## Approach

Preserved the seven 1448×1086 user-provided painted keyframes and the separately recovered original chat visual master. Produced 22 PNG layer sprites using manual rough matte regions and limited local OpenCV Telea inpainting. All masks and source generation remain editable in `tools/prepare_layers.py`. Inpainting is a **temporary guessed background**, not recovered hidden painting. Never overwritten original images.

Built a deterministic 7-shot clock (24fps, 2160 frames, total 90s) using a unified `renderFrame(ctx, absoluteFrame, assets, manifest, opts)` Canvas 2D renderer. Canvas API runs in both the browser and the Skia Canvas Node exporter; FFmpeg assembles H.264 without audio. Choice of native Canvas 2D + Skia and FFmpeg instead of PixiJS + Remotion was an explicitly verified **equivalent renderer fallback** due to unavailable outbound package registry access. It is not a claim of PixiJS/Remotion being installed.

## Production pass

| SH | Supplied drawing | Code motion | Stage / open problem |
|----|----|----|----|
| 01 | Empty courtyard + tiny distant runners | three extracted tiny child masks + independently timed irregular leaves | coded draft; tiny children's pixel-matte edges still need finishing |
| 02 | Tree-climbing pose | two runners offset by separate time curves; leaf group motion | **partial**; principal climbing pose is a fixed drawing, no second frame for convincing ascent |
| 03 | Boy content in upper tree | three foliage groups independent + single deliberately timed paper scrap drop | **code proof**; boy himself largely static pending rigorous rotoscoping |
| 04 | Kong looks up from courtyard | head patch rotated slowly on locked body; leaves almost static | coded draft; facial blink/redrawn head profile advisable |
| 05 | Two boys fail to meet each other's gaze | trial hand shift + slight spatially displaced shade + background foliage | **partial**; insufficient actor poses |
| 06 | Observer displaced from boy in tree | separate near-field leaf planes offset in unequal directions | coded draft; needs further space/world repaint for a full viewpoint change |
| 07 | Empty courtyard; tiny boy on branch | wind decays to zero, ending on cut | coded draft; almost stillness is intentional |

## Actual validation

- `node tools/check.mjs`: PASS — 7 sequential shots, all input/layer paths present, final frame 2159.
- Skia frame capture: 21 selected frames at beginning/middle/end and key dramatic turns. Contact sheet checked manually.
- Chromium headless Canvas 2D: actual code rendered SH03 frame 600, SH04 frame 890, SH06 frame 1660 via injected `about:blank`; 0 page errors. Loopback/file navigation blocked by sandbox policy, so interactive route acceptance remains TODO.
- FFmpeg: individual full-resolution segment tests succeeded; concatenated 1448×1086, 24 fps, 2160 frames, 90.000000 sec, H.264, 4:3. No music/sounds.
- Aesthetic review and first repair: compared grouped contact-sheet and enlarged SH04/SH05; reduced unmotivated extra darkening at SH05 and reduced distant running-child count in a newer source revision. After these tweaks, SH01 and SH05 were re-rendered and the full 2160-frame MP4 was re-concatenated and verified again.

## Faithfulness problems to address next

1. Existing stills are similar but **not pixel-continuous** world maps. In SH03 / SH05 / SH06 the architectural orientation changes partly through original image generation. This is not caused by code animation and should be corrected by painting/compositing the geographic master.
2. Stronger SH02 climbing requires a hand-painted intermediate posture: lifting the source character as a rigid PNG would look fake.
3. Translucent feathered leaf overlays are not true independent clean plates; original texture is maintained but strong movement would produce a double-printed edge. Keep winds under 3px until precise matte + paint-over exists.
4. The hand mask in SH05 is rough. Do not enlarge motion amplitude without refinements.
5. The old asset manifest's IMG-001 SHA differs from the original still reattached in this session. Both versions have separate provenance; do not silently overwrite the historical manifest.

## Skill audit

- lemo-wake: official v1.1.0 SKILL.md and CC BY-NC 4.0 LICENSE read via GitHub. Tool is designed for single-shot ~5-second loops, not 90s narrative. Optional cutout models require downloads and consent. **Not installed or executed**; outbound git network was DNS-blocked. No model download.
- lemo-opuscar: official SKILL and Watercolor / Crayon Book technique files, MIT LICENSE read. Art-method inspiration only; no demo code reused. **Not installed or executed** due unavailable network checkout; its setup.sh was not run.
- Remotion: evaluated as timeline/export candidate but not installed; introducing network-dependent framework would not improve proof with available environment.
- Motion Canvas: evaluated as alternate 2D render/export system but not installed.
- Actual installed/exercised: Node 22.16.0, system `skia-canvas` 3.0.8, OpenCV, Chromium 144, FFmpeg 7.1.5. `npm install` in isolated runtime unavailable, but global dependencies permit proof. Credentials/API keys not used. All motion is code-driven, never a generated video model.

## Asset status & distribution

All source PNGs and extracted layers are in the downloadable handoff ZIP, not automatically in GitHub by virtue of being attached to chat. Check GitHub push separately. Licensed Swallow music is **not included**.
