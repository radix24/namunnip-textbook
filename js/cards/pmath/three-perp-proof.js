/* 카드: 평면 위에 그은 수선 하나로 공중의 수선을 어떻게 증명할까? — 삼수선 정리 증명 조립 + 3D 그림 */
(() => {
  const root = document.getElementById("card-pmath-three-perp-proof");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { add, sub, mul, dot: dt, len, unit, vecAngle } = S;
  const { n, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sh = $(".sh");
  let stage = -1;
  const vw = S.view($("canvas"), () => draw(), { center: [0.4, 0.4, 0.8], span: 6.4, yaw: -2.3, pitch: 0.42 });
  const D = 1.6;   // O에서 l까지 거리

  function geom() {
    const a = +sa.value * Math.PI / 180, u = [Math.cos(a), Math.sin(a), 0];   // l의 방향
    const nrm = [-Math.sin(a), Math.cos(a), 0];                                 // 평면 위에서 l에 수직
    const O = [0, 0, 0], P = [0, 0, +sh.value], H = mul(nrm, D);
    return { u, O, P, H };
  }
  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const { u, O, P, H } = geom();
    vw.poly(vw.quad([0.4, 0.4, 0], [1, 0, 0], [0, 1, 0], 2.8, 2.6), "#cfe0c6", C.rule, 0.5, 1);
    vw.label([2.8, -2, 0], "α", C.ink2, 0, 0, "center", `italic 700 14px ${F.serif}`);
    vw.line(add(H, mul(u, -3)), add(H, mul(u, 3)), C.ink, 2.4);
    vw.label(add(H, mul(u, 2.8)), "l", C.ink, 8, -6, "left", `italic 700 14px ${F.serif}`);
    vw.dot(P, C.ink, 5); vw.label(P, "P", C.ink, 8, -6);
    if (stage >= 0) {
      vw.line(P, O, C.forest, 2.4); vw.line(O, H, BLUE, 2.4);
      vw.right(O, unit(sub(P, O)), unit(sub(H, O)), 0.24, C.forest);
      vw.right(H, unit(sub(O, H)), u, 0.24, BLUE);
      vw.dot(O, C.ink2, 4); vw.label(O, "O", C.ink2, -10, 10); vw.dot(H, C.ink2, 4); vw.label(H, "H", C.ink2, 8, 12);
    }
    if (stage >= 1) {   // PO ⊥ l: l을 O로 평행이동한 보조선
      vw.line(add(O, mul(u, -1)), add(O, mul(u, 1)), C.forest, 1.2, [4, 3]);
      vw.right(O, unit(sub(P, O)), u, 0.2, C.forest);
    }
    if (stage >= 2) vw.poly([P, O, H], PURPLE, PURPLE, 0.22, 1);
    if (stage >= 3) { vw.line(P, H, C.warn, 3); vw.right(H, unit(sub(P, H)), u, 0.24, C.warn); }
  }
  function update() {
    const { u, O, P, H } = geom();
    $(".a-out").textContent = `${sa.value}°`; $(".h-out").textContent = n(+sh.value, 1);
    const ang = (v) => `${n(vecAngle(v, u), 1)}°`;
    $(".n-1").textContent = stage >= 1 ? ang(sub(P, O)) : "—";
    $(".n-2").textContent = stage >= 0 ? ang(sub(H, O)) : "—";
    $(".n-3").textContent = stage >= 3 ? ang(sub(P, H)) : "—";
    draw();
  }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d"], onStep(i) { stage = i; update(); } });
  [sa, sh].forEach((el) => el.addEventListener("input", update));
  update();
})();
