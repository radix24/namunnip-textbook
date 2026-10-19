/* 카드: 나선을 따라 움직이는 점의 가속도는 어느 쪽을 향할까? — r′(t), r″(t)를 곡선 위에 */
(() => {
  const root = document.getElementById("card-adgeo-vel-acc");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const CV = [
    { f: (t) => [2 * Math.cos(t), 2 * Math.sin(t), t / 2], T: [0, 4 * Math.PI], vs: 0.6, as: 0.6 },
    { f: (t) => [(t * Math.cos(t)) / 4, (t * Math.sin(t)) / 4, t / 4], T: [0, 4 * Math.PI], vs: 0.8, as: 0.8 },
    { f: (t) => [1.6 * t, 1.6 * t * t, 1.6 * t * t * t], T: [-1.1, 1.1], vs: 0.3, as: 0.15 },
  ];
  let ci = 0;
  const tIn = $(".t");
  const tv = () => { const c = CV[ci]; return c.T[0] + (c.T[1] - c.T[0]) * +tIn.value; };
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 1.6], span: 8, yaw: -2.2, pitch: 0.35 });
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    v.axes(2.8, 0.5);
    const c = CV[ci], pts = [...Array(301)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / 300)), t = tv(), p = c.f(t), vel = K.d1(c.f, t), acc = K.d2(c.f, t);
    v.path(pts, "rgba(123,94,167,.75)", 2.2, null, false);
    v.line(p, S.add(p, S.mul(vel, c.vs)), "#3f6fa3", 3); v.label(S.add(p, S.mul(vel, c.vs)), "v", "#3f6fa3");
    v.line(p, S.add(p, S.mul(acc, c.as)), C.warn, 3); v.label(S.add(p, S.mul(acc, c.as)), "a", C.warn);
    v.dot(p, "#e0a02a", 6);
  }
  function update() {
    const c = CV[ci], t = tv(), vel = K.d1(c.f, t), acc = K.d2(c.f, t), sp = K.len(vel), am = K.len(acc);
    const ang = am > 1e-6 ? (Math.acos(Math.max(-1, Math.min(1, K.dot(vel, acc) / (sp * am)))) * 180) / Math.PI : NaN;
    $(".t-out").textContent = K.n(t, 2);
    $(".say").textContent = `속력 |v| = ${K.n(sp, 3)} · |a| = ${K.n(am, 3)} · v와 a 사이의 각 ${K.n(ang, 1)}° · 속도 방향 성분 a·v/|v| = ${K.n(K.dot(vel, acc) / sp, 3)} (그림은 보기 좋게 축척을 바꿈)`;
    draw();
  }
  $(".pick").addEventListener("change", () => { ci = +$(".pick").value; update(); });
  tIn.addEventListener("input", update);
  update();
})();
