/* 카드: 세율이 35%인 사람은 소득의 35%를 세금으로 낼까? — 초과 누진, 한계세율과 실효세율 (가상 세율표) */
(() => {
  const root = document.getElementById("card-econ-progressive-tax");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon, T = NMTax;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), MAX = 15000, COL = ["#b5d7ac", "#74ab66", "#3b7c2a", "#1f4f16"];
  const bar = fit($(".bar"), () => drawBar()), gr = fit($(".gr"), () => drawGr());
  function drawBar() {
    const { ctx, size: { w, h } } = bar; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const x = +xIn.value, L = 8, R = 8, X = (v) => L + (v / MAX) * (w - L - R), y0 = 16, bh = Math.max(16, h - 40);
    ctx.font = `10.5px ${F.mono}`;
    T.parts(MAX).forEach((p, i) => { ctx.fillStyle = "rgba(141,141,146,.12)"; ctx.fillRect(X(p.lo), y0, X(Math.min(p.hi, MAX)) - X(p.lo), bh); ctx.fillStyle = C.ink3; ctx.textAlign = "left"; ctx.fillText(`${E.n(p.r * 100)}%`, X(p.lo) + 3, y0 - 4); });
    T.parts(x).forEach((p, i) => { if (!p.amt) return; ctx.fillStyle = COL[i]; ctx.fillRect(X(p.lo), y0, X(p.lo + p.amt) - X(p.lo), bh); const wd = X(p.lo + p.amt) - X(p.lo); if (wd > 54) { ctx.fillStyle = i > 1 ? "#fff" : C.ink; ctx.textAlign = "center"; ctx.fillText(`${E.n(p.tax)}만`, X(p.lo + p.amt / 2), y0 + bh / 2 + 4); } });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(x), y0 - 2); ctx.lineTo(X(x), y0 + bh + 2); ctx.stroke();
  }
  function drawGr() {
    const { ctx, size } = gr; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: MAX, y0: 0, y1: 0.4, xt: [[0, "0"], [4000, "4천만"], [8000, "8천만"], [12000, "1.2억"]], yt: [[0, "0"], [0.1, "10%"], [0.2, "20%"], [0.3, "30%"], [0.4, "40%"]], xlab: "과세표준(만 원)", ylab: "세율" });
    const steps = []; T.BR.forEach(([lo, r], i) => { const hi = i + 1 < T.BR.length ? T.BR[i + 1][0] : MAX; steps.push([lo, r], [hi, r]); });
    E.line(ctx, P, steps, C.warn, 2.4);
    E.fn(ctx, P, (v) => (v > 1 ? T.tax(v) / v : NaN), 1, MAX, E.BLUE, 2.4);
    const x = +xIn.value;
    if (x > 0) { E.dot(ctx, P, x, T.marginal(x), C.warn, 5, "한계", 6, -6); E.dot(ctx, P, x, T.tax(x) / x, E.BLUE, 5, "실효", 6, 14); }
    E.text(ctx, P.L + 6, P.T + 12, "주황: 한계세율 · 파랑: 실효세율", C.ink2);
  }
  function update() {
    const x = +xIn.value, t = T.tax(x);
    $(".x-out").textContent = E.n(x);
    $(".say").textContent = x ? `세금 ${E.n(t, 1)}만 원 = ${T.parts(x).filter((p) => p.amt).map((p) => `${E.n(p.amt)}×${E.n(p.r * 100)}%`).join(" + ")} · 한계세율 ${E.n(T.marginal(x) * 100)}% · 실효세율 ${E.pct(t / x)} · 세후 소득 ${E.n(x - t, 1)}만 원` : "소득이 0이면 세금도 0입니다.";
    drawBar(); drawGr();
  }
  xIn.addEventListener("input", update);
  update();
})();
