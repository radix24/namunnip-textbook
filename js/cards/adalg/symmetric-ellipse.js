/* 카드: 대칭행렬은 원을 어떤 모양으로 바꿀까? — 단위원의 상(타원)과 직교 고유벡터, A = QDQᵀ */
(() => {
  const root = document.getElementById("card-adalg-symmetric-ellipse");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, seg, BLUE, deg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sl = [...root.querySelectorAll("[data-m]")], out = [...root.querySelectorAll("[data-o]")];
  let th = 0.9, pl = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const A = () => { const [a, b, d] = sl.map((el) => +el.value); return [[a, b], [b, d]]; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, 3.6);
    const M = A(), e = L.eig2(M);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.arc(...pl.P(0, 0), pl.s, 0, 7); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let k = 0; k <= 160; k++) { const t = (2 * Math.PI * k) / 160, p = L.mv(M, [Math.cos(t), Math.sin(t)]); k ? ctx.lineTo(...pl.P(...p)) : ctx.moveTo(...pl.P(...p)); }
    ctx.stroke();
    e.vecs.forEach((u, i) => {
      seg(ctx, ...pl.P(...L.scl(u, -5)), ...pl.P(...L.scl(u, 5)), i ? C.forest : C.warn, 1.2, [6, 4]);
      NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...L.scl(u, e.vals[i])), i ? C.forest : C.warn, 2.6);
    });
    const x = [Math.cos(th), Math.sin(th)], Ax = L.mv(M, x);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...Ax), C.amber, 2.4);
    seg(ctx, ...pl.P(0, 0), ...pl.P(...x), C.ink, 1.6);
    dot(ctx, ...pl.P(...x), C.ink, 6, true);
    label(ctx, "x", pl.P(...x)[0] + 9, pl.P(...x)[1] - 9, C.ink, "left", `italic 700 13px ${F.serif}`);
    label(ctx, "Ax", pl.P(...Ax)[0] + 9, pl.P(...Ax)[1] + 11, C.amber, "left", `italic 700 13px ${F.serif}`);
  }
  function update() {
    sl.forEach((el, i) => (out[i].textContent = L.n(+el.value, 2)));
    const M = A(), e = L.eig2(M), Q = L.T(e.vecs), D = [[e.vals[0], 0], [0, e.vals[1]]], f = (x) => L.n(x, 3);
    $(".qd").innerHTML = `Q ${L.table(Q, { f })} D ${L.table(D, { f })} Qᵀ ${L.table(L.T(Q), { f })} · QᵀQ ${L.table(L.mul(L.T(Q), Q), { f })}`;
    const ang = deg(Math.acos(Math.min(1, Math.abs(L.dot(e.vecs[0], e.vecs[1])))));
    $(".say").textContent = `λ₁ = ${f(e.vals[0])}, λ₂ = ${f(e.vals[1])} · 두 고유벡터 사이의 각 ${L.n(ang, 1)}° · 타원의 반지름 ${f(Math.abs(e.vals[0]))}, ${f(Math.abs(e.vals[1]))}`;
    draw();
  }
  drag(cv, (x, y) => (pl && Math.hypot(x - pl.P(Math.cos(th), Math.sin(th))[0], y - pl.P(Math.cos(th), Math.sin(th))[1]) < 18 ? "x" : null),
    (who, x, y) => { const q = pl.inv(x, y); th = Math.atan2(q[1], q[0]); draw(); }, null, "none");
  sl.forEach((el) => el.addEventListener("input", update));
  update();
})();
