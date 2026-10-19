/* 카드: 마주 보는 두 카디오이드는 몇 도로 만날까? — 교점에서 ψ1, ψ2와 사잇각 */
(() => {
  const root = document.getElementById("card-adcalc-polar-angle");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, dg, label, seg, dot, arc, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sb = $(".sb"), PI = Math.PI;
  let pk = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function cur() {
    const a = +sa.value, b = +sb.value;
    if (pk === 0) {
      const c = (b - a) / (a + b), t = Math.acos(c);   // a(1 + c) = b(1 − c)
      return { f: (u) => a * (1 + Math.cos(u)), df: (u) => -a * Math.sin(u), g: (u) => b * (1 - Math.cos(u)), dg: (u) => b * Math.sin(u), t, rmax: 2 * Math.max(a, b) * 1.08 };
    }
    return { f: (u) => 1 + Math.cos(u), df: (u) => -Math.sin(u), g: (u) => 3 * Math.cos(u), dg: (u) => -3 * Math.sin(u), t: PI / 3, rmax: 3.2, gT: PI };
  }
  const psi = (r, d) => { let p = Math.atan2(r, d); if (p < 0) p += PI; return p; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const c = cur();
    const pf = A.pframe(ctx, w, h, { rmax: c.rmax, rings: 2, rays: 12, ringLabels: false });
    A.pcurve(ctx, pf, c.f, 0, 2 * PI, BLUE, { width: 2.4 });
    A.pcurve(ctx, pf, c.g, 0, c.gT || 2 * PI, C.forest, { width: 2.4 });
    const t = c.t, r = c.f(t), [px, py] = pf.P(r, t);
    seg(ctx, pf.cx, pf.cy, px, py, C.ink2, 1.4);
    const tan = (fr, d, col) => {
      const dx = d * Math.cos(t) - fr * Math.sin(t), dy = d * Math.sin(t) + fr * Math.cos(t), L = Math.hypot(dx, dy), k = pf.R * 0.5;
      seg(ctx, px - dx / L * k, py + dy / L * k, px + dx / L * k, py - dy / L * k, col, 1.8, [6, 3]);
    };
    tan(c.f(t), c.df(t), BLUE); tan(c.g(t), c.dg(t), C.forest);
    const p1 = psi(c.f(t), c.df(t)), p2 = psi(c.g(t), c.dg(t));
    arc(ctx, px, py, 16, t, t + p1, BLUE, 1.6); arc(ctx, px, py, 24, t, t + p2, C.forest, 1.6);
    dot(ctx, px, py, C.ink);
    label(ctx, "ψ₁", px + 22 * Math.cos(t + p1 / 2), py - 22 * Math.sin(t + p1 / 2), BLUE, "center", `600 12px ${F.serif}`);
  }
  function nums() {
    const c = cur(), t = c.t;
    $(".a-out").textContent = n(+sa.value, 2); $(".b-out").textContent = n(+sb.value, 2);
    const p1 = psi(c.f(t), c.df(t)), p2 = psi(c.g(t), c.dg(t));
    let g = Math.abs(p1 - p2); if (g > PI / 2) g = PI - g;
    $(".n-1").textContent = dg(p1, 1); $(".n-2").textContent = dg(p2, 1); $(".n-g").textContent = dg(g, 1);
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = +b.dataset.p; root.querySelector(".ab").style.visibility = pk ? "hidden" : ""; nums(); });
  [sa, sb].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
