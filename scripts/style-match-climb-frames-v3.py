from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets/concepts/characters/climb-frames-v2/frames"
OUTPUT_DIR = ROOT / "assets/concepts/characters/climb-frames-v3/frames"
FRAME_COUNT = 40


def grade_frame(source: Image.Image, index: int) -> Image.Image:
    rgba = source.convert("RGBA")
    alpha = rgba.getchannel("A")
    rgb = rgba.convert("RGB")
    # The source character sits in the canopy shade. Lower chroma and contrast
    # to meet the muted, matte pigments in IMG-001 without changing line detail.
    rgb = ImageEnhance.Color(rgb).enhance(0.70)
    rgb = ImageEnhance.Contrast(rgb).enhance(0.92)
    rgb = ImageEnhance.Brightness(rgb).enhance(0.94)
    rgb = rgb.filter(ImageFilter.GaussianBlur(0.18))

    pixels = np.asarray(rgb, dtype=np.float32)
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    luminance = pixels.mean(axis=2)
    # Nudge dark warm pigments (hair and shorts) toward the original's deeper
    # charcoal/olive-brown, keeping skin and the light shirt out of this grade.
    dark_warm = (red > green * 1.06) & (green > blue * 1.01) & (luminance < 150)
    pixels[dark_warm] *= np.array([0.91, 0.92, 0.96], dtype=np.float32)

    rng = np.random.default_rng(927 + index)
    grain = rng.normal(0.0, 1.35, (pixels.shape[0], pixels.shape[1], 1))
    visible = np.asarray(alpha) > 0
    pixels[visible] += grain[visible]
    result = Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    result.putalpha(alpha)
    return result


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    entries: list[dict[str, object]] = []
    for index in range(FRAME_COUNT):
        source = SOURCE_DIR / f"frame-{index + 1:03d}.png"
        destination = OUTPUT_DIR / source.name
        grade_frame(Image.open(source), index).save(destination, optimize=True)
        entries.append({
            "index": index,
            "source": source.relative_to(ROOT).as_posix(),
            "frame": destination.relative_to(ROOT).as_posix(),
            "canvas": [448, 448],
            "alpha": "preserved transparent full-body character cutout",
            "grade": "muted canopy palette, softened contrast, fine paper grain",
        })

    manifest = {
        "version": "climb-frame-animation-v3",
        "frame_count": FRAME_COUNT,
        "playback_fps": 12,
        "action_seconds": FRAME_COUNT / 12,
        "identity_reference": "assets/images/IMG-001-tree-hide-v01.png",
        "sequence": ["reach", "grip", "pull", "raise-knee", "hide-and-glance"],
        "frames": entries,
    }
    (OUTPUT_DIR.parent / "frames.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"frames": len(entries), "directory": OUTPUT_DIR.relative_to(ROOT).as_posix()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
