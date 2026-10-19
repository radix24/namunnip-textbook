/* 카드: 나선 위를 속력 1로 움직이게 하려면 매개변수를 어떻게 바꿀까? — t = s/c, c = √(a² + b²) */
(() => {
  const root = document.getElementById("card-adgeo-reparam");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), cIn = $(".c");
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 4], span: 11, yaw: -2.2, pitch: 0.35 });
  const r = (t) => [+aIn.value * Math.cos(t), +aIn.value * Math.sin(t), +bIn.value * t * 0.5];
  /* 그림의 높이는 0.5배로 줄여 그림(눈금은 식 기준) */
  const rTrue = (t) => [+aIn.value * Math.cos(t), +aIn.value * Math.sin(t), +bIn.value * t];
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    v.axes(3.4, 0.5);
    const tmax = 4 * Math.PI, pts = [...Array(301)].map((_, k) => r((tmax * k) / 300));
    v.path(pts, "rgba(123,94,167,.7)", 2.2, null, false);
    const c = +cIn.value; for (let s = 0; s / c <= tmax; s += 1) v.dot(r(s / c), s % 5 === 0 ? C.warn : "#e0a02a", s % 5 === 0 ? 5.5 : 3.5);
  }
  function update() {
    const a = +aIn.value, b = +bIn.value, c = +cIn.value, ideal = Math.hypot(a, b), sp = K.len(K.d1(rTrue, 1)) / c;
    $(".a-out").textContent = a; $(".b-out").textContent = b; $(".c-out").textContent = c.toFixed(2);
    const ok = Math.abs(sp - 1) < 0.02, vv = $(".verdict");
    vv.textContent = `|dr/ds| = √(a² + b²)/c = ${K.n(ideal, 3)}/${c.toFixed(2)} = ${K.n(sp, 3)} · 점 사이의 곡선 거리 ${K.n(sp, 3)}` + (ok ? ` · 단위속력! c = √(${a}² + ${b}²) ≈ ${K.n(ideal, 3)}` : sp > 1 ? " · 점 간격이 1보다 넓음(c를 키우세요)" : " · 점 간격이 1보다 좁음(c를 줄이세요)");
    vv.className = "verdict " + (ok ? "good" : "");
    draw();
  }
  [aIn, bIn, cIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
