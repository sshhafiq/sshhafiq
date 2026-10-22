# McDonald's Application Tracker

A single-page, black-and-white analytical dashboard that visualizes application volume
across McDonald's U.S. job pages over time.

Live site: https://sshhafiq.github.io/sshhafiq/

> Data shown is fabricated for illustrative purposes. Not financial advice. For educational purposes only.

## Features

- Centered time-series chart (Chart.js) with a trailing moving-average overlay
- Time-range selector: 1D / 1M / 3M / 1Y
- KPI strip: total, average, peak, low, period change, and volatility (coefficient of variation)
- Cross-range summary table and a short methodology section
- Monochrome, typography-led layout with no decorative elements

## Run it

Pure static HTML/CSS/JS with no build step. Open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` - page structure
- `styles.css` - monochrome styling
- `data.js` - fabricated datasets for each time range
- `app.js` - chart rendering, statistics, range switching, summary table
