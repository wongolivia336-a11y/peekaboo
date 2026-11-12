from __future__ import annotations

from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1448, 1086
FPS = 12
FRAME_DIR = ROOT / "assets/concepts/characters/climb-frames-v3/frames"
PLATE = ROOT / "assets/layers/film-v2/SH02/plate-clean-v2.png"
OUTPUT = ROOT / "exports/SH02-climb-40frames-v3.mp4"


def smoothstep(start: float, end: float, value: float) -> float:
    phase = max(0.0, min(1.0, (value - start) / (end - start)))
    return phase * phase * (3.0 - 2.0 * phase)


def main() -> None:
    background = Image.open(PLATE).convert("RGBA")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    writer = imageio_ffmpeg.write_frames(
        str(OUTPUT),
        (WIDTH, HEIGHT),
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=2,
        pix_fmt_in="rgb24",
        pix_fmt_out="yuv420p",
    )
    writer.send(None)
    try:
        for frame_index in range(1, 41):
            frame = Image.open(FRAME_DIR / f"frame-{frame_index:03d}.png").convert("RGBA")
            frame = frame.resize((540, 540), Image.Resampling.LANCZOS)
            composite = background.copy()
            climb_travel = 340 * smoothstep(0, 39, frame_index - 1)
            composite.alpha_composite(frame, (730, round(430 - climb_travel)))
            writer.send(np.asarray(composite.convert("RGB"), dtype=np.uint8))
    finally:
        writer.close()
    print(f"Wrote {OUTPUT.relative_to(ROOT).as_posix()} ({40 / FPS:.2f}s, {FPS} fps)")


if __name__ == "__main__":
    main()
