# PEEKABOO — Workprint runner

**Status:** seven-shot, 90-second code-animated **WORKPRINT**, not a finished character-animated film. No sound is shipped. All seven picture assets come from the 2026-11-11 chat upload. All original paintings remain unaltered in `assets/frames/`.

## Run the interactive director's preview

Requirements: Python 3, a modern Chromium-based browser. The browser application uses **native Canvas 2D** and needs no npm packages.

```bash
cd peekaboo-delivery
python -m http.server 4173
# open http://127.0.0.1:4173
```

Use Play/Pause; the timeline slider seeks any of 2160 frames; ←/→ steps frames. Check Original A/B to compare the unmodified supplied still to the composite. Toggle Foliage, Actors, Motion and Shadow to inspect passes. UI is development-only, not burned into the movie.

If you have Node and npm you may also use `npm install && npm run dev`. Offline environments can use the Python server instead.

## Production / render commands

Requires `skia-canvas` (v3.0.8 tested), Node v22.16.0, FFmpeg v7.1.5. To install on a normal online computer:

```bash
npm install
python -m pip install pillow opencv-python numpy
python tools/prepare_layers.py
npm run check
node tools/snapshot.cjs
node tools/export-video.cjs --width=720 --frames=2160 --out=edits/renders/720-workprint.mp4
```

For exact source resolution `1448×1086` the exporter runs the **same deterministic renderFrame** function. On constrained systems export seven independent clips and concatenate without transcoding:

```bash
node tools/export-video.cjs --width=1448 --start=0 --frames=240 --out=edits/renders/segment-SH01.mp4
node tools/export-video.cjs --width=1448 --start=240 --frames=240 --out=edits/renders/segment-SH02.mp4
node tools/export-video.cjs --width=1448 --start=480 --frames=288 --out=edits/renders/segment-SH03.mp4
node tools/export-video.cjs --width=1448 --start=768 --frames=336 --out=edits/renders/segment-SH04.mp4
node tools/export-video.cjs --width=1448 --start=1104 --frames=384 --out=edits/renders/segment-SH05.mp4
node tools/export-video.cjs --width=1448 --start=1488 --frames=360 --out=edits/renders/segment-SH06.mp4
node tools/export-video.cjs --width=1448 --start=1848 --frames=312 --out=edits/renders/segment-SH07.mp4
cd edits/renders
printf "file 'segment-SH%s.mp4'\n" 01 02 03 04 05 06 07 > segments.txt
ffmpeg -f concat -safe 0 -i segments.txt -c copy -movflags +faststart PEEKABOO-90s-fullres-WORKPRINT.mp4
```

## Existing export & verification

- `edits/renders/PEEKABOO-90s-fullres-WORKPRINT.mp4`: verified H.264, 1448×1086, 24 fps, 2160 frames / 90.00 sec, no audio. (A workprint, not a polished final.)
- `edits/previews/contact-sheet.png`: all seven shots, extracted from source-equivalent render.
- `edits/previews/frame-XXXX.png`: frame checkpoints for every shot.
- `edits/previews/browser-verified-SH03-600.png`, `...SH04-890.png`, `...SH06-1660.png`: actual Chromium Canvas screenshots.

In this execution environment, direct Playwright navigation to `localhost`, `file:` and arbitrary test hosts returned `ERR_BLOCKED_BY_ADMINISTRATOR`. Instead, `tools/browser-smoke.py` ran the **same real JS renderFrame function** in Chromium via `about:blank` script injection, supplied decoded PNG assets locally, and captured frames. Browser Canvas rendering passed for SH03, SH04, SH06 with no JS page errors. This is evidence of browser rendering, **not** an end-to-end browser navigation acceptance test; repeat that separately on a normal dev workstation.

## Artistic limitations / do not misrepresent

**Stage 1 reached:** 2160-frame score, seven supplied shot keyframes, original PNGs preserved, frame previews, source/overlay A/B, exported silent workprint.

**Stage 2 partial:** independently animated masked leaves (different phase per group), inpainted moving background children, subtly articulated lifted head in SH04, hand/shadow partials in SH05, falling paper detail in SH03, foreground parallax in SH06. All motion paths are pure time functions, not generative video.

**Still missing for final:** hand-drawn alternate pose(s) for the tree climb SH02, cleaner hand/eye performance in SH05, tree/hand precise roto, correction of background inpaint artifacts, stronger multi-plane viewpoint change in SH06, and a cross-shot character/location continuity cleanup. The original generated backgrounds are slightly different between shots and are not implicitly guaranteed to share exact architectural geometry. Source images have NOT been redrawn as generic vectors.

## Sound and rights

Swallow — *Peekaboo* is **reference-only**. No download, audio embedding or reproduction has been performed. Add a local, appropriately licensed recording in editing only after verifying usage rights.
