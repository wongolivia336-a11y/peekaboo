# 06 · Code-as-Video Open Source Research (2026-11-11)

**Question:** Which GitHub projects can make real animated films via code, without diffusion video-generation models? Which is best for the existing painterly IMG-001 of a boy sitting in a large tree?

**Project state:** research only; links and technical capabilities checked against public README/docs. No tool has been installed locally and no generated video has been benchmarked in this conversation.

## Short verdict

- **Single image → animated loop + source layers:** [lemo-wake](https://github.com/lemomo-ai/lemo-wake). Most directly aligned to the PNG, but Claude Code is the primary target, Code/Docs CC BY-NC 4.0, and Windows support is not claimed fully tested. Its optional local ML models assist segmentation, inpainting, depth, **not video diffusion**.
- **Code-drawn creative short film & style explorations:** [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar). Works from Canvas/WebGL code, frame-by-frame. The README says its demos were produced by Claude Opus 5.5; that is the project creator's assertion. Its style guides were tuned for Claude, so Codex fidelity is not guaranteed. Especially relevant source material: [Watercolor Brush STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/watercolor/STYLE.md) and [TECHNIQUE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/TECHNIQUE.md). A style is *not* an invitation to overwrite the exact source painting: the watercolor style usually paints forms from zero, including handwritten labels, not faithful animation of an already-complete original.
- **End-to-end film timeline and MP4 rendering:** [Remotion](https://github.com/remotion-dev/remotion) (React, CSS, SVG, Canvas, WebGL; special license, check commercial terms). [@remotion/three](https://www.remotion.dev/docs/three) supports R3F if later needed.
- **Fine-grained 2D motion design:** [Motion Canvas](https://github.com/motion-canvas/motion-canvas) (TypeScript generator-based animation and editor; optional FFmpeg exporter).
- **Secondary candidates:** [Revideo](https://github.com/midrender/revideo) (code-based rendering, preview player); [fframes](https://github.com/dmtrkovalenko/fframes) (Rust/SVG on GPU, agent skill, likely more suited to typography/data/graphic motion than painterly animation); [html-video](https://github.com/nexu-io/html-video) (HTML to MP4 via Chromium+FFmpeg, 21 templates; currently Hyperframes engine implemented; other adapters on roadmap); [theatre-js/theatre](https://github.com/theatre-js/theatre) (timeline and motion controls, *not* standalone MP4 generator); [p5.capture](https://github.com/tapioca24/p5.capture) (records p5.js code to MP4/WebM/GIF/PNG); [canvas-sketch](https://github.com/mattdesl/canvas-sketch) (frame export / ffmpeg stream); [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) (skills packs, not standalone render engine).

## How a source image becomes a video without a video generation model

```text
IMG-001.png
  -> object masks / layered PNG / optional PSD + restored background
  -> 2.5D scene + small movement values over time (code)
  -> deterministic render(t) in browser / GPU
  -> individual image frames at 24 FPS
  -> FFmpeg / render-engine encoding to MP4
```

This is different from having the model synthesize every video frame. The agent may write code, and optionally run local segmentation, depth and inpainting models, but the actual animation frames are *rendered* deterministically from scene descriptions, textures and curves.

## PEEKABOO-specific ranking

| Project | Exact IMG-001 preservation | Hand-drawn language | Export workflow | Use it for |
|---|---|---|---|---|
| lemo-wake | **Potentially high** if layering works (verify seams) | Starting from user painting | ~5s MP4, GIF, WebP; PSD layers | Quick 5s source-preserving loop / layer experiment |
| PixiJS 2.5D bespoke (not turnkey) | **High when carefully manually masked** | Highest controllability | Coupled to renderer / frame export | Final control over boy, tree and shadow |
| lemo-opuscar | Style-dependent, often repaints from code | Rich stylistic demos | Canvas/WebGL + Chromium + FFmpeg | Study non-diffusion storytelling and motion language |
| Motion Canvas | High only with supplied layers | Better for graphic/vector animations | FFmpeg exporter | Specialized editable 2D timeline |
| Remotion | High when fed correct source layers/render | Inherits supplied scene engine | Full-length MP4 timeline | Assemble and export 90s multi-shot film |
| fframes | Rich SVG, but source painting not primary | SVG-oriented | GPU renderer | Fast graphic animation later |

**Recommended first comparison**: A/B test (1) lemo-wake 5-second layer-based version and (2) bespoke PixiJS same-source 5-second version. Compare exact original texture, occlusion seams, leaf motion independence, character identity, export stability, editing ergonomics and license constraints. Keep both raw outputs; select one for 8–12s SH03. Remotion later for whole film.

## Tool caveats

### lemo-wake
- Official repository: https://github.com/lemomo-ai/lemo-wake
- Designed as Claude Code plugin. README says other agents like Codex can read the skill, without guaranteeing results.
- Claude plugin: `claude plugin marketplace add lemomo-ai/lemo-wake`; `claude plugin install lemo-wake@lemo-wake`.
- Other agent usage: inspect/port `skills/wake/SKILL.md` into that agent's local skills folder (with required scripts/assets). Do not claim installation until `doctor.mjs` and sample run pass.
- Windows/Linux should work, project says macOS was tested. Needs Node, ffmpeg, uv, browser; optional local models for cutouts/hole-filling/depth.
- Code and docs are **CC BY-NC 4.0**. Clarify commercial or public portfolio licensing before distributing derivative code or running commercial workflows. Original image and resulting film rights may have separate rules.

### lemo-opuscar
- Author says demo films were written in code by Claude Opus 5.5, not by a generative video model. This is author-reported, not independently reproduced.
- README says copy `plugin/skills/lemo-opuscar/` into other coding agents' skill folders; Claude plugin-specific installation is not a Codex install command.
- Styles can be customized: don't directly copy film story, timing, characters; relevant inspiration is watercolor/painted language, hand-drawn and stop-motion variation.
- Its default scripts include sound/voice, while PEEKABOO should remain visually silent during render. Do not copy music tracks automatically.
- Code/docs MIT, demo films/stills CC BY 4.0 subject to third-party asset exclusions; check respective LICENSE and CREDITS.

### Remotion
- Strong compositing/export layer; licensing is **not** an uncomplicated blanket MIT license. Check commercial use license.
- Prefer single frame-number source-of-truth per composition. Test WebGL/Pixi integration with offscreen rendering rather than assuming every browser render behaves identically during headless export.

## Notes on names
The user mentioned “fable 5.5” earlier. The specific publicly documented non-video-model film examples surfaced in this research are made by **Claude Opus 5.5, per lemo-opuscar creator**. Do not conflate that attribution with an independently verified “Fable 5.5” model.

## Engineering recommendation

Do **not** swap every existing plan to three.js just because it's an impressive creative coding framework. For source painting: segmentation and repaint repairs matter more than the rendering library. First get credible layers, then small controlled movement.

For the first 5s clip:
- Stabilize trunk and school.
- Animate 2–3 foliage clusters asymmetrically and sparsely.
- Keep boy still until a complete, repaired character matte exists, then try tiny eyelid/head articulation.
- Avoid indiscriminate sine-wave global warp.
- Save original and generated masks, browser screenshots t=0/2.5/5 and MP4, ensure deterministic scrub.
- Log used versions, commands, and licenses.

## References
- https://github.com/lemomo-ai/lemo-wake
- https://github.com/lemomo-ai/lemo-opuscar
- https://github.com/lemomo-ai/lemo-opuscar/blob/main/TECHNIQUE.md
- https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/watercolor/STYLE.md
- https://github.com/remotion-dev/remotion
- https://github.com/motion-canvas/motion-canvas
- https://github.com/midrender/revideo
- https://github.com/dmtrKovalenko/fframes
- https://github.com/nexu-io/html-video
- https://github.com/iart-ai/motion-skills
