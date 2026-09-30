# helix-desktop.com

The website of [Helix](https://github.com/mickaphd/Helix), a free, open-source and private alternative to GraphPad Prism for macOS.

A static site with no build step, deployed by Vercel on every push to `main`.

```bash
node scripts/serve.mjs          # preview on http://localhost:4321
sh scripts/prepare-images.sh    # captures/*.png → resources/screenshots/*.webp
```
