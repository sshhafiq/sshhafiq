# 🍟📈 McMAXXING — The McDonald's Application Tracker™

A deliberately memeish single-page website with one giant chart: the number of people
**applying to McDonald's over time**.

The (very serious, totally peer-reviewed) thesis: the line only goes up. We are, in
fact, so cooked. 🍳

> ⚠️ All data is 100% fabricated for comedic purposes. Not financial advice.

## Features

- 🔴 Full red, meme-energy layout
- 📊 One huge applications-over-time chart powered by [Chart.js](https://www.chartjs.org/)
- ⏱️ Time-range filters: **1D / 1M / 3M / 1Y**
- 🎢 Scrolling ticker tape and a fake "live" applications counter
- 🍟 Floating burger/fry/rocket emojis and a "how cooked is the economy" strip

## Run it

It's pure static HTML/CSS/JS — no build step. Just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `styles.css` — all the red meme styling
- `data.js` — the (fabricated) application datasets for each time range
- `app.js` — chart rendering, range filters, ticker, floaties, live counter
