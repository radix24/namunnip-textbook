/* 카드: 지도의 등고선은 곡면을 어떻게 나타낸 것일까? — z = f(x, y), 높이 c의 교선과 등위곡선 지도 */
(() => {
  const root = document.getElementById("card-adgeo-contour");
  if (!root) return;
  const { C, fit } = NM;
  const S = NMSpace3;
  const $ = (s) => root.querySelector(s);
  const cIn = $(".c"), D = 2; // 정의역 [−D, D]²
  const FN = [
    { f: (x, y) => 1.6 * Math.exp(-((x - 0.8) ** 2 + (y - 0.4) ** 2) / 0.5) + 1.1 * Math.exp(-((x + 0.9) ** 2 + (y + 0.6) ** 2) / 0.6), lo: 0, hi: 1.7, zs: 1 },
    { f: (x, y) => x * x + y * y, lo: 0, hi: 4, zs: 0.4 },
    { f: (x, y) => x * x - y * y, lo: -3, hi: 3, zs: 0.4 },
    { f: (x, y) => x + y / 2, lo: -3, hi: 3, zs: 0.4 },
  ];
  let fi = 0;
  const level = () => { const F = FN[fi]; return F.lo + (F.hi - F.lo) * +cIn.value; };
  const v3 = S.view($(".v3"), () => draw3(), { center: [0, 0, 0.3], span: 6.4, yaw: -2.3, pitch: 0.55 });
  const mp = fit($(".map"), () => drawMap());
  /* 마칭 스퀘어로 f = c의 선분들 */
  function segs(c, N = 48) {
    const F = FN[fi], out = [], h = (2 * D) / N, val = (i, j) => F.f(-D + i * h, -D + j * h) - c;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = [val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)], P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let k = 0; k < 4; k++) { const a = v[k], b = v[(k + 1) % 4]; if ((a < 0) !== (b < 0)) { const t = a / (a - b), p = P[k], q = P[(k + 1) % 4]; pts.push([-D + (p[0] + t * (q[0] - p[0])) * h, -D + (p[1] + t * (q[1] - p[1])) * h]); } }
      if (pts.length >= 2) out.push([pts[0], pts[1]]); if (pts.length === 4) out.push([pts[2], pts[3]]);
    }
    return out;
  }
  function draw3() {
    const { ctx, size } = v3; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const F = FN[fi], z = (x, y) => F.f(x, y) * F.zs, N = 16;
    for (let i = 0; i <= N; i++) { const x = -D + (2 * D * i) / N; v3.path([...Array(N + 1)].map((_, j) => { const y = -D + (2 * D * j) / N; return [x, y, z(x, y)]; }), "rgba(63,111,163,.45)", 1, null, false); v3.path([...Array(N + 1)].map((_, j) => { const y = -D + (2 * D * j) / N; return [y, x, z(y, x)]; }), "rgba(63,111,163,.45)", 1, null, false); }
    const c = level(), zc = c * F.zs;
    v3.poly([[-D, -D, zc], [D, -D, zc], [D, D, zc], [-D, D, zc]], "#e0a02a", "#e0a02a", 0.12, 1);
    segs(c, 40).forEach(([p, q]) => { v3.line([p[0], p[1], zc], [q[0], q[1], zc], C.warn, 2.6); v3.line([p[0], p[1], -1.6], [q[0], q[1], -1.6], "rgba(181,83,47,.5)", 1.4); });
    v3.path([[-D, -D, -1.6], [D, -D, -1.6], [D, D, -1.6], [-D, D, -1.6]], C.rule, 1, null, true);
  }
  function drawMap() {
    const { ctx, size: { w, h } } = mp; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) / (2 * D + 0.4), X = (x) => w / 2 + x * s, Y = (y) => h / 2 - y * s, F = FN[fi];
    ctx.strokeStyle = C.rule; ctx.strokeRect(X(-D), Y(D), 2 * D * s, 2 * D * s);
    for (let k = 1; k < 10; k++) { const c = F.lo + ((F.hi - F.lo) * k) / 10; ctx.strokeStyle = "rgba(63,111,163,.55)"; ctx.lineWidth = 1; segs(c).forEach(([p, q]) => { ctx.beginPath(); ctx.moveTo(X(p[0]), Y(p[1])); ctx.lineTo(X(q[0]), Y(q[1])); ctx.stroke(); }); }
    ctx.strokeStyle = C.warn; ctx.lineWidth = 3; segs(level()).forEach(([p, q]) => { ctx.beginPath(); ctx.moveTo(X(p[0]), Y(p[1])); ctx.lineTo(X(q[0]), Y(q[1])); ctx.stroke(); });
  }
  function update() {
    const c = level(); $(".c-out").textContent = S.n(c, 2);
    const names = ["두 봉우리: 높이에 따라 고리 두 개 또는 하나", "동심원 x² + y² = c", c > 1e-6 ? "쌍곡선(좌우로 열림)" : c < -1e-6 ? "쌍곡선(위아래로 열림)" : "두 직선 y = ±x", "평행한 직선 x + y/2 = c"];
    $(".say").textContent = `높이 c = ${S.n(c, 2)}의 등위곡선: ${names[fi]} · 오른쪽 지도의 가는 선은 같은 간격의 높이`;
    draw3(); drawMap();
  }
  $(".pick").addEventListener("change", () => { fi = +$(".pick").value; update(); });
  cIn.addEventListener("input", update);
  update();
})();
