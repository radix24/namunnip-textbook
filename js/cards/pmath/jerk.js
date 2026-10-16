/* 카드: 엘리베이터가 덜컹거리지 않으려면 몇 번째 도함수까지 매끄러워야 할까? — 위치·속도·가속도·저크 */
(() => {
  const root = document.getElementById("card-pmath-jerk");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, piLab, label, arrow, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const stt = $(".stt"), play = $(".go-play");
  const T = 10, H = 30, A = H / 18.75, t1 = 2.5, t2 = 7.5;
  /* 운행 방식마다 [s, v, a, j](t)와 그래프 범위. step의 저크는 순간 무한대(spikes)로 따로 그린다 */
  const P = {
    smooth: {
      T, f: [
        (t) => { const u = t / T; return H * (10 * u ** 3 - 15 * u ** 4 + 6 * u ** 5); },
        (t) => { const u = t / T; return H / T * (30 * u ** 2 - 60 * u ** 3 + 30 * u ** 4); },
        (t) => { const u = t / T; return H / T ** 2 * (60 * u - 180 * u ** 2 + 120 * u ** 3); },
        (t) => { const u = t / T; return H / T ** 3 * (60 - 360 * u + 360 * u ** 2); },
      ],
      names: ["높이 s (m)", "속도 s′ (m/s)", "가속도 s″ (m/s²)", "저크 s‴ (m/s³)"], spikes: [],
    },
    step: {
      T, f: [
        (t) => (t < t1 ? A * t * t / 2 : t < t2 ? A * t1 * t1 / 2 + A * t1 * (t - t1) : H - A * (T - t) ** 2 / 2),
        (t) => (t < t1 ? A * t : t < t2 ? A * t1 : A * (T - t)),
        (t) => (t < t1 ? A : t < t2 ? 0 : -A),
        () => 0,
      ],
      names: ["높이 s (m)", "속도 s′ (m/s)", "가속도 s″ (m/s²)", "저크 s‴ (m/s³)"], spikes: [[0, 1], [t1, -1], [t2, -1], [T, 1]],
    },
    sin: {
      T: 2 * Math.PI, f: [Math.sin, Math.cos, (t) => -Math.sin(t), (t) => -Math.cos(t)],
      names: ["sin t", "(sin t)′ = cos t", "(sin t)″ = −sin t", "(sin t)‴ = −cos t"], spikes: [],
    },
  };
  let pk = "smooth", raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const tnow = () => P[pk].T * (+stt.value) / 1000;
  const COLS = [C.forest, BLUE, C.amber, C.warn];

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], t = tnow();
    // 왼쪽: 승강로와 엘리베이터 (sin 모드에서는 용수철 추처럼)
    const sw = Math.min(90, w * 0.2), shaftTop = 14, shaftBot = h - 14;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.strokeRect(16, shaftTop, sw - 24, shaftBot - shaftTop);
    const lo = pk === "sin" ? -1.2 : -1, hi = pk === "sin" ? 1.2 : H + 1;
    const y = shaftBot - (p.f[0](t) - lo) / (hi - lo) * (shaftBot - shaftTop - 40) - 40;
    const j = pk === "step" ? (p.spikes.some(([ts]) => Math.abs(ts - t) < 0.12) ? 3 : 0) : p.f[3](t) / (pk === "sin" ? 1 : 0.6);
    const shake = NM.clamp(j, -3, 3) * 3;
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5;
    ctx.fillRect(20, y, sw - 32, 40); ctx.strokeRect(20, y, sw - 32, 40);
    // 승객: 저크에 비례해 기울어짐
    const mx = 20 + (sw - 32) / 2;
    ctx.save(); ctx.translate(mx, y + 36); ctx.rotate(shake * 0.05);
    ctx.strokeStyle = Math.abs(shake) > 4 ? C.warn : C.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -18); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -23, 5, 0, 7); ctx.stroke();
    ctx.restore();
    if (Math.abs(shake) > 4) label(ctx, "덜컹!", mx, y - 10, C.warn, "center", `700 12px ${F.sans}`);
    // 오른쪽: 그래프 네 개
    const L = sw + 46, gh = (h - 8) / 4;
    for (let k = 0; k < 4; k++) {
      const f = p.f[k];
      let mn = 0, mxv = 0; for (let i = 0; i <= 200; i++) { const v = f(p.T * i / 200); mn = Math.min(mn, v); mxv = Math.max(mxv, v); }
      if (pk === "step" && k === 3) { mn = -1; mxv = 1; }
      const pad = (mxv - mn || 1) * 0.15;
      ctx.save(); ctx.translate(0, k * gh);
      const g = G.frame(ctx, w, gh, { xr: [0, p.T], yr: [mn - pad, mxv + pad], xs: pk === "sin" ? Math.PI / 2 : 2, ys: (mxv - mn) > 10 ? 10 : (mxv - mn) > 2 ? 1 : 0.5, L, T: 6, B: 14, xf: pk === "sin" ? piLab : (v) => n(v, 0), yf: (v) => n(v, 1) });
      G.curve(ctx, g, f, COLS[k], { width: 2, N: 500 });
      if (pk === "step" && k === 3) p.spikes.forEach(([ts, sgn]) => arrow(ctx, g.X(ts), g.Y(0), g.X(ts), g.Y(0) - sgn * g.h * 0.45, C.warn, 2.4, 7));
      ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(g.X(t), g.y0); ctx.lineTo(g.X(t), g.y0 + g.h); ctx.stroke(); ctx.setLineDash([]);
      G.tag(ctx, g, p.names[k], g.x0 + g.w - 4, g.y0 + 9, COLS[k], "right", 10.5);
      ctx.restore();
    }
  }

  function update() {
    const p = P[pk], t = tnow();
    $(".t-out").textContent = pk === "sin" ? `${n(t, 2)}` : n(t, 2);
    for (let k = 0; k < 4; k++) {
      let v = p.f[k](t);
      let s = n(v, 2);
      if (pk === "step" && k === 3) s = p.spikes.some(([ts]) => Math.abs(ts - t) < 0.12) ? "∞ (순간)" : "0";
      $(`.n${k}`).textContent = s;
    }
    const lab = pk === "sin" ? [" f", "f′", "f″", "f‴"] : null;
    [".d0", ".d1", ".d2", ".d3"].forEach((sel, k) => { const el = $(sel); if (lab) el.textContent = lab[k]; });
    draw();
  }
  function run() {
    cancelAnimationFrame(raf);
    if (play.getAttribute("aria-pressed") !== "true") return;
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1000; last = now;
      let v = +stt.value + dt * 1000 / 8;   // 한 번 운행에 8초
      if (v >= 1000) { v = 1000; play.setAttribute("aria-pressed", "false"); play.textContent = "운행하기"; }
      stt.value = v; update();
      if (play.getAttribute("aria-pressed") === "true") raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  play.addEventListener("click", () => {
    const on = play.getAttribute("aria-pressed") !== "true";
    play.setAttribute("aria-pressed", String(on)); play.textContent = on ? "멈춤" : "운행하기";
    if (on && +stt.value >= 1000) stt.value = 0;
    run();
  });
  G.chips(root, ".presets .chip[data-p]", (b) => {
    pk = b.dataset.p; stt.value = 0;
    if (pk !== "sin") ["높이 s", "속도 s′", "가속도 s″", "저크 s‴"].forEach((tx, k) => { $(`.d${k}`).textContent = tx; });
    update();
  });
  stt.addEventListener("input", update);
  update();
})();
