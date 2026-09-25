#!/bin/sh
# Converts captures/*.png into resources/screenshots/*.webp (2000 px and 1000 px wide),
# and rebuilds resources/og-image.png from captures/01-overview.png.
# Needs: brew install webp ffmpeg
set -e
cd "$(dirname "$0")/.."

for png in captures/*.png; do
    [ -e "$png" ] || { echo "No PNG in captures/"; exit 1; }
    name=$(basename "$png" .png)
    cwebp -quiet -q 86 -m 6 -resize 2000 0 "$png" -o "resources/screenshots/$name.webp"
    cwebp -quiet -q 82 -m 6 -resize 1000 0 "$png" -o "resources/screenshots/$name-1000.webp"
    echo "✓ $name"
done

if [ -e captures/01-overview.png ]; then
    ffmpeg -loglevel error -y -f lavfi -i "color=c=0x030303:s=1200x630" \
        -i captures/01-overview.png -i resources/app-icon-512.png \
        -filter_complex "[1:v]scale=-1:600[s];[2:v]scale=200:200[i];[0:v][s]overlay=x=300:y=(H-h)/2+8[b];[b][i]overlay=x=60:y=(H-h)/2" \
        -frames:v 1 resources/og-image.png
    echo "✓ og-image"
fi
