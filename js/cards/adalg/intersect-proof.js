/* 카드: 두 부분공간이 겹치는 부분도 부분공간일까? — 원점을 지나는 두 평면의 교선 + 증명 조립 */
(() => {
  const root = document.getElementById("card-adalg-intersect-proof");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { cross, unit, mul, len } = S;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa");
  let stage = -1;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 7, yaw: -2.25, pitch: 0.4 });
  /* W₁: z = 0, W₂: 법선이 (0.3 sin a, sin a, cos a)인 원점을 지나는 평면 (a = 0이면 W₁과 같음) */
  const n2 = () => { const a = +sa.value * Math.PI / 180; return [Math.sin(a) * 0.3, Math.sin(a), Math.cos(a)]; };
  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(3, 1.5);
    const N1 = [0, 0, 1], N2 = unit(n2());
    const basis = (N) => { const a = unit(Math.abs(N[0]) < 0.9 ? cross(N, [1, 0, 0]) : cross(N, [0, 1, 0])); return [a, cross(N, a)]; };
    const [a1, b1] = basis(N1), [a2, b2] = basis(N2);
    vw.poly(vw.quad([0, 0, 0], a1, b1, 2.2, 2.2), "#74ab66", C.forest, 0.22, 1);
    vw.poly(vw.quad([0, 0, 0], a2, b2, 2.2, 2.2), "#7aa7d9", BLUE, 0.22, 1);
    const d = cross(N1, N2);
    if (len(d) > 1e-6) { const u = mul(unit(d), 3); vw.line(mul(u, -1), u, C.warn, stage >= 4 ? 4 : 2.6); vw.label(u, "W₁ ∩ W₂", C.warn, 8, -6, "left", `700 12px ${F.sans}`); }
    else vw.label([0, 0, 0], "두 평면이 같음: 교집합 = 평면", C.warn, 10, -14, "left", `600 12px ${F.sans}`);
    vw.dot([0, 0, 0], stage >= 1 ? C.warn : C.ink, stage >= 1 ? 6 : 4);
  }
  function update() { $(".a-out").textContent = `${sa.value}°`; draw(); }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d", "e"], onStep(i) { stage = i; draw(); } });
  sa.addEventListener("input", update);
  update();
})();
