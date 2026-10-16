/* 카드: 카디오이드에서 접선이 수평인 곳은 어디일까? — 극곡선의 접선, 각 ψ, 수평·수직 접선 */
(() => {
  const root = document.getElementById("card-adcalc-polar-tangent");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, rad, dg, label, seg, dot, arc, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), bH = $(".go-h"), bV = $(".go-v"), PI = Math.PI;
  const P = {
    card: { f: (t) => 1 + Math.cos(t), d: (t) => -Math.sin(t), rmax: 2.2 },
    circ: { f: (t) => 2 * Math.cos(t), d: (t) => -2 * Math.sin(t), rmax: 2.2 },
    rose: { f: (t) => Math.cos(2 * t), d: (t) => -2 * Math.sin(2 * t), rmax: 1.15 },
    lima: { f: (t) => 1 + 2 * Math.cos(t), d: (t) => -2 * Math.sin(t), rmax: 3.2 },
  };
  let pk = "card";
  const { ctx, size } = fit($("canvas"), () => draw());
  const dxy = (t) => { const p = P[pk], f = p.f(t), d = p.d(t); return { dx: d * Math.cos(t) - f * Math.sin(t), dy: d * Math.sin(t) + f * Math.cos(t) }; };
  /* 부호가 바뀌는 곳 찾기 (분자 또는 분모) */
  function roots(which) {
    const out = [], N = 1440;
    let prev = dxy(0)[which];
    for (let i = 1; i <= N; i++) {
      const t = 2 * PI * i / N, v = dxy(t)[which];
      if (prev === 0 || prev * v < 0) {
        let a = 2 * PI * (i - 1) / N, b = t;
        for (let k = 0; k < 40; k++) { const m = (a + b) / 2; (dxy(a)[which] * dxy(m)[which] <= 0 ? (b = m) : (a = m)); }
        const m = (a + b) / 2, other = dxy(m)[which === "dy" ? "dx" : "dy"];
        if (Math.abs(other) > 1e-6) out.push(m);
      }
      prev = v;
    }
    return out;
  }

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], t = rad(+st.value);
    const pf = A.pframe(ctx, w, h, { rmax: p.rmax, rings: 2, rays: 12 });
    A.pcurve(ctx, pf, p.f, 0, 2 * PI, BLUE, { width: 2.4 });
    const mark = (ts, col) => ts.forEach((u) => { const [x, y] = pf.P(p.f(u), u); dot(ctx, x, y, col, 5, true); });
    if (bH.getAttribute("aria-pressed") === "true") mark(roots("dy"), C.forest);
    if (bV.getAttribute("aria-pressed") === "true") mark(roots("dx"), C.warn);
    const r = p.f(t), [px, py] = pf.P(r, t), { dx, dy } = dxy(t);
    seg(ctx, pf.cx, pf.cy, px, py, C.ink2, 1.4);
    const L = Math.hypot(dx, dy);
    if (L > 1e-9) {
      const ux = dx / L, uy = dy / L, k = pf.R * 0.7;
      seg(ctx, px - ux * k, py + uy * k, px + ux * k, py - uy * k, C.warn, 2);
      // ψ: 반지름 방향(바깥)과 접선 방향 사이
      if (Math.abs(r) > 0.05) {
        const ra = Math.atan2(r >= 0 ? Math.sin(t) : -Math.sin(t), r >= 0 ? Math.cos(t) : -Math.cos(t));
        const ta = Math.atan2(uy, ux);
        let d = ta - ra; while (d < 0) d += 2 * PI; while (d > PI) d -= PI;
        arc(ctx, px, py, 18, ra, ra + d, C.ink, 1.4);
      }
    }
    dot(ctx, px, py, C.ink);
    label(ctx, "초록 ○ 수평 접선 · 주황 ○ 수직 접선", 6, h - 8, C.ink3, "left", `11px ${F.sans}`);
  }
  function nums() {
    const p = P[pk], t = rad(+st.value), { dx, dy } = dxy(t), r = p.f(t), d = p.d(t);
    $(".t-out").textContent = `${st.value}°`;
    $(".n-m").textContent = Math.abs(dx) < 1e-9 ? (Math.abs(dy) < 1e-9 ? "0/0" : "수직") : n(dy / dx, 3);
    $(".n-d").textContent = n(d, 3);
    let psi = Math.atan2(r, d); if (psi < 0) psi += PI;
    $(".n-p").textContent = Math.abs(r) < 1e-9 ? "—" : dg(psi, 1);
    draw();
  }
  G.chips(root, ".presets .chip[data-p]", (b) => { pk = b.dataset.p; nums(); });
  [bH, bV].forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); draw(); }));
  st.addEventListener("input", nums);
  nums();
})();
