#!/usr/bin/env bash
# Re-encode navbar logo video for smaller size and fixed width (navbar uses /Adswadi.webm).
# Requires: ffmpeg (e.g. sudo apt install ffmpeg)
#
# Usage from repo root:
#   chmod +x scripts/optimize-navbar-webm.sh
#   ./scripts/optimize-navbar-webm.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IN="${ROOT}/public/Adswadi.webm"
OUT="${ROOT}/public/Adswadi.webm.optimized"
BAK="${ROOT}/public/Adswadi.webm.bak"

if [[ ! -f "$IN" ]]; then
  echo "Missing: $IN"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it, e.g.: sudo apt install ffmpeg"
  exit 1
fi

echo "Input:  $IN ($(du -h "$IN" | cut -f1))"
ffmpeg -y -i "$IN" -b:v 200k -vf "scale=300:-1" "$OUT"
echo "Output: $OUT ($(du -h "$OUT" | cut -f1))"
cp -a "$IN" "$BAK"
mv "$OUT" "$IN"
echo "Replaced $IN (backup: $BAK)"

# H.264 MP4 for iOS Safari (NavbarLogo lists this source first; Safari does not play WebM).
MP4_OUT="${ROOT}/public/Adswadi.mp4"
ffmpeg -y -i "$IN" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -vf "scale=300:-1" -an "$MP4_OUT"
echo "Wrote $MP4_OUT for mobile Safari"
