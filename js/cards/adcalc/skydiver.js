/* 카드: 스카이다이버의 속도는 왜 끝없이 빨라지지 않을까? — v = vT tanh(gt/vT), 접선 기울기와 운동 방정식 비교 */
(() => {
  const root = document.getElementById("card-adcalc-skydiver");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sv = $(".sv"), st = $(".st"), g0 = 9.8;
  const { ctx, size } = fit($("canvas"), () => draw());
  const vel = (t, vT) => vT * Math.tanh(g0 * t / vT);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const vT = +sv.value, t = +st.value;
    const g = G.frame(ctx, w, h, { xr: [0, 25], yr: [0, 100], xs: 5, ys: 20, L: 30, xf: (v) => n(v, 0), yf: (v) => n(v, 0) });
    G.curve(ctx, g, (x) => g0 * x, C.ink3, { width: 1.6, dash: [5, 4] });
    G.curve(ctx, g, () => vT, C.warn, { width: 1.2, dash: [2, 4] });
    G.curve(ctx, g, (x) => vel(x, vT), BLUE, { width: 2.6 });
    const v = vel(t, vT), a = g0 * (1 - (v / vT) ** 2);
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = C.forest; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(g.X(t - 3), g.Y(v - 3 * a)); ctx.lineTo(g.X(t + 3), g.Y(v + 3 * a)); ctx.stroke(); ctx.restore();
    G.dot(ctx, g, t, v, C.forest);
    G.tag(ctx, g, "점선: 저항이 없을 때 v = gt", g.x0 + g.w - 4, g.y0 + 10, C.ink3, "right");
    G.tag(ctx, g, `종단 속도 ${vT} m/s`, g.x0 + g.w - 4, g.Y(vT) - 10, C.warn, "right");
    G.tag(ctx, g, "속도 (m/s) — 시간 (s)", g.x0 + 4, g.y0 + g.h - 10, C.ink3);
  }
  function nums() {
    const vT = +sv.value, t = +st.value, v = vel(t, vT);
    const dv = (vel(t + 1e-4, vT) - vel(Math.max(0, t - 1e-4), vT)) / (t >= 1e-4 ? 2e-4 : 1e-4);
    $(".v-out").textContent = vT; $(".t-out").textContent = n(t, 1);
    $(".n-v").textContent = n(v, 2); $(".n-a").textContent = n(dv, 3);
    $(".n-r").textContent = n(g0 * (1 - (v / vT) ** 2), 3);
    $(".n-p").textContent = `${n(v / vT * 100, 1)}%`;
    draw();
  }
  [sv, st].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
