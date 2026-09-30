# G50T — corporate site

One-page static site for G50T LLC (https://t50g.com). Plain `index.html` + `styles.css` + `main.js`, no build step, no dependencies. The only external resource is Google Fonts.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Change the accent colour

Edit one line in `styles.css`:

```css
:root { --accent: #c8ff3d; }
```

The button, logo mark, "Apple"/"Google" and the orbit background all follow it. Tested alternatives: `#7c6cff`, `#ff6a3d`, `#3dd9ff`.

## Orbit background

Built by `main.js` from plain divs and animated with CSS (`transform` only). Defaults live in the `ORBITS` object; any value can be overridden with a `data-*` attribute on `.bg` in `index.html`, no JS edits needed:

```html
<div class="bg" aria-hidden="true" data-orbits="5" data-tilt="70" data-speed="0.5"></div>
```

| Attribute | Range | Default |
|---|---|---|
| `data-orbits` | 1–6 | 4 (mobile 3) |
| `data-objects` | 1–6 | 3 |
| `data-tilt` | 0–85 | 60 |
| `data-spread` | 0.5–1.6 | 1 (mobile 0.6) |
| `data-object-size` | 0.5–2.5 | 1 |
| `data-ring-opacity` | 0–0.5 | 0.14 |
| `data-center-x` | % | 66 (mobile 50) |
| `data-center-y` | % | 46 (mobile 35) |
| `data-speed` | 0.25–3 | 1 |
| `data-intensity` | 0–1 | 1 (mobile 0.8) |
| `data-accent`, `data-secondary` | colour | from `--accent` / `--secondary` |

Mobile defaults apply below 768 px; a `data-*` attribute wins over them. `prefers-reduced-motion: reduce` stops the animation.

## Deploy

Any static host works — upload the repository root as is.

- **Cloudflare Pages / Netlify**: connect the repo, no build command, output directory `/`.
- **GitHub Pages**: publish from the `main` branch, root folder.

Point `t50g.com` at the host and keep `robots.txt` / `sitemap.xml` at the root.
