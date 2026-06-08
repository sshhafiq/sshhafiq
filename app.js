/* global Chart, MCD_DATA */
(function () {
  "use strict";

  const RANGES = {
    day: "Today (hourly)",
    month: "Last 30 days",
    threeMonth: "Last 3 months",
    year: "Last 12 months",
  };

  /* ---------------- Floating emojis ---------------- */
  (function spawnFloaties() {
    const container = document.querySelector(".floaties");
    if (!container) return;
    const emojis = ["🍟", "🍔", "📈", "🤡", "💸", "🔴", "🥤", "🧾"];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("span");
      el.className = "floaty";
      el.textContent = emojis[i % emojis.length];
      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = 1.6 + Math.random() * 2.4 + "rem";
      el.style.animationDuration = 12 + Math.random() * 16 + "s";
      el.style.animationDelay = -Math.random() * 20 + "s";
      container.appendChild(el);
    }
  })();

  /* ---------------- Ticker tape ---------------- */
  (function buildTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    const items = [
      ["MCD APPS", "+69.0%", true],
      ["RESUMES SENT", "+420%", true],
      ["DAY TRADERS", "-88%", false],
      ["FRY STATION", "HIRING", true],
      ["DRIVE-THRU CREW", "+250%", true],
      ["HOPE", "-100%", false],
      ["McNUGGET INDEX", "ALL TIME HIGH", true],
      ["APRON SUPPLY", "SOLD OUT", true],
      ["EMPLOYEE MORALE", "lovin' it", true],
      ["MCD APPS", "🚀🚀🚀", true],
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
    animateNumber(document.getElementById("periodTotal"), total);
    animateNumber(document.getElementById("periodPeak"), peak);

    const unitShort = series.unit.replace("applications / ", "per ");
    const totalLabel = document.getElementById("periodTotalLabel");
    const peakLabel = document.getElementById("periodPeakLabel");
    if (totalLabel) totalLabel.textContent = `🍟 Total applications (${RANGES[range]})`;
    if (peakLabel) peakLabel.textContent = `🚀 Peak (${unitShort})`;
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
    if (ratio >= 0.85) return "\n🤡 Status: WELCOME ABOARD";
    if (ratio >= 0.6) return "\n😱 Status: drive-thru of applicants";
    if (ratio >= 0.35) return "\n😬 Status: updating resume...";
    return "\n😎 Status: still a 'day trader'";
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

    const data = {
      labels: series.labels,
      datasets: [
        {
          label: "🍟 McDonald's Applications",
          data: series.values,
          borderColor: "#ffc72c",
          backgroundColor: makeGradient(ctx),
          borderWidth: 4,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#fff",
        },
      ],
    };

    if (chart) {
      chart.data = data;
      chart.options.scales.y.title.text = "🍟 " + series.unit;
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
          legend: { labels: { font: { size: 15, weight: "900" }, padding: 18 } },
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
              text: "🍟 " + series.unit,
              color: "#ffc72c",
              font: { size: 14, weight: "900" },
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
