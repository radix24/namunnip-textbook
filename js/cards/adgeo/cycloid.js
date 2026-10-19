/* 카드: 굴러가는 바퀴 위의 점은 어떤 곡선을 그릴까? — x = rt − d sin t, y = r − d cos t */
(() => {
  const root = document.getElementById("card-adgeo-cycloid");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t"), dIn = $(".d"), r = 1;
  let timer = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const pt = (t, d) => [r * t - d * Math.sin(t), r - d * Math.cos(t)];
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = +tIn.value, d = +dIn.value, xmax = 2 * Math.PI + 1.6, s = Math.min((w - 20) / (xmax + 1.6), (h - 20) / 3.3), ox = 10 + 1.6 * s, oy = h - 14;
    const X = (x) => ox + x * s, Y = (y) => oy - y * s;
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
    // 전체 궤적(흐리게)과 지금까지(진하게)
    ctx.strokeStyle = "rgba(63,111,163,.25)"; ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = 0; k <= 400; k++) { const p = pt((2 * Math.PI * k) / 400, d); k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); } ctx.stroke();
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 300; k++) { const p = pt((t * k) / 300, d); k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); } ctx.stroke();
    // 바퀴
    const c = [r * t, r];
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(c[0]), Y(c[1]), r * s, 0, 7); ctx.stroke();
    for (let k = 0; k < 6; k++) { const a = Math.PI + t + (k * Math.PI) / 3; ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(c[0]), Y(c[1])); ctx.lineTo(X(c[0] + r * Math.sin(a)), Y(c[1] + r * Math.cos(a))); ctx.stroke(); }
    const p = pt(t, d);
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(c[0]), Y(c[1])); ctx.lineTo(X(p[0]), Y(p[1])); ctx.stroke();
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5.5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "top";
    [0, 1].forEach((k) => { ctx.fillText(k ? `${2 * k}π` : "0", X(2 * Math.PI * k), Y(0) + 2); });
  }
  function update() {
    const t = +tIn.value, d = +dIn.value, p = pt(t, d);
    $(".t-out").textContent = NMTri.n(t, 2); $(".d-out").textContent = NMTri.n(d, 2);
    root.querySelectorAll("[data-d]").forEach((b) => b.setAttribute("aria-pressed", String(Math.abs(+b.dataset.d - d) < 1e-9)));
    $(".say").textContent = `점 (${NMTri.n(p[0], 2)}, ${NMTri.n(p[1], 2)}) · x = t − ${NMTri.n(d, 2)} sin t, y = 1 − ${NMTri.n(d, 2)} cos t (r = 1)` + (Math.abs(d - 1) < 1e-9 ? " · 사이클로이드" : d < 1 ? " · 단축 사이클로이드(물결)" : " · 장축 사이클로이드(고리)");
    draw();
  }
  $(".go-play").addEventListener("click", () => { clearInterval(timer); tIn.value = 0; timer = setInterval(() => { tIn.value = Math.min(6.29, +tIn.value + 0.04); update(); if (+tIn.value >= 6.28) clearInterval(timer); }, 30); });
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { dIn.value = b.dataset.d; update(); }));
  [tIn, dIn].forEach((el) => el.addEventListener("input", () => { clearInterval(timer); update(); }));
  update();
})();
