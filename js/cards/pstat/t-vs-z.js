/* 카드: t분포는 표준정규분포와 무엇이 다를까? — 자유도에 따른 곡선, t₀.₀₂₅, |T| > 2의 확률 */
(() => {
  const root = document.getElementById("card-pstat-t-vs-z");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const dIn = $(".d"), P = NMPst;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, size.h);
    const df = +dIn.value, tc = P.tinv(0.975, df), f = P.frame(ctx, size, { x0: -5, x1: 5, y0: 0, y1: 0.42, xt: [-4, -3, -2, -1, 0, 1, 2, 3, 4], yt: [0, 0.1, 0.2, 0.3, 0.4], yf: (v) => v.toFixed(1), L: 34 });
    ctx.fillStyle = "rgba(181,83,47,.25)";
    [[-5, -tc], [tc, 5]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(f.X(a), f.Y(0)); for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; ctx.lineTo(f.X(x), f.Y(P.tpdf(x, df))); } ctx.lineTo(f.X(b), f.Y(0)); ctx.closePath(); ctx.fill(); });
    P.curve(ctx, f.X, f.Y, (x) => NMStat.npdf(x, 0, 1), -5, 5, C.ink3, 2);
    P.curve(ctx, f.X, f.Y, (x) => P.tpdf(x, df), -5, 5, C.warn, 2.5);
    ctx.setLineDash([3, 3]); ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; [-1.96, 1.96].forEach((z) => { ctx.beginPath(); ctx.moveTo(f.X(z), f.Y(0)); ctx.lineTo(f.X(z), f.Y(0.4)); ctx.stroke(); }); ctx.setLineDash([]);
    ctx.font = `11px ${NM.F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = C.ink3; ctx.fillText("표준정규분포(회색)", f.X(1.2), f.Y(0.36)); ctx.fillStyle = C.warn; ctx.fillText(`t분포, 자유도 ${df}(빨강)`, f.X(1.2), f.Y(0.32));
  }
  function update() {
    const df = +dIn.value, tc = P.tinv(0.975, df), tail = 2 * (1 - P.tcdf(2, df)), ztail = 2 * (1 - NMStat.ncdf(2));
    $(".d-out").textContent = df;
    $(".say").textContent = `양쪽 2.5% 경계: t₀.₀₂₅(${df}) = ${tc.toFixed(3)} (표준정규 1.960) · P(|T| > 2) = ${(100 * tail).toFixed(1)}% (표준정규 ${(100 * ztail).toFixed(1)}%)`;
    const rows = [1, 2, 4, 9, 19, 29];
    $("table").innerHTML = `<tr><th>자유도</th>${rows.map((d) => `<th>${d}</th>`).join("")}<th>Z</th></tr><tr class="on"><td>t₀.₀₂₅</td>${rows.map((d) => `<td>${P.tinv(0.975, d).toFixed(2)}</td>`).join("")}<td>1.96</td></tr>`;
    draw();
  }
  dIn.addEventListener("input", update);
  update();
})();
