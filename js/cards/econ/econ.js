/* 경제 수학 도구 window.NMEcon — 숫자 표기, 좌표 그래프 틀, 곡선·점 그리기 */
window.NMEcon = (() => {
  "use strict";
  const { C, F } = NM;
  /* 숫자: 소수 d자리, 천 단위 쉼표 */
  const n = (x, d = 0) => (Number.isFinite(x) ? (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toLocaleString("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—");
  const pct = (x, d = 1) => `${n(x * 100, d)}%`;
  /* 그래프 틀: o = {x0, x1, y0, y1, xt, yt, xlab, ylab, L, R, T, B}. 눈금은 [값, 글자] 또는 숫자 */
  function frame(ctx, size, o) {
    const L = o.L ?? 46, R = o.R ?? 20, T = o.T ?? 18, B = o.B ?? 30, w = size.w - L - R, h = size.h - T - B;
    const X = (x) => L + ((x - o.x0) / (o.x1 - o.x0)) * w, Y = (y) => T + ((o.y1 - y) / (o.y1 - o.y0)) * h;
    const inv = (px, py) => [o.x0 + ((px - L) / w) * (o.x1 - o.x0), o.y1 - ((py - T) / h) * (o.y1 - o.y0)];
    const tk = (a) => (a || []).map((t) => (Array.isArray(t) ? t : [t, n(t)]));
    NM.axes(ctx, { x0: L, y0: T, w, h, X, Y, xt: tk(o.xt), yt: tk(o.yt), xlabel: o.xlab, ylabel: o.ylab });
    ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, T + h); ctx.lineTo(L + w, T + h); ctx.stroke(); ctx.restore();
    return { X, Y, inv, L, T, w, h, clip: () => { ctx.save(); ctx.beginPath(); ctx.rect(L, T, w, h); ctx.clip(); } };
  }
  /* 함수 곡선 */
  function fn(ctx, P, f, a, b, col, lw = 2.2, dash) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); let on = false;
    for (let i = 0; i <= 240; i++) { const x = a + ((b - a) * i) / 240, y = f(x); if (!Number.isFinite(y)) { on = false; continue; } const px = P.X(x), py = P.Y(y); on ? ctx.lineTo(px, py) : ctx.moveTo(px, py); on = true; }
    ctx.stroke(); ctx.restore();
  }
  /* 꺾은선 */
  function line(ctx, P, pts, col, lw = 2, dash) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)))); ctx.stroke(); ctx.restore();
  }
  function dot(ctx, P, x, y, col, r = 4.5, lab, dx = 6, dy = -6) {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r, 0, 7); ctx.fill();
    if (lab) { ctx.font = `600 11px ${F.sans}`; ctx.textAlign = dx < 0 ? "right" : "left"; ctx.fillText(lab, P.X(x) + dx, P.Y(y) + dy); }
    ctx.restore();
  }
  function text(ctx, x, y, s, col = C.ink2, align = "left", font = `11px ${F.sans}`) { ctx.save(); ctx.fillStyle = col; ctx.font = font; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore(); }
  const BLUE = "#3f6fa3", PURPLE = "#7b5ea7", ORANGE = "#e0a02a";
  return { n, pct, frame, fn, line, dot, text, BLUE, PURPLE, ORANGE };
})();
