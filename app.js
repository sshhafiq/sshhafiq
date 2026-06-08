/* global Chart, MEME_DATA */
(function () {
  "use strict";

  const { labels, vix, apps } = MEME_DATA;

  /* ---------------- Floating emojis ---------------- */
  (function spawnFloaties() {
    const container = document.querySelector(".floaties");
    if (!container) return;
    const emojis = ["🍟", "🍔", "📈", "📉", "🤡", "💸", "🔴", "🥤"];
    const count = 16;
    for (let i = 0; i < count; i++) {
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
      ["VIX", "+4.20%", true],
      ["MCD APPS", "+69.0%", true],
      ["RESUMES SENT", "+420%", true],
      ["DAY TRADERS", "-88%", false],
      ["FRY STATION", "HIRING", true],
      ["S&P 500", "-3.1%", false],
      ["HOPE", "-100%", false],
      ["McNUGGET INDEX", "ALL TIME HIGH", true],
      ["VIX", "🚀🚀🚀", true],
      ["EMPLOYEE MORALE", "lovin' it", true],
    ];
    const html = items
      .map(
        ([name, val, pos]) =>
          `<span>${name} <span class="${pos ? "pos" : "neg"}">${val}</span></span>`
      )
      .join("");
    // duplicate so the scroll loops seamlessly
    track.innerHTML = html + html;
  })();

  /* ---------------- Animated stats ---------------- */
  (function animateStats() {
    const appsStat = document.getElementById("appsStat");
    if (appsStat) {
      const target = apps[apps.length - 1];
      const dur = 1500;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        appsStat.textContent = Math.round(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  })();

  /* ---------------- Live (fake) VIX ticker ---------------- */
  (function fakeLiveVix() {
    const valueEl = document.getElementById("vixValue");
    const changeEl = document.getElementById("vixChange");
    if (!valueEl || !changeEl) return;
    let value = vix[vix.length - 1] + Math.random() * 4;
    setInterval(() => {
      const delta = (Math.random() - 0.45) * 1.8;
      value = Math.max(9, value + delta);
      const pct = (delta / value) * 100;
      valueEl.textContent = value.toFixed(2);
      const up = delta >= 0;
      changeEl.textContent = `${up ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%`;
      changeEl.classList.toggle("down", !up);
    }, 1200);
  })();

  /* ---------------- The big chart ---------------- */
  (function drawChart() {
    const canvas = document.getElementById("bigChart");
    if (!canvas || typeof Chart === "undefined") return;
    const ctx = canvas.getContext("2d");

    const appGradient = ctx.createLinearGradient(0, 0, 0, 600);
    appGradient.addColorStop(0, "rgba(255, 199, 44, 0.85)");
    appGradient.addColorStop(1, "rgba(255, 199, 44, 0.05)");

    Chart.defaults.color = "#fff7e6";
    Chart.defaults.font.family = "Inter, sans-serif";
    Chart.defaults.font.weight = "700";

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "🍟 McDonald's Applications",
            data: apps,
            yAxisID: "yApps",
            borderColor: "#ffc72c",
            backgroundColor: appGradient,
            borderWidth: 4,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#fff",
          },
          {
            label: "😱 VIX (Fear Index)",
            data: vix,
            yAxisID: "yVix",
            borderColor: "#00e5ff",
            backgroundColor: "rgba(0, 229, 255, 0.1)",
            borderWidth: 3,
            borderDash: [6, 4],
            fill: false,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: { font: { size: 15, weight: "900" }, padding: 18 },
          },
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
                const v = items.find((i) => i.dataset.yAxisID === "yVix");
                if (!v) return "";
                const fear = v.parsed.y;
                if (fear >= 50) return "\n🤡 Status: WELCOME ABOARD";
                if (fear >= 30) return "\n😱 Status: Updating resume...";
                if (fear >= 20) return "\n😨 Status: nervous laughter";
                return "\n😎 Status: still a 'day trader'";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.08)" },
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 14 },
          },
          yApps: {
            type: "linear",
            position: "left",
            grid: { color: "rgba(255,255,255,0.08)" },
            title: {
              display: true,
              text: "🍟 Applications / month",
              color: "#ffc72c",
              font: { size: 14, weight: "900" },
            },
            ticks: {
              color: "#ffc72c",
              callback: (v) => (v >= 1000 ? v / 1000 + "k" : v),
            },
          },
          yVix: {
            type: "linear",
            position: "right",
            grid: { drawOnChartArea: false },
            title: {
              display: true,
              text: "😱 VIX level",
              color: "#00e5ff",
              font: { size: 14, weight: "900" },
            },
            ticks: { color: "#00e5ff" },
          },
        },
      },
    });
  })();
})();
