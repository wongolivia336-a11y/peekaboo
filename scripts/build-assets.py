"""Build source-registered masks and bounded 2.5D layer crops for IMG-001.

The original PNG is never modified. Masks are authored in source coordinates;
the crop outputs keep the original RGB and only add an alpha matte. The
underlay is intentionally labelled an inferred, bounded completion because a
single flattened painting cannot reveal exact hidden pixels.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/images/IMG-001-tree-hide-v01.png"
MASK_DIR = ROOT / "assets/masks"
LAYER_DIR = ROOT / "assets/layers"
EXPECTED_SHA256 = "5bdda3d0d314a20af09df6ef1480ccc888a002ee5a3054228e88857c2c9730f4"
WIDTH, HEIGHT = 1448, 1086


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def scaled_polygon(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], scale: int) -> None:
    draw.polygon([(x * scale, y * scale) for x, y in points], fill=255)


def leaf_mask(source: Image.Image, bbox: tuple[int, int, int, int], polygons: list[list[tuple[int, int]]]) -> Image.Image:
    scale = 4
    mask_hi = Image.new("L", (WIDTH * scale, HEIGHT * scale), 0)
    draw = ImageDraw.Draw(mask_hi)
    for points in polygons:
        scaled_polygon(draw, points, scale)
    polygon_mask = mask_hi.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    pixels = np.array(source.convert("RGB"), dtype=np.int16)
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    chroma = pixels.max(axis=2) - pixels.min(axis=2)
    # The polygon is only a search envelope. This pixel gate keeps painted
    # leaf strokes and rejects the sky/white wall that would otherwise become
    # a moving cutout. It is not treated as semantic ground truth.
    foliage_color = (
        (green >= blue * 1.04)
        & (((green >= red * 0.86) & (green - blue > 8)) | ((red >= green * 0.88) & (green - blue > 16)))
        & (chroma > 15)
    )
    alpha = np.where(foliage_color, np.array(polygon_mask), 0).astype("uint8")
    mask = Image.fromarray(alpha, mode="L")
    return mask.filter(ImageFilter.GaussianBlur(0.55))


def boy_mask() -> Image.Image:
    scale = 4
    hi = Image.new("L", (WIDTH * scale, HEIGHT * scale), 0)
    draw = ImageDraw.Draw(hi)

    def ellipse(box: tuple[int, int, int, int]) -> None:
        draw.ellipse(tuple(value * scale for value in box), fill=255)

    def polygon(points: list[tuple[int, int]]) -> None:
        scaled_polygon(draw, points, scale)

    # Observed silhouette, traced conservatively around the visible boy.
    ellipse((914, 69, 1032, 236))
    polygon([(938, 205), (1021, 193), (1086, 247), (1112, 355), (1060, 390), (984, 336)])
    polygon([(982, 320), (1052, 313), (1077, 397), (1037, 474), (997, 466)])
    polygon([(1040, 316), (1097, 294), (1142, 369), (1114, 488), (1071, 475)])
    polygon([(1003, 445), (1048, 448), (1059, 528), (1021, 536), (990, 491)])
    polygon([(1085, 455), (1127, 452), (1140, 532), (1100, 543), (1077, 503)])
    ellipse((985, 517, 1060, 554))
    ellipse((1088, 524, 1154, 557))
    polygon([(1030, 245), (1084, 246), (1113, 365), (1091, 384), (1054, 324)])
    polygon([(1082, 350), (1112, 356), (1101, 483), (1087, 501), (1072, 474)])
    return hi.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.5))


def shadow_mask() -> Image.Image:
    scale = 4
    hi = Image.new("L", (WIDTH * scale, HEIGHT * scale), 0)
    draw = ImageDraw.Draw(hi)
    scaled_polygon(
        draw,
        [(326, 809), (489, 796), (709, 823), (979, 802), (1152, 850), (1090, 992),
         (758, 1016), (467, 984), (286, 920)],
        scale,
    )
    return hi.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(18))


def alpha_crop(source: Image.Image, mask: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    x, y, width, height = bbox
    crop = source.crop((x, y, x + width, y + height)).convert("RGBA")
    crop.putalpha(mask.crop((x, y, x + width, y + height)))
    return crop


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing admitted source image: {SOURCE}")
    actual_hash = sha256(SOURCE)
    if actual_hash != EXPECTED_SHA256:
        raise SystemExit(f"Source hash mismatch: expected {EXPECTED_SHA256}, got {actual_hash}")

    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (WIDTH, HEIGHT):
        raise SystemExit(f"Unexpected source size: {source.size}")

    definitions = {
        "foliage-left": {
            "bbox": [218, 34, 365, 392],
            "polygons": [
                [(220, 42), (291, 34), (384, 88), (481, 157), (563, 269), (535, 380),
                 (447, 422), (356, 391), (289, 332), (242, 238)],
            ],
            "role": "ENV_30_foliage_rear",
            "provenance": "observed foliage pixels inside a manually traced source-coordinate owner polygon",
        },
        "foliage-middle": {
            "bbox": [468, 272, 380, 382],
            "polygons": [
                [(481, 311), (564, 274), (682, 295), (797, 369), (842, 494), (779, 616),
                 (653, 662), (534, 618), (473, 528)],
            ],
            "role": "ENV_30_foliage_rear",
            "provenance": "observed foliage pixels inside a manually traced source-coordinate owner polygon",
        },
        "foliage-front": {
            "bbox": [794, 0, 654, 390],
            "polygons": [
                [(793, 0), (932, 0), (1002, 64), (1068, 4), (1179, 0), (1264, 61),
                 (1361, 0), (1448, 0), (1448, 392), (1329, 355), (1221, 293),
                 (1126, 355), (1034, 282), (939, 315), (854, 238)],
            ],
            "role": "ENV_50_foliage_front",
            "provenance": "observed foreground foliage pixels inside a manually traced source-coordinate owner polygon",
        },
    }

    masks: dict[str, Image.Image] = {}
    for name, definition in definitions.items():
        masks[name] = leaf_mask(source, tuple(definition["bbox"]), definition["polygons"])
    masks["boy"] = boy_mask()
    masks["shadow"] = shadow_mask()

    MASK_DIR.mkdir(parents=True, exist_ok=True)
    LAYER_DIR.mkdir(parents=True, exist_ok=True)
    for name, mask in masks.items():
        mask.save(MASK_DIR / f"{name}.png")

    combined = Image.new("L", (WIDTH, HEIGHT), 0)
    for key in ("foliage-left", "foliage-middle", "foliage-front", "boy"):
        combined = Image.fromarray(np.maximum(np.array(combined), np.array(masks[key])).astype("uint8"))

    # Bounded completion: source-guided low-frequency paint continuation only
    # inside the swept regions. This is not claimed as recovered hidden art.
    softened = source.filter(ImageFilter.GaussianBlur(7))
    underlay = source.copy()
    underlay.paste(softened, mask=combined)
    underlay.save(LAYER_DIR / "static-underlay.png")

    for name, definition in definitions.items():
        alpha_crop(source, masks[name], tuple(definition["bbox"])).save(LAYER_DIR / f"{name}.png")
    alpha_crop(source, masks["boy"], (880, 54, 300, 530)).save(LAYER_DIR / "boy.png")
    alpha_crop(source, masks["shadow"], (300, 770, 900, 280)).save(LAYER_DIR / "shadow.png")

    manifest = {
        "reference": {
            "path": "assets/images/IMG-001-tree-hide-v01.png",
            "sha256": actual_hash,
            "width": WIDTH,
            "height": HEIGHT,
        },
        "completion": {
            "method": "bounded Gaussian source continuation under moved owners",
            "authorization": "phase-1 handoff requests masked layer separation; exact hidden pixels remain unknown",
            "regions": "union of foliage and boy mattes",
        },
        "layers": dict(definitions, **{
            "boy": {"bbox": [880, 54, 300, 530], "role": "CHAR_40_boy", "provenance": "observed silhouette, manually traced conservative matte"},
            "shadow": {"bbox": [300, 770, 900, 280], "role": "FX_60_painted_shadow", "provenance": "observed painted shadow region, low-alpha modulation only"},
        }),
    }
    (LAYER_DIR / "layers.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"source": str(SOURCE), "sha256": actual_hash, "size": [WIDTH, HEIGHT], "layers": list(manifest["layers"])}, ensure_ascii=False))


if __name__ == "__main__":
    main()


