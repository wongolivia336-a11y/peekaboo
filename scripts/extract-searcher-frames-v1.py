from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets/concepts/characters/searcher-frames-v1"
SHEET = ASSET_DIR / "searcher-16-pose-sheet.png"
FRAME_SIZE = 448
GRID = 4


def remove_green(cell: Image.Image) -> Image.Image:
    rgb = np.asarray(cell.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    green_excess = g - np.maximum(r, b)
    corners = np.asarray([rgb[0, 0], rgb[0, -1], rgb[-1, 0], rgb[-1, -1]])
    background_excess = max(float(np.median(corners[:, 1] - np.maximum(corners[:, 0], corners[:, 2]))), 120.0)
    alpha = np.clip((background_excess - green_excess) / background_excess, 0.0, 1.0)
    alpha[green_excess <= 4] = 1.0
    alpha[alpha < 0.035] = 0.0

    background = np.median(corners, axis=0)
    edge = (alpha > 0.0) & (alpha < 0.995)
    clean = rgb.copy()
    if np.any(edge):
        a = alpha[edge, None]
        clean[edge] = (rgb[edge] - (1.0 - a) * background) / np.maximum(a, 0.08)
        # Remove the residual green spill on partially covered edge pixels.
        edge_pixels = clean[edge]
        edge_pixels[:, 1] = np.minimum(edge_pixels[:, 1], np.maximum(edge_pixels[:, 0], edge_pixels[:, 2]) + 3)
        clean[edge] = edge_pixels
    rgba = np.dstack((np.clip(clean, 0, 255).astype(np.uint8), np.round(alpha * 255).astype(np.uint8)))
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    sheet = Image.open(SHEET).convert("RGB")
    width, height = sheet.size
    frames_dir = ASSET_DIR / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)
    entries: list[dict[str, object]] = []

    for row in range(GRID):
        for column in range(GRID):
            index = row * GRID + column
            cell = sheet.crop((
                round(column * width / GRID), round(row * height / GRID),
                round((column + 1) * width / GRID), round((row + 1) * height / GRID),
            ))
            cutout = remove_green(cell)
            content_bbox = cutout.getchannel("A").getbbox()
            if content_bbox:
                content = cutout.crop(content_bbox)
                cell_scale = min(FRAME_SIZE / cell.width, FRAME_SIZE / cell.height)
                fitted_size = (max(1, round(content.width * cell_scale)), max(1, round(content.height * cell_scale)))
                # Resize premultiplied RGBA so transparent green pixels cannot
                # bleed back into the antialiased character edge.
                fitted = content.convert("RGBa").resize(fitted_size, Image.Resampling.LANCZOS).convert("RGBA")
                fitted_pixels = np.asarray(fitted, dtype=np.float32)
                fitted_alpha = fitted_pixels[..., 3]
                inner_alpha = np.asarray(fitted.getchannel("A").filter(ImageFilter.MinFilter(3)), dtype=np.float32)
                outline = (fitted_alpha < 255) | (inner_alpha < 255)
                outline_pixels = fitted_pixels[outline]
                if outline_pixels.size:
                    outline_pixels[:, 1] = np.minimum(
                        outline_pixels[:, 1], np.maximum(outline_pixels[:, 0], outline_pixels[:, 2]) + 2,
                    )
                    fitted_pixels[outline] = outline_pixels
                fitted = Image.fromarray(np.clip(fitted_pixels, 0, 255).astype(np.uint8), "RGBA")
                fitted.putalpha(fitted.getchannel("A").filter(ImageFilter.MinFilter(3)))
            else:
                fitted = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
            canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
            canvas.alpha_composite(fitted, ((FRAME_SIZE - fitted.width) // 2, FRAME_SIZE - fitted.height))
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
                "sheet": SHEET.relative_to(ROOT).as_posix(),
                "cell": [column, row],
                "canvas": [FRAME_SIZE, FRAME_SIZE],
                "alpha": "green-screen keyed with edge decontamination",
            })

    manifest = {
        "version": "searcher-character-frames-v1",
        "frame_count": len(entries),
        "playback_fps": 3,
        "action_seconds": len(entries) / 3,
        "sequence": ["look-up", "scan", "search-steps", "notice", "settle"],
        "frames": entries,
    }
    (ASSET_DIR / "frames.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"frames": len(entries), "directory": frames_dir.relative_to(ROOT).as_posix()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
