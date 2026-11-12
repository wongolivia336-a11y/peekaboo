from __future__ import annotations

from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1448, 1086
FPS = 24
POSE_FPS = 3
REPEATS = FPS // POSE_FPS
FRAME_DIR = ROOT / "assets/concepts/characters/searcher-frames-v1/frames"
PLATE = ROOT / "assets/layers/film-v2/SH04/plate-clean-v2.png"
OUTPUT = ROOT / "exports/SH04-searcher-16poses-v1.mp4"
SCALE = 1.04
CENTER_X, BASELINE_Y = 878, 824


def main() -> None:
    background = Image.open(PLATE).convert("RGBA")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    writer = imageio_ffmpeg.write_frames(
        str(OUTPUT), (WIDTH, HEIGHT), fps=FPS, codec="libx264", quality=8,
        macro_block_size=2, pix_fmt_in="rgb24", pix_fmt_out="yuv420p",
    )
    writer.send(None)
    try:
        for index in range(16):
            pose = Image.open(FRAME_DIR / f"frame-{index + 1:03d}.png").convert("RGBA")
            size = round(448 * SCALE)
            pose = pose.resize((size, size), Image.Resampling.LANCZOS)
            composite = background.copy()
            composite.alpha_composite(pose, (round(CENTER_X - size / 2), BASELINE_Y - size))
            frame = np.asarray(composite.convert("RGB"), dtype=np.uint8)
            for _ in range(REPEATS):
                writer.send(frame)
    finally:
        writer.close()
    print(f"Wrote {OUTPUT.relative_to(ROOT).as_posix()} ({16 / POSE_FPS:.2f}s, {FPS} fps)")


if __name__ == "__main__":
    main()
