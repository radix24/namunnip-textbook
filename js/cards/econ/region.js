/* 부등식 영역 카드 공용 window.NMRegion — 반평면 ax + by ≤ c(또는 ≥)들의 영역 칠하기, 꼭짓점 구하기 */
window.NMRegion = (() => {
  "use strict";
  /* 제약: {a, b, c, ge} → ax + by ≤ c (ge면 ≥). x ≥ 0, y ≥ 0은 따로 포함 */
  const ok = (cs, x, y, eps = 1e-9) => x >= -eps && y >= -eps && cs.every((k) => (k.ge ? k.a * x + k.b * y >= k.c - eps : k.a * x + k.b * y <= k.c + eps));
  /* 꼭짓점: 경계선(축 포함) 두 개의 교점 중 영역 안에 있는 것 */
  function vertices(cs) {
    const L = [...cs.map((k) => [k.a, k.b, k.c]), [1, 0, 0], [0, 1, 0]], out = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const [a1, b1, c1] = L[i], [a2, b2, c2] = L[j], det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-12) continue;
      const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
      if (ok(cs, x, y, 1e-7) && !out.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-6)) out.push([x, y]);
    }
    return out;
  }
  /* 영역 칠하기: 격자 픽셀 단위로 */
  function shade(ctx, P, cs, x1, y1, col, cell = 4) {
    ctx.save(); ctx.fillStyle = col;
    for (let px = P.L; px < P.L + P.w; px += cell) for (let py = P.T; py < P.T + P.h; py += cell) { const [x, y] = P.inv(px + cell / 2, py + cell / 2); if (x <= x1 && y <= y1 && ok(cs, x, y)) ctx.fillRect(px, py, cell, cell); }
    ctx.restore();
  }
  /* 경계선 ax + by = c를 그림 범위에서 */
  function edge(ctx, P, k, x1, y1, col, lw = 1.8) {
    const pts = [];
    if (Math.abs(k.b) > 1e-12) { [0, x1].forEach((x) => pts.push([x, (k.c - k.a * x) / k.b])); }
    else pts.push([k.c / k.a, 0], [k.c / k.a, y1]);
    NMEcon.line(ctx, P, pts, col, lw);
  }
  return { ok, vertices, shade, edge };
})();
