#!/usr/bin/env python3
"""Point image references at the optimised .webp copies.

- index.html: rewrite src / data-image-src (.jpg/.jpeg/.png -> .webp) and drop
  the broken duplicate srcset attributes.
- css/main.css: rewrite url("../images/...") background references.

Every rewrite is verified against an existing .webp on disk; missing targets
are reported and left untouched so nothing silently breaks.
"""

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
CSS = ROOT / "css" / "main.css"

EXT_RE = re.compile(r"\.(jpe?g|png)$", re.IGNORECASE)
missing: list[str] = []


def to_webp(path_str: str, base: Path) -> str | None:
    """Return the .webp path string if the file exists, else None."""
    if not EXT_RE.search(path_str):
        return None
    webp_str = EXT_RE.sub(".webp", path_str)
    disk = (base / unquote(webp_str)).resolve()
    if disk.is_file():
        return webp_str
    missing.append(webp_str)
    return None


def rewrite_html(text: str) -> str:
    # Drop broken/duplicate srcset attributes entirely.
    text = re.sub(r'\s*srcset="[^"]*"', "", text)

    def repl(m: re.Match) -> str:
        attr, quote, path = m.group("attr"), m.group("q"), m.group("path")
        webp = to_webp(path, ROOT)
        return f'{attr}={quote}{webp}{quote}' if webp else m.group(0)

    pattern = re.compile(
        r'(?P<attr>src|data-image-src)=(?P<q>")(?P<path>images/[^"]+?)(?P=q)'
    )
    return pattern.sub(repl, text)


def rewrite_css(text: str) -> str:
    def repl(m: re.Match) -> str:
        prefix, path, suffix = m.group(1), m.group(2), m.group(3)
        webp = to_webp(path, CSS.parent)
        return f"{prefix}{webp}{suffix}" if webp else m.group(0)

    # url("../images/foo.jpg") with optional quotes
    pattern = re.compile(r'(url\(["\']?)(\.\./images/[^"\')]+)(["\']?\))')
    return pattern.sub(repl, text)


def main() -> int:
    for label, path, fn in (
        ("index.html", HTML, rewrite_html),
        ("css/main.css", CSS, rewrite_css),
    ):
        original = path.read_text(encoding="utf-8")
        updated = fn(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            print(f"updated {label}")
        else:
            print(f"no changes {label}")

    if missing:
        print("\nWARNING: referenced .webp files not found (left unchanged):",
              file=sys.stderr)
        for m in sorted(set(missing)):
            print(f"  {m}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
