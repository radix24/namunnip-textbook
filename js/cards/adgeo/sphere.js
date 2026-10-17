/* 구면 도구 window.NMSphere — 위도·경도 ↔ 좌표, 대원호, 구면삼각형의 변과 각, NMSpace3 그림판에 구 그리기. */
window.NMSphere = (() => {
  "use strict";
  const { C } = NM;
  const S = NMSpace3;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
  /* 위도 φ, 경도 λ(도) → 단위구 위의 점 */
  const xyz = (lat, lon) => [Math.cos(rad(lat)) * Math.cos(rad(lon)), Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat))];
  const latlon = (p) => [deg(Math.asin(Math.max(-1, Math.min(1, p[2])))), deg(Math.atan2(p[1], p[0]))];
  /* 두 단위벡터 사이의 중심각(라디안) = 대원 거리 */
  const arc = (p, q) => Math.acos(Math.max(-1, Math.min(1, S.dot(p, q))));
  /* 대원호 위의 점들 */
  function slerp(p, q, n = 64) { const w = arc(p, q); if (w < 1e-9) return [p]; return [...Array(n + 1)].map((_, k) => { const t = k / n, a = Math.sin((1 - t) * w) / Math.sin(w), b = Math.sin(t * w) / Math.sin(w); return S.add(S.mul(p, a), S.mul(q, b)); }); }
  /* 꼭짓점 A에서 대원 AB, AC 사이의 각 */
  function angleAt(A, B, Cc) { const t1 = S.sub(B, S.mul(A, S.dot(A, B))), t2 = S.sub(Cc, S.mul(A, S.dot(A, Cc))); return Math.acos(Math.max(-1, Math.min(1, S.dot(t1, t2) / (S.len(t1) * S.len(t2))))); }
  /* 구 그리기: 윤곽(화면의 원), 위선·경선 일부 */
  function globe(v, R = 1, grid = true) {
    const { ctx } = v, c = v.P([0, 0, 0]), s = v.scale() * R;
    ctx.fillStyle = "rgba(143,184,222,.16)"; ctx.beginPath(); ctx.arc(c.x, c.y, s, 0, 7); ctx.fill();
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.4; ctx.stroke();
    if (!grid) return;
    for (let lat = -60; lat <= 60; lat += 30) curve(v, [...Array(73)].map((_, k) => S.mul(xyz(lat, k * 5), R)), lat === 0 ? "rgba(93,93,97,.55)" : "rgba(141,141,146,.35)", 1);
    for (let lon = 0; lon < 360; lon += 30) curve(v, [...Array(37)].map((_, k) => S.mul(xyz(-90 + k * 5, lon), R)), "rgba(141,141,146,.35)", 1);
  }
  /* 앞면은 실선, 뒷면은 점선으로 */
  function curve(v, pts, col, w = 2, dashBack = true) {
    const eye = v.eye(), { ctx } = v;
    for (let i = 1; i < pts.length; i++) {
      const front = S.dot(S.add(pts[i], pts[i - 1]), eye) >= 0;
      if (!front && !dashBack) continue;
      const a = v.P(pts[i - 1]), b = v.P(pts[i]);
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = front ? w : Math.max(1, w * 0.6); ctx.globalAlpha = front ? 1 : 0.45; if (!front) ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    }
  }
  const front = (v, p) => S.dot(p, v.eye()) >= 0;
  return { rad, deg, xyz, latlon, arc, slerp, angleAt, globe, curve, front };
})();
