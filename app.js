/* global Chart, MCD_DATA */
(function () {
  "use strict";

  const RANGES = {
    day: { label: "1D", title: "Last 24 hours, hourly", interval: "hour", resolution: "Hourly" },
    month: { label: "1M", title: "Last 30 days, daily", interval: "day", resolution: "Daily" },
    threeMonth: { label: "3M", title: "Last 3 months, daily", interval: "day", resolution: "Daily" },
    year: { label: "1Y", title: "Last 12 months, monthly", interval: "month", resolution: "Monthly" },
  };
  const ORDER = ["day", "month", "threeMonth", "year"];

  /* ---------------- Math helpers ---------------- */
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const pct = (n) => `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(1)}%`;

  function stats(values) {
    const n = values.length;
    const total = values.reduce((a, b) => a + b, 0);
    const mean = total / n;
    let peak = -Infinity, low = Infinity, peakIdx = 0, lowIdx = 0;
    values.forEach((v, i) => {
      if (v > peak) { peak = v; peakIdx = i; }
      if (v < low) { low = v; lowIdx = i; }
    });
    const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
    const cv = mean ? (Math.sqrt(variance) / mean) * 100 : 0;
    const first = values[0];
    const last = values[n - 1];
    const change = first ? ((last - first) / first) * 100 : 0;
    return { n, total, mean, peak, low, peakIdx, lowIdx, cv, change, first, last };
  }

  function movingAverage(values, window) {
    return values.map((_, i) => {
      if (i < window - 1) return null;
      let s = 0;
      for (let j = i - window + 1; j <= i; j++) s += values[j];
      return s / window;
    });
  }

  function maWindow(n) {
    return Math.max(3, Math.round(n / 8));
  }

  /* ---------------- Header ---------------- */
  (function setUpdated() {
    const el = document.getElementById("updatedAt");
    if (!el) return;
    const now = new Date();
    el.dateTime = now.toISOString();
    el.textContent = now.toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });
  })();

  /* ---------------- KPIs ---------------- */
  function updateKpis(range) {
    const series = MCD_DATA[range];
    const s = stats(series.values);
    const meta = RANGES[range];

    document.getElementById("kpiTotal").textContent = fmt(s.total);
    document.getElementById("kpiTotalSub").textContent = meta.title;

    document.getElementById("kpiAvg").textContent = fmt(s.mean);
    document.getElementById("kpiAvgSub").textContent = `Per ${meta.interval}`;

    document.getElementById("kpiPeak").textContent = fmt(s.peak);
    document.getElementById("kpiPeakSub").textContent = series.labels[s.peakIdx];

    document.getElementById("kpiLow").textContent = fmt(s.low);
    document.getElementById("kpiLowSub").textContent = series.labels[s.lowIdx];

    document.getElementById("kpiChange").textContent = pct(s.change);
    document.getElementById("kpiChangeSub").textContent =
      `${fmt(s.first)} to ${fmt(s.last)} per ${meta.interval}`;

    document.getElementById("kpiVol").textContent = `${s.cv.toFixed(1)}%`;
  }

  /* ---------------- Summary table ---------------- */
  function buildTable(activeRange) {
    const tbody = document.querySelector("#summaryTable tbody");
    if (!tbody) return;
    tbody.innerHTML = ORDER.map((key) => {
      const s = stats(MCD_DATA[key].values);
      const meta = RANGES[key];
      return `<tr class="${key === activeRange ? "active" : ""}" data-range="${key}">
        <td>${meta.label}</td>
        <td>${meta.resolution}</td>
        <td class="num">${fmt(s.total)}</td>
        <td class="num">${fmt(s.mean)}</td>
        <td class="num">${fmt(s.peak)}</td>
        <td class="num">${fmt(s.low)}</td>
        <td class="num">${pct(s.change)}</td>
      </tr>`;
    }).join("");
  }

  /* ---------------- Chart ---------------- */
  let chart;

  function buildDatasets(range) {
    const series = MCD_DATA[range];
    const window = maWindow(series.values.length);
    const maLabel = document.getElementById("maLabel");
    if (maLabel) maLabel.textContent = `${window}-${RANGES[range].interval} moving average`;

    return [
      {
        label: "Applications",
        data: series.values,
        borderColor: "#000000",
        backgroundColor: "#000000",
        borderWidth: 2,
        fill: false,
        tension: 0,
        pointRadius: series.values.length <= 35 ? 3 : 0,
        pointBackgroundColor: "#000000",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#000000",
        order: 1,
      },
      {
        label: "Moving average",
        data: movingAverage(series.values, window),
        borderColor: "#767676",
        borderWidth: 1.5,
        borderDash: [5, 4],
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        spanGaps: false,
        order: 2,
      },
    ];
  }

  function drawChart(range) {
    const canvas = document.getElementById("bigChart");
    if (!canvas || typeof Chart === "undefined") return;
    const series = MCD_DATA[range];
    const yTitle = series.unit.charAt(0).toUpperCase() + series.unit.slice(1);

    Chart.defaults.color = "#000000";
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.font.size = 12;

    if (chart) {
      chart.data.labels = series.labels;
      chart.data.datasets = buildDatasets(range);
      chart.options.scales.y.title.text = yTitle;
      chart.update();
      return;
    }

    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: { labels: series.labels, datasets: buildDatasets(range) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#000000",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#000000",
            borderWidth: 1,
            cornerRadius: 2,
            padding: 10,
            titleFont: { weight: "600" },
            displayColors: false,
            callbacks: {
              label: (item) => {
                if (item.parsed.y == null) return null;
                return `${item.dataset.label}: ${fmt(item.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "#e3e3e3", drawTicks: false },
            border: { color: "#000000" },
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12, padding: 8 },
          },
          y: {
            beginAtZero: false,
            grid: { color: "#e3e3e3", drawTicks: false },
            border: { color: "#000000", dash: [0, 0] },
            title: {
              display: true,
              text: yTitle,
              color: "#4a4a4a",
              font: { size: 12, weight: "500" },
            },
            ticks: {
              padding: 8,
              callback: (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : v),
            },
          },
        },
      },
    });
  }

  /* ---------------- Range switching ---------------- */
  function setRange(range) {
    drawChart(range);
    updateKpis(range);
    buildTable(range);
    const sub = document.getElementById("chartSub");
    if (sub) sub.textContent = RANGES[range].title;
    document.querySelectorAll(".range-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.range === range);
    });
  }

  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", () => setRange(btn.dataset.range));
  });

  const initial =
    document.querySelector(".range-btn.active")?.dataset.range || "threeMonth";
  setRange(initial);
})();
