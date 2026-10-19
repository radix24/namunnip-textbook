/* 카드: r = f(θ)의 그래프를 극좌표로 옮기면 어떤 모양이 될까? — θ–r 그래프와 극곡선을 함께 그리기, 대칭 판정 */
(() => {
  const root = document.getElementById("card-adcalc-polar-trace");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, piLab, label, dot, seg, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), PI = Math.PI;
  const P = {
    card: { f: (t) => 1 + Math.cos(t), T: 2 * PI, rmax: 2.2 },
    lima: { f: (t) => 1 + 2 * Math.cos(t), T: 2 * PI, rmax: 3.2 },
    rose2: { f: (t) => Math.cos(2 * t), T: 2 * PI, rmax: 1.1 },
    rose3: { f: (t) => Math.sin(3 * t), T: 2 * PI, rmax: 1.1 },
    spiral: { f: (t) => t / 2, T: 4 * PI, rmax: 6.5 },
    sin2: { f: (t) => Math.sin(2 * t), T: 2 * PI, rmax: 1.1 },
  };
  let pk = "card", raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], th = +st.value * p.T, lw = w * 0.5;
    // 왼쪽: θ–r
    const g = G.frame(ctx, lw, h, { xr: [0, p.T], yr: [-p.rmax, p.rmax], xs: p.T > 7 ? PI : PI / 2, ys: p.rmax > 3 ? 2 : p.rmax > 1.5 ? 1 : 0.5, xf: piLab, yf: (v) => n(v, 1), L: 30 });
    G.curve(ctx, g, p.f, C.rule, { width: 1.6 });
    G.curve(ctx, g, (t) => (p.f(t) >= 0 ? p.f(t) : NaN), BLUE, { width: 2.4, to: th, N: 600 });
    G.curve(ctx, g, (t) => (p.f(t) < 0 ? p.f(t) : NaN), C.warn, { width: 2.4, to: th, N: 600 });
    G.dot(ctx, g, th, p.f(th), p.f(th) < 0 ? C.warn : BLUE);
    G.tag(ctx, g, "가로 θ, 세로 r", g.x0 + 4, g.y0 + 10, C.ink3);
    // 오른쪽: 극곡선
    ctx.save(); ctx.translate(lw, 0);
    const pf = A.pframe(ctx, w - lw, h, { rmax: p.rmax, rings: 2, rays: 8 });
    A.pcurve(ctx, pf, p.f, 0, p.T, C.rule, { width: 1.4 });
    const N = 600;
    for (let i = 0; i < N; i++) {
      const a = th * i / N, b = th * (i + 1) / N, r = p.f((a + b) / 2);
      const [x1, y1] = pf.P(p.f(a), a), [x2, y2] = pf.P(p.f(b), b);
      seg(ctx, x1, y1, x2, y2, r < 0 ? C.warn : BLUE, 2.4);
    }
    const r = p.f(th), [px, py] = pf.P(r, th), [ux, uy] = pf.P(p.rmax, th);
    seg(ctx, pf.cx, pf.cy, ux, uy, C.ink3, 1, [3, 3]);
    seg(ctx, pf.cx, pf.cy, px, py, r < 0 ? C.warn : BLUE, 1.4);
    dot(ctx, px, py, r < 0 ? C.warn : BLUE);
    label(ctx, "θ 방향", ux, uy + (uy < pf.cy ? -8 : 10), C.ink3, "center", `10px ${F.sans}`);
    ctx.restore();
  }
  /* 대칭: 식 판정과 그림 판정 */
  function sym() {
    const p = P[pk], f = p.f, eq = (a, b) => Math.abs(a - b) < 1e-9;
    const ts = Array.from({ length: 97 }, (_, i) => 0.03 + i * 0.061);
    const fx = ts.every((t) => eq(f(-t), f(t))), fy = ts.every((t) => eq(f(PI - t), f(t))), fo = ts.every((t) => eq(f(t + PI), f(t)));
    const pts = []; for (let i = 0; i <= 720; i++) { const t = p.T * i / 720, r = f(t); pts.push([r * Math.cos(t), r * Math.sin(t)]); }
    const near = (x, y) => pts.some(([a, b]) => Math.hypot(a - x, b - y) < p.rmax * 0.02);
    const gx = pts.every(([x, y]) => near(x, -y)), gy = pts.every(([x, y]) => near(-x, y)), go = pts.every(([x, y]) => near(-x, -y));
    const s = (a, b) => `식 ${a ? "○" : "×"} · 그림 ${b ? "○" : "×"}`;
    $(".n-x").textContent = s(fx, gx); $(".n-y").textContent = s(fy, gy); $(".n-o").textContent = s(fo, go);
  }
  function nums() { const t = +st.value * P[pk].T; $(".t-out").textContent = `${n(t / PI, 2)}π`; draw(); }
  function play() {
    cancelAnimationFrame(raf);
    if (NM.reduce) { st.value = 1; nums(); return; }
    const t0 = performance.now(), D = 3500;
    const tick = (t) => { const k = Math.min(1, (t - t0) / D); st.value = k; nums(); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  }
  G.chips(root, ".presets .chip[data-p]", (b) => { pk = b.dataset.p; sym(); play(); });
  st.addEventListener("input", () => { cancelAnimationFrame(raf); nums(); });
  $(".go-play").addEventListener("click", play);
  sym(); nums();
})();
