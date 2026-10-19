/* 카드: 불량 검사 기준선 — 정상 N(50, 7²)·불량 N(66, 7²), 불량률 10%, 기대 손해 0.9·α·c1 + 0.1·β·c2(가상) */
(() => {
  const root = document.getElementById("card-pstat-error-cost");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t"), c1In = $(".c1"), c2In = $(".c2"), M0 = 50, M1 = 66, S = 7, Q = 0.1, P = NMPst;
  const alpha = (t) => 1 - NMStat.ncdf((t - M0) / S), beta = (t) => NMStat.ncdf((t - M1) / S);
  const cost = (t) => (1 - Q) * alpha(t) * +c1In.value + Q * beta(t) * +c2In.value;
  const best = () => { let b = 40, bc = Infinity; for (let t = 40; t <= 80; t += 0.1) { const c = cost(t); if (c < bc) { bc = c; b = t; } } return b; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = +tIn.value, top = { w, h: h * 0.58 }, f = P.frame(ctx, top, { x0: 25, x1: 95, y0: 0, y1: 0.06, xt: [30, 40, 50, 60, 70, 80, 90], yt: [], L: 40, B: 22, T: 8 });
    const pdf0 = (x) => (1 - Q) * NMStat.npdf(x, M0, S), pdf1 = (x) => Q * NMStat.npdf(x, M1, S);
    const fillArea = (g, a, b, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(f.X(a), f.Y(0)); for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; ctx.lineTo(f.X(x), f.Y(g(x))); } ctx.lineTo(f.X(b), f.Y(0)); ctx.closePath(); ctx.fill(); };
    fillArea(pdf0, t, 95, "rgba(181,83,47,.35)"); fillArea(pdf1, 25, t, "rgba(224,160,42,.45)");
    P.curve(ctx, f.X, f.Y, pdf0, 25, 95, "#3f6fa3", 2); P.curve(ctx, f.X, f.Y, pdf1, 25, 95, C.warn, 2);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.X(t), 4); ctx.lineTo(f.X(t), f.Y(0)); ctx.stroke();
    ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = "#3f6fa3"; ctx.fillText("정상품(90%)", f.X(30), f.Y(0.05)); ctx.fillStyle = C.warn; ctx.fillText("불량품(10%)", f.X(70), f.Y(0.012));
    /* 아래: 기준값에 따른 기대 손해 */
    ctx.save(); ctx.translate(0, h * 0.58);
    const cs = []; for (let x = 40; x <= 80; x += 0.5) cs.push(cost(x));
    const g = P.frame(ctx, { w, h: h * 0.42 }, { x0: 25, x1: 95, y0: 0, y1: Math.max(...cs) * 1.1, xt: [40, 50, 60, 70, 80], yt: [], L: 40, B: 32, T: 8, xlab: "기준값 · 아래 곡선: 제품 하나당 기대 손해" });
    P.curve(ctx, g.X, g.Y, cost, 40, 80, C.ink, 2);
    const b = best(); ctx.fillStyle = C.forest; ctx.beginPath(); ctx.arc(g.X(b), g.Y(cost(b)), 5, 0, 7); ctx.fill();
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(g.X(t), g.Y(cost(t)), 4, 0, 7); ctx.fill();
    ctx.restore();
  }
  function update() {
    const t = +tIn.value, b = best();
    $(".t-out").textContent = t.toFixed(1); $(".c1-out").textContent = c1In.value; $(".c2-out").textContent = c2In.value;
    $(".say").textContent = `1종 오류(정상품을 불량 판정) ${(100 * alpha(t)).toFixed(1)}% · 2종 오류(불량품 통과) ${(100 * beta(t)).toFixed(1)}% · 기대 손해 ${cost(t).toFixed(3)} · 가장 작은 기준값 ≈ ${b.toFixed(1)}(초록 점, 손해 ${cost(b).toFixed(3)})`;
    draw();
  }
  [tIn, c1In, c2In].forEach((x) => x.addEventListener("input", update));
  update();
})();
