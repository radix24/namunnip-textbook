/* 고급 기하 곡선 도구 window.NMCurve — 매개변수 곡선의 수치 미분(속도·가속도·곡률), 길이, 그래프 그리기. */
window.NMCurve = (() => {
  "use strict";
  const { C, F } = NM;
  const h = 1e-4;
  const sub = (a, b) => a.map((x, i) => x - b[i]), add = (a, b) => a.map((x, i) => x + b[i]), mul = (a, k) => a.map((x) => x * k);
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0), len = (a) => Math.sqrt(dot(a, a));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const d1 = (f, t) => mul(sub(f(t + h), f(t - h)), 1 / (2 * h));
  const d2 = (f, t) => mul(add(sub(f(t + h), mul(f(t), 2)), f(t - h)), 1 / (h * h));
  const to3 = (v) => (v.length === 2 ? [v[0], v[1], 0] : v);
  /* 곡률 κ = |r′ × r″| / |r′|³ */
  const kappa = (f, t) => { const a = to3(d1(f, t)), b = to3(d2(f, t)), s = len(a); return s < 1e-9 ? NaN : len(cross(a, b)) / (s * s * s); };
  /* 길이: 심프슨 */
  function arcLen(f, a, b, n = 400) { const g = (t) => len(d1(f, t)); let s = g(a) + g(b); const dt = (b - a) / n; for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * g(a + k * dt); return (s * dt) / 3; }
  /* 꺾은선 길이 */
  const polyLen = (f, a, b, n) => { let s = 0, p = f(a); for (let k = 1; k <= n; k++) { const q = f(a + ((b - a) * k) / n); s += len(sub(q, p)); p = q; } return s; };
  /* 간단한 시간 그래프: series = [{data:[[t, v]…], col, name}], 축 범위 자동 */
  function graph(ctx, box, series, o = {}) {
    const { x, y, w, h: H } = box, all = series.flatMap((s) => s.data), t0 = o.t0 ?? Math.min(...all.map((d) => d[0])), t1 = o.t1 ?? Math.max(...all.map((d) => d[0]));
    const v0 = o.v0 ?? Math.min(0, ...all.map((d) => d[1])), v1 = o.v1 ?? (Math.max(...all.map((d) => d[1])) * 1.1 || 1);
    const X = (t) => x + 34 + ((t - t0) / (t1 - t0)) * (w - 40), Y = (v) => y + H - 16 - ((v - v0) / (v1 - v0)) * (H - 24);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.strokeRect(x + 34, y + 8, w - 40, H - 24);
    ctx.fillStyle = C.ink2; ctx.font = `10px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    [v0, (v0 + v1) / 2, v1].forEach((v) => ctx.fillText(String(+v.toFixed(1)), x + 31, Y(v)));
    (o.lines || []).forEach(([v, col, lab]) => { ctx.strokeStyle = col; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(t0), Y(v)); ctx.lineTo(X(t1), Y(v)); ctx.stroke(); ctx.setLineDash([]); if (lab) { ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(lab, X(t0) + 4, Y(v) - 8); } });
    series.forEach((s) => { ctx.strokeStyle = s.col; ctx.lineWidth = 2; ctx.beginPath(); s.data.forEach(([t, v], i) => (i ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)))); ctx.stroke(); });
    if (o.mark != null) { ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(o.mark), y + 8); ctx.lineTo(X(o.mark), y + H - 16); ctx.stroke(); }
    ctx.textAlign = "left"; series.forEach((s, i) => { ctx.fillStyle = s.col; ctx.fillText(s.name || "", x + 40 + i * 90, y + 16); });
    return { X, Y };
  }
  const n = (x, d = 3) => (Number.isFinite(x) ? String(+x.toFixed(d)).replace("-", "−") : "—");
  return { sub, add, mul, dot, len, cross, d1, d2, kappa, arcLen, polyLen, graph, n };
})();
