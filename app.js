/* global Chart, MCD_DATA */
(function () {
  "use strict";

  const RANGES = {
    day: "Today (hourly)",
    month: "Last 30 days",
    threeMonth: "Last 3 months",
    year: "Last 12 months",
  };

  /* ---------------- Ticker tape ---------------- */
  (function buildTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    const items = [
      ["APPLICATIONS (1D)", "+4.2%", true],
      ["APPLICATIONS (1M)", "+18.6%", true],
      ["APPLICATIONS (3M)", "+41.0%", true],
      ["APPLICATIONS (1Y)", "+128%", true],
      ["AVG / DAY", "8,140", true],
      ["PEAK / DAY", "11,600", true],
      ["OPEN ROLES", "HIRING", true],
      ["DEMAND LEVEL", "HIGH", true],
    ];
    const html = items
      .map(
        ([name, val, pos]) =>
          `<span>${name} <span class="${pos ? "pos" : "neg"}">${val}</span></span>`
      )
      .join("");
    track.innerHTML = html + html; // duplicate for seamless loop
  })();

  /* ---------------- Live (fake) applications counter ---------------- */
  (function fakeLiveApps() {
    const valueEl = document.getElementById("liveApps");
    if (!valueEl) return;
    // Seed the live number off today's total so it feels connected.
    let count = MCD_DATA.day.values.reduce((a, b) => a + b, 0);
    valueEl.textContent = count.toLocaleString();
    setInterval(() => {
      count += 1 + Math.floor(Math.random() * 9);
      valueEl.textContent = count.toLocaleString();
    }, 800);
  })();

  /* ---------------- Helpers ---------------- */
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function animateNumber(el, target) {
    if (!el) return;
    const dur = 900;
    const start = performance.now();
    const from = parseInt(String(el.dataset.val || "0"), 10) || 0;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    el.dataset.val = String(target);
    requestAnimationFrame(tick);
  }

  function updateStats(range) {
    const series = MCD_DATA[range];
    const total = series.values.reduce((a, b) => a + b, 0);
    const peak = Math.max(...series.values);
    const avg = Math.round(total / series.values.length);
    animateNumber(document.getElementById("periodTotal"), total);
    animateNumber(document.getElementById("periodPeak"), peak);
    animateNumber(document.getElementById("periodAvg"), avg);

    const interval = series.unit.replace("applications / ", "");
    const totalLabel = document.getElementById("periodTotalLabel");
    const peakLabel = document.getElementById("periodPeakLabel");
    const avgLabel = document.getElementById("periodAvgLabel");
    if (totalLabel) totalLabel.textContent = `Applications · ${RANGES[range]}`;
    if (peakLabel) peakLabel.textContent = `Peak per ${interval}`;
    if (avgLabel) avgLabel.textContent = `Average per ${interval}`;
  }

  /* ---------------- The big chart ---------------- */
  let chart;

  function makeGradient(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 600);
    g.addColorStop(0, "rgba(255, 199, 44, 0.85)");
    g.addColorStop(1, "rgba(255, 199, 44, 0.05)");
    return g;
  }

  function statusFor(value, max) {
    const ratio = max ? value / max : 0;
    if (ratio >= 0.85) return "\nDemand: Peak";
    if (ratio >= 0.6) return "\nDemand: High";
    if (ratio >= 0.35) return "\nDemand: Moderate";
    return "\nDemand: Low";
  }

  function drawChart(range) {
    const canvas = document.getElementById("bigChart");
    if (!canvas || typeof Chart === "undefined") return;
    const ctx = canvas.getContext("2d");
    const series = MCD_DATA[range];
    const peak = Math.max(...series.values);

    Chart.defaults.color = "#fff7e6";
    Chart.defaults.font.family = "Inter, sans-serif";
    Chart.defaults.font.weight = "700";

    const showPoints = series.values.length <= 35;
    const data = {
      labels: series.labels,
      datasets: [
        {
          label: "McDonald's Applications",
          data: series.values,
          borderColor: "#ffc72c",
          backgroundColor: makeGradient(ctx),
          borderWidth: 3,
          fill: true,
          tension: 0,
          pointRadius: showPoints ? 3 : 0,
          pointBackgroundColor: "#ffc72c",
          pointBorderColor: "#1a0000",
          pointBorderWidth: 1,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#fff",
        },
      ],
    };

    if (chart) {
      chart.data = data;
      chart.options.scales.y.title.text = capitalize(series.unit);
      chart.update();
      return;
    }

    chart = new Chart(ctx, {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        animation: { duration: 700 },
        plugins: {
          legend: { labels: { font: { size: 14, weight: "700" }, padding: 18, usePointStyle: true } },
          tooltip: {
            backgroundColor: "#1a0000",
            borderColor: "#ffc72c",
            borderWidth: 2,
            titleColor: "#ffc72c",
            titleFont: { size: 16, weight: "900" },
            bodyFont: { size: 14, weight: "700" },
            padding: 12,
            callbacks: {
              afterBody: (items) => {
                const it = items[0];
                if (!it) return "";
                const max = Math.max(...it.dataset.data);
                return statusFor(it.parsed.y, max);
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.08)" },
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 14 },
          },
          y: {
            beginAtZero: false,
            grid: { color: "rgba(255,255,255,0.08)" },
            title: {
              display: true,
              text: capitalize(series.unit),
              color: "#ffc72c",
              font: { size: 13, weight: "700" },
            },
            ticks: {
              color: "#ffc72c",
              callback: (v) => (v >= 1000 ? v / 1000 + "k" : v),
            },
          },
        },
      },
    });
    // silence unused warning for peak in non-tooltip path
    void peak;
  }

  /* ---------------- Range buttons ---------------- */
  function setRange(range) {
    drawChart(range);
    updateStats(range);
    document.querySelectorAll(".range-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.range === range);
    });
  }

  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", () => setRange(btn.dataset.range));
  });

  // Initial render (matches the .active button in the markup).
  const initial =
    document.querySelector(".range-btn.active")?.dataset.range || "threeMonth";
  setRange(initial);
})();
