/* 카드: 책상과 의자를 몇 개씩 만들어야 이익이 가장 클까? — 선형계획, 꼭짓점에서 최대 (모의 값) */
(() => {
  const root = document.getElementById("card-econ-lp-production");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, R = NMRegion;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), yIn = $(".y"), kIn = $(".k"), XM = 60, YM = 60, CS = [{ a: 2, b: 1, c: 100 }, { a: 1, b: 2, c: 80 }];
  let showV = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const prof = (x, y) => +kIn.value * x + 3 * y;
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: YM, xt: [0, 20, 40, 60], yt: [0, 20, 40, 60], xlab: "책상 x", ylab: "의자 y", L: 34 });
    R.shade(ctx, P, CS, XM, YM, "rgba(116,171,102,.22)");
    P.clip();
    R.edge(ctx, P, CS[0], XM, YM, E.BLUE); R.edge(ctx, P, CS[1], XM, YM, E.ORANGE);
    const x = +xIn.value, y = +yIn.value, k = prof(x, y), a = +kIn.value;
    E.line(ctx, P, [[0, k / 3], [k / a, 0]], C.warn, 2, [6, 4]);
    ctx.restore();
    E.text(ctx, P.X(47) + 4, P.Y(10), "작업 2x + y = 100", E.BLUE);
    E.text(ctx, P.X(14), P.Y(33) - 6, "나무 x + 2y = 80", E.ORANGE);
    if (showV) R.vertices(CS).forEach(([vx, vy]) => E.dot(ctx, P, vx, vy, C.ink, 4.5, `${E.n(prof(vx, vy), 1)}`, 6, vy < 3 ? -8 : -6));
    E.dot(ctx, P, x, y, R.ok(CS, x, y) ? C.forest : C.warn, 6);
  }
  function update() {
    const x = +xIn.value, y = +yIn.value, a = +kIn.value, inside = R.ok(CS, x, y);
    $(".x-out").textContent = x; $(".y-out").textContent = y; $(".k-out").textContent = E.n(a, 1);
    const V = R.vertices(CS).map(([vx, vy]) => [vx, vy, prof(vx, vy)]).sort((p, q) => q[2] - p[2]), best = V[0];
    $(".say").textContent = `작업 ${2 * x + y}/100시간, 나무 ${x + 2 * y}/80장 → ${inside ? "가능" : "불가능(제약을 넘음)"} · 이익 ${a}x + 3y = ${E.n(prof(x, y), 1)}만 원` + (showV ? ` · 최대 이익: 꼭짓점 (${E.n(best[0])}, ${E.n(best[1])})에서 ${E.n(best[2], 1)}만 원` : "");
    draw();
  }
  [xIn, yIn, kIn].forEach((el) => el.addEventListener("input", update));
  $(".go-v").addEventListener("click", () => { showV = true; update(); });
  update();
})();
