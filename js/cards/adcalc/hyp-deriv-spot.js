/* 카드: 이 미분 풀이, 어디가 틀렸을까? — 쌍곡선함수 미분 풀이 네 개의 오류 찾기, 풀이의 답과 수치 기울기 비교 */
(() => {
  const root = document.getElementById("card-adcalc-hyp-deriv-spot");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, spot } = NMPm;
  const $ = (s) => root.querySelector(s);
  const ash = (x) => Math.log(x + Math.sqrt(x * x + 1));
  const S = [
    { f: (x) => x * Math.cosh(x), claim: (x) => Math.cosh(x) - x * Math.sinh(x), yr: [-6, 8] },
    { f: (x) => Math.sinh(3 * x), claim: (x) => Math.cosh(3 * x), yr: [-1, 8] },
    { f: Math.tanh, claim: (x) => 1 / Math.cosh(x) ** 2, yr: [-0.3, 1.3] },
    { f: ash, claim: (x) => (Math.abs(x) <= 1 ? NaN : 1 / Math.sqrt(x * x - 1)), yr: [-0.3, 2] },
  ];
  let sk = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());
  const num = (f) => (x) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = S[sk], xr = sk === 1 ? [-1, 1] : [-3, 3];
    const span = s.yr[1] - s.yr[0];
    const g = G.frame(ctx, w, h, { xr, yr: s.yr, xs: sk === 1 ? 0.5 : 1, ys: span > 5 ? 2 : 0.5, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    G.curve(ctx, g, num(s.f), C.forest, { width: 2, dash: [5, 4], N: 600 });
    G.curve(ctx, g, s.claim, C.warn, { width: 2.2, N: 900 });
    G.tag(ctx, g, "실선: 풀이의 답", g.x0 + 4, g.y0 + 10, C.warn);
    G.tag(ctx, g, "점선: 실제 접선의 기울기", g.x0 + 4, g.y0 + 28, C.forest);
    if (done.has(sk)) G.tag(ctx, g, sk === 2 ? "바른 풀이" : "틀린 곳을 찾았습니다", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink2, "right");
  }
  root.querySelectorAll(".spot").forEach((ol, i) => spot(ol, () => { done.add(i); draw(); }));
  G.chips(root, ".presets .chip", (b) => {
    sk = +b.dataset.s;
    root.querySelectorAll(".sol").forEach((d) => { d.hidden = +d.dataset.s !== sk; });
    draw();
  });
  draw();
})();
