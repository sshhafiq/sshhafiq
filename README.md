# McDonald's Application Tracker

A single-page, black-and-white analytical dashboard that visualizes application volume
across McDonald's U.S. job pages over time.

Live site: https://thegoldenindex.com/

> Data shown is fabricated for illustrative purposes. Not financial advice. For educational purposes only.

## Features

- Centered time-series chart (Chart.js) with a trailing moving-average overlay
- Time-range selector (1D / 1M / 3M / 1Y) reflected in the URL hash for shareable deep links
- KPI strip: total, average, peak, low, period change, and volatility (coefficient of variation)
- Cross-range summary table, CSV export of the selected range, and a methodology section
- Monochrome, typography-led layout with no decorative elements

## Production hardening

- Content Security Policy, referrer policy, and Subresource Integrity on the chart library
- Graceful degradation: statistics still render if the chart library or JavaScript data fails to load
- Open Graph and Twitter card metadata with a generated preview image, JSON-LD, canonical URL, `robots.txt`, `sitemap.xml`, web manifest, and icons
- Accessible: skip link, visible focus states, `aria-pressed` on controls, table caption, print styles, reduced-motion support
- Cache-busted asset URLs (`?v=`) so updates propagate through GitHub Pages' 10-minute cache
- Custom `404.html` and `.nojekyll` for predictable static hosting
- GitHub Actions CI validates HTML, JavaScript syntax, data integrity, the SRI hash, and runs a daily live-site smoke test

## Run it

Pure static HTML/CSS/JS with no build step. Serve the directory:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Hosted on Vercel (project `sshhafiq`, team `thegoldenindex`) and linked to this GitHub
repository. Every push to `main` deploys to production at https://thegoldenindex.com;
every pull request gets a preview URL. `www.thegoldenindex.com` redirects to the apex.
Security and caching headers are defined in `vercel.json`. The CI workflow smoke-tests
the live site, redirect, 404, and headers after each deploy and daily.

The GitHub Pages copy at https://sshhafiq.github.io/sshhafiq/ remains as a mirror and
declares the Vercel domain as canonical.

## Files

- `index.html` - page structure and metadata
- `styles.css` - monochrome styling
- `data.js` - fabricated datasets for each time range
- `app.js` - chart rendering, statistics, range switching, CSV export
- `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `assets/` - hosting and sharing assets
- `.github/workflows/ci.yml` - validation and smoke tests
