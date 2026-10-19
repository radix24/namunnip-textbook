/* 카드: 하나 더 만들 때 드는 비용은 생산량에 따라 어떻게 달라질까? — 한계비용 C'(x), 할선과 접선 (가상 함수) */
(() => {
  const root = document.getElementById("card-econ-marginal-cost");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), hIn = $(".h"), XM = 60;
  const Cf = (x) => 0.01 * x ** 3 - 0.6 * x ** 2 + 15 * x + 100, MC = (x) => 0.03 * x ** 2 - 1.2 * x + 15;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const x = +xIn.value, h = +hIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: 1200, xt: [0, 10, 20, 30, 40, 50, 60], yt: [0, 300, 600, 900, 1200], xlab: "생산량 x(개)", ylab: "총비용(만 원)", L: 44 });
    P.clip();
    E.fn(ctx, P, Cf, 0, XM, C.ink, 2.4);
    E.fn(ctx, P, (t) => Cf(x) + MC(x) * (t - x), 0, XM, C.warn, 1.8);
    E.fn(ctx, P, (t) => Cf(x) + ((Cf(x + h) - Cf(x)) / h) * (t - x), 0, XM, E.BLUE, 1.6, [6, 4]);
    ctx.restore();
    E.dot(ctx, P, x, Cf(x), C.warn, 5, `x = ${x}`, 6, -8);
    E.dot(ctx, P, x + h, Cf(x + h), E.BLUE, 4);
    E.text(ctx, P.L + 8, P.T + 12, "주황: 접선(한계비용) · 파랑 점선: 할선", C.ink2);
  }
  function update() {
    const x = +xIn.value, h = +hIn.value, sec = (Cf(x + h) - Cf(x)) / h;
    $(".x-out").textContent = x; $(".h-out").textContent = E.n(h, 1);
    $(".say").textContent = `총비용 C(${x}) = ${E.n(Cf(x), 1)}만 원 · 평균변화율 [C(x + h) − C(x)]/h = ${E.n(sec, 3)} · 한계비용 C'(${x}) = ${E.n(MC(x), 3)}만 원/개 · 실제 1개 더: C(${x + 1}) − C(${x}) = ${E.n(Cf(x + 1) - Cf(x), 3)}`;
    draw();
  }
  [xIn, hIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
