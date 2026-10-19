/* 카드: 예산선 위에서 만족이 가장 큰 점은 어떻게 생겼을까? — U = x^0.4 y^0.6, 예산선과의 접점 (가상 효용) */
(() => {
  const root = document.getElementById("card-econ-indifference");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), pxIn = $(".px"), M = 60000, PY = 10000, A = 0.4, XM = 12, YM = 8;
  const { ctx, size } = fit($("canvas"), () => draw());
  const U = (x, y) => x ** A * y ** (1 - A);
  const curveY = (u, x) => (u / x ** A) ** (1 / (1 - A));
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const px = +pxIn.value, xmax = M / px, x = Math.min(+xIn.value, xmax - 0.05), y = (M - px * x) / PY, u = U(x, y), xs = (A * M) / px, ys = ((1 - A) * M) / PY;
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: YM, xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 2, 4, 6, 8], xlab: "영화(편)", ylab: "책(권)", L: 34 });
    P.clip();
    ctx.fillStyle = "rgba(63,111,163,.08)"; ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(0)); ctx.lineTo(P.X(xmax), P.Y(0)); ctx.lineTo(P.X(0), P.Y(M / PY)); ctx.closePath(); ctx.fill();
    E.line(ctx, P, [[0, M / PY], [xmax, 0]], E.BLUE, 2.4);
    E.fn(ctx, P, (t) => curveY(U(xs, ys), t), 0.05, XM, C.forest, 1.4, [5, 4]);
    E.fn(ctx, P, (t) => curveY(u, t), 0.05, XM, C.warn, 2.4);
    ctx.restore();
    E.dot(ctx, P, x, y, C.warn, 5.5, `(${E.n(x, 1)}, ${E.n(y, 2)})`, 8, -8);
    E.text(ctx, P.X(xmax) + 4, P.Y(0) - 6, "예산선", E.BLUE);
    E.text(ctx, P.X(XM) - 4, P.Y(curveY(U(xs, ys), XM)) - 6, "최적점을 지나는 무차별곡선", C.forest, "right");
  }
  function update() {
    const px = +pxIn.value, xmax = M / px;
    xIn.max = Math.max(0.3, xmax - 0.1).toFixed(1);
    const x = Math.min(+xIn.value, +xIn.max), y = (M - px * x) / PY, xs = (A * M) / px, ys = ((1 - A) * M) / PY;
    $(".x-out").textContent = E.n(x, 1); $(".px-out").textContent = E.n(px);
    const near = Math.abs(x - xs) < 0.11;
    $(".say").textContent = `고른 점 영화 ${E.n(x, 1)}편, 책 ${E.n(y, 2)}권 · 효용 ${E.n(U(x, y), 3)}` + (near ? " · 무차별곡선이 예산선에 접합니다(최적)" : ` · 최대 효용 ${E.n(U(xs, ys), 3)}보다 작습니다(예산선이 곡선을 가로지름)`) + ` · 최적점 (${E.n(xs, 2)}, ${E.n(ys, 2)})에서 영화에 쓰는 돈 ${E.n(px * xs)}원 = 예산의 40%`;
    draw();
  }
  [xIn, pxIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
