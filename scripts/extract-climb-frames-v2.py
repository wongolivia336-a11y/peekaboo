from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets/concepts/characters/climb-frames-v2"
SHEET_COUNT = 5
COLUMNS = 4
ROWS = 2
FRAME_SIZE = 448


def remove_green(cell: Image.Image) -> Image.Image:
    rgb = np.asarray(cell.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    green_excess = g - np.maximum(r, b)

    # Estimate antialiased edge opacity from the green-screen channel mixture.
    background_excess = float(np.median([
        green_excess[0, 0], green_excess[0, -1],
        green_excess[-1, 0], green_excess[-1, -1],
    ]))
    alpha = np.clip((background_excess - green_excess) / background_excess, 0.0, 1.0)
    alpha[green_excess <= 5] = 1.0
    alpha[alpha < 0.035] = 0.0

    # Decontaminate partially transparent edge pixels against the sampled green.
    bg = np.median(np.asarray([
        rgb[0, 0], rgb[0, -1], rgb[-1, 0], rgb[-1, -1],
    ]), axis=0)
    edge = (alpha > 0.0) & (alpha < 0.995)
    clean = rgb.copy()
    if np.any(edge):
        a = alpha[edge, None]
        clean[edge] = (rgb[edge] - (1.0 - a) * bg) / np.maximum(a, 0.08)
        edge_pixels = clean[edge]
        edge_pixels[:, 1] = np.minimum(edge_pixels[:, 1], np.maximum(edge_pixels[:, 0], edge_pixels[:, 2]) + 3)
        clean[edge] = edge_pixels
    clean = np.clip(clean, 0, 255).astype(np.uint8)
    rgba = np.dstack((clean, np.round(alpha * 255).astype(np.uint8)))
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    frames_dir = ASSET_DIR / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)
    entries: list[dict[str, object]] = []

    for sheet_number in range(1, SHEET_COUNT + 1):
        sheet_path = ASSET_DIR / f"pose-sheet-{sheet_number:02d}.png"
        sheet = Image.open(sheet_path).convert("RGB")
        width, height = sheet.size
        first_index = (sheet_number - 1) * COLUMNS * ROWS

        for row in range(ROWS):
            for column in range(COLUMNS):
                index = first_index + row * COLUMNS + column
                left = round(column * width / COLUMNS)
                right = round((column + 1) * width / COLUMNS)
                top = round(row * height / ROWS)
                bottom = round((row + 1) * height / ROWS)
                cutout = remove_green(sheet.crop((left, top, right, bottom)))

                canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                offset_x = (FRAME_SIZE - cutout.width) // 2
                offset_y = FRAME_SIZE - cutout.height
                canvas.alpha_composite(cutout, (offset_x, offset_y))
                alpha = np.asarray(canvas.getchannel("A"), dtype=np.float32)
                y_grid, x_grid = np.indices(alpha.shape)
                centroid_x = float((alpha * x_grid).sum() / max(alpha.sum(), 1.0))
                shift_x = round(FRAME_SIZE / 2 - centroid_x)
                if shift_x:
                    aligned = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                    source_left = max(0, -shift_x)
                    source_right = min(FRAME_SIZE, FRAME_SIZE - shift_x)
                    aligned.alpha_composite(
                        canvas.crop((source_left, 0, source_right, FRAME_SIZE)),
                        (max(0, shift_x), 0),
                    )
                    canvas = aligned
                alpha_bbox = canvas.getchannel("A").getbbox()
                if alpha_bbox:
                    baseline_shift = FRAME_SIZE - alpha_bbox[3]
                    if baseline_shift > 0:
                        aligned = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                        aligned.alpha_composite(
                            canvas.crop((0, 0, FRAME_SIZE, FRAME_SIZE - baseline_shift)),
                            (0, baseline_shift),
                        )
                        canvas = aligned
                destination = frames_dir / f"frame-{index + 1:03d}.png"
                canvas.save(destination, optimize=True)
                entries.append({
                    "index": index,
                    "frame": destination.relative_to(ROOT).as_posix(),
                    "sheet": sheet_path.relative_to(ROOT).as_posix(),
                    "cell": [column, row],
                    "canvas": [FRAME_SIZE, FRAME_SIZE],
                    "alpha": "green-screen keyed with antialiased edge decontamination",
                })

    manifest = {
        "version": "climb-frame-animation-v2",
        "frame_count": len(entries),
        "playback_fps": 12,
        "action_seconds": len(entries) / 12,
        "sequence": ["reach", "grip", "pull", "raise-knee", "hide-and-glance"],
        "frames": entries,
    }
    (ASSET_DIR / "frames.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"frames": len(entries), "directory": frames_dir.relative_to(ROOT).as_posix()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
