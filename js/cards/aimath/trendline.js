/* 카드: 흩어진 점들을 가장 잘 나타내는 직선은 어떻게 고를까? — 오차 제곱 = 정사각형 넓이, 최소제곱 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-trendline");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b");
  /* [최고 기온(℃), 판매량(개)] — 가상 */
  const D = [[17, 38], [19, 52], [21, 44], [22, 65], [24, 70], [25, 62], [27, 88], [28, 80], [29, 101], [31, 98], [32, 118], [33, 112]];
  const mx = D.reduce((s, d) => s + d[0], 0) / D.length, my = D.reduce((s, d) => s + d[1], 0) / D.length;
  const LA = D.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / D.reduce((s, [x]) => s + (x - mx) ** 2, 0), LB = my - LA * mx;
  const sse = (a, b) => D.reduce((s, [x, y]) => s + (y - a * x - b) ** 2, 0);
  let showLS = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const a = +aIn.value, b = +bIn.value;
    const P = E.frame(ctx, size, { x0: 14, x1: 36, y0: 0, y1: 150, xt: [15, 20, 25, 30, 35], yt: [0, 50, 100, 150], xlab: "최고 기온(℃)", ylab: "판매량(개)", L: 40 });
    /* 같은 화면 비율의 정사각형: 세로 오차 e를 가로로도 같은 픽셀 길이로 */
    P.clip();
    D.forEach(([x, y]) => { const yh = a * x + b, px = P.X(x), py1 = P.Y(y), py2 = P.Y(yh), s = Math.abs(py2 - py1); ctx.fillStyle = "rgba(181,83,47,.16)"; ctx.strokeStyle = "rgba(181,83,47,.6)"; ctx.lineWidth = 1; ctx.fillRect(px, Math.min(py1, py2), s, s); ctx.strokeRect(px, Math.min(py1, py2), s, s); });
    if (showLS) E.fn(ctx, P, (x) => LA * x + LB, 14, 36, C.forest, 1.8, [6, 4]);
    E.fn(ctx, P, (x) => a * x + b, 14, 36, E.BLUE, 2.4);
    ctx.restore();
    D.forEach(([x, y]) => E.dot(ctx, P, x, y, C.ink, 4));
    E.dot(ctx, P, mx, my, C.forest, 3.5, "평균점", 6, 14);
  }
  function update() {
    const a = +aIn.value, b = +bIn.value;
    $(".a-out").textContent = a.toFixed(1); $(".b-out").textContent = b;
    $(".say").textContent = `y = ${a.toFixed(1)}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} · 오차 제곱합(넓이 합) ${E.n(sse(a, b))}` + (showLS ? ` · 최소제곱: y = ${LA.toFixed(2)}x ${LB < 0 ? "−" : "+"} ${Math.abs(LB).toFixed(1)}, 제곱합 ${E.n(sse(LA, LB))} · 30℃ 예측 ${(LA * 30 + LB).toFixed(0)}개` : "");
    draw();
  }
  [aIn, bIn].forEach((el) => el.addEventListener("input", update));
  $(".go-ls").addEventListener("click", () => { showLS = true; update(); });
  update();
})();
