/* 카드: 100번 중 k번 앞면 — 귀무가설 p = 0.5, 양측 유의확률(이항분포 계산 + 2000회 시뮬레이션) */
(() => {
  const root = document.getElementById("card-pstat-coin-test");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), N = 100, B = NMStat.binom(N, 0.5);
  let sim = null;
  const pval = (k) => { const d = Math.abs(k - 50); return B.reduce((s, p, x) => s + (Math.abs(x - 50) >= d ? p : 0), 0); };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, size.h);
    const k = +kIn.value, d = Math.abs(k - 50), f = NMPst.frame(ctx, size, { x0: 29.5, x1: 70.5, y0: 0, y1: 0.09, xt: [30, 40, 50, 60, 70], yt: [0, 0.04, 0.08], yf: (v) => v.toFixed(2), L: 40, xlab: "앞면 수" });
    for (let x = 30; x <= 70; x++) {
      const p = sim ? sim[x] / 2000 : B[x], ext = Math.abs(x - 50) >= d;
      ctx.fillStyle = ext ? "rgba(181,83,47,.75)" : "rgba(63,111,163,.45)";
      ctx.fillRect(f.X(x - 0.42), f.Y(p), f.X(x + 0.42) - f.X(x - 0.42), f.Y(0) - f.Y(p));
    }
    if (sim) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 30; x <= 70; x++) x > 30 ? ctx.lineTo(f.X(x), f.Y(B[x])) : ctx.moveTo(f.X(x), f.Y(B[x])); ctx.stroke(); }
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.X(k), f.Y(0)); ctx.lineTo(f.X(k), f.Y(0.085)); ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(sim ? "막대: 시뮬레이션 상대도수 · 선: 이항분포" : "막대: 이항분포 B(100, 0.5)", f.L + 6, 14);
  }
  function update() {
    const k = +kIn.value, p = pval(k), d = Math.abs(k - 50);
    $(".k-out").textContent = k;
    let s = `관찰 ${k}번 · 50에서 ${d} 이상 벗어날 확률(유의확률) = ${p.toFixed(4)} (${(100 * p).toFixed(1)}%) → 유의수준 5%에서 ${p < 0.05 ? "귀무가설 기각" : "기각하지 못함"}`;
    if (sim) { const e = sim.reduce((a, c, x) => a + (Math.abs(x - 50) >= d ? c : 0), 0); s += ` · 시뮬레이션 2000회 중 ${e}회(${((100 * e) / 2000).toFixed(1)}%)`; }
    $(".say").textContent = s; draw();
  }
  $(".run").addEventListener("click", () => { sim = new Array(N + 1).fill(0); for (let t = 0; t < 2000; t++) { let h = 0; for (let i = 0; i < N; i++) if (Math.random() < 0.5) h++; sim[h]++; } update(); });
  kIn.addEventListener("input", update);
  update();
})();
