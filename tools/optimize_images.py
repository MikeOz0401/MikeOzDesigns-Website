#!/usr/bin/env python3
"""Generate optimised WebP copies of site images.

Originals are never modified. For every .jpg/.jpeg/.png under images/ a sibling
.webp is written, resized so its longest edge fits within a sensible cap and
re-encoded at a good quality/size balance. Re-running only regenerates outputs
whose source is newer, so it is safe to run repeatedly.

The scripts are re-runnable: drop in new images, run python3 tools/optimize_images.py then python3 tools/rewrite_image_refs.py, and they'll only process what's new.
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "images"

# Longest-edge caps (px). The hero background is displayed full-bleed so it
# gets a larger cap; everything else is capped for portfolio/modal display.
DEFAULT_MAX_EDGE = 1600
HERO_MAX_EDGE = 2000
HERO_NAMES = {"Small-Hero-bg.jpg"}

QUALITY = 80
CONVERTIBLE = {".jpg", ".jpeg", ".png"}


def human(num_bytes: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if num_bytes < 1024 or unit == "GB":
            return f"{num_bytes:.1f}{unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f}GB"


def optimise(src: Path) -> tuple[int, int]:
    """Return (original_bytes, webp_bytes) for one image."""
    dest = src.with_suffix(".webp")
    original_bytes = src.stat().st_size

    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return original_bytes, dest.stat().st_size

    max_edge = HERO_MAX_EDGE if src.name in HERO_NAMES else DEFAULT_MAX_EDGE

    with Image.open(src) as img:
        has_alpha = img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        )
        img = img.convert("RGBA" if has_alpha else "RGB")

        longest = max(img.width, img.height)
        if longest > max_edge:
            scale = max_edge / longest
            img = img.resize(
                (round(img.width * scale), round(img.height * scale)),
                Image.LANCZOS,
            )

        img.save(dest, "WEBP", quality=QUALITY, method=6)

    return original_bytes, dest.stat().st_size


def main() -> int:
    if not IMAGES_DIR.is_dir():
        print(f"images directory not found: {IMAGES_DIR}", file=sys.stderr)
        return 1

    sources = sorted(
        p
        for p in IMAGES_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in CONVERTIBLE
    )

    total_original = 0
    total_webp = 0
    count = 0

    for src in sources:
        try:
            orig, webp = optimise(src)
        except Exception as exc:  # noqa: BLE001 - report and keep going
            print(f"  SKIP {src.relative_to(ROOT)} ({exc})", file=sys.stderr)
            continue
        total_original += orig
        total_webp += webp
        count += 1

    print(f"Processed {count} images")
    print(f"  Original (source formats): {human(total_original)}")
    print(f"  WebP output:               {human(total_webp)}")
    if total_original:
        saved = 100 * (1 - total_webp / total_original)
        print(f"  Reduction:                 {saved:.1f}%")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
