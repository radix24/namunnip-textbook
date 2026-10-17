/* 카드: 8자 비행하는 드론은 얼마나 빨리 돌 수 있을까? — 모의 경로의 속력·가속도, ω² 비례 */
(() => {
  const root = document.getElementById("card-adgeo-drone");
  if (!root) return;
  const { C, fit } = NM;
  const S = NMSpace3, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const wIn = $(".w"), tIn = $(".t"), AMAX = 4;
  const path = (w) => (t) => [20 * Math.sin(w * t), 10 * Math.sin(2 * w * t), 15 + 3 * Math.sin(w * t)];
  const period = () => (2 * Math.PI) / +wIn.value;
  const v3 = S.view($(".v3"), () => draw3(), { center: [0, 0, 12], span: 58, yaw: -2.3, pitch: 0.45 });
  const gr = fit($(".gr"), () => drawG());
  function draw3() {
    const { ctx, size } = v3; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const f = path(+wIn.value), T = period(), t = T * +tIn.value, pts = [...Array(301)].map((_, k) => f((T * k) / 300));
    v3.path([[-25, -15, 0], [25, -15, 0], [25, 15, 0], [-25, 15, 0]], C.rule, 1, null, true);
    v3.path(pts.map(([x, y]) => [x, y, 0]), "rgba(141,141,146,.4)", 1, null, false);
    v3.path(pts, "#7b5ea7", 2.4, null, false);
    const p = f(t), vel = K.d1(f, t), acc = K.d2(f, t);
    v3.line(p, S.add(p, S.mul(vel, 1.2)), "#3f6fa3", 3); v3.line(p, S.add(p, S.mul(acc, 3)), C.warn, 3);
    v3.line(p, [p[0], p[1], 0], C.ink3, 1, [3, 3]); v3.dot(p, "#e0a02a", 7);
  }
  function drawG() {
    const { ctx, size: { w, h } } = gr; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const f = path(+wIn.value), T = period(), sp = [], ac = [];
    for (let k = 0; k <= 200; k++) { const t = (T * k) / 200; sp.push([t, K.len(K.d1(f, t))]); ac.push([t, K.len(K.d2(f, t))]); }
    K.graph(ctx, { x: 0, y: 0, w, h }, [{ data: sp, col: "#3f6fa3", name: "속력(m/s)" }, { data: ac, col: C.warn, name: "가속도(m/s²)" }], { v0: 0, v1: Math.max(AMAX * 1.6, ...sp.map((d) => d[1]), ...ac.map((d) => d[1])) * 1.05, lines: [[AMAX, C.warn, "가속도 한계"]], mark: T * +tIn.value });
  }
  function update() {
    const w = +wIn.value, f = path(w), T = period(); let amax = 0, tmax = 0, smax = 0;
    for (let k = 0; k <= 400; k++) { const t = (T * k) / 400, a = K.len(K.d2(f, t)); if (a > amax) { amax = a; tmax = t; } smax = Math.max(smax, K.len(K.d1(f, t))); }
    $(".w-out").textContent = w.toFixed(2); $(".t-out").textContent = (T * +tIn.value).toFixed(1);
    const v = $(".verdict"), wbest = w * Math.sqrt(AMAX / amax);
    v.textContent = `한 바퀴 ${T.toFixed(1)}초 · 최고 속력 ${smax.toFixed(1)} m/s · 최대 가속도 ${amax.toFixed(2)} m/s² (t = ${tmax.toFixed(1)}초)` + (amax <= AMAX ? " · 한계 이내" : " · 한계 초과!") + ` · 한계에 딱 맞는 ω ≈ ${wbest.toFixed(3)}`;
    v.className = "verdict " + (amax <= AMAX ? "good" : "bad");
    draw3(); drawG();
  }
  [wIn, tIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
