# PEEKABOO · Instructions for Codex and coding agents

## Mission
This repo archives an experimental, wordless animated adaptation concept inspired by Yuan Zhe-sheng's *The Game of Loneliness*. The first scene is a **hand-painted 1448×1086 school courtyard with a boy sitting in a tree**. The visual identity is "Tender Uncanny": warm, nostalgic, subtly wrong, never AI-slop.

Before implementation, read:
1. `README.md`
2. `docs/02-art-direction.md`
3. `docs/03-storyboard-v01.md`
4. `docs/05-animation-engineering-decision.md`
5. `handoff/CODEX_PHASE1_2_5D.md`
6. `production/ASSETS.md`

## Non-negotiables
- **Preserve original pixels.** Do not redraw the whole scene as flat Three.js primitives, AI approximate scenery, generic stock art, CSS gradients, or a random SVG.
- Prefer **PixiJS v8 + TypeScript** for editably animated 2.5D; use Three.js only for a genuinely needed camera/volume effect and justify the cost.
- `img2threejs` is an OPTIONAL helper for procedural 3D objects, not a mandate to model the whole image. Installing it is an environment change: verify the user's environment and use documented install paths. `img2pixi2d` currently documents OMP as its host; do not falsely claim to have installed it into Codex.
- Original asset IMG-001 is referenced in the manifest; the binary **may not yet exist** in the GitHub checkout. If missing, consult the handoff package / request the source from the local user, or build explicit asset-loading fallback. Never fabricate its presence.
- Reference canvas 1448 × 1086 (4:3). Prioritize character, branch and tree leaves, distant courtyard, light/shadow. Do not add an extraneous UI to the finished film.
- Motion should be restrained and art-directed, not indiscriminate "breathing everywhere". Expose explicit controls only in a separate development/debug panel.
- No text, dialogue, sound effects or generated music in the visual render; licensed music comes later.
- A flattened image has no hidden pixels. Masking + motion may reveal holes; use documented, explicitly approved completion, or constrain deformations so hidden surfaces do not appear.
- Deterministic `renderAtTime(seconds)` for scrub and frame-by-frame export. Clean teardown, responsive preview, reduced motion.
- Commit source, masks, docs and experiment logs. Never overwrite original inputs or erase failed variants.

## Acceptance gate
Deliver **one** tasteful 8–12 second working visual scene first, not a rushed 90-second slideshow. Include an actual browser render, screenshot evidence at start/middle/end, a visually faithful neutral pose, deterministic seeking, editable animation parameters, and build/test results. Document which effects are real vs placeholders. Record results in `production/`, link to assets.

Do not claim skills installed, videos exported or assets committed unless actually verified.
