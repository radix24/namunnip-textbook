/* 카드: 로피탈의 정리를 쓴 이 풀이, 어디가 틀렸을까? — 풀이 네 개의 오류 찾기와 함수 그래프 */
(() => {
  const root = document.getElementById("card-pmath-lhopital-errors");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, spot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const S = [
    { f: (x) => (x * x + 1) / (x + 1), xr: [-0.9, 1], yr: [0, 2], at: 0, L: 1, wrong: 0, xs: 0.5 },
    { f: (x) => (Math.abs(x) < 1e-9 ? NaN : Math.sin(x) / x), xr: [-6, 6], yr: [-0.4, 1.3], at: 0, L: 1, wrong: 0, xs: 2 },
    { f: (x) => (x + Math.sin(x)) / x, xr: [1, 60], yr: [0.6, 1.6], at: Infinity, L: 1, wrong: null, xs: 10 },
    { f: (x) => (Math.abs(x) < 1e-6 ? NaN : (Math.exp(x) - 1 - x) / (x * x)), xr: [-2, 2], yr: [0, 1.2], at: 0, L: 0.5, wrong: null, xs: 1 },
  ];
  let sk = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = S[sk];
    const g = G.frame(ctx, w, h, { xr: s.xr, yr: s.yr, xs: s.xs, ys: (s.yr[1] - s.yr[0]) > 1.5 ? 0.5 : 0.2, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    G.curve(ctx, g, s.f, BLUE, { width: 2.4, N: 1200 });
    if (s.at !== Infinity) G.dot(ctx, g, s.at, s.L, BLUE, true, 5);
    if (done.has(sk)) {
      G.curve(ctx, g, () => s.L, C.forest, { width: 1.6, dash: [6, 4] });
      if (s.wrong != null) G.curve(ctx, g, () => s.wrong, C.warn, { width: 1.4, dash: [2, 4] });
      G.tag(ctx, g, `참값 ${n(s.L, 2)}${s.wrong != null ? ` · 풀이의 답 ${n(s.wrong, 2)}` : ""}`, g.x0 + g.w - 4, g.y0 + 10, C.forest, "right");
    } else G.tag(ctx, g, s.at === Infinity ? "x → ∞" : `x → ${n(s.at, 0)}`, g.x0 + g.w - 4, g.y0 + 10, C.ink3, "right");
  }
  root.querySelectorAll(".spot").forEach((ol, i) => spot(ol, () => { done.add(i); draw(); }));
  G.chips(root, ".presets .chip", (b) => {
    sk = +b.dataset.s;
    root.querySelectorAll(".sol").forEach((d) => { d.hidden = +d.dataset.s !== sk; });
    draw();
  });
  draw();
})();
