# 📈🍟 VIXMAXXING — The McDonald's Volatility Index™

A deliberately memeish single-page website with one giant chart: **McDonald's job
applications vs. the VIX (market fear index)** over time.

The (very serious, totally peer-reviewed) thesis: when markets get more volatile and
the **VIX goes up ↑**, the number of people **applying to McDonald's goes up ↑** too.

> ⚠️ All data is 100% fabricated for comedic purposes. Not financial advice.

## Features

- 🔴 Full red, meme-energy layout
- 📊 Huge dual-axis chart (applications + VIX) powered by [Chart.js](https://www.chartjs.org/)
- 🎢 Scrolling ticker tape and a fake "live" VIX readout
- 🍟 Floating burger/fry/rocket emojis and a VIX "panic scale" strip

## Run it

It's pure static HTML/CSS/JS — no build step. Just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `styles.css` — all the red meme styling
- `data.js` — the (fabricated) monthly VIX + applications dataset
- `app.js` — chart rendering, ticker, floaties, fake live VIX
