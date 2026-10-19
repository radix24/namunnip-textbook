/* 카드: 동전을 기울이면 그림자의 넓이는 얼마나 줄어들까? — 기울인 도형과 바닥으로의 정사영 */
(() => {
  const root = document.getElementById("card-pmath-disk-shadow");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st");
  /* 도형: 평면 좌표 (u, v) 목록과 넓이. u는 회전축(x) 방향 */
  const SH = {
    disk: { pts: Array.from({ length: 72 }, (_, i) => [1.4 * Math.cos(2 * Math.PI * i / 72), 1.4 * Math.sin(2 * Math.PI * i / 72)]), area: Math.PI * 1.96 },
    tri: { pts: [[-1.6, -1.1], [1.6, -1.1], [0.3, 1.5]], area: 0.5 * 3.2 * 2.6 },
    sq: { pts: [[-1.2, -1.2], [1.2, -1.2], [1.2, 1.2], [-1.2, 1.2]], area: 2.4 * 2.4 },
  };
  let fk = "disk";
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0.9], span: 6.2, yaw: -2.5, pitch: 0.5 });
  const H = 1.8;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const t = +st.value * Math.PI / 180, v = [0, Math.cos(t), Math.sin(t)];
    const shape = SH[fk].pts.map(([a, b]) => [a, b * v[1], H + b * v[2]]);
    const shadow = shape.map(([x, y]) => [x, y, 0]);
    vw.poly(vw.quad([0, 0, 0], [1, 0, 0], [0, 1, 0], 2.6, 2.2), "#e5e3da", C.rule, 0.6, 1);
    vw.poly(shadow, "#3a3a3a", "#3a3a3a", 0.45, 1);
    // 빛줄기 몇 개
    shape.filter((_, i) => i % Math.max(1, Math.floor(shape.length / 8)) === 0).forEach((p) => vw.line(p, [p[0], p[1], 0], "#e0a02a", 1, [3, 3]));
    vw.poly(shape, BLUE, BLUE, 0.35, 1.6);
    vw.line([-2.4, 0, H], [2.4, 0, H], C.warn, 1.6);
  }
  function update() {
    const t = +st.value * Math.PI / 180;
    // 도형과 그림자의 넓이를 꼭짓점 좌표로 직접 잰다(신발끈 공식)
    const shoe = (p) => Math.abs(p.reduce((s, [x, y], i) => { const [x2, y2] = p[(i + 1) % p.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
    const pts = SH[fk].pts, A = shoe(pts), As = shoe(pts.map(([a, b]) => [a, b * Math.cos(t)]));
    $(".t-out").textContent = `${st.value}°`;
    $(".n-s").textContent = n(A, 3); $(".n-sp").textContent = n(As, 3);
    $(".n-r").textContent = `${n(As / A, 3)} · cos θ = ${n(Math.cos(t), 3)}`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    fk = b.dataset.f; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  st.addEventListener("input", update);
  update();
})();
