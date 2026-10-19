/* 카드: 일시금 10억 원과 20년간 해마다 7000만 원, 무엇을 고를까? — 연금의 현재 가치와 기준 할인율 (가상 상황) */
(() => {
  const root = document.getElementById("card-econ-lump-or-annuity");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const LIn = $(".L"), aIn = $(".a"), nIn = $(".n"), RMAX = 0.12;
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 금액 단위: 억 원 */
  const pv = (r) => { const a = +aIn.value / 1e4, n = +nIn.value; return r < 1e-9 ? a * n : (a * (1 - (1 + r) ** -n)) / r; };
  /* pv는 r에 대해 감소 → 이분법으로 pv(r) = 일시금 */
  const breakEven = () => { const L = +LIn.value; if (pv(0) <= L) return null; let lo = 0, hi = 1; if (pv(hi) > L) return Infinity; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; pv(m) > L ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const L = +LIn.value, top = Math.ceil(Math.max(pv(0), L) * 1.1 / 5) * 5;
    const yt = []; for (let v = 0; v <= top; v += top > 20 ? 10 : 5) yt.push([v, `${v}억`]);
    const P = E.frame(ctx, size, { x0: 0, x1: RMAX, y0: 0, y1: top, xt: [0, 0.03, 0.06, 0.09, 0.12].map((v) => [v, `${Math.round(v * 100)}%`]), yt, xlab: "할인율", ylab: "현재 가치", L: 44 });
    E.fn(ctx, P, () => L, 0, RMAX, C.warn, 2.2, [6, 4]);
    E.fn(ctx, P, pv, 0, RMAX, E.BLUE, 2.6);
    E.text(ctx, P.X(RMAX) - 4, P.Y(L) - 6, `일시금 ${E.n(L, 1)}억`, C.warn, "right");
    E.text(ctx, P.X(RMAX) - 4, P.Y(pv(RMAX)) + 16, "연금의 현재 가치", E.BLUE, "right");
    const be = breakEven(); if (be !== null && be < RMAX) { E.dot(ctx, P, be, L, C.ink, 5, `${E.n(be * 100, 2)}%`, 6, -8); ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(be), P.Y(L)); ctx.lineTo(P.X(be), P.Y(0)); ctx.stroke(); ctx.restore(); }
  }
  function update() {
    const L = +LIn.value, a = +aIn.value, n = +nIn.value, be = breakEven();
    $(".L-out").textContent = E.n(L, 1); $(".a-out").textContent = E.n(a); $(".n-out").textContent = n;
    const tail = be === null ? "받는 금액의 합이 일시금보다 작아 어떤 할인율에서도 일시금이 유리합니다." : be === Infinity ? "모든 할인율에서 연금이 유리합니다." : `할인율이 ${E.n(be * 100, 2)}%보다 낮으면 연금, 높으면 일시금이 유리합니다.`;
    $(".say").textContent = `연금 합계 ${E.n((a * n) / 1e4, 1)}억 원 · 할인율 3%에서 현재 가치 ${E.n(pv(0.03), 2)}억, 6%에서 ${E.n(pv(0.06), 2)}억 원 · ${tail}`;
    draw();
  }
  [LIn, aIn, nIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
