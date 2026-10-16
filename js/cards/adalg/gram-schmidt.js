/* 카드: 비스듬한 두 벡터로 직각 자를 만들 수 있을까? — 그람-슈미트 과정을 단계별로 */
(() => {
  const root = document.getElementById("card-adalg-gram-schmidt");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, seg, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  let v1 = [3, 1], v2 = [1, 2.5], st = 0, pl = null;
  const R = 4, cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const btns = [...root.querySelectorAll("[data-s]")];

  function gs() {
    const n1 = L.norm(v1); if (n1 < 1e-9) return null;
    const u1 = L.scl(v1, 1 / n1), pr = L.scl(u1, L.dot(v2, u1)), w2 = L.sub(v2, pr), n2 = L.norm(w2);
    return { u1, pr, w2, u2: n2 < 1e-9 ? null : L.scl(w2, 1 / n2) };
  }
  const tag = (v, t, col) => label(ctx, t, pl.P(...v)[0] + 9, pl.P(...v)[1] - 9, col, "left", `italic 700 13px ${F.serif}`);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, R);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.arc(...pl.P(0, 0), pl.s, 0, 7); ctx.stroke(); ctx.restore();
    const g = gs(), O = pl.P(0, 0);
    NMPm.arrow(ctx, ...O, ...pl.P(...v1), st >= 1 ? "rgba(181,83,47,.35)" : C.warn, 2.6); tag(v1, "v₁", C.warn);
    NMPm.arrow(ctx, ...O, ...pl.P(...v2), st >= 3 ? "rgba(59,124,42,.35)" : C.forest, 2.6); tag(v2, "v₂", C.forest);
    if (g && st >= 1) { NMPm.arrow(ctx, ...O, ...pl.P(...g.u1), BLUE, 3.4); tag(g.u1, "u₁", BLUE); }
    if (g && st >= 2) {
      // 직선 u₁과 그림자
      seg(ctx, ...pl.P(...L.scl(g.u1, -8)), ...pl.P(...L.scl(g.u1, 8)), "rgba(63,111,163,.3)", 1);
      NMPm.arrow(ctx, ...O, ...pl.P(...g.pr), C.amber, 2.4);
      seg(ctx, ...pl.P(...g.pr), ...pl.P(...v2), C.ink3, 1.2, [4, 3]);
      NMPm.arrow(ctx, ...O, ...pl.P(...g.w2), PURPLE, 2.6); tag(g.w2, "w₂", PURPLE);
    }
    if (g && g.u2 && st >= 3) { NMPm.arrow(ctx, ...O, ...pl.P(...g.u2), BLUE, 3.4); tag(g.u2, "u₂", BLUE); }
    [v1, v2].forEach((v) => dot(ctx, ...pl.P(...v), C.ink, 5, true));
  }
  function update() {
    const g = gs(), f = (v) => `(${v.map((x) => L.n(x, 3)).join(", ")})`;
    btns.forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.s === st)));
    let s = `v₁ = ${f(v1)}, v₂ = ${f(v2)}`;
    if (!g) s = "v₁ = 0이라 시작할 수 없습니다.";
    else if (st === 1) s = `u₁ = v₁/|v₁| = ${f(g.u1)}  (|v₁| = ${L.n(L.norm(v1), 3)})`;
    else if (st === 2) s = `v₂·u₁ = ${L.n(L.dot(v2, g.u1), 3)} → 그림자 ${f(g.pr)} → w₂ = ${f(g.w2)}`;
    else if (st === 3) s = g.u2 ? `u₂ = ${f(g.u2)} · u₁·u₂ = ${L.n(L.dot(g.u1, g.u2), 6)} · |u₂| = ${L.n(L.norm(g.u2), 3)}` : "w₂ = 0: v₁과 v₂가 평행해 u₂를 만들 수 없습니다.";
    $(".say").textContent = s;
    draw();
  }
  btns.forEach((b) => b.addEventListener("click", () => { st = +b.dataset.s; update(); }));
  const snap = (q) => q.map((x) => Math.max(-R, Math.min(R, Math.round(x * 2) / 2)));
  drag(cv, (x, y) => {
    if (!pl) return null;
    const near = (v) => Math.hypot(x - pl.P(...v)[0], y - pl.P(...v)[1]) < 16;
    return near(v1) ? "v1" : near(v2) ? "v2" : null;
  }, (who, x, y) => { const q = snap(pl.inv(x, y)); if (who === "v1") v1 = q; else v2 = q; update(); }, null, "none");
  update();
})();
