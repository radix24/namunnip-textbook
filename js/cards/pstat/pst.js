/* 실용 통계 공용 도구: 정규 역함수, t분포, 좌표틀·곡선·막대 그리기 → window.NMPst (NMStat 위에 얹음) */
window.NMPst = (() => {
  "use strict";
  /* 표준정규분포의 역누적함수 (Acklam 근사, 상대오차 1.2×10⁻⁹ 이하) */
  function ninv(p) {
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const lo = 0.02425;
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - lo) return -ninv(1 - p);
    const q = p - 0.5, r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  /* 로그 감마 (Lanczos) */
  function lgamma(x) {
    const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015;
    for (const v of g) s += v / ++y;
    return -t + Math.log((2.5066282746310005 * s) / x);
  }
  /* 정규화 불완전 베타함수 I_x(a, b) (연분수) */
  function betacf(a, b, x) {
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m; let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }
  /* 자유도 df인 t분포의 밀도·누적확률·역함수 */
  const tpdf = (x, df) => Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2)) / Math.sqrt(df * Math.PI) * (1 + (x * x) / df) ** (-(df + 1) / 2);
  const tcdf = (x, df) => { const p = 0.5 * ibeta(df / (df + x * x), df / 2, 0.5); return x >= 0 ? 1 - p : p; };
  function tinv(p, df) { let lo = -60, hi = 60; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (tcdf(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* 좌표틀: o = {x0, x1, y0, y1, L, R, T, B, xt, yt, xf, yf, xlab, ylab} → {X, Y, inv} */
  function frame(ctx, size, o) {
    const { w, h } = size, L = o.L ?? 40, R = o.R ?? 12, T = o.T ?? 12, B = o.B ?? 30;
    const X = (v) => L + ((w - L - R) * (v - o.x0)) / (o.x1 - o.x0), Y = (v) => T + (h - T - B) * (1 - (v - o.y0) / (o.y1 - o.y0));
    const inv = (px) => o.x0 + ((px - L) * (o.x1 - o.x0)) / (w - L - R);
    const { C, F } = NM;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    (o.yt || []).forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(o.yf ? o.yf(v) : String(v), L - 4, Y(v) + 4); });
    ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(L, Y(o.y0)); ctx.lineTo(w - R, Y(o.y0)); ctx.stroke();
    (o.xt || []).forEach((v) => { ctx.textAlign = "center"; ctx.fillText(o.xf ? o.xf(v) : String(v), X(v), h - B + 14); });
    ctx.font = `11px ${F.sans}`;
    if (o.xlab) { ctx.textAlign = "center"; ctx.fillText(o.xlab, (L + w - R) / 2, h - 3); }
    if (o.ylab) { ctx.textAlign = "left"; ctx.fillText(o.ylab, L + 4, T + 10); }
    return { X, Y, inv, L, R, T, B };
  }
  /* 함수 곡선 */
  function curve(ctx, X, Y, f, a, b, col, lw = 2, n = 240) {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n, y = f(x); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
    ctx.stroke();
  }
  /* 히스토그램 막대: counts는 lo부터 폭 wd인 구간별 높이 */
  function bars(ctx, X, Y, counts, lo, wd, col) {
    ctx.fillStyle = col;
    counts.forEach((c, i) => { if (!c) return; const x0 = X(lo + i * wd), x1 = X(lo + (i + 1) * wd); ctx.fillRect(x0 + 0.5, Y(c), Math.max(1, x1 - x0 - 1), Y(0) - Y(c)); });
  }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
  const median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  return { ninv, tpdf, tcdf, tinv, frame, curve, bars, mean, sd, median, lgamma };
})();
