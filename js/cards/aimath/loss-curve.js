/* 카드: 모델이 틀린 정도를 함수로 나타내면 어떤 모양일까? — y = wx의 평균제곱오차 L(w) (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-loss-curve");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const wIn = $(".w");
  /* [거리 km, 요금 천 원] — 가상 */
  const D = [[1, 4.6], [2, 6.1], [3, 7.9], [5, 10.6], [7, 13.4], [9, 16.8]];
  const L = (w) => D.reduce((s, [x, y]) => s + (y - w * x) ** 2, 0) / D.length;
  const WS = D.reduce((s, [x, y]) => s + x * y, 0) / D.reduce((s, [x]) => s + x * x, 0);
  const fc = fit($(".fitc"), () => drawFit()), lc = fit($(".lossc"), () => drawLoss());
  function drawFit() {
    const { ctx, size } = fc; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const w = +wIn.value, P = E.frame(ctx, size, { x0: 0, x1: 10, y0: 0, y1: 25, xt: [0, 5, 10], yt: [0, 10, 20], xlab: "거리(km)", ylab: "요금(천 원)", L: 32 });
    P.clip();
    D.forEach(([x, y]) => E.line(ctx, P, [[x, y], [x, w * x]], C.warn, 1.6));
    E.fn(ctx, P, (x) => w * x, 0, 10, E.BLUE, 2.4);
    ctx.restore();
    D.forEach(([x, y]) => E.dot(ctx, P, x, y, C.ink, 4));
  }
  function drawLoss() {
    const { ctx, size } = lc; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const w = +wIn.value, top = Math.ceil(Math.max(L(0), L(3)) / 20) * 20;
    const P = E.frame(ctx, size, { x0: 0, x1: 3, y0: 0, y1: top, xt: [[0, "0"], [1, "1"], [2, "2"], [3, "3"]], yt: [0, top / 2, top].map((v) => [v, E.n(v)]), xlab: "w", ylab: "손실 L(w)", L: 36 });
    E.fn(ctx, P, L, 0, 3, C.ink, 2.2);
    E.dot(ctx, P, WS, L(WS), C.forest, 4, "최소", 6, 14);
    E.dot(ctx, P, w, L(w), E.BLUE, 5.5);
  }
  function update() {
    const w = +wIn.value;
    $(".w-out").textContent = w.toFixed(2);
    $(".say").textContent = `L(${w.toFixed(2)}) = ${L(w).toFixed(3)} · 최소: w* = (xy의 합)/(x²의 합) = ${WS.toFixed(3)}, L(w*) = ${L(WS).toFixed(3)} · 그 점의 기울기 ${((-2 / D.length) * D.reduce((s, [x, y]) => s + x * (y - w * x), 0)).toFixed(2)}`;
    drawFit(); drawLoss();
  }
  wIn.addEventListener("input", update);
  update();
})();
