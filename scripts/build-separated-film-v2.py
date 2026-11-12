from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1448, 1086
EXPAND_RADIUS = 31
SHOT_EXPAND_RADIUS = {"SH02": 197}
FEATHER_RADIUS = 2.0

SHOT_PARTS = {
    "SH01": ["runner-01", "runner-02", "runner-03", "runner-04"],
    "SH02": [
        "climber-arm-high", "climber-arm-reach", "climber-head", "climber-leg-ground",
        "climber-leg-lifted", "climber-shirt", "climber-shoe-ground", "climber-shoe-lifted",
        "climber-shorts", "runner-arm-back", "runner-arm-front", "runner-body", "runner-head",
        "runner-leg-back", "runner-leg-front",
    ],
    "SH04": ["kong-body", "kong-head", "kong-legs"],
    "SH05": ["observer-body", "observer-head", "small-body", "small-head"],
    "SH06": ["tree-boy"],
}

ACTORS = {
    "SH01": {f"runner-{index:02d}": [f"runner-{index:02d}"] for index in range(1, 5)},
    "SH02": {
        "climber": [
            "climber-arm-high", "climber-arm-reach", "climber-head", "climber-leg-ground",
            "climber-leg-lifted", "climber-shirt", "climber-shoe-ground", "climber-shoe-lifted",
            "climber-shorts",
        ],
        "runner": ["runner-arm-back", "runner-arm-front", "runner-body", "runner-head", "runner-leg-back", "runner-leg-front"],
    },
    "SH04": {"kong": ["kong-body", "kong-head", "kong-legs"]},
    "SH05": {
        "observer": ["observer-body", "observer-head"],
        "small-boy": ["small-body", "small-head"],
    },
    "SH06": {"tree-boy": ["tree-boy"]},
}

SOURCES = {
    "SH01": "assets/frames/SH01-v01.png",
    "SH02": "assets/frames/SH02-v01.png",
    "SH03": "assets/images/IMG-001-tree-hide-v01.png",
    "SH04": "assets/frames/SH04-v01.png",
    "SH05": "assets/frames/SH05-v01.png",
    "SH06": "assets/frames/SH06-v01.png",
}

GENERATED_PLATES = {
    shot: ROOT / "assets/layers/film-v2/generated-plates" / f"{shot}.png"
    for shot in ("SH01", "SH02", "SH03", "SH04", "SH05", "SH06")
}


def character_matte(shot: str) -> Image.Image:
    if shot == "SH03":
        return Image.open(ROOT / "assets/masks/boy.png").convert("L")
    return Image.open(ROOT / "assets/masks/film" / shot / "movable-union.png").convert("L")


def background_repair_matte(shot: str) -> Image.Image:
    if shot != "SH03":
        return character_matte(shot)
    masks = ["boy", "foliage-left", "foliage-middle", "foliage-front"]
    combined = Image.new("L", (WIDTH, HEIGHT), 0)
    for name in masks:
        matte = Image.open(ROOT / "assets/masks" / f"{name}.png").convert("L")
        combined = Image.frombytes("L", combined.size, bytes(max(a, b) for a, b in zip(combined.tobytes(), matte.tobytes())))
    return combined


def source_rgba(shot: str) -> Image.Image:
    return Image.open(ROOT / SOURCES[shot]).convert("RGBA")


def prepare_cutout(shot: str, matte: Image.Image, destination: Path) -> None:
    image = source_rgba(shot)
    if image.size != matte.size:
        raise ValueError(f"{shot}: source/matte size mismatch: {image.size} vs {matte.size}")
    image.putalpha(matte)
    image.save(destination, optimize=True)


def actor_matte(shot: str, part_names: list[str]) -> Image.Image:
    combined = Image.new("L", (WIDTH, HEIGHT), 0)
    for name in part_names:
        mask_path = ROOT / "assets/masks/film" / shot / f"{name}.png"
        if not mask_path.exists():
            raise FileNotFoundError(f"Missing source alpha mask for {shot}/{name}: {mask_path}")
        mask = Image.open(mask_path).convert("L")
        if mask.size != combined.size:
            raise ValueError(f"{shot}/{name}: mask size mismatch: {mask.size}")
        combined = ImageChops.lighter(combined, mask)
    return combined


def prepare_plate(shot: str, matte: Image.Image, destination: Path) -> None:
    generated_path = GENERATED_PLATES[shot]
    original = Image.open(ROOT / SOURCES[shot]).convert("RGB")
    generated = Image.open(generated_path).convert("RGB")
    if original.size != (WIDTH, HEIGHT) or generated.size != original.size or matte.size != original.size:
        raise ValueError(f"{shot}: source, generated plate, and matte must all be {WIDTH}x{HEIGHT}")

    expand_radius = SHOT_EXPAND_RADIUS.get(shot, EXPAND_RADIUS)
    repair_region = matte.filter(ImageFilter.MaxFilter(expand_radius))
    repair_region = repair_region.filter(ImageFilter.GaussianBlur(FEATHER_RADIUS))
    plate = Image.composite(generated, original, repair_region)
    plate.save(destination, optimize=True)

    mask_path = ROOT / "assets/masks/film-v2" / shot / "background-repair.png"
    mask_path.parent.mkdir(parents=True, exist_ok=True)
    repair_region.save(mask_path, optimize=True)


