/* 카드: 같은 점인데 기저를 바꾸면 왜 좌표가 달라질까? — 기저 격자와 좌표 B⁻¹p */
(() => {
  const root = document.getElementById("card-adalg-basis-grid");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  let b1 = [2, 1], b2 = [-1, 1], p = [3, 1], pl = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const R = 5;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x: 0, y: 0, w, h };
    pl = L.plane(ctx, box, R);
    const B = L.T([b1, b2]), d = L.det(B);
    if (Math.abs(d) > 1e-9) L.grid(ctx, box, pl, B, { K: 10, square: true, axes: false });
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...b1), C.warn, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...b2), C.forest, 3);
    label(ctx, "b₁", pl.P(...b1)[0] + 8, pl.P(...b1)[1] - 8, C.warn, "left", `italic 700 13px ${F.serif}`);
    label(ctx, "b₂", pl.P(...b2)[0] + 8, pl.P(...b2)[1] - 8, C.forest, "left", `italic 700 13px ${F.serif}`);
    if (Math.abs(d) > 1e-9) {
      const c = L.mv(L.inv(B), p);
      // c₁b₁ 따라간 뒤 c₂b₂
      const m = L.scl(b1, c[0]);
      ctx.save(); ctx.setLineDash([5, 3]); ctx.lineWidth = 1.6;
      ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(...pl.P(0, 0)); ctx.lineTo(...pl.P(...m)); ctx.stroke();
      ctx.strokeStyle = C.forest; ctx.beginPath(); ctx.moveTo(...pl.P(...m)); ctx.lineTo(...pl.P(...p)); ctx.stroke(); ctx.restore();
    }
    dot(ctx, ...pl.P(...p), BLUE, 6.5);
    label(ctx, "P", pl.P(...p)[0] + 10, pl.P(...p)[1] - 10, BLUE, "left", `italic 700 14px ${F.serif}`);
    [b1, b2].forEach((v) => { ctx.beginPath(); ctx.arc(...pl.P(...v), 6, 0, 7); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke(); });
  }
  function update() {
    const B = L.T([b1, b2]), d = L.det(B), f = (v) => `(${v.map((x) => L.frac(x)).join(", ")})`;
    $(".n-s").textContent = f(p); $(".n-d").textContent = L.frac(d);
    $(".n-b").textContent = Math.abs(d) < 1e-9 ? "기저가 아님 (평행)" : f(L.mv(L.inv(B), p));
    draw();
  }
  const snap = (q) => q.map((x) => Math.round(x * 2) / 2);
  drag(cv, (x, y) => {
    if (!pl) return null;
    const near = (v) => Math.hypot(x - pl.P(...v)[0], y - pl.P(...v)[1]) < 16;
    return near(b1) ? "b1" : near(b2) ? "b2" : near(p) ? "p" : null;
  }, (who, x, y) => {
    const q = snap(pl.inv(x, y)).map((v) => Math.max(-R, Math.min(R, v)));
    if (who === "b1") b1 = q; else if (who === "b2") b2 = q; else p = q;
    update();
  }, null, "none");
  $(".go-std").addEventListener("click", () => { b1 = [1, 0]; b2 = [0, 1]; update(); });
  update();
})();
