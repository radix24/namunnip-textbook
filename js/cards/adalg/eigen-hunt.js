/* 카드: 행렬을 곱해도 방향이 그대로인 벡터가 있을까? — 단위원 위 v와 Av, 같은 직선에 놓이는 방향 찾기 */
(() => {
  const root = document.getElementById("card-adalg-eigen-hunt");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, seg, BLUE, deg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const AS = [[[2, 1], [1, 2]], [[3, 1], [0, 2]], [[1, 1], [0, 1]], [[0, -1], [1, 0]]];
  let A = AS[0], th = 0.3, pl = null, found = [], trail = [], sweeping = 0;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const v = () => [Math.cos(th), Math.sin(th)];
  /* 같은 직선 위인지: 외적이 0에 가까움 */
  const crossZ = (p, q) => p[0] * q[1] - p[1] * q[0];
  /* 두 벡터가 이루는 직선 사이의 각(라디안, 0 ~ π/2) */
  const off = (p, q) => { const a = Math.abs(Math.atan2(crossZ(p, q), L.dot(p, q))); return Math.min(a, Math.PI - a); };
  const TOL = 0.03;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, 3.3);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.arc(...pl.P(0, 0), pl.s, 0, 7); ctx.stroke(); ctx.restore();
    if (trail.length > 1) { ctx.strokeStyle = "rgba(63,111,163,.35)"; ctx.lineWidth = 1.4; ctx.beginPath(); trail.forEach((p, i) => (i ? ctx.lineTo(...pl.P(...p)) : ctx.moveTo(...pl.P(...p)))); ctx.stroke(); }
    found.forEach(({ t }) => { const u = [Math.cos(t), Math.sin(t)]; seg(ctx, ...pl.P(...L.scl(u, -5)), ...pl.P(...L.scl(u, 5)), C.forest, 2, [7, 4]); });
    const V = v(), AV = L.mv(A, V), par = off(V, AV) < TOL;
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...AV), BLUE, par ? 4 : 2.8);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...V), C.warn, 3);
    label(ctx, "v", pl.P(...V)[0] + 8, pl.P(...V)[1] - 10, C.warn, "left", `italic 700 14px ${F.serif}`);
    label(ctx, "Av", pl.P(...AV)[0] + 8, pl.P(...AV)[1] + 12, BLUE, "left", `italic 700 14px ${F.serif}`);
    dot(ctx, ...pl.P(...V), C.ink, 6, true);
  }
  function update() {
    const V = v(), AV = L.mv(A, V), f = (p) => `(${p.map((x) => L.n(x, 2)).join(", ")})`;
    const ang = Math.atan2(crossZ(V, AV), L.dot(V, AV));
    $(".n-v").textContent = f(V); $(".n-av").textContent = f(AV); $(".n-ang").textContent = `${L.n(deg(ang), 1)}°`;
    const err = off(V, AV);
    if (err < TOL) {
      const t = ((th % Math.PI) + Math.PI) % Math.PI, near = (s) => Math.min(Math.abs(s - t), Math.PI - Math.abs(s - t)) < 0.3;
      const k = found.findIndex((f) => near(f.t));
      if (k < 0) found.push({ t, err }); else if (err < found[k].err) found[k] = { t, err };
    }
    $(".found").textContent = found.length ? `찾은 방향 ${found.length}개: ` + found.map(({ t }) => { const lam = L.dot(L.mv(A, [Math.cos(t), Math.sin(t)]), [Math.cos(t), Math.sin(t)]); return `${L.n(deg(t), 0)}° (λ ≈ ${L.n(lam, 2)})`; }).join(", ") : "찾은 방향: 없음";
    draw();
  }
  drag(cv, (x, y) => (pl && Math.hypot(x - pl.P(...v())[0], y - pl.P(...v())[1]) < 18 ? "v" : null), (who, x, y) => { const q = pl.inv(x, y); th = Math.atan2(q[1], q[0]); update(); }, null, "none");
  $(".go-sweep").addEventListener("click", () => {
    cancelAnimationFrame(sweeping); trail = []; const t0 = performance.now(), th0 = th;
    const tick = (now) => { const s = Math.min(1, (now - t0) / 6000); th = th0 + s * 2 * Math.PI; trail.push(L.mv(A, v())); update(); if (s < 1) sweeping = requestAnimationFrame(tick); };
    sweeping = requestAnimationFrame(tick);
  });
  $(".go-show").addEventListener("click", () => {
    const e = L.eig2(A);
    $(".calc").textContent = `λ² − ${L.frac(e.tr)}λ + ${L.frac(e.det)} = 0 → ` + (e.complex ? "실근이 없어 실수 고유벡터가 없습니다." :
      Math.abs(e.vals[0] - e.vals[1]) < 1e-9 ? `중근 λ = ${L.frac(e.vals[0])}, 고유 방향 ${L.n(deg(Math.atan2(e.vecs[0][1], e.vecs[0][0])), 0)}° 하나` :
      `λ = ${e.vals.map((x) => L.frac(x)).join(", ")}, 방향 ${e.vecs.map((u) => L.n(((deg(Math.atan2(u[1], u[0])) % 180) + 180) % 180, 0) + "°").join(", ")}`);
  });
  $(".pick").addEventListener("change", () => { A = AS[+$(".pick").value]; found = []; trail = []; $(".calc").textContent = ""; update(); });
  update();
})();
