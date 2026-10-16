/* 카드: 운동 에너지 ½mv²은 상대성 이론의 어떤 근사일까? — (γ − 1), ½β², ½β² + 3β⁴/8 비교 */
(() => {
  const root = document.getElementById("card-adcalc-relativity");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sb = $(".sb");
  const K = (b) => 1 / Math.sqrt(1 - b * b) - 1, N1 = (b) => 0.5 * b * b, N2 = (b) => 0.5 * b * b + 0.375 * b ** 4;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [0, 1], yr: [0, 2.5], xs: 0.1, ys: 0.5, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    G.curve(ctx, g, (b) => (b >= 0.999 ? NaN : K(b)), C.ink, { width: 2.6, N: 600 });
    G.curve(ctx, g, N1, C.warn, { width: 2, dash: [6, 4] });
    G.curve(ctx, g, N2, BLUE, { width: 2, dash: [2, 3] });
    const b = +sb.value;
    G.guide(ctx, g, b, K(b), C.ink3, "x"); G.dot(ctx, g, b, K(b), C.ink);
    G.tag(ctx, g, "검정: (γ − 1) · 주황: ½β² · 파랑: ½β² + ⅜β⁴", g.x0 + 4, g.y0 + 10, C.ink2);
    G.tag(ctx, g, "가로: β = v/c, 세로: K ÷ mc²", g.x0 + 4, g.y0 + 28, C.ink3);
  }
  function nums() {
    const b = +sb.value, k = K(b);
    $(".b-out").textContent = n(b, 3);
    $(".n-e").textContent = n(k, 5);
    $(".n-1").textContent = `${n((k - N1(b)) / k * 100, 3)}%`;
    $(".n-2").textContent = `${n((k - N2(b)) / k * 100, 3)}%`;
    draw();
  }
  sb.addEventListener("input", nums);
  nums();
})();
