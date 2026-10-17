/* 카드: 개당 평균 비용이 가장 낮은 생산량은 어디일까? — AC = C/x, MC = C', 최소에서 MC = AC (가상 함수) */
(() => {
  const root = document.getElementById("card-econ-avg-marginal");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), XM = 60;
  const Cf = (x) => 0.01 * x ** 3 - 0.6 * x ** 2 + 15 * x + 100, MC = (x) => 0.03 * x ** 2 - 1.2 * x + 15, AC = (x) => Cf(x) / x;
  /* AC 최소: MC = AC를 이분법으로 (x는 20~60 사이) */
  const XS = (() => { let lo = 20, hi = 60; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; MC(m) - AC(m) < 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; })();
  const tc = fit($(".tc"), () => drawTc()), ac = fit($(".ac"), () => drawAc());
  function drawTc() {
    const { ctx, size } = tc; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const x = +xIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: 1200, xt: [0, 20, 40, 60], yt: [0, 400, 800, 1200], xlab: "x", ylab: "총비용", L: 40 });
    P.clip();
    E.fn(ctx, P, Cf, 0, XM, C.ink, 2.2);
    E.fn(ctx, P, (t) => AC(x) * t, 0, XM, E.BLUE, 1.8);
    E.fn(ctx, P, (t) => Cf(x) + MC(x) * (t - x), 0, XM, C.warn, 1.6, [5, 4]);
    ctx.restore();
    E.dot(ctx, P, x, Cf(x), C.ink, 5);
  }
  function drawAc() {
    const { ctx, size } = ac; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const x = +xIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: 50, xt: [0, 20, 40, 60], yt: [0, 10, 20, 30, 40, 50], xlab: "x", ylab: "만 원/개", L: 34 });
    P.clip();
    E.fn(ctx, P, AC, 1, XM, E.BLUE, 2.4);
    E.fn(ctx, P, MC, 0, XM, C.warn, 2.4);
    ctx.restore();
    E.dot(ctx, P, XS, AC(XS), C.ink3, 4, "AC 최소", 6, 14);
    E.dot(ctx, P, x, AC(x), E.BLUE, 5); E.dot(ctx, P, x, MC(x), C.warn, 5);
    E.text(ctx, P.X(4), P.Y(46), "AC(파랑) · MC(주황)", C.ink2);
  }
  function update() {
    const x = +xIn.value, a = AC(x), m = MC(x);
    $(".x-out").textContent = x;
    $(".say").textContent = `평균비용 AC(${x}) = ${E.n(a, 2)} · 한계비용 MC(${x}) = ${E.n(m, 2)} → ${Math.abs(m - a) < 0.35 ? "거의 같습니다: 평균비용이 최소인 근처입니다" : m < a ? "MC < AC라 생산을 늘리면 평균비용이 줄어듭니다" : "MC > AC라 생산을 늘리면 평균비용이 늘어납니다"} · 평균비용 최소: x ≈ ${E.n(XS, 1)}, AC ≈ ${E.n(AC(XS), 2)}만 원`;
    drawTc(); drawAc();
  }
  xIn.addEventListener("input", update);
  update();
})();
