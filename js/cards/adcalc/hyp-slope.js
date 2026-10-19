/* 카드: cosh x의 접선의 기울기를 모으면 어떤 그래프가 될까? — 접선 기울기 점 모으기와 도함수 겹치기 */
(() => {
  const root = document.getElementById("card-adcalc-hyp-slope");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), bAns = $(".go-ans");
  const sech2 = (x) => 1 / Math.cosh(x) ** 2;
  const FN = {
    cosh: { f: Math.cosh, d: Math.sinh, yr: [-1, 6.5], dr: [-6.5, 6.5], ans: "sinh x" },
    sinh: { f: Math.sinh, d: Math.cosh, yr: [-6.5, 6.5], dr: [-1, 6.5], ans: "cosh x" },
    tanh: { f: Math.tanh, d: sech2, yr: [-1.3, 1.3], dr: [-0.3, 1.3], ans: "1 / cosh² x" },
    cos: { f: Math.cos, d: (x) => -Math.sin(x), yr: [-1.3, 1.3], dr: [-1.3, 1.3], ans: "−sin x" },
  };
  let fk = "cosh", pts = new Map(), raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const F = FN[fk], x = +sx.value, hh = h / 2;
    const yt = (r) => ((r[1] - r[0]) > 4 ? 2 : 0.5);
    const g1 = G.frame(ctx, w, hh - 4, { xr: [-2.5, 2.5], yr: F.yr, xs: 1, ys: yt(F.yr), xf: (v) => n(v, 0), yf: (v) => n(v, 1) });
    G.curve(ctx, g1, F.f, BLUE);
    const m = F.d(x);
    ctx.save(); ctx.beginPath(); ctx.rect(g1.x0, g1.y0, g1.w, g1.h); ctx.clip();
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(g1.X(x - 1.2), g1.Y(F.f(x) - 1.2 * m)); ctx.lineTo(g1.X(x + 1.2), g1.Y(F.f(x) + 1.2 * m)); ctx.stroke(); ctx.restore();
    G.dot(ctx, g1, x, F.f(x), C.warn);
    G.tag(ctx, g1, `y = ${fk === "cos" ? "cos" : fk} x`, g1.x0 + 4, g1.y0 + 10, BLUE);
    ctx.save(); ctx.translate(0, hh + 4);
    const g2 = G.frame(ctx, w, hh - 4, { xr: [-2.5, 2.5], yr: F.dr, xs: 1, ys: yt(F.dr), xf: (v) => n(v, 0), yf: (v) => n(v, 1) });
    if (bAns.getAttribute("aria-pressed") === "true") { G.curve(ctx, g2, F.d, C.forest, { width: 2, dash: [5, 4] }); G.tag(ctx, g2, `y = ${F.ans}`, g2.x0 + g2.w - 4, g2.y0 + 10, C.forest, "right"); }
    pts.forEach((v, k) => G.dot(ctx, g2, k / 50, v, C.warn, false, 2.6));
    G.dot(ctx, g2, x, m, C.warn, false, 5);
    G.tag(ctx, g2, "접선의 기울기", g2.x0 + 4, g2.y0 + 10, C.warn);
    ctx.restore();
  }
  function rec() { const x = +sx.value; pts.set(Math.round(x * 50), FN[fk].d(x)); }
  function nums() {
    const x = +sx.value;
    $(".x-out").textContent = n(x, 2);
    $(".n-m").textContent = n(FN[fk].d(x), 4);
    $(".n-g").textContent = bAns.getAttribute("aria-pressed") === "true" ? n(FN[fk].d(x), 4) : "—";
    $(".n-k").textContent = pts.size;
    draw();
  }
  function sweep() {
    cancelAnimationFrame(raf);
    let x = -2.5;
    const tick = () => { x = Math.min(2.5, x + 0.04); sx.value = x; rec(); nums(); if (x < 2.5) raf = requestAnimationFrame(tick); };
    if (NM.reduce) { for (let v = -2.5; v <= 2.5; v += 0.04) { sx.value = v; rec(); } nums(); return; }
    raf = requestAnimationFrame(tick);
  }
  G.chips(root, ".presets .chip[data-f]", (b) => { fk = b.dataset.f; pts.clear(); bAns.setAttribute("aria-pressed", "false"); rec(); nums(); });
  sx.addEventListener("input", () => { rec(); nums(); });
  $(".go-sweep").addEventListener("click", sweep);
  $(".go-clear").addEventListener("click", () => { pts.clear(); nums(); });
  bAns.addEventListener("click", () => { bAns.setAttribute("aria-pressed", String(bAns.getAttribute("aria-pressed") !== "true")); nums(); });
  rec(); nums();
})();
