// 100% fabricated data for memeing purposes.
// The thesis: as the VIX (market fear) spikes, so do McDonald's applications.
// Monthly data from Jan 2019 -> Jun 2026.

const MEME_DATA = (() => {
  // [label, vix] — vix loosely mirrors real-world vibes (COVID spike, 2022 chop, etc.)
  const points = [
    ["Jan '19", 18], ["Feb '19", 15], ["Mar '19", 14], ["Apr '19", 13],
    ["May '19", 17], ["Jun '19", 15], ["Jul '19", 14], ["Aug '19", 19],
    ["Sep '19", 16], ["Oct '19", 15], ["Nov '19", 12], ["Dec '19", 14],
    ["Jan '20", 18], ["Feb '20", 40], ["Mar '20", 82], ["Apr '20", 47],
    ["May '20", 28], ["Jun '20", 31], ["Jul '20", 25], ["Aug '20", 23],
    ["Sep '20", 26], ["Oct '20", 38], ["Nov '20", 21], ["Dec '20", 22],
    ["Jan '21", 25], ["Feb '21", 28], ["Mar '21", 20], ["Apr '21", 18],
    ["May '21", 17], ["Jun '21", 16], ["Jul '21", 18], ["Aug '21", 16],
    ["Sep '21", 23], ["Oct '21", 17], ["Nov '21", 27], ["Dec '21", 19],
    ["Jan '22", 24], ["Feb '22", 31], ["Mar '22", 33], ["Apr '22", 33],
    ["May '22", 29], ["Jun '22", 28], ["Jul '22", 22], ["Aug '22", 25],
    ["Sep '22", 31], ["Oct '22", 26], ["Nov '22", 21], ["Dec '22", 22],
    ["Jan '23", 19], ["Feb '23", 20], ["Mar '23", 26], ["Apr '23", 16],
    ["May '23", 18], ["Jun '23", 14], ["Jul '23", 13], ["Aug '23", 17],
    ["Sep '23", 17], ["Oct '23", 21], ["Nov '23", 13], ["Dec '23", 12],
    ["Jan '24", 13], ["Feb '24", 14], ["Mar '24", 13], ["Apr '24", 15],
    ["May '24", 13], ["Jun '24", 12], ["Jul '24", 17], ["Aug '24", 38],
    ["Sep '24", 17], ["Oct '24", 20], ["Nov '24", 14], ["Dec '24", 17],
    ["Jan '25", 18], ["Feb '25", 20], ["Mar '25", 24], ["Apr '25", 52],
    ["May '25", 30], ["Jun '25", 22], ["Jul '25", 18], ["Aug '25", 19],
    ["Sep '25", 16], ["Oct '25", 21], ["Nov '25", 29], ["Dec '25", 24],
    ["Jan '26", 27], ["Feb '26", 33], ["Mar '26", 45], ["Apr '26", 38],
    ["May '26", 31], ["Jun '26", 28],
  ];

  const labels = points.map((p) => p[0]);
  const vix = points.map((p) => p[1]);

  // Applications = a deterministic-but-wiggly function of the VIX.
  // Baseline + VIX^1.6 scaling, with a tiny pseudo-random wiggle for "realism".
  const apps = vix.map((v, i) => {
    const seed = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const wiggle = 1 + (seed - 0.5) * 0.18;
    const base = 12000;
    const value = base + Math.pow(v, 1.3) * 650 * wiggle;
    return Math.round(value / 100) * 100;
  });

  return { labels, vix, apps };
})();
