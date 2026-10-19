/* 카드: 기울기가 일정한 수요곡선인데 반응의 크기는 왜 달라질까? — ε = 2P/(100 − 2P), 총수입과의 관계 (가상 수요) */
(() => {
  const root = document.getElementById("card-econ-elasticity");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p");
  const Q = (p) => 100 - 2 * p, eps = (p) => (2 * p) / Q(p), R = (p) => p * Q(p);
  const dd = fit($(".dd"), () => drawD()), rr = fit($(".rr"), () => drawR());
  function drawD() {
    const { ctx, size } = dd; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const p = +pIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: 100, y0: 0, y1: 50, xt: [0, 50, 100], yt: [0, 25, 50], xlab: "수량 Q", ylab: "가격 P", L: 30 });
    ctx.fillStyle = "rgba(63,111,163,.15)"; ctx.fillRect(P.X(0), P.Y(p), P.X(Q(p)) - P.X(0), P.Y(0) - P.Y(p));
    E.line(ctx, P, [[0, 50], [50, 25]], C.warn, 3.2);
    E.line(ctx, P, [[50, 25], [100, 0]], E.BLUE, 3.2);
    E.text(ctx, P.X(4), P.Y(46), "탄력적(ε > 1)", C.warn);
    E.text(ctx, P.X(55), P.Y(16), "비탄력적(ε < 1)", E.BLUE);
    E.dot(ctx, P, 50, 25, C.ink3, 3.5, "ε = 1", 6, -6);
    E.dot(ctx, P, Q(p), p, C.ink, 5.5);
  }
  function drawR() {
    const { ctx, size } = rr; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const p = +pIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: 50, y0: 0, y1: 1400, xt: [0, 25, 50], yt: [0, 500, 1000], xlab: "가격 P", ylab: "총수입 R = PQ", L: 40 });
    E.fn(ctx, P, R, 0, 50, C.ink, 2.4);
    E.dot(ctx, P, 25, R(25), C.ink3, 3.5, "최대", 6, -6);
    E.dot(ctx, P, p, R(p), p < 25 ? E.BLUE : p > 25 ? C.warn : C.ink, 5.5);
  }
  function update() {
    const p = +pIn.value, e = eps(p);
    $(".p-out").textContent = p;
    $(".say").textContent = `Q = ${Q(p)} · ε = 2·${p}/${Q(p)} = ${E.n(e, 3)} → ${Math.abs(e - 1) < 1e-9 ? "단위 탄력적" : e > 1 ? "탄력적" : "비탄력적"} · 가격 1% 인상 → 수요량 약 ${E.n(e, 2)}% 감소 · 총수입 ${E.n(R(p))} → 값을 올리면 수입이 ${Math.abs(e - 1) < 1e-9 ? "거의 그대로" : e < 1 ? "늘어남" : "줄어듦"}`;
    drawD(); drawR();
  }
  pIn.addEventListener("input", update);
  update();
})();
