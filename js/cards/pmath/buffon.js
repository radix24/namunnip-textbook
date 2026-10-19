/* 카드: 바늘을 바닥에 떨어뜨려 원주율을 구할 수 있을까? — 뷔퐁의 바늘, π ≈ 2lN/(dH) */
(() => {
  const root = document.getElementById("card-pmath-buffon");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr");
  const D = 1;   // 선 간격(단위)
  let N = 0, H = 0, recent = [];
  const rec = NMSim.recorder();
  const fl = fit($(".floor"), () => drawFloor()), tr = fit($(".tr"), () => drawTrend());

  function drawFloor() {
    const { ctx, size } = fl; const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const rows = 5, s = h / rows;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1;
    for (let k = 0; k <= rows; k++) { ctx.beginPath(); ctx.moveTo(0, k * s); ctx.lineTo(w, k * s); ctx.stroke(); }
    recent.forEach(({ x, y, th, hit }) => {
      const L = +sr.value * s / 2;
      ctx.strokeStyle = hit ? C.warn : "#6d7a66"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x * w - L * Math.cos(th), y * h - L * Math.sin(th)); ctx.lineTo(x * w + L * Math.cos(th), y * h + L * Math.sin(th)); ctx.stroke();
    });
  }
  function drawTrend() {
    const { ctx, size } = tr; const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    NMSim.trend(ctx, { x0: 34, y0: 10, w: w - 42, h: h - 44 }, rec.pts, { target: Math.PI, yr: [2.4, 4], ylabel: "π 어림값" });
  }
  function nums() {
    $(".r-out").textContent = (+sr.value).toFixed(2); $(".n-n").textContent = N; $(".n-h").textContent = H;
    $(".n-p").textContent = H ? (2 * +sr.value * N / (D * H)).toFixed(4) : "—";
  }
  NMSim.runner(root, {
    trial(k) {
      const l = +sr.value;
      for (let i = 0; i < k; i++) {
        // 중심의 위치(바닥 5칸 안에서 아무 곳), 각도
        const x = Math.random(), y = Math.random(), th = Math.random() * Math.PI;
        const yy = y * 5, dist = Math.min(yy - Math.floor(yy), Math.ceil(yy) - yy);
        const hit = dist <= (l / 2) * Math.sin(th);
        N++; if (hit) H++;
        recent.push({ x, y, th, hit }); if (recent.length > 220) recent.shift();
        if (H) rec.push(N, 2 * l * N / (D * H));
      }
    },
    draw() { nums(); drawFloor(); drawTrend(); },
    reset() { N = 0; H = 0; recent = []; rec.clear(); },
    rate: 120,
  });
  sr.addEventListener("input", () => { N = 0; H = 0; recent = []; rec.clear(); nums(); drawFloor(); drawTrend(); });
  nums();
})();
