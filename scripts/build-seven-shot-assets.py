"""Build hand-traced, source-registered cut-outs for the seven user keyframes.

The supplied PNGs are never rewritten. Every cut-out keeps original RGB pixels;
only the alpha matte is authored here. Plates are bounded low-frequency fills
under moved subjects and are explicitly inferred, not recovered hidden art.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
FRAME_DIR = ROOT / "assets" / "frames"
OUT = ROOT / "assets" / "layers" / "film"
MASKS = ROOT / "assets" / "masks" / "film"
W, H = 1448, 1086
SS = 3


def poly(points):
    return [tuple(map(int, p)) for p in points]


# Coordinates are in the original 1448 x 1086 source frames. Each painted part
# overlaps its joints by a few pixels so the composite can be repositioned.
PARTS = {
    "SH01": {
        "runners": [
            [(1027, 784), (1036, 778), (1044, 779), (1050, 786), (1048, 796), (1056, 804), (1055, 811), (1047, 810), (1040, 801), (1037, 812), (1029, 818), (1024, 814), (1031, 800)],
            [(1054, 786), (1064, 781), (1072, 784), (1076, 792), (1072, 801), (1080, 811), (1081, 819), (1074, 821), (1067, 812), (1064, 822), (1058, 821), (1060, 808), (1057, 798)],
            [(1095, 782), (1104, 778), (1113, 780), (1118, 789), (1115, 799), (1122, 807), (1122, 815), (1115, 816), (1108, 806), (1105, 816), (1098, 816), (1101, 803), (1098, 793)],
            [(1135, 780), (1144, 776), (1154, 779), (1159, 787), (1156, 797), (1163, 805), (1164, 813), (1157, 815), (1149, 805), (1145, 816), (1138, 815), (1141, 802), (1138, 792)],
        ],
    },
    "SH02": {
        "runner-head": [[(479, 678), (489, 674), (503, 678), (516, 687), (516, 701), (506, 713), (489, 715), (478, 706), (475, 691)]],
        "runner-body": [[(469, 705), (485, 707), (497, 716), (502, 740), (498, 765), (505, 790), (493, 807), (467, 803), (443, 791), (439, 771), (447, 748), (458, 732)]],
        "runner-arm-back": [[(465, 716), (474, 723), (462, 739), (447, 748), (433, 762), (420, 758), (423, 747), (438, 737), (450, 725)]],
        "runner-arm-front": [[(490, 718), (500, 723), (507, 740), (522, 752), (525, 765), (516, 774), (506, 763), (495, 750)]],
        "runner-leg-back": [[(448, 785), (465, 791), (463, 808), (450, 824), (442, 840), (425, 840), (419, 831), (428, 818), (435, 798)]],
        "runner-leg-front": [[(477, 785), (493, 790), (502, 810), (503, 833), (517, 844), (510, 855), (492, 852), (480, 839), (477, 817)]],
        "climber-head": [[(914, 506), (918, 491), (931, 482), (946, 477), (962, 482), (978, 492), (990, 509), (991, 529), (980, 543), (963, 552), (945, 551), (928, 544), (917, 530)]],
        "climber-arm-high": [[(1026, 408), (1035, 403), (1046, 407), (1053, 418), (1050, 432), (1043, 446), (1037, 470), (1030, 492), (1023, 510), (1010, 526), (997, 534), (985, 526), (993, 512), (1006, 497), (1012, 477), (1017, 453), (1019, 432)]],
        "climber-shirt": [[(938, 536), (952, 531), (970, 534), (985, 544), (1001, 552), (1019, 563), (1039, 577), (1053, 590), (1047, 608), (1030, 616), (1013, 605), (997, 595), (985, 621), (971, 650), (958, 671), (940, 681), (924, 675), (918, 662), (926, 641), (933, 618), (923, 600), (914, 584), (915, 564), (923, 548)]],
        "climber-arm-reach": [[(979, 540), (994, 542), (1006, 556), (1024, 567), (1045, 578), (1063, 587), (1080, 585), (1090, 572), (1098, 551), (1107, 547), (1117, 553), (1120, 565), (1115, 584), (1104, 601), (1089, 613), (1069, 619), (1049, 616), (1032, 607), (1013, 596), (995, 590)]],
        "climber-shorts": [[(934, 665), (948, 660), (968, 662), (986, 667), (1001, 677), (1008, 692), (1002, 712), (987, 730), (970, 740), (952, 735), (940, 719), (931, 699)]],
        "climber-leg-ground": [[(932, 711), (952, 716), (955, 738), (948, 767), (941, 795), (936, 823), (930, 851), (927, 882), (925, 907), (915, 927), (896, 930), (882, 924), (885, 911), (896, 885), (903, 858), (908, 832), (914, 805), (918, 778), (919, 746)]],
        "climber-shoe-ground": [[(887, 914), (916, 916), (935, 926), (947, 942), (941, 956), (923, 965), (892, 960), (878, 949), (880, 933)]],
        "climber-leg-lifted": [[(978, 683), (999, 680), (1018, 687), (1031, 703), (1035, 722), (1029, 743), (1022, 765), (1018, 784), (1004, 795), (988, 786), (980, 769), (977, 744), (970, 721)]],
        "climber-shoe-lifted": [[(1000, 765), (1020, 758), (1041, 762), (1062, 770), (1081, 780), (1090, 792), (1081, 802), (1056, 802), (1035, 795), (1014, 789)]],
    },
    "SH04": {
        "kong-head": [[(838, 383), (855, 378), (874, 381), (894, 389), (910, 404), (914, 426), (907, 447), (889, 463), (869, 470), (848, 466), (832, 454), (824, 435), (825, 410)]],
        "kong-body": [[(850, 461), (874, 464), (891, 475), (914, 480), (933, 495), (946, 530), (955, 564), (961, 591), (951, 612), (946, 636), (951, 666), (938, 684), (922, 681), (908, 670), (895, 681), (876, 683), (861, 672), (843, 680), (826, 673), (817, 659), (822, 637), (818, 613), (802, 597), (795, 580), (801, 563), (815, 548), (817, 526), (810, 507), (814, 487), (829, 474)]],
        "kong-legs": [[(841, 668), (871, 674), (887, 681), (900, 675), (924, 676), (937, 685), (930, 713), (924, 741), (924, 770), (932, 799), (923, 817), (905, 818), (892, 801), (886, 777), (878, 749), (870, 716), (859, 716), (855, 748), (855, 777), (845, 792), (829, 784), (822, 767), (823, 738), (827, 710)]],
    },
    "SH05": {
        "small-head": [[(1074, 418), (1090, 406), (1110, 405), (1131, 412), (1147, 428), (1151, 448), (1142, 467), (1127, 479), (1107, 480), (1089, 472), (1078, 457)]],
        "small-body": [[(1089, 472), (1117, 475), (1140, 486), (1150, 510), (1153, 548), (1142, 572), (1147, 596), (1135, 620), (1137, 649), (1125, 669), (1110, 674), (1096, 663), (1089, 642), (1075, 668), (1060, 674), (1046, 663), (1052, 642), (1056, 616), (1043, 596), (1045, 574), (1034, 554), (1038, 527), (1041, 502), (1055, 486), (1071, 480)]],
        "observer-head": [[(324, 219), (338, 178), (367, 144), (402, 118), (445, 87), (492, 59), (541, 39), (592, 33), (638, 43), (682, 67), (711, 104), (716, 151), (701, 203), (680, 254), (662, 304), (636, 345), (600, 371), (553, 386), (504, 380), (459, 363), (421, 337), (385, 312), (354, 280), (333, 251)]],
        "observer-body": [[(397, 327), (449, 323), (493, 349), (544, 369), (590, 394), (626, 427), (651, 471), (668, 522), (705, 568), (737, 625), (763, 693), (809, 756), (850, 819), (858, 879), (831, 931), (768, 960), (691, 954), (624, 923), (576, 877), (538, 818), (494, 777), (434, 748), (380, 715), (338, 673), (295, 627), (250, 592), (207, 551), (164, 503), (125, 459), (123, 414), (155, 376), (209, 351), (278, 338), (338, 333)]],
    },
    "SH06": {
        "tree-boy": [[(1078, 307), (1089, 297), (1101, 296), (1114, 301), (1123, 310), (1127, 323), (1121, 334), (1115, 343), (1127, 347), (1140, 351), (1150, 364), (1150, 378), (1140, 387), (1129, 390), (1109, 386), (1094, 389), (1080, 382), (1066, 382), (1053, 374), (1051, 360), (1059, 348), (1070, 340), (1070, 328)]],
    },
}


def mask_from_polygons(polygons):
    high = Image.new("L", (W * SS, H * SS), 0)
    draw = ImageDraw.Draw(high)
    for pts in polygons:
        draw.polygon([(x * SS, y * SS) for x, y in pts], fill=255)
    return high.resize((W, H), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.45))


def crop_to_mask(source, mask, destination):
    box = mask.getbbox()
    if not box:
        return None
    x0, y0, x1, y1 = box
    margin = 3
    box = (max(0, x0 - margin), max(0, y0 - margin), min(W, x1 + margin), min(H, y1 + margin))
    layer = source.crop(box).convert("RGBA")
    layer.putalpha(mask.crop(box))
    layer.save(destination, optimize=True)
    return [box[0], box[1], box[2] - box[0], box[3] - box[1]]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    MASKS.mkdir(parents=True, exist_ok=True)
    manifest = {"canvas": {"width": W, "height": H}, "method": "manual source-coordinate mattes, 3x supersampling, alpha-only cutouts", "plate_fill": "Gaussian low-frequency continuation, radius 7px under a 7px expanded matte; inferred and reversible", "shots": {}}
    for shot, named_parts in PARTS.items():
        source_path = FRAME_DIR / f"{shot}-v01.png"
        if not source_path.exists():
            raise SystemExit(f"Missing original frame: {source_path}")
        source = Image.open(source_path).convert("RGB")
        if source.size != (W, H):
            raise SystemExit(f"Unexpected frame size for {shot}: {source.size}")
        masks = {}
        shot_out = OUT / shot
        shot_masks = MASKS / shot
        shot_out.mkdir(parents=True, exist_ok=True)
        shot_masks.mkdir(parents=True, exist_ok=True)
        layers = {}
        union = Image.new("L", (W, H), 0)
        for name, polygons in named_parts.items():
            if name == "runners":
                # each far child is its own independently movable actor
                for index, one in enumerate(polygons, 1):
                    key = f"runner-{index:02d}"
                    matte = mask_from_polygons([poly(one)])
                    masks[key] = matte
                    union = Image.fromarray(np.maximum(np.asarray(union), np.asarray(matte)).astype(np.uint8), "L")
                    matte.save(shot_masks / f"{key}.png", optimize=True)
                    layers[key] = {"bbox": crop_to_mask(source, matte, shot_out / f"{key}.png"), "role": "CHAR_20_distant_runner", "provenance": "hand-traced from user-provided SH01 pixels"}
                continue
            matte = mask_from_polygons([poly(p) for p in polygons])
            masks[name] = matte
            union = Image.fromarray(np.maximum(np.asarray(union), np.asarray(matte)).astype(np.uint8), "L")
            matte.save(shot_masks / f"{name}.png", optimize=True)
            layers[name] = {"bbox": crop_to_mask(source, matte, shot_out / f"{name}.png"), "role": "CHAR_30_source_cutout", "provenance": "hand-traced from user-provided frame; RGB unchanged"}
        # Save the exact source and a reversible, bounded inferred fill plate.
        expanded = union.filter(ImageFilter.MaxFilter(15))
        softened = source.filter(ImageFilter.GaussianBlur(7))
        plate = source.copy()
        plate.paste(softened, (0, 0), expanded)
        plate.save(shot_out / "plate-inferred.png", optimize=True)
        union.save(shot_masks / "movable-union.png", optimize=True)
        digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
        manifest["shots"][shot] = {"source": str(source_path.relative_to(ROOT)).replace("\\", "/"), "sha256": digest, "layers": layers, "plate": str((shot_out / "plate-inferred.png").relative_to(ROOT)).replace("\\", "/"), "retouch_note": "Only pixels beneath the named movable matte are inferred; original PNG remains intact."}
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: len(v["layers"]) for k, v in manifest["shots"].items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
