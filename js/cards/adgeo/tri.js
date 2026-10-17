/* 고급 기하 평면 도구 window.NMTri — 2차원 벡터 계산, 삼각형의 중심들, 끌 수 있는 점이 있는 그림판. */
window.NMTri = (() => {
  "use strict";
  const { C, F, fit } = NM;
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]], mul = (p, k) => [p[0] * k, p[1] * k];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1], cross = (p, q) => p[0] * q[1] - p[1] * q[0], len = (p) => Math.hypot(p[0], p[1]), dist = (p, q) => len(sub(p, q));
  const lerp = (p, q, t) => add(p, mul(sub(q, p), t));
  /* 직선 p1p2와 q1q2의 교점 */
  const meet = (p1, p2, q1, q2) => { const d = cross(sub(p2, p1), sub(q2, q1)); if (Math.abs(d) < 1e-12) return null; const t = cross(sub(q1, p1), sub(q2, q1)) / d; return lerp(p1, p2, t); };
  const foot = (P, X, Y) => { const d = sub(Y, X), t = dot(sub(P, X), d) / dot(d, d); return add(X, mul(d, t)); };
  function circum(A, B, Cc) { const d = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1])); if (Math.abs(d) < 1e-12) return null; const a2 = dot(A, A), b2 = dot(B, B), c2 = dot(Cc, Cc); return [(a2 * (B[1] - Cc[1]) + b2 * (Cc[1] - A[1]) + c2 * (A[1] - B[1])) / d, (a2 * (Cc[0] - B[0]) + b2 * (A[0] - Cc[0]) + c2 * (B[0] - A[0])) / d]; }
  const centroid = (A, B, Cc) => [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
  const ortho = (A, B, Cc) => { const O = circum(A, B, Cc); return O ? sub(add(add(A, B), Cc), mul(O, 2)) : null; };
  const incenter = (A, B, Cc) => { const a = dist(B, Cc), b = dist(Cc, A), c = dist(A, B), s = a + b + c; return [(a * A[0] + b * B[0] + c * Cc[0]) / s, (a * A[1] + b * B[1] + c * Cc[1]) / s]; };
  const angleAt = (P, Q, R) => (Math.acos(Math.max(-1, Math.min(1, dot(sub(Q, P), sub(R, P)) / (dist(P, Q) * dist(P, R))))) * 180) / Math.PI;
  /* 그림판: 좌표계 world 반폭 R(가로세로 같은 축척), pts = {이름: [x, y]}, drag 가능 이름 목록, draw(ctx, T, s) */
  function pad(canvas, o) {
    const f = fit(canvas, () => redraw());
    const R = o.R || 3;
    const T = (p) => { const { w, h } = f.size, s = Math.min(w, h) / (2 * R); return [w / 2 + (p[0] - (o.cx || 0)) * s, h / 2 - (p[1] - (o.cy || 0)) * s]; };
    const inv = (x, y) => { const { w, h } = f.size, s = Math.min(w, h) / (2 * R); return [(x - w / 2) / s + (o.cx || 0), (h / 2 - y) / s + (o.cy || 0)]; };
    function redraw() { const { ctx, size: { w, h } } = f; if (!w) return; ctx.clearRect(0, 0, w, h); o.draw(ctx, T, Math.min(w, h) / (2 * R), w, h); }
    let who = null;
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", (e) => { const b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; let best = null, d = 18; (o.handles() || []).forEach(([name, p]) => { const q = T(p), dd = Math.hypot(q[0] - x, q[1] - y); if (dd < d) { d = dd; best = name; } }); who = best; if (who) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); } });
    canvas.addEventListener("pointermove", (e) => { if (!who) return; const b = canvas.getBoundingClientRect(); o.move(who, inv(e.clientX - b.left, e.clientY - b.top)); redraw(); });
    canvas.addEventListener("pointerup", () => { if (who && o.end) o.end(who); who = null; });
    return { redraw, T, inv };
  }
  /* 그리기 도우미 */
  const seg = (ctx, T, p, q, col = C.ink, lw = 2, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(...T(p)); ctx.lineTo(...T(q)); ctx.stroke(); ctx.setLineDash([]); };
  const dot2 = (ctx, T, p, col = C.ink, r = 4.5, open) => { ctx.beginPath(); ctx.arc(...T(p), r, 0, 7); if (open) { ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); } else { ctx.fillStyle = col; ctx.fill(); } };
  const label = (ctx, T, t, p, col = C.ink, dx = 8, dy = -10, font) => { const q = T(p); ctx.font = font || `italic 700 14px ${F.serif}`; ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.lineWidth = 3; ctx.strokeStyle = C.card; ctx.strokeText(t, q[0] + dx, q[1] + dy); ctx.fillText(t, q[0] + dx, q[1] + dy); };
  const circle = (ctx, T, s, c, r, col = C.ink3, lw = 1.5, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.arc(...T(c), r * s, 0, 7); ctx.stroke(); ctx.setLineDash([]); };
  const n = (x, d = 3) => String(+x.toFixed(d)).replace("-", "−");
  return { add, sub, mul, dot, cross, len, dist, lerp, meet, foot, circum, centroid, ortho, incenter, angleAt, pad, seg, dot2, label, circle, n };
})();
