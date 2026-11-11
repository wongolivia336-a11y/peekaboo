# EXP-003 — SH03 PixiJS 2.5D implementation

Date: 2026-11-11  
Shot: SH03「躲藏的幸福」  
Source: `IMG-001-tree-hide-v01.png`

## Hypothesis

For this watercolor campus scene, a small number of authored 2D owners with source-registered masks will preserve authorship better than a broad generative motion treatment or a Three.js projection. The viewer should notice the tree breathing only after watching long enough; the boy should remain a quiet anchor.

## Experiment

1. Locked the original image by SHA-256 before any processing.
2. Drew conservative owner polygons in source coordinates for three foliage groups; traced a boy silhouette and painted-shadow region.
3. Generated full-size grayscale mattes and RGBA crops. The underlay blurs only the union of moved foliage/boy regions and is labelled inferred completion.
4. Rendered foliage crops through PixiJS `MeshSimple` with independent phase, frequency, rotation and non-uniform scale.
5. Kept the boy sprite masked but still; added only a low-alpha shadow drift.
6. Exposed a deterministic `renderAtTime(seconds)` and captured the same five times in a real Edge browser.

## What was rejected

- Three.js runtime: unnecessary for the current shot and risked flattening the hand-painted surface into a spatial gimmick.
- Global sine-wave displacement: would move walls, trunk, boy and ground together and read as a filter.
- Particle dust/leaves: no authored visual reason in the source image.
- Invented boy acting: hidden joints and clean face separation are not present in the flattened source.
- Unbounded AI inpainting: would make hidden pixels look “recovered” when they are not observable.

## Result

The runtime keeps the source composition and palette at the first and last frame. Between them, only three authored canopy owners and a nearly imperceptible painted shadow move. The five clean browser captures and source comparison are in `edits/evidence/`. The layer/matte provenance is in `assets/layers/layers.json`.

## Limitations and next pass

The hidden pixels behind the moved owners are not known; the current Gaussian continuation is intentionally low-frequency and bounded. A later art pass can replace only `static-underlay.png` with hand-painted completion without changing the runtime timeline or owner IDs. If SH03 later needs a camera move, add a separate Pixi camera container rather than increasing local leaf amplitude.


