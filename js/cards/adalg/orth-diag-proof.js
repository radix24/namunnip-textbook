/* 카드: 대칭행렬의 고유벡터는 왜 서로 수직일까? — [2, 1 ; c, 1]의 고유벡터 사이 각 + 증명 조립 */
(() => {
  const root = document.getElementById("card-adalg-orth-diag-proof");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, arc, deg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const cIn = $(".c");
  let stage = -1;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 2.2), c = +cIn.value, e = L.eig2([[2, 1], [c, 1]]);
    if (e.complex) { label(ctx, "실수 고유벡터 없음", w / 2, 18, C.warn, "center", `600 13px ${F.sans}`); return; }
    const [u, v] = e.vecs.map((p) => (p[0] < 0 || (Math.abs(p[0]) < 1e-9 && p[1] < 0) ? L.scl(p, -1) : p));
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...L.scl(u, 1.8)), C.warn, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...L.scl(v, 1.8)), C.forest, 3);
    const a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(v[1], v[0]);
    arc(ctx, ...pl.P(0, 0), 28, Math.min(a1, a2), Math.max(a1, a2), C.ink2, 1.4);
    const ang = deg(Math.acos(Math.abs(L.dot(u, v))));
    label(ctx, `${L.n(ang, 1)}°`, pl.P(0, 0)[0] + 34, pl.P(0, 0)[1] - 30, Math.abs(ang - 90) < 0.05 ? C.forest : C.ink, "left", `700 14px ${F.sans}`);
    label(ctx, `λ₁ = ${L.n(e.vals[0], 2)}`, pl.P(...L.scl(u, 1.8))[0] + 6, pl.P(...L.scl(u, 1.8))[1] - 10, C.warn, "left", `600 12px ${F.sans}`);
    label(ctx, `λ₂ = ${L.n(e.vals[1], 2)}`, pl.P(...L.scl(v, 1.8))[0] + 6, pl.P(...L.scl(v, 1.8))[1] + 12, C.forest, "left", `600 12px ${F.sans}`);
    if (stage >= 4) label(ctx, "대칭이면 수직", 10, 14, C.forest, "left", `700 12px ${F.sans}`);
  }
  function update() {
    const c = +cIn.value;
    $(".c-out").textContent = L.n(c, 1);
    $(".say").textContent = Math.abs(c - 1) < 1e-9 ? "c = 1: 대칭행렬입니다." : `c = ${L.n(c, 1)}: 대칭이 아닙니다 (Aᵀ ≠ A).`;
    draw();
  }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d", "e"], onStep(i) { stage = i; draw(); } });
  cIn.addEventListener("input", update);
  update();
})();
