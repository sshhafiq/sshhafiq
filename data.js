// 100% fabricated data for memeing purposes.
// A pure McDonald's-application tracker. The line only goes up.
// Provides four time ranges: 1 day (hourly), 1 month + 3 months (daily), 1 year (monthly).

const MCD_DATA = (function () {
  // Tiny seeded PRNG so the "data" is stable between reloads.
  function rng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildSeries(n, opts, labelFn, seed) {
    const r = rng(seed);
    const labels = [];
    const values = [];
    const round = opts.round || 1;
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 1;
      let v = opts.base + opts.rise * t; // relentless upward drift
      v *= 1 + (r() - 0.5) * opts.noise; // meme jitter
      if (opts.spikeAt != null) {
        const dist = Math.abs(i - opts.spikeAt);
        if (dist <= opts.spikeWidth) {
          const d = 1 - dist / (opts.spikeWidth + 1);
          v *= 1 + opts.spikeMag * d;
        }
      }
      labels.push(labelFn(i, n));
      values.push(Math.max(0, Math.round(v / round) * round));
    }
    return { labels, values };
  }

  const now = new Date();
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;

  const hourLabel = (i, n) =>
    new Date(now.getTime() - (n - 1 - i) * HOUR).toLocaleTimeString("en-US", {
      hour: "numeric",
    });
  const dayLabel = (i, n) =>
    new Date(now.getTime() - (n - 1 - i) * DAY).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  const monthLabel = (i, n) =>
    new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1).toLocaleDateString(
      "en-US",
      { month: "short", year: "2-digit" }
    );

  return {
    day: {
      unit: "applications / hour",
      ...buildSeries(
        24,
        { base: 280, rise: 560, noise: 0.35, round: 10, spikeAt: 13, spikeWidth: 2, spikeMag: 0.6 },
        hourLabel,
        101
      ),
    },
    month: {
      unit: "applications / day",
      ...buildSeries(
        30,
        { base: 4200, rise: 3400, noise: 0.25, round: 50, spikeAt: 22, spikeWidth: 2, spikeMag: 0.5 },
        dayLabel,
        202
      ),
    },
    threeMonth: {
      unit: "applications / day",
      ...buildSeries(
        90,
        { base: 3800, rise: 4600, noise: 0.3, round: 50, spikeAt: 61, spikeWidth: 4, spikeMag: 0.6 },
        dayLabel,
        303
      ),
    },
    year: {
      unit: "applications / month",
      ...buildSeries(
        12,
        { base: 42000, rise: 96000, noise: 0.2, round: 500, spikeAt: 8, spikeWidth: 1, spikeMag: 0.5 },
        monthLabel,
        404
      ),
    },
  };
})();
