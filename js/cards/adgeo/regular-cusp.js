/* 카드: 매끄러운 매개변수 식이 왜 뾰족한 곡선을 그릴까? — 속도가 0인 점과 첨점 */
(() => {
  const root = document.getElementById("card-adgeo-regular-cusp");
  if (!root) return;
  const { C } = NM;
  const G = NMTri, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const CV = [
    { f: (t) => [t * t, t * t * t], T: [-1.3, 1.3], R: 2.2, cx: 0.8, zero: [0], vs: 0.4 },
    { f: (t) => [t - Math.sin(t), 1 - Math.cos(t)], T: [-2, 8.3], R: 5, cx: 3, cy: 1, zero: [0, 2 * Math.PI], vs: 0.7 },
    { f: (t) => [t * t * t, t * t * t], T: [-1.2, 1.2], R: 2.2, cx: 0, zero: [0], vs: 0.4 },
    { f: (t) => [Math.cos(t), Math.sin(t)], T: [0, 2 * Math.PI], R: 1.8, cx: 0, zero: [], vs: 0.6 },
  ];
  let ci = 0;
  const tIn = $(".t");
  const tv = () => { const c = CV[ci]; return c.T[0] + (c.T[1] - c.T[0]) * +tIn.value; };
  let pad = null;
  function make() {
    const c = CV[ci], cvs = $("canvas"), nc = cvs.cloneNode(); cvs.replaceWith(nc);
    pad = G.pad(nc, { R: c.R, cx: c.cx || 0, cy: c.cy || 0, handles: () => [], move: () => {}, draw: (ctx, T) => {
      const pts = [...Array(401)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / 400));
      G.seg(ctx, T, [-10, 0], [10, 0], C.rule, 1); G.seg(ctx, T, [0, -10], [0, 10], C.rule, 1);
      ctx.strokeStyle = "#7b5ea7"; ctx.lineWidth = 2.6; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p)))); ctx.stroke();
      c.zero.forEach((t0) => { const q = T(c.f(t0)); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(...q, 11, 0, 7); ctx.stroke(); });
      const t = tv(), p = c.f(t), v = K.d1(c.f, t);
      G.seg(ctx, T, p, G.add(p, G.mul(v, c.vs)), "#3f6fa3", 3); G.dot2(ctx, T, p, "#e0a02a", 6);
    } });
  }
  function update() {
    const c = CV[ci], t = tv(), v = K.d1(c.f, t), sp = K.len(v);
    $(".t-out").textContent = K.n(t, 2);
    $(".say").textContent = `r′(t) = (${K.n(v[0], 2)}, ${K.n(v[1], 2)}) · 속력 ${K.n(sp, 3)}` + (c.zero.length ? ` · 속도가 0인 t: ${c.zero.map((z) => K.n(z, 2)).join(", ")} (빨간 원)` : " · 속도가 0인 곳 없음(정칙곡선)") + (sp < 0.02 ? " · 지금 거의 멈춤!" : "");
    pad.redraw();
  }
  $(".pick").addEventListener("change", () => { ci = +$(".pick").value; tIn.value = ci === 1 ? 0.2 : 0.5; make(); update(); });
  tIn.addEventListener("input", update);
  make(); update();
})();
