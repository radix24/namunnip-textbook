/* 카드: 이자에 이자가 붙으면 돈은 언제 두 배가 될까? — 단리·복리·연속 복리, 72의 법칙 */
(() => {
  const root = document.getElementById("card-econ-compound");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), nIn = $(".n"), mIn = $(".m"), P0 = 100;
  const { ctx, size } = fit($("canvas"), () => draw());
  const grow = (t) => { const r = +rIn.value / 100, m = +mIn.value; return m ? P0 * (1 + r / m) ** (m * t) : P0 * Math.exp(r * t); };
  const simple = (t) => P0 * (1 + (+rIn.value / 100) * t);
  const dbl = () => { const r = +rIn.value / 100, m = +mIn.value; return m ? Math.log(2) / (m * Math.log(1 + r / m)) : Math.log(2) / r; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const N = +nIn.value, top = Math.max(250, grow(N) * 1.08), step = [50, 100, 200, 500, 1000, 2000, 5000, 10000].find((s) => top / s <= 6) || 20000;
    const yt = []; for (let v = 0; v <= top; v += step) yt.push(v);
    const P = E.frame(ctx, size, { x0: 0, x1: N, y0: 0, y1: top, xt: [0, Math.round(N / 2), N].filter((v, i, a) => a.indexOf(v) === i).map((v) => [v, `${v}년`]), yt, xlab: "기간", ylab: "원리합계(만 원)", L: 52 });
    ctx.save(); ctx.strokeStyle = C.rule; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(200)); ctx.lineTo(P.X(N), P.Y(200)); ctx.stroke(); ctx.restore();
    E.text(ctx, P.X(0) + 4, P.Y(200) - 4, "두 배(200만 원)", C.ink3);
    E.fn(ctx, P, simple, 0, N, E.ORANGE, 2.4);
    E.fn(ctx, P, grow, 0, N, E.BLUE, 2.6);
    const d = dbl(); if (d <= N) E.dot(ctx, P, d, 200, E.BLUE, 5, `${E.n(d, 1)}년`, 6, -8);
    E.dot(ctx, P, N, grow(N), E.BLUE, 4, `복리 ${E.n(grow(N), 1)}`, -6, -8);
    E.dot(ctx, P, N, simple(N), E.ORANGE, 4, `단리 ${E.n(simple(N), 1)}`, -6, 16);
  }
  function update() {
    const R = +rIn.value, N = +nIn.value, d = dbl();
    $(".r-out").textContent = E.n(R, 1); $(".n-out").textContent = N;
    $(".say").textContent = `원금 100만 원 · ${N}년 뒤 단리 ${E.n(simple(N), 1)}만 원, 복리 ${E.n(grow(N), 1)}만 원 (차이 ${E.n(grow(N) - simple(N), 1)}만 원) · 두 배가 되는 때: 실제 ${E.n(d, 2)}년, 72의 법칙 ${E.n(72 / R, 2)}년 (오차 ${E.n(72 / R - d, 2)}년)`;
    draw();
  }
  [rIn, nIn, mIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
