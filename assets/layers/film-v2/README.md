# Film v2 separated assets

This package keeps character pixels and background plates separate for 2D animation.

- Each shot from `SH01` through `SH06` has a `plate-clean-v2.png` background. Generated clean plates are composited only inside the expanded character/leaf repair mask; original source pixels remain untouched outside that region.
- `characters-fullframe-v2.png` is an aligned 1448 × 1086 RGBA cutout using the source character pixels and the shot's union matte.
- `actors/` contains one transparent full-body source-pixel PNG per figure. Animation keeps each cutout intact to prevent detached limbs and gaps.
- SH02 uses 40 individually exported transparent full-body drawings at 12 fps, then holds the final hiding pose; its larger repair matte gives the drawn sequence room over the background plate.
- `parts/` retains the original traced pieces as source material; the runtime no longer animates individual limbs.
- `generated-plates/` preserves the full generated background references. `assets/masks/film-v2/` preserves both character union masks and background repair masks.
- SH03 keeps its PixiJS foliage and boy layers over the new clean plate. Its source-derived character cutout and foliage pieces are included here for reuse.
- `assets/concepts/characters/climb-frames-v2/frames/` contains the 40 transparent animation frames; the five green-screen pose sheets are preserved beside them. The earlier expression atlas remains a separate concept asset.

Rebuild the aligned cutouts, repair masks, clean plates, frame crops, and manifest with:

```powershell
npm run assets:film-v2
npm run assets:climb-frames-v2
```

The original source frames and v1 mattes remain preserved.
