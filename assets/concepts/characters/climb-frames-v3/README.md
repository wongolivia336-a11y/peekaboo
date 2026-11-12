# SH02 climbing animation frames v3

- `frames/` contains 40 separate 448 × 448 transparent character drawings used by SH02 and reused for the SH03 handoff pose.
- The frames keep the v2 pose drawings and receive a restrained palette/texture pass to sit closer to IMG-001's shaded, muted painting.
- Playback advances at 12 drawings per second and rises about 340 px onto the branch over 3.33 seconds, then holds frame 40.
- Rebuild the style pass with `npm run assets:climb-frames-v3`.
- Export the SH02 excerpt with `npm run export:climb-preview`.
