# McDonald's Application Tracker

A single-page website that visualizes the number of people **applying to McDonald's
over time**, with selectable time ranges.

> Data shown is fabricated for illustrative purposes. Not financial advice.

## Features

- 📈 Clean dashboard-style chart powered by [Chart.js](https://www.chartjs.org/) with a sharp, angular line
- ⏱️ Time-range filters: **1D / 1M / 3M / 1Y**
- 📊 Period stats (total, peak, average) that update with the selected range
- 🔴 Red, McDonald's-inspired theme with a live applications counter and ticker

## Run it

It's pure static HTML/CSS/JS — no build step. Just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `styles.css` — dashboard styling
- `data.js` — fabricated application datasets for each time range
- `app.js` — chart rendering, range filters, stats, ticker, live counter
