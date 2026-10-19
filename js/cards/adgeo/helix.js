/* 카드: 용수철과 나사의 모양은 어떤 식으로 나타낼까? — 원기둥 나선 (a cos t, a sin t, bt)과 그림자 */
(() => {
  const root = document.getElementById("card-adgeo-helix");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), tIn = $(".t");
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 2.2], span: 8.5, yaw: -2.2, pitch: 0.35 });
  const r = (t) => [+aIn.value * Math.cos(t), +aIn.value * Math.sin(t), +bIn.value * t];
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    v.axes(3.2, 0.5);
    const T = +tIn.value, N = 300, full = [...Array(N + 1)].map((_, k) => r((18.85 * k) / N)), part = [...Array(N + 1)].map((_, k) => r((T * k) / N));
    v.path(full.map(([x, y]) => [x, y, 0]), "rgba(63,111,163,.35)", 1.2, null, false); // xy 그림자
    v.path(full.map(([x, , z]) => [x, -3, z]), "rgba(181,83,47,.35)", 1.2, null, false); // xz 그림자(y = −3 벽)
    v.path(full, "rgba(35,35,38,.2)", 1.2, null, false);
    v.path(part, "#7b5ea7", 3, null, false);
    const p = r(T);
    v.line(p, [p[0], p[1], 0], C.ink3, 1, [3, 3]); v.dot(p, "#e0a02a", 6);
    v.label([2.6, 2.6, 0], "xy 그림자: 원", "#3f6fa3"); v.label([0, -3, 4.6], "xz 그림자: 코사인 곡선", C.warn);
  }
  function update() {
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = bIn.value; $(".t-out").textContent = (+tIn.value).toFixed(2);
    const p = r(+tIn.value), b = +bIn.value;
    $(".say").textContent = `r(t) = (${aIn.value} cos t, ${aIn.value} sin t, ${b} t) · 지금 (${S.n(p[0])}, ${S.n(p[1])}, ${S.n(p[2])}) · 한 바퀴에 2πb = ${S.n(2 * Math.PI * b)} 오름` + (b === 0 ? " (원)" : b < 0 ? " (반대로 감김)" : "");
    draw();
  }
  [aIn, bIn, tIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
