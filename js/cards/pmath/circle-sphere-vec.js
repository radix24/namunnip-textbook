/* 카드: 원과 구는 같은 식 하나로 쓸 수 있을까? — |p − c| = r, 정수 좌표 점 찾기 */
(() => {
  const root = document.getElementById("card-pmath-circle-sphere-vec");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), sy = $(".sy"), sz = $(".sz"), R = 3;
  let dim = 3;
  const found = { 2: new Set(), 3: new Set() };
  const TOTAL = { 2: 4, 3: 30 };   // x² + y² = 9: 4개, x² + y² + z² = 9: 6(축) + 24(1, 2, 2 꼴) = 30개
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 9, yaw: -2.25, pitch: 0.4 });
  const P = () => (dim === 3 ? [+sx.value, +sy.value, +sz.value] : [+sx.value, +sy.value, 0]);
  const d2 = (p) => p[0] ** 2 + p[1] ** 2 + p[2] ** 2;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(4.2, 4.2);
    if (dim === 3) {
      [-2, -1, 0, 1, 2].forEach((z) => vw.path(vw.circle([0, 0, z * R / 2.5], [1, 0, 0], [0, 1, 0], Math.sqrt(R * R - (z * R / 2.5) ** 2)), C.rule, 1));
      for (let k = 0; k < 6; k++) { const a = Math.PI * k / 6; vw.path(vw.circle([0, 0, 0], [Math.cos(a), Math.sin(a), 0], [0, 0, 1], R), C.rule, 1); }
    }
    vw.path(vw.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], R), BLUE, 2);
    [...found[dim]].forEach((k) => vw.dot(k.split(",").map(Number), C.forest, 4.5));
    const p = P(), on = d2(p) === R * R;
    vw.line([0, 0, 0], p, C.warn, 1.6, [4, 3]);
    vw.dot(p, on ? C.forest : C.warn, 6.5); vw.label(p, `P(${p.slice(0, dim).join(", ")})`.replace(/-/g, "−"), C.ink, 8, -8, "left", `600 11.5px ${F.mono}`);
  }
  function update() {
    const p = P(), v = d2(p);
    $(".x-out").textContent = sx.value; $(".y-out").textContent = sy.value; $(".z-out").textContent = sz.value;
    $(".n-d").textContent = dim === 3 ? `${p[0] ** 2} + ${p[1] ** 2} + ${p[2] ** 2} = ${v}` : `${p[0] ** 2} + ${p[1] ** 2} = ${v}`;
    const w = v < 9 ? "안쪽" : v > 9 ? "바깥쪽" : (dim === 3 ? "구 위" : "원 위");
    $(".n-w").textContent = w; $(".n-w").className = `n-w ${v === 9 ? "good" : ""}`;
    if (v === 9) found[dim].add(p.join(","));
    $(".found").textContent = `찾은 정수 좌표 점: ${found[dim].size} / ${TOTAL[dim]}개`;
    draw();
  }
  root.querySelectorAll(".mode .chip").forEach((b) => b.addEventListener("click", () => {
    dim = +b.dataset.m; root.querySelectorAll(".mode .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".zw").style.display = dim === 3 ? "" : "none";
    vw.st.pitch = dim === 2 ? 1.45 : 0.4; update();
  }));
  [sx, sy, sz].forEach((el) => el.addEventListener("input", update));
  update();
})();
