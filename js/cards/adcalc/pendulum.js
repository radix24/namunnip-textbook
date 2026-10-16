/* 카드: 진자의 주기 공식 2π√(L/g)는 언제까지 믿을 수 있을까? — 실제(sin θ)와 근사(θ) 진자 비교 */
(() => {
  const root = document.getElementById("card-adcalc-pendulum");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), g0 = 9.8, L = 1, W = Math.sqrt(g0 / L), T0 = 2 * Math.PI / W, TMAX = 12;
  let trace = [], tnow = 0, raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const agm = (a, b) => { for (let i = 0; i < 40; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)]; return a; };
  const Texact = (a0) => T0 / agm(1, Math.cos(a0 / 2));

  /* 실제 운동: RK4로 θ'' = −(g/L) sin θ, 시간 간격 0.002 s */
  function simulate() {
    const a0 = +sa.value * Math.PI / 180, dt = 0.002;
    let th = a0, om = 0; trace = [];
    const f = (t, o) => [o, -W * W * Math.sin(t)];
    for (let i = 0; i * dt <= TMAX + 1e-9; i++) {
      if (i % 10 === 0) trace.push([i * dt, th, a0 * Math.cos(W * i * dt)]);
      const k1 = f(th, om), k2 = f(th + dt / 2 * k1[0], om + dt / 2 * k1[1]), k3 = f(th + dt / 2 * k2[0], om + dt / 2 * k2[1]), k4 = f(th + dt * k3[0], om + dt * k3[1]);
      th += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); om += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    }
  }
  function at(t) { const i = Math.min(trace.length - 1, Math.round(t / 0.02)); return trace[i]; }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const top = h * 0.5, px = w / 2, py = 12, Lp = top - 30;
    const [, th, thl] = at(tnow);
    seg(ctx, px - 40, py, px + 40, py, C.ink3, 3);
    [[thl, C.warn, "근사 (θ)"], [th, BLUE, "실제 (sin θ)"]].forEach(([a, col]) => {
      const bx = px + Lp * Math.sin(a), by = py + Lp * Math.cos(a);
      seg(ctx, px, py, bx, by, col, 1.6); dot(ctx, bx, by, col, 9);
    });
    label(ctx, "파랑: 실제 · 주황: 근사", 8, 14, C.ink2, "left", `600 11px ${F.sans}`);
    label(ctx, `t = ${n(tnow, 2)} s`, w - 8, 14, C.ink2, "right", `11px ${F.mono}`);
    // 아래: θ(t)
    const gx = 34, gy = top + 8, gw = w - 44, gh = h - gy - 22, a0 = +sa.value * Math.PI / 180;
    const X = (t) => gx + t / TMAX * gw, Y = (v) => gy + gh / 2 - v / (a0 * 1.1) * gh / 2;
    NM.axes(ctx, { x0: gx, y0: gy, w: gw, h: gh, X, Y, xt: [0, 2, 4, 6, 8, 10, 12].map((t) => [t, `${t}s`]), yt: [[0, "0"], [a0, `${sa.value}°`], [-a0, `−${sa.value}°`]] });
    [[2, C.warn], [1, BLUE]].forEach(([j, col]) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); trace.forEach((r, i) => (i ? ctx.lineTo(X(r[0]), Y(r[j])) : ctx.moveTo(X(r[0]), Y(r[j])))); ctx.stroke(); ctx.restore(); });
    seg(ctx, X(tnow), gy, X(tnow), gy + gh, C.ink3, 1, [3, 3]);
  }
  function nums() {
    const a0 = +sa.value * Math.PI / 180, T = Texact(a0);
    $(".a-out").textContent = sa.value;
    $(".n-0").textContent = `${n(T0, 3)} s`;
    $(".n-1").textContent = `${n(T, 3)} s (+${n((T / T0 - 1) * 100, 2)}%)`;
    $(".n-d").textContent = `${n(10 * (T - T0), 2)} s`;
    draw();
  }
  function play() {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = (t) => { tnow = Math.min(TMAX, (t - t0) / 1000); draw(); if (tnow < TMAX) raf = requestAnimationFrame(tick); };
    if (NM.reduce) { tnow = TMAX; draw(); return; }
    raf = requestAnimationFrame(tick);
  }
  sa.addEventListener("input", () => { cancelAnimationFrame(raf); tnow = 0; simulate(); nums(); });
  $(".go-play").addEventListener("click", play);
  simulate(); nums();
})();
