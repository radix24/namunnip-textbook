/* 시장 카드 공용 window.NMMarket — 직선 수요·공급(Q = a − bP, Q = c + dP)과 수량–가격 그래프 */
window.NMMarket = (() => {
  "use strict";
  const { C } = NM;
  const E = NMEcon;
  const eq = (m) => { const P = (m.a - m.c) / (m.b + m.d); return { P, Q: m.a - m.b * P }; };
  /* 수량 가로, 가격 세로 */
  function plot(ctx, size, o) {
    const P = E.frame(ctx, size, { x0: 0, x1: o.QM, y0: 0, y1: o.PM, xt: o.xt, yt: o.yt, xlab: o.xlab || "수량", ylab: o.ylab || "가격", L: o.L ?? 48 });
    const dLine = (m, col, lw = 2.6, dash) => E.line(ctx, P, [[m.a, 0], [m.a - m.b * o.PM, o.PM]], col, lw, dash);
    const sLine = (m, col, lw = 2.6, dash, up = 0) => E.line(ctx, P, [[m.c - m.d * up, 0], [m.c + m.d * (o.PM - up), o.PM]].map(([q, p]) => [q, p]), col, lw, dash);
    return { P, dLine, sLine };
  }
  return { eq, plot, D: NMEcon.BLUE, S: C.warn };
})();
