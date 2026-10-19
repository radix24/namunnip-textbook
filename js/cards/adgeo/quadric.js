/* 이차곡면 공용과 카드: 여섯 가지 이차곡면의 그물 그림과 z = k 단면 (window.NMQuad도 내보냄) */
window.NMQuad = (() => {
  "use strict";
  const KINDS = [
    { name: "타원면", eq: "x²/a² + y²/b² + z²/c² = 1", F: (x, y, z, a, b, c) => (x * x) / (a * a) + (y * y) / (b * b) + (z * z) / (c * c) - 1, P: (u, v, a, b, c) => [a * Math.cos(u) * Math.cos(v), b * Math.sin(u) * Math.cos(v), c * Math.sin(v)], V: [-Math.PI / 2, Math.PI / 2] },
    { name: "일엽쌍곡면", eq: "x²/a² + y²/b² − z²/c² = 1", F: (x, y, z, a, b, c) => (x * x) / (a * a) + (y * y) / (b * b) - (z * z) / (c * c) - 1, P: (u, v, a, b, c) => [a * Math.cos(u) * Math.cosh(v), b * Math.sin(u) * Math.cosh(v), c * Math.sinh(v)], V: [-1.2, 1.2] },
    { name: "이엽쌍곡면", eq: "−x²/a² − y²/b² + z²/c² = 1", F: (x, y, z, a, b, c) => -(x * x) / (a * a) - (y * y) / (b * b) + (z * z) / (c * c) - 1, P: (u, v, a, b, c) => [a * Math.cos(u) * Math.sinh(Math.abs(v)), b * Math.sin(u) * Math.sinh(Math.abs(v)), Math.sign(v || 1) * c * Math.cosh(v)], V: [-1.3, 1.3], split: true },
    { name: "타원뿔면", eq: "x²/a² + y²/b² − z²/c² = 0", F: (x, y, z, a, b, c) => (x * x) / (a * a) + (y * y) / (b * b) - (z * z) / (c * c), P: (u, v, a, b, c) => [a * v * Math.cos(u), b * v * Math.sin(u), c * v], V: [-1.5, 1.5] },
    { name: "타원포물면", eq: "z = x²/a² + y²/b²", F: (x, y, z, a, b) => (x * x) / (a * a) + (y * y) / (b * b) - z, P: (u, v, a, b) => [a * v * Math.cos(u), b * v * Math.sin(u), v * v], V: [0, 1.6] },
    { name: "쌍곡포물면", eq: "z = x²/a² − y²/b²", F: (x, y, z, a, b) => (x * x) / (a * a) - (y * y) / (b * b) - z, grid: true },
  ];
  /* 2변수 음함수 g(p, q) = 0의 선분(마칭 스퀘어), 범위 [−R, R]² */
  function segs(g, R = 3, N = 50) {
    const out = [], h = (2 * R) / N, val = (i, j) => g(-R + i * h, -R + j * h);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = [val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)], P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let k = 0; k < 4; k++) { const a = v[k], b = v[(k + 1) % 4]; if ((a < 0) !== (b < 0)) { const t = a / (a - b), p = P[k], q = P[(k + 1) % 4]; pts.push([-R + (p[0] + t * (q[0] - p[0])) * h, -R + (p[1] + t * (q[1] - p[1])) * h]); } }
      if (pts.length >= 2) out.push([pts[0], pts[1]]); if (pts.length === 4) out.push([pts[2], pts[3]]);
    }
    return out;
  }
  /* 그물 그리기 */
  function mesh(v, k, a, b, c, col = "rgba(63,111,163,.45)") {
    const K = KINDS[k], N = 18;
    if (K.grid) { for (let i = 0; i <= N; i++) { const s = -2 + (4 * i) / N; v.path([...Array(N + 1)].map((_, j) => { const t = -2 + (4 * j) / N; return [s, t, (s * s) / (a * a) - (t * t) / (b * b)]; }), col, 1, null, false); v.path([...Array(N + 1)].map((_, j) => { const t = -2 + (4 * j) / N; return [t, s, (t * t) / (a * a) - (s * s) / (b * b)]; }), col, 1, null, false); } return; }
    const [v0, v1] = K.V;
    for (let i = 0; i < N; i++) { const u = (2 * Math.PI * i) / N; const pts = [...Array(N + 1)].map((_, j) => K.P(u, v0 + ((v1 - v0) * j) / N, a, b, c)); if (K.split) { v.path(pts.slice(0, N / 2), col, 1, null, false); v.path(pts.slice(N / 2 + 1), col, 1, null, false); } else v.path(pts, col, 1, null, false); }
    for (let j = 0; j <= 8; j++) { const t = v0 + ((v1 - v0) * j) / 8; if (K.split && Math.abs(t) < 1e-9) continue; v.path([...Array(41)].map((_, i) => K.P((2 * Math.PI * i) / 40, t, a, b, c)), col, 1, null, false); }
  }
  return { KINDS, segs, mesh };
})();

(() => {
  const root = document.getElementById("card-adgeo-quadric");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, Q = NMQuad;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), cIn = $(".c"), kIn = $(".k");
  let ki = 0;
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 7, yaw: -2.2, pitch: 0.4 });
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const a = +aIn.value, b = +bIn.value, c = +cIn.value, z = +kIn.value, K = Q.KINDS[ki];
    v.axes(2.8, 2.4);
    Q.mesh(v, ki, a, b, c);
    v.poly([[-3, -3, z], [3, -3, z], [3, 3, z], [-3, 3, z]], "#e0a02a", "#e0a02a", 0.1, 1);
    Q.segs((x, y) => K.F(x, y, z, a, b, c)).forEach(([p, q]) => v.line([p[0], p[1], z], [q[0], q[1], z], C.warn, 2.8));
  }
  function update() {
    const a = +aIn.value, b = +bIn.value, c = +cIn.value, z = +kIn.value, K = Q.KINDS[ki];
    ["a", "b", "c", "k"].forEach((n) => ($(`.${n}-out`).textContent = (+$(`.${n}`).value).toFixed(2)));
    $(".c").disabled = ki >= 4;
    const r = { 0: 1 - (z * z) / (c * c), 1: 1 + (z * z) / (c * c), 2: (z * z) / (c * c) - 1, 3: (z * z) / (c * c), 4: z }[ki];
    let sec;
    if (ki === 5) sec = Math.abs(z) < 1e-9 ? "두 직선 y = ±(b/a)x" : "쌍곡선";
    else sec = r > 1e-9 ? (Math.abs(a - b) < 1e-9 ? "원" : "타원") : Math.abs(r) <= 1e-9 ? "한 점" : "없음";
    $(".say").textContent = `${K.name}: ${K.eq} · 평면 z = ${z.toFixed(2)}로 자른 단면: ${sec}`;
    root.querySelectorAll("[data-q]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.q === ki)));
    draw();
  }
  root.querySelectorAll("[data-q]").forEach((x) => x.addEventListener("click", () => { ki = +x.dataset.q; update(); }));
  [aIn, bIn, cIn, kIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
