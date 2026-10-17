/* 카드: 영양 기준을 채우는 가장 싼 아침 식단은? — 열린 영역에서의 최소 (가상 영양 정보) */
(() => {
  const root = document.getElementById("card-econ-diet");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, R = NMRegion;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), yIn = $(".y"), XM = 10, YM = 10, CS = [{ a: 8, b: 4, c: 32, ge: true }, { a: 120, b: 200, c: 1000, ge: true }];
  let showV = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const cost = (x, y) => 800 * x + 600 * y;
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: YM, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10], xlab: "우유 x(잔)", ylab: "시리얼 y(그릇)", L: 30 });
    R.shade(ctx, P, CS, XM, YM, "rgba(116,171,102,.22)");
    P.clip();
    R.edge(ctx, P, CS[0], XM, YM, E.BLUE); R.edge(ctx, P, CS[1], XM, YM, E.ORANGE);
    const x = +xIn.value, y = +yIn.value, k = cost(x, y);
    E.line(ctx, P, [[0, k / 600], [k / 800, 0]], C.warn, 2, [6, 4]);
    ctx.restore();
    E.text(ctx, P.X(1.4), P.Y(5.6), "단백질 8x + 4y = 32", E.BLUE);
    E.text(ctx, P.X(6.3), P.Y(1.2) - 4, "열량 120x + 200y = 1000", E.ORANGE);
    if (showV) R.vertices(CS).forEach(([vx, vy]) => E.dot(ctx, P, vx, vy, C.ink, 4.5, `${E.n(cost(vx, vy))}원`, 6, -6));
    E.dot(ctx, P, x, y, R.ok(CS, x, y) ? C.forest : C.warn, 6);
  }
  function update() {
    const x = +xIn.value, y = +yIn.value, inside = R.ok(CS, x, y);
    $(".x-out").textContent = E.n(x, 1); $(".y-out").textContent = E.n(y, 1);
    const V = R.vertices(CS).map(([vx, vy]) => [vx, vy, cost(vx, vy)]).sort((p, q) => p[2] - q[2]);
    $(".say").textContent = `단백질 ${E.n(8 * x + 4 * y)}/32 g, 열량 ${E.n(120 * x + 200 * y)}/1000 kcal → ${inside ? "기준 충족" : "기준 미달"} · 비용 ${E.n(cost(x, y))}원` + (showV ? ` · 최소 비용 꼭짓점 (${E.n(V[0][0], 2)}, ${E.n(V[0][1], 2)})에서 ${E.n(V[0][2])}원` : "");
    draw();
  }
  [xIn, yIn].forEach((el) => el.addEventListener("input", update));
  $(".go-v").addEventListener("click", () => { showV = true; update(); });
  update();
})();
