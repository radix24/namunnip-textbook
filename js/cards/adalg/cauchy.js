/* 카드: 내적은 두 크기의 곱보다 커질 수 있을까? — f(t) = |a + t b|² ≥ 0의 판별식 */
(() => {
  const root = document.getElementById("card-adalg-cauchy");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, seg, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t");
  let a = [3, 1], b = [1, 2], pl = null;
  const R = 4;
  const cvV = $(".cv-v"), cvF = $(".cv-f");
  const V = fit(cvV, () => drawV()), G = fit(cvF, () => drawF());
  const f = (t) => L.norm(L.add(a, L.scl(b, t))) ** 2;

  function drawV() {
    const { ctx, size: { w, h } } = V; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, R);
    const t = +tIn.value, c = L.add(a, L.scl(b, t));
    // 삼각부등식: a 다음 b
    seg(ctx, ...pl.P(...a), ...pl.P(...L.add(a, b)), C.ink3, 1.2, [4, 3]);
    seg(ctx, ...pl.P(0, 0), ...pl.P(...L.add(a, b)), C.ink3, 1.2, [4, 3]);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...a), C.warn, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...b), C.forest, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...c), PURPLE, 2.4);
    seg(ctx, ...pl.P(...a), ...pl.P(...c), PURPLE, 1, [2, 3]);
    label(ctx, "a", pl.P(...a)[0] + 8, pl.P(...a)[1] - 8, C.warn, "left", `italic 700 14px ${F.serif}`);
    label(ctx, "b", pl.P(...b)[0] + 8, pl.P(...b)[1] - 8, C.forest, "left", `italic 700 14px ${F.serif}`);
    [a, b].forEach((v) => dot(ctx, ...pl.P(...v), C.ink, 5, true));
  }
  function drawF() {
    const { ctx, size: { w, h } } = G; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L0 = 34, B0 = 24, T0 = 12, R0 = 10, tm = 3;
    const ymax = Math.max(f(-tm), f(tm), 4) * 1.05;
    const X = (t) => L0 + ((t + tm) / (2 * tm)) * (w - L0 - R0), Y = (y) => h - B0 - (y / ymax) * (h - B0 - T0);
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(L0, Y(0)); ctx.lineTo(w - R0, Y(0)); ctx.moveTo(X(0), T0); ctx.lineTo(X(0), h - B0); ctx.stroke();
    label(ctx, "t", w - R0 - 4, Y(0) + 12, C.ink2, "right", `italic 600 12px ${F.serif}`);
    label(ctx, "f(t)", X(0) + 6, T0 + 4, C.ink2, "left", `italic 600 12px ${F.serif}`);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const t = -tm + (2 * tm * i) / 120; i ? ctx.lineTo(X(t), Y(f(t))) : ctx.moveTo(X(t), Y(f(t))); }
    ctx.stroke();
    const bb = L.dot(b, b);
    if (bb > 1e-9) {
      const ts = -L.dot(a, b) / bb;
      if (Math.abs(ts) <= tm) { dot(ctx, X(ts), Y(f(ts)), C.amber, 5); seg(ctx, X(ts), Y(f(ts)), X(ts), Y(0), C.amber, 1, [3, 3]); }
    }
    const t = +tIn.value; dot(ctx, X(t), Y(f(t)), PURPLE, 5.5);
  }
  function update() {
    const ab = L.dot(a, b), na = L.norm(a), nb = L.norm(b), bb = L.dot(b, b);
    $(".t-out").textContent = L.n(+tIn.value, 2);
    $(".n-dot").textContent = L.n(Math.abs(ab), 3);
    $(".n-prod").textContent = L.n(na * nb, 3) + (Math.abs(Math.abs(ab) - na * nb) < 1e-9 ? "  (같음: 평행)" : "");
    $(".n-tri").textContent = `${L.n(L.norm(L.add(a, b)), 3)} ≤ ${L.n(na + nb, 3)}`;
    $(".n-min").textContent = bb < 1e-9 ? "b = 0" : `${L.n(L.dot(a, a) - ab * ab / bb, 3)} (t = ${L.n(-ab / bb, 2)})`;
    drawV(); drawF();
  }
  const snap = (q) => q.map((x) => Math.max(-R, Math.min(R, Math.round(x * 2) / 2)));
  drag(cvV, (x, y) => {
    if (!pl) return null;
    const near = (v) => Math.hypot(x - pl.P(...v)[0], y - pl.P(...v)[1]) < 16;
    return near(a) ? "a" : near(b) ? "b" : null;
  }, (who, x, y) => { const q = snap(pl.inv(x, y)); if (who === "a") a = q; else b = q; update(); }, null, "none");
  tIn.addEventListener("input", update);
  update();
})();
