# SH02 climbing animation frames

- `frames/` contains 40 separate 448 × 448 transparent character drawings.
- `pose-sheet-01.png` through `pose-sheet-05.png` preserve the five 8-frame source sheets on a flat green key background.
- `climb-40-sheet-v1.png` is the initial low-resolution 40-cell layout; the runtime uses the higher-resolution extracted PNGs instead.
- Playback advances at 12 drawings per second while the character rises about 340 px from the tree base onto the branch over 3.33 seconds, then holds frame 40.
- Re-extract the alpha PNGs with `npm run assets:climb-frames-v2`.
- Render a standalone SH02 excerpt with `npm run export:climb-preview`.
