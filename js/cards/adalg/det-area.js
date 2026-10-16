/* 카드: 행렬식은 무엇을 재는 수일까? — 두 열벡터의 평행사변형과 부호 있는 넓이 */
(() => {
  const root = document.getElementById("card-adalg-det-area");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot } = NMPm;
  const $ = (s) => root.querySelector(s);
  let a = [2, 0.5], b = [1, 1.5], pl = null;
  const R = 3.5, cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const D = () => a[0] * b[1] - b[0] * a[1];

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, R, { ox: -1, oy: -1 });
    const d = D(), pts = [[0, 0], a, L.add(a, b), b];
    ctx.fillStyle = Math.abs(d) < 1e-9 ? "rgba(141,141,146,.3)" : d > 0 ? "rgba(116,171,102,.38)" : "rgba(212,73,58,.3)";
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.2;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...pl.P(...p)) : ctx.moveTo(...pl.P(...p)))); ctx.closePath(); ctx.fill(); ctx.stroke();
    // 단위 정사각형(넓이 1) 비교
    ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.strokeRect(...pl.P(0, 1), pl.s, pl.s); ctx.setLineDash([]);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...a), C.warn, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...b), C.forest, 3);
    label(ctx, "a", pl.P(...a)[0] + 9, pl.P(...a)[1] - 9, C.warn, "left", `italic 700 14px ${F.serif}`);
    label(ctx, "b", pl.P(...b)[0] + 9, pl.P(...b)[1] - 9, C.forest, "left", `italic 700 14px ${F.serif}`);
    const m = pl.P(...L.scl(L.add(a, b), 0.5));
    label(ctx, `det = ${L.frac(d)}`, m[0], m[1], C.ink, "center", `600 13px ${F.sans}`);
    [a, b].forEach((v) => dot(ctx, ...pl.P(...v), C.ink, 5, true));
  }
  function update() {
    const d = D();
    $(".n-m").textContent = `[${L.frac(a[0])}, ${L.frac(b[0])} ; ${L.frac(a[1])}, ${L.frac(b[1])}]`;
    $(".n-d").textContent = L.frac(d);
    $(".n-a").textContent = L.frac(Math.abs(d)) + (Math.abs(d) < 1e-9 ? " (납작)" : d < 0 ? " (뒤집힘)" : "");
    draw();
  }
  root.querySelectorAll("[data-op]").forEach((btn) => btn.addEventListener("click", () => {
    const before = D(), op = btn.dataset.op;
    if (op === "scale") a = L.scl(a, 2);
    else if (op === "swap") [a, b] = [b, a];
    else if (op === "shear") b = L.add(b, a);
    else { a = [2, 0.5]; b = [1, 1.5]; }
    const after = D();
    $(".log").textContent = op === "reset" ? "—" : `det: ${L.frac(before)} → ${L.frac(after)}` + (Math.abs(before) > 1e-9 ? ` (${L.frac(after / before)}배)` : "") + (Math.max(...a.map(Math.abs), ...b.map(Math.abs)) > R ? " · 화면 밖으로 나갔습니다. 처음으로 돌아가세요." : "");
    update();
  }));
  const snap = (q) => q.map((x) => Math.max(-R, Math.min(R, Math.round(x * 2) / 2)));
  drag(cv, (x, y) => {
    if (!pl) return null;
    const near = (v) => Math.hypot(x - pl.P(...v)[0], y - pl.P(...v)[1]) < 16;
    return near(a) ? "a" : near(b) ? "b" : null;
  }, (who, x, y) => { const q = snap(pl.inv(x, y)); if (who === "a") a = q; else b = q; update(); }, null, "none");
  update();
})();
