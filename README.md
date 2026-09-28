<div align="center">
  <br />
  <a href="https://www.helix-desktop.com">
    <img src="resources/app-icon-512.png" alt="Helix Logo" width="140" height="140">
  </a>

  <h1>Helix website</h1>

  <p>Source of <a href="https://www.helix-desktop.com">www.helix-desktop.com</a>, the website of
  <a href="https://github.com/mickaphd/Helix">Helix</a>: a free, open-source and private
  alternative to GraphPad Prism for macOS.</p>

  <p>
    <a href="https://www.helix-desktop.com">🌐 Website</a>
    &nbsp;•&nbsp;
    <a href="https://github.com/mickaphd/Helix/releases/latest">⬇️ Download Helix</a>
    &nbsp;•&nbsp;
    <a href="https://github.com/mickaphd/Helix">💻 App source code</a>
  </p>
  <br />
</div>

## How it works

A plain static site (HTML and CSS, no build step), deployed by Vercel on every push to `main`.

- `index.html`: home page · `404.html`: page not found · `llms.txt`: summary for AI assistants
- `assets/`: shared stylesheet and script
- `resources/screenshots/`: screenshots in WebP, made from the PNGs in `captures/` (not in git) with
  `sh scripts/prepare-images.sh` (needs `brew install webp ffmpeg`)
- `scripts/serve.mjs`: local preview (`node scripts/serve.mjs`, then http://localhost:4321)

Download buttons point to the app's
[latest release](https://github.com/mickaphd/Helix/releases/latest), so the site doesn't need
updating when a new version comes out.
