/* 카드: 행렬 하나가 평면 전체를 어떻게 움직일까? — 2×2 행렬의 격자 변환, I에서 M으로 이어 재생 */
(() => {
  const root = document.getElementById("card-adalg-grid-transform");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const sl = [...root.querySelectorAll("[data-m]")], out = [...root.querySelectorAll("[data-o]")];
  let t = 1, anim = null;
  const { ctx, size } = fit($("canvas"), () => draw());
  const M = () => { const v = sl.map((el) => +el.value); return [[v[0], v[1]], [v[2], v[3]]]; };
  const mix = (A, s) => A.map((r, i) => r.map((x, j) => (i === j ? 1 : 0) * (1 - s) + x * s));

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x: 0, y: 0, w, h }, pl = L.plane(ctx, box, 4), A = mix(M(), t);
    L.grid(ctx, box, pl, A, { K: 10 });
    L.shape(ctx, pl, L.HOUSE, null, null, "rgba(141,141,146,.7)");
    L.shape(ctx, pl, L.HOUSE, A, "rgba(224,160,42,.35)", C.amber);
  }
  function update() {
    const A = M();
    sl.forEach((el, i) => (out[i].textContent = L.n(+el.value, 1)));
    $(".say").textContent = `e₁ → (${L.n(A[0][0], 1)}, ${L.n(A[1][0], 1)}) = 1열 · e₂ → (${L.n(A[0][1], 1)}, ${L.n(A[1][1], 1)}) = 2열 · det = ${L.n(L.det(A), 2)}`;
    draw();
  }
  sl.forEach((el) => el.addEventListener("input", () => { if (anim) { anim(); anim = null; } t = 1; update(); }));
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    b.dataset.p.split(",").forEach((v, i) => (sl[i].value = v));
    play();
  }));
  function play() {
    if (anim) anim();
    t = 0; update();
    const t0 = performance.now(); let raf = 0;
    const tick = (now) => { t = NM.ease(Math.min(1, (now - t0) / 1200)); draw(); if (t < 1) raf = requestAnimationFrame(tick); else anim = null; };
    raf = requestAnimationFrame(tick);
    anim = () => cancelAnimationFrame(raf);
  }
  $(".go-play").addEventListener("click", play);
  update();
})();
