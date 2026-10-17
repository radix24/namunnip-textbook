/* 카드: 휘어진 곡선의 길이는 어떻게 잴까? — 꺾은선 길이 → ∫|r′(t)|dt */
(() => {
  const root = document.getElementById("card-adgeo-arc-length");
  if (!root) return;
  const { C } = NM;
  const G = NMTri, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const CV = [
    { f: (t) => [t - Math.sin(t), 1 - Math.cos(t)], T: [0, 2 * Math.PI], R: 3.6, cx: Math.PI, cy: 1, exact: 8, name: "8" },
    { f: (t) => [t, t * t], T: [0, 1], R: 0.8, cx: 0.5, cy: 0.5, exact: Math.sqrt(5) / 2 + Math.asinh(2) / 4, name: "√5/2 + ln(2 + √5)/4" },
    { f: (t) => [Math.cos(t), Math.sin(t)], T: [0, Math.PI], R: 1.3, cx: 0, cy: 0.5, exact: Math.PI, name: "π" },
  ];
  let ci = 0, pad = null;
  const nIn = $(".n");
  function make() {
    const c = CV[ci], cvs = $("canvas"), nc = cvs.cloneNode(); cvs.replaceWith(nc);
    pad = G.pad(nc, { R: c.R, cx: c.cx, cy: c.cy, handles: () => [], move: () => {}, draw: (ctx, T) => {
      const pts = [...Array(301)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / 300)), n = +nIn.value, poly = [...Array(n + 1)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / n));
      ctx.strokeStyle = "#7b5ea7"; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p)))); ctx.stroke();
      ctx.strokeStyle = "#e0a02a"; ctx.lineWidth = 2; ctx.beginPath(); poly.forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p)))); ctx.stroke();
      poly.forEach((p) => G.dot2(ctx, T, p, "#b07a10", 3.5));
    } });
  }
  function update() {
    const c = CV[ci], n = +nIn.value, Lp = K.polyLen(c.f, c.T[0], c.T[1], n), Li = K.arcLen(c.f, c.T[0], c.T[1]);
    $(".n-out").textContent = n;
    $(".say").textContent = `꺾은선 ${n}개의 길이 ${K.n(Lp, 5)} · ∫|r′(t)|dt = ${K.n(Li, 5)} (정확한 값 ${c.name} = ${K.n(c.exact, 5)}) · 오차 ${K.n(c.exact - Lp, 5)}`;
    $(".st").innerHTML = "<tr><th>n</th>" + [1, 2, 4, 8, 16, 32, 64].map((k) => `<th>${k}</th>`).join("") + "</tr><tr><th>길이</th>" + [1, 2, 4, 8, 16, 32, 64].map((k) => `<td>${K.n(K.polyLen(c.f, c.T[0], c.T[1], k), 4)}</td>`).join("") + "</tr>";
    pad.redraw();
  }
  $(".pick").addEventListener("change", () => { ci = +$(".pick").value; make(); update(); });
  nIn.addEventListener("input", update);
  make(); update();
})();
