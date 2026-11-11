# EXP-002 · Code-driven 2.5D animation

**Date**: 2026-11-11  
**Status**: planned / handed off; not implemented or rendered.  
**Reason for starting**: The first MiniMax video trial appeared unsatisfactory to the user; no source video file was shared, so the specific visual defects remain unverified.

## Hypothesis

A controlled 2.5D reconstruction with image-based layers, nonuniform leaf deformations, and art-directed micro-performance can preserve the visual fidelity of IMG-001 more reliably than diffusion video on this scene.

## Inputs
- IMG-001: 1448×1086 original PNG, SHA256 `5bdda3d0d314a20af09df6ef1480ccc888a002ee5a3054228e88857c2c9730f4`; GitHub upload pending.
- Literary/art direction and storyboard docs in this repository.
- Current production video: not available for objective side-by-side evaluation.

## Experiment protocol
- 10s SH03 shot; visual motion only, silent.
- Source painting must remain inspectable and unchanged.
- Generate/retain masks and named layers, reference-aligned neutral render.
- Deterministic playback, scrubbing and export; 24fps frames.
- Compare initial/final frames with source + inspect occlusion/character details.

## Prioritization
1. Spatial separation without edge halos.
2. Two foliage clusters move convincingly, not all foliage identically.
3. No drift in buildings or main trunk.
4. Micro acting only if cleanly possible.
5. Optional camera depth AFTER first 4 pass.

## Evidence required before claiming success
- working source checkout + build
- screenshots at five times from real browser
- layer debug isolation
- image-by-image comparative critique
- exported video if render tooling supports it

## Iteration ledger
- EXP-002 v0: architecture and Codex handoff recorded. No claim of implementation.
- EXP-002 v1: pending first running prototype.
