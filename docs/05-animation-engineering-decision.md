# 05 · 2026-11-11 Animation Engineering Decision Record

## Decision

**Switch the first-shot experiment from diffusion image-to-video to reproducible code-driven 2.5D animation.** Build the render from the actual rasterized artwork's selectively separated layers. Use PixiJS v8 + TypeScript (with a single animation timing mechanism). Three.js is optional for later impossible camera perspectives, not a default solution.

This is a choice about *image fidelity and authorship*, not an unsupported claim that code motion is always better than video models.

## Why the uploaded 1448×1086 PNG suits layered motion

Visible elements, from farther to nearer:
1. pale sky / distant tree and courtyard
2. left/center school building and windows / corridor
3. sunlit concrete ground, wall and purple shadows
4. large right trunk and structural branches
5. several groups of foreground / midground painted leaves
6. seated boy (white shirt, dark shorts, dangling hand, shoes)
7. small close leaf overlaps on top of boy, carefully occluding him

Large, spatially stable structures and naturally oscillating leaf groups favor 2.5D. The PNG does **not** contain actual depth maps, hidden tree texture or a rig for the boy. Accurate movement beyond tiny deformations requires artwork separation and retouching.

## Comparison

| Approach | Pros | Risks | Decision |
|---|---|---|---|
| MiniMax image-to-video | Fast results, natural-looking motion on some shots | Flicker, anatomy drift, uncontrolled motion, nondeterminism | Keep as parallel experiment, no longer primary |
| PixiJS 2.5D layered sprites, masks, mesh deformation | Preserves original pixels, named editable layers, measurable motion, deterministic render | Handcrafted masks; unseen background completion needed for larger motions | **Primary for SH03/SH07** |
| Three.js image planes / depth layers | True parallax/camera path if needed | Perspective holes, perspective warping, heavier scene | Optional for SH06 viewpoint fracture |
| img2threejs procedural full reconstruction | Fully editable 3D object geometries | Object reconstruction is not painting-preserving; buildings and foliage may become visually generic | Use selectively, not entire scene |
| Rive / vector rig | Precise puppet animation | Redrawing a painterly background as vector loses texture | Perhaps for independently redrawn character-only studies |

PixiJS v8 documentation confirms native masks, filters and mesh deformations. Deformation should be localized to permitted regions and time-stable. Avoid blanket full-image displacement and expensive filter stacks.

## Important distinction: “Fable 5.5”

Community code-animation demos attributed to Fable 5.5 are interesting, but attribution is largely creator-reported; Anthropic's current official model catalog does not expose a distinct Fable 5.5 model. The deliverable is agnostic to LLM branding; reproducible source, assets and rendered output are the evidence.

## Prototype choreography (10 seconds)

**0–2s:** completely faithful neutral composition; almost static. Let viewer see the tree, school, boy.

**2–5s:** only two or three masked clusters of leaves move under an irregular, low-amplitude wind (non-synchronized, non-sinusoidal repeat). Light patch shifts subtly, respecting existing painted shadow boundaries. Trunk, buildings and windows remain locked.

**5–7s:** near-imperceptible boy animation — tiny head inclination/eye blink or one hand joint, ONLY if separated painted assets permit. Otherwise keep him stationary and explicitly record why. No melting hands or inventing unseen anatomy.

**7–10s:** motion fades nearly to stillness. Optionally a minimally perceptible camera creep (e.g., under 1%) if no edges or holes are exposed. Loop can be created with a smooth return to the original frame, but cinematic single-shot may end naturally.

Story note: this is the pleasant hiding moment (SH03) *before* the uncanniness. Do not prematurely turn all the trees into monsters.

## Scene ownership / layer plan

- `BG_00_canvas`: immutable original reference for calibration / fallback only
- `BG_10_school_ground`: static restored background if cutouts require it
- `ENV_20_trunk_branches`: static trunk
- `ENV_30_foliage_rear`: rear foliage cluster(s)
- `CHAR_40_boy`: boy silhouette, single root/pivot
- `ENV_50_foliage_front`: foreground occluding leaf group(s)
- `FX_60_light_and_shadow`: localized translucent painted shadow/light modulation (no full screen haze)

A true compositing rebuild requires **mattes and potentially restored background**. `BG_00_canvas` alone plus overlaid cutouts is *not* an honest fully independent scene and may double edges. Show comparison screenshots and label the stage as an overlay proof if not yet fully separated.

## Implementation specifications

- Vite + React + TypeScript host; PixiJS v8 scene; use a single clock and `renderAtTime(t)` independent of frame rate.
- Use fixed artboard 1448×1086 and contain-scale for viewport, preserving aspect ratio; keep all scene geometry in reference-image coordinates.
- At-rest frame must be close to the source pixel-for-pixel; isolate cosmetic overlays.
- Manual or hybrid alpha masks; retain editable source of every matte; keep a manifest with polygon/brush method and unknown/inferred fill regions.
- Readable source `src/scene/createPeekabooScene.ts`, `src/scene/timeline.ts`, `src/scene/layers.ts` + `src/debug/Controls.tsx` suggested; allow tasteful restructuring.
- Scene supports pause, play, scrubbing, `reset`, `destroy` without accumulating renderer instances; handle resize/reduced-motion.
- Export reproducible PNG frame sequence at 24 fps, or provide automated Playwright capture + ffmpeg assembly if tools exist. Do not claim valid MP4 if ffmpeg is absent.
- Debug toggles for mask borders, individual layers, A/B source overlay, motion gain; **only debug UI**.
- Validate still frame and motion extrema, not just build success.

## Research

- img2threejs skill: https://github.com/img2threejs/img2threejs
- img2pixi2d / OMP-oriented workflow: https://github.com/img2threejs/pixi2d
- PixiJS masks: https://pixijs.com/8.x/guides/components/scene-objects
- PixiJS meshes: https://pixijs.com/8.x/guides/components/scene-objects/mesh
- PixiJS filters: https://pixijs.com/8.x/guides/components/filters
- Current official model catalog: https://platform.claude.com/docs/en/models/overview

**Status:** Architecture decision + handoff only; this is NOT a claim that the browser app has already been implemented.