def copy_character_parts(shot: str, part_names: list[str], destination: Path) -> dict[str, str]:
    result: dict[str, str] = {}
    if shot == "SH03":
        source_dir = ROOT / "assets/layers"
        names = ["boy", "foliage-left", "foliage-middle", "foliage-front"]
    else:
        source_dir = ROOT / "assets/layers/film" / shot
        names = part_names

    destination.mkdir(parents=True, exist_ok=True)
    for name in names:
        source = source_dir / f"{name}.png"
        target = destination / f"{name}.png"
        if source.exists():
            shutil.copy2(source, target)
            result[name] = target.relative_to(ROOT).as_posix()
    return result


def main() -> None:
    manifest: dict[str, object] = {
        "version": "film-v2-separated-assets",
        "canvas": {"width": WIDTH, "height": HEIGHT},
        "background_method": "generated clean plate composited only under a dilated, feathered movement matte; source pixels preserved outside repair mask",
        "mask_expansion_px": {shot: (SHOT_EXPAND_RADIUS.get(shot, EXPAND_RADIUS) - 1) // 2 for shot in SOURCES},
        "character_method": "source frame RGB with unions of hand-traced alpha mattes for whole-body sprites; SH02 also uses complete transparent pose illustrations",
        "shots": {},
    }

    shots: dict[str, object] = {}
    for shot in SOURCES:
        matte = character_matte(shot)
        repair_matte = background_repair_matte(shot)
        output_dir = ROOT / "assets/layers/film-v2" / shot
        parts_dir = output_dir / "parts"
        output_dir.mkdir(parents=True, exist_ok=True)
        matte_target = ROOT / "assets/masks/film-v2" / shot / "characters-union.png"
        matte_target.parent.mkdir(parents=True, exist_ok=True)
        matte.save(matte_target, optimize=True)

        cutout_path = output_dir / "characters-fullframe-v2.png"
        prepare_cutout(shot, matte, cutout_path)
        parts = copy_character_parts(shot, SHOT_PARTS.get(shot, []), parts_dir)
        actors: dict[str, object] = {}
        actor_dir = output_dir / "actors"
        actor_dir.mkdir(parents=True, exist_ok=True)
        actor_mask_dir = ROOT / "assets/masks/film-v2" / shot / "actors"
        actor_mask_dir.mkdir(parents=True, exist_ok=True)
        for actor_name, part_names in ACTORS.get(shot, {}).items():
            actor_alpha = actor_matte(shot, part_names)
            actor_box = actor_alpha.getbbox()
            if actor_box is None:
                raise ValueError(f"No visible source pixels for {shot}/{actor_name}")
            actor_mask_path = actor_mask_dir / f"{actor_name}.png"
            actor_alpha.save(actor_mask_path, optimize=True)
            actor_path = actor_dir / f"{actor_name}.png"
            prepare_cutout(shot, actor_alpha, actor_path)
            actors[actor_name] = {
                "image": actor_path.relative_to(ROOT).as_posix(),
                "alpha": actor_mask_path.relative_to(ROOT).as_posix(),
                "bbox": [actor_box[0], actor_box[1], actor_box[2] - actor_box[0], actor_box[3] - actor_box[1]],
                "source_parts": part_names,
            }
        plate_path: str | None = None
        generated_path: str | None = None
        if shot in GENERATED_PLATES:
            clean_plate = output_dir / "plate-clean-v2.png"
            prepare_plate(shot, repair_matte, clean_plate)
            plate_path = clean_plate.relative_to(ROOT).as_posix()
            generated_path = GENERATED_PLATES[shot].relative_to(ROOT).as_posix()
        shots[shot] = {
            "source": SOURCES[shot],
            "background_plate": plate_path,
            "generated_background_source": generated_path,
            "transparent_fullframe_characters": cutout_path.relative_to(ROOT).as_posix(),
            "union_matte": matte_target.relative_to(ROOT).as_posix(),
            "character_parts": parts,
            "actors": actors,
            "status": "clean-background-v2" if plate_path else "source-layer-stack-preserved",
        }

    manifest["shots"] = shots
    output_path = ROOT / "assets/layers/film-v2/manifest.json"
    output_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output_path), "shots": len(shots), "generated_backgrounds": len(GENERATED_PLATES), "source_pixel_actors": sum(len(v) for v in ACTORS.values())}, ensure_ascii=False))


if __name__ == "__main__":
    main()
