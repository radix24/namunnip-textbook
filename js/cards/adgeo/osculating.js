/* 카드: 곡선이 얼마나 휘었는지를 원으로 잴 수 있을까? — 접촉원과 곡률 그래프 */
(() => {
  const root = document.getElementById("card-adgeo-osculating");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMTri, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const CV = [
    { f: (t) => [t, (t * t) / 2], T: [-2.2, 2.2], R: 2.6, cy: 1.2 },
    { f: (t) => [2 * Math.cos(t), Math.sin(t)], T: [0, 2 * Math.PI], R: 2.6, cy: 0 },
    { f: (t) => [t, Math.sin(t)], T: [-3.5, 3.5], R: 3.6, cy: 0 },
    { f: (t) => [1.5 * Math.cos(t), 1.5 * Math.sin(t)], T: [0, 2 * Math.PI], R: 2.4, cy: 0 },
  ];
  let ci = 0, pad = null;
  const tIn = $(".t");
  const tv = () => { const c = CV[ci]; return c.T[0] + (c.T[1] - c.T[0]) * +tIn.value; };
  const osc = (c, t) => { const p = c.f(t), v = K.d1(c.f, t), a = K.d2(c.f, t), sp = K.len(v), cz = v[0] * a[1] - v[1] * a[0], k = Math.abs(cz) / sp ** 3; if (k < 1e-6) return { k: 0 }; const n = [(-v[1] / sp) * Math.sign(cz), (v[0] / sp) * Math.sign(cz)]; return { k, R: 1 / k, c: [p[0] + n[0] / k, p[1] + n[1] / k] }; };
  const gv = fit($(".g"), () => drawG());
  function make() {
    const c = CV[ci], cvs = $(".c"), nc = cvs.cloneNode(); cvs.replaceWith(nc);
    pad = G.pad(nc, { R: c.R, cy: c.cy, handles: () => [], move: () => {}, draw: (ctx, T, s) => {
      G.seg(ctx, T, [-9, 0], [9, 0], C.rule, 1); G.seg(ctx, T, [0, -9], [0, 9], C.rule, 1);
      const pts = [...Array(401)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / 400));
      ctx.strokeStyle = "#7b5ea7"; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p)))); ctx.stroke();
      const t = tv(), p = c.f(t), o = osc(c, t);
      if (o.k > 0) { G.circle(ctx, T, s, o.c, o.R, C.forest, 2, [6, 4]); G.seg(ctx, T, p, o.c, C.forest, 1.4); G.dot2(ctx, T, o.c, C.forest, 4); }
      const v = K.d1(c.f, t), sp = K.len(v); G.seg(ctx, T, G.add(p, G.mul(v, -1.2 / sp)), G.add(p, G.mul(v, 1.2 / sp)), "#3f6fa3", 1.6);
      G.dot2(ctx, T, p, "#e0a02a", 6.5);
    } });
  }
  function drawG() {
    const { ctx, size: { w, h } } = gv; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const c = CV[ci], data = [...Array(201)].map((_, k) => { const t = c.T[0] + ((c.T[1] - c.T[0]) * k) / 200; return [t, osc(c, t).k]; });
    K.graph(ctx, { x: 0, y: 0, w, h }, [{ data, col: C.forest, name: "곡률 κ" }], { v0: 0, mark: tv() });
  }
  function update() {
    const c = CV[ci], t = tv(), o = osc(c, t);
    $(".t-out").textContent = K.n(t, 2);
    $(".say").textContent = `곡률 κ = ${K.n(o.k, 4)} · 곡률반경 R = ${o.k > 1e-6 ? K.n(o.R, 3) : "∞ (직선처럼)"}` + (o.k > 1e-6 ? ` · 접촉원의 중심 (${K.n(o.c[0], 2)}, ${K.n(o.c[1], 2)})` : "");
    pad.redraw(); drawG();
  }
  $(".pick").addEventListener("change", () => { ci = +$(".pick").value; make(); update(); });
  tIn.addEventListener("input", update);
  make(); update();
})();
