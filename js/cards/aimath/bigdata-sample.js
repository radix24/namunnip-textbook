/* 카드: 자료를 100배 모으면 추정도 100배 정확해질까? — 표본비율의 퍼짐 ∝ 1/√n (가상 모집단) */
(() => {
  const root = document.getElementById("card-aimath-bigdata-sample");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), PTRUE = 0.37, REP = 200;
  let est = null, showT = false, seed = 3, hist = {};
  const N = () => Math.round(10 ** +nIn.value);
  /* 이항 표본: n이 크면 정규 근사로 빠르게 */
  const sample = (r, n) => { if (n <= 400) { let k = 0; for (let i = 0; i < n; i++) if (r() < PTRUE) k++; return k / n; } return Math.min(1, Math.max(0, PTRUE + Math.sqrt((PTRUE * (1 - PTRUE)) / n) * A.gauss(r))); };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => [v, `${v * 100}%`]), yt: [], xlab: "추정한 비율", L: 16 });
    if (!est) { E.text(ctx, P.L + P.w / 2, P.T + P.h / 2, "표본을 뽑아 보세요", C.ink3, "center"); return; }
    const bins = 50, cnt = Array(bins).fill(0); est.forEach((p) => cnt[Math.min(bins - 1, Math.floor(p * bins))]++);
    const mx = Math.max(...cnt), bw = P.w / bins;
    cnt.forEach((c, i) => { if (!c) return; ctx.fillStyle = E.BLUE; ctx.globalAlpha = 0.8; const h = (c / mx) * (P.h - 14); ctx.fillRect(P.L + i * bw + 1, P.T + P.h - h, bw - 2, h); ctx.globalAlpha = 1; });
    if (showT) { ctx.save(); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(P.X(PTRUE), P.T); ctx.lineTo(P.X(PTRUE), P.T + P.h); ctx.stroke(); ctx.restore(); E.text(ctx, P.X(PTRUE) + 4, P.T + 12, `진짜 ${PTRUE * 100}%`, C.warn); }
  }
  function update() {
    const n = N();
    $(".n-out").textContent = E.n(n);
    let s = "";
    if (est) { const m = est.reduce((a, b) => a + b, 0) / REP, sd = Math.sqrt(est.reduce((a, b) => a + (b - m) ** 2, 0) / REP); hist[n] = sd; s = `n = ${E.n(n)}: 200번 추정의 평균 ${E.pct(m)}, 표준편차 ${E.n(sd * 100, 2)}%p (이론값 ${E.n(Math.sqrt((PTRUE * (1 - PTRUE)) / n) * 100, 2)}%p)`; const ks = Object.keys(hist).map(Number).sort((a, b) => a - b); if (ks.length > 1) s += ` · 지금까지: ${ks.map((k) => `n=${E.n(k)}→${E.n(hist[k] * 100, 2)}`).join(", ")}`; }
    else s = "표본 크기를 정하고 표본을 뽑아 보세요.";
    $(".say").textContent = s; draw();
  }
  nIn.addEventListener("input", () => { est = null; update(); });
  $(".go-run").addEventListener("click", () => { const r = A.rng(seed++), n = N(); est = [...Array(REP)].map(() => sample(r, n)); update(); });
  $(".go-truth").addEventListener("click", () => { showT = true; update(); });
  update();
})();
