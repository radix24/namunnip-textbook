/* 카드: 초기 조건을 넣었는데 해가 맞지 않는 이 풀이, 어디가 틀렸을까? — 변수분리 풀이 네 개의 오류 찾기 */
(() => {
  const root = document.getElementById("card-adcalc-separable-spot");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, spot } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const S = [
    { f: (x, y) => 3 * y, x0: 0, y0: 2, claim: (x) => Math.exp(3 * x) + 1, xr: [-1, 0.8], yr: [-0.5, 10] },
    { f: (x, y) => x / y, x0: 0, y0: 1, claim: (x) => x + 1, xr: [-2.5, 2.5], yr: [-0.5, 3.5] },
    { f: (x, y) => y * y, x0: 0, y0: 1, claim: (x) => (x >= 1 ? NaN : 1 / (1 - x)), xr: [-2, 1.3], yr: [-0.5, 10] },
    { f: (x, y) => y - 1, x0: 0, y0: 1, claim: null, xr: [-2, 2], yr: [-2, 4] },
  ];
  let sk = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = S[sk], span = s.yr[1] - s.yr[0];
    const g = G.frame(ctx, w, h, { xr: s.xr, yr: s.yr, xs: 0.5, ys: span > 6 ? 2 : 1, xf: (v) => n(v, 1), yf: (v) => n(v, 0) });
    A.field(ctx, g, s.f, { nx: 17, ny: 11 });
    const fw = A.rk4(s.f, s.x0, s.y0, s.xr[1], 0.002, 1e3), bw = A.rk4(s.f, s.x0, s.y0, s.xr[0], 0.002, 1e3);
    A.path(ctx, g, bw.reverse().concat(fw.slice(1)), C.ink, { width: 2.6 });
    if (s.claim) G.curve(ctx, g, s.claim, C.warn, { width: 2, dash: [6, 4], N: 600 });
    G.dot(ctx, g, s.x0, s.y0, C.ink, false, 5);
    if (done.has(sk)) G.tag(ctx, g, sk === 2 ? "실제 해와 풀이의 답이 같다" : "실제 해(검정)와 다른 곳을 찾았습니다", g.x0 + 4, g.y0 + 10, C.ink2);
  }
  root.querySelectorAll(".spot").forEach((ol, i) => spot(ol, () => { done.add(i); draw(); }));
  G.chips(root, ".presets .chip", (b) => {
    sk = +b.dataset.s;
    root.querySelectorAll(".sol").forEach((d) => { d.hidden = +d.dataset.s !== sk; });
    draw();
  });
  draw();
})();
