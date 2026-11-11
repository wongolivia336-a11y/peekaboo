from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "edits" / "evidence"
SOURCE = ROOT / "assets" / "images" / "IMG-001-tree-hide-v01.png"
FRAMES = [
    ("source", SOURCE),
    ("t=0.0s", EVIDENCE / "SH03-t00000.png"),
    ("t=2.5s", EVIDENCE / "SH03-t02500.png"),
    ("t=5.0s", EVIDENCE / "SH03-t05000.png"),
    ("t=7.5s", EVIDENCE / "SH03-t07500.png"),
    ("t=10.0s", EVIDENCE / "SH03-t10000.png"),
]

thumb_w, thumb_h = 482, 362
label_h = 42
sheet = Image.new("RGB", (thumb_w * 2, (thumb_h + label_h) * 3), (24, 25, 22))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("arial.ttf", 18)
except OSError:
    font = ImageFont.load_default()

for index, (label, path) in enumerate(FRAMES):
    image = Image.open(path).convert("RGB")
    image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    x = (index % 2) * thumb_w
    y = (index // 2) * (thumb_h + label_h)
    cell = Image.new("RGB", (thumb_w, thumb_h), (18, 19, 17))
    cell.paste(image, ((thumb_w - image.width) // 2, (thumb_h - image.height) // 2))
    sheet.paste(cell, (x, y))
    draw.rectangle((x, y + thumb_h, x + thumb_w, y + thumb_h + label_h), fill=(36, 38, 33))
    draw.text((x + 14, y + thumb_h + 11), label, fill=(235, 224, 186), font=font)

output = EVIDENCE / "SH03-contact-sheet.png"
sheet.save(output, optimize=True)
print(output)


