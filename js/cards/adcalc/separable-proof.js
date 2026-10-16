/* 카드: y′ = 2xy의 해를 식으로 구하려면? — 변수분리 풀이 조립과 방향장 위 해의 가족 */
(() => {
  const root = document.getElementById("card-adcalc-separable-proof");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  let stage = -1;
  const f = (x, y) => 2 * x * y;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [-1.6, 1.6], yr: [-4, 4], xs: 0.5, ys: 1, xf: (v) => n(v, 1), yf: (v) => n(v, 0) });
    A.field(ctx, g, f, { nx: 17, ny: 13 });
    if (stage >= 0) G.curve(ctx, g, () => 0, C.forest, { width: 2.6 });
    if (stage >= 3) [-2, -1, -0.5, 0.5, 2, 3].forEach((a) => G.curve(ctx, g, (x) => a * Math.exp(x * x), BLUE, { width: 1.6 }));
    if (stage >= 4) { G.curve(ctx, g, (x) => Math.exp(x * x), C.warn, { width: 2.8 }); G.dot(ctx, g, 0, 1, C.warn, false, 5); }
    const msg = ["단계를 쌓아 보세요", "상수해 y = 0", "변수 분리", "ln|y| = x² + C", "해의 가족 y = Ae^(x²)", "y(0) = 1인 해 y = e^(x²)"][stage + 1];
    G.tag(ctx, g, msg, g.x0 + 4, g.y0 + 10, C.ink2);
  }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d", "e"], onStep(i) { stage = i; draw(); } });
  draw();
})();
