/* 카드: 표본 5개로 표준화하면 95%가 ±1.96 안일까? — T = (X̄ − μ)/(S/√n) 2000번, Z·t 곡선과 비교 */
(() => {
  const root = document.getElementById("card-pstat-why-t");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), P = NMPst, MU = 50, SG = 10, LO = -6, HI = 6, BINS = 60;
  let T = null;
  const sim = (n) => Array.from({ length: 2000 }, () => { const x = Array.from({ length: n }, () => MU + SG * NMStat.gauss(Math.random)); return (P.mean(x) - MU) / (P.sd(x) / Math.sqrt(n)); });
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, size.h);
    const n = +nIn.value, f = P.frame(ctx, size, { x0: LO, x1: HI, y0: 0, y1: 0.45, xt: [-6, -4, -2, 0, 2, 4, 6], yt: [0, 0.2, 0.4], yf: (v) => v.toFixed(1), L: 34, xlab: "T 값" });
    if (T) { const wd = (HI - LO) / BINS, cnt = NMStat.counts(T, LO, HI, BINS).map((c) => c / (T.length * wd)); P.bars(ctx, f.X, f.Y, cnt, LO, wd, "rgba(63,111,163,.45)"); }
    P.curve(ctx, f.X, f.Y, (x) => NMStat.npdf(x, 0, 1), LO, HI, C.ink3, 2);
    P.curve(ctx, f.X, f.Y, (x) => P.tpdf(x, n - 1), LO, HI, C.warn, 2);
    ctx.setLineDash([3, 3]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1; [-1.96, 1.96].forEach((z) => { ctx.beginPath(); ctx.moveTo(f.X(z), f.Y(0)); ctx.lineTo(f.X(z), f.Y(0.43)); ctx.stroke(); }); ctx.setLineDash([]);
    ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = C.ink3; ctx.fillText("표준정규", f.X(2.3), f.Y(0.38)); ctx.fillStyle = C.warn; ctx.fillText(`t(자유도 ${n - 1})`, f.X(2.3), f.Y(0.34));
    if (!T) { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("‘2000번 뽑기’를 눌러 보세요", w / 2, size.h * 0.55); }
  }
  function update() {
    const n = +nIn.value; $(".n-out").textContent = n;
    const theo = 2 * (1 - P.tcdf(1.96, n - 1));
    $(".say").textContent = (T ? `|T| > 1.96인 비율: 시뮬레이션 ${((100 * T.filter((t) => Math.abs(t) > 1.96).length) / T.length).toFixed(1)}% · ` : "") + `t분포(자유도 ${n - 1})로 계산하면 ${(100 * theo).toFixed(1)}% · 표준정규라면 5.0%`;
    draw();
  }
  $(".run").addEventListener("click", () => { T = sim(+nIn.value); update(); });
  nIn.addEventListener("input", () => { T = null; update(); });
  update();
})();
