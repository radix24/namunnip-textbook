/* 카드: 넓이가 음수로 나온 이 풀이, 어디가 틀렸을까? — 이상적분 풀이 네 개의 오류 찾기 */
(() => {
  const root = document.getElementById("card-adcalc-improper-spot");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, spot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const S = [
    { f: (x) => (x === 0 ? NaN : 1 / (x * x)), xr: [-1.5, 1.5], yr: [0, 12], a: -1, b: 1, xs: 0.5, ys: 2, bad: 0, note: "x = 0에서 무한대 — 구간 안의 불연속점" },
    { f: (x) => Math.exp(-x), xr: [-0.5, 6], yr: [0, 1.2], a: 0, b: 6, xs: 1, ys: 0.5, note: "넓이 1 (수렴)" },
    { f: (x) => x, xr: [-6, 6], yr: [-6, 6], a: -6, b: 6, xs: 2, ys: 2, note: "양쪽 꼬리가 각각 무한대" },
    { f: (x) => 1 / x, xr: [0, 12], yr: [0, 1.2], a: 1, b: 12, xs: 2, ys: 0.5, note: "∫₁ᵇ dx/x = ln b → ∞" },
  ];
  let sk = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = S[sk];
    const g = G.frame(ctx, w, h, { xr: s.xr, yr: s.yr, xs: s.xs, ys: s.ys, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    for (let i = 0; i < 400; i++) {
      const x = s.a + (s.b - s.a) * (i + 0.5) / 400, y = s.f(x);
      if (!Number.isFinite(y)) continue;
      ctx.fillStyle = y >= 0 ? "rgba(59,124,42,.2)" : "rgba(181,83,47,.2)";
      const y0 = g.Y(0), y1 = g.Y(NM.clamp(y, s.yr[0] * 2, s.yr[1] * 2));
      ctx.fillRect(g.X(s.a + (s.b - s.a) * i / 400), Math.min(y0, y1), g.w * (s.b - s.a) / (s.xr[1] - s.xr[0]) / 400 + 0.6, Math.abs(y1 - y0));
    }
    ctx.restore();
    G.curve(ctx, g, s.f, BLUE, { width: 2.4, N: 1200 });
    if (sk === 0) { ctx.save(); ctx.strokeStyle = done.has(0) ? C.warn : C.rule; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.X(0), g.y0); ctx.lineTo(g.X(0), g.y0 + g.h); ctx.stroke(); ctx.restore(); }
    if (done.has(sk)) G.tag(ctx, g, s.note, g.x0 + g.w - 4, g.y0 + 10, sk === 1 ? C.forest : C.warn, "right");
  }
  root.querySelectorAll(".spot").forEach((ol, i) => spot(ol, () => { done.add(i); draw(); }));
  G.chips(root, ".presets .chip", (b) => {
    sk = +b.dataset.s;
    root.querySelectorAll(".sol").forEach((d) => { d.hidden = +d.dataset.s !== sk; });
    draw();
  });
  draw();
})();
