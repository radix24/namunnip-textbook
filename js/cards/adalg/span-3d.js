/* 카드: 세 벡터가 공간을 채우지 못하고 평면에 갇히는 때는 언제일까? — 평행육면체의 부피와 일차종속 */
(() => {
  const root = document.getElementById("card-adalg-span-3d");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, L = NMLin, { add } = S;
  const { BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const w1 = $(".w1"), w2 = $(".w2"), w3 = $(".w3");
  const U = [2, 0, 0], V = [1, 2, 0];
  const vw = S.view($("canvas"), () => draw(), { center: [1.2, 1, 0.6], span: 7, yaw: -2.3, pitch: 0.42 });
  const W = () => [+w1.value, +w2.value, +w3.value];
  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(3.2, 1.2);
    const w = W(), d = Math.abs(L.det(L.T([U, V, w]))), flat = d < 1e-9;
    // 평행육면체 모서리
    const o = [0, 0, 0], pts = [o, U, V, w, add(U, V), add(U, w), add(V, w), add(add(U, V), w)];
    const E = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
    E.forEach(([a, b]) => vw.line(pts[a], pts[b], flat ? C.warn : C.rule, 1.2, [4, 3]));
    vw.poly([o, U, add(U, V), V], flat ? C.warn : "#74ab66", null, 0.25);
    vw.line(o, U, C.forest, 3); vw.line(o, V, BLUE, 3); vw.line(o, w, PURPLE, 3);
    vw.label(U, "u", C.forest, 8, -6, "left", `italic 700 13px ${F.serif}`); vw.label(V, "v", BLUE, 8, -6, "left", `italic 700 13px ${F.serif}`); vw.label(w, "w", PURPLE, 8, -6, "left", `italic 700 13px ${F.serif}`);
  }
  function update() {
    const w = W(), d = L.det(L.T([U, V, w]));
    $(".o1").textContent = L.n(w[0], 2); $(".o2").textContent = L.n(w[1], 2); $(".o3").textContent = L.n(w[2], 2);
    $(".n-v").textContent = L.n(Math.abs(d), 3);
    const dep = Math.abs(d) < 1e-9;
    $(".n-j").textContent = dep ? "일차종속" : "일차독립"; $(".n-j").className = `n-j ${dep ? "bad" : "good"}`;
    // w₃ = 0이면 w = a·u + b·v: b = w₂/2, a = (w₁ − b)/2
    if (dep) { const b = w[1] / 2, a = (w[0] - b) / 2; $(".n-c").textContent = `w = ${L.frac(a)}u + ${L.frac(b)}v`; }
    else $(".n-c").textContent = "나타낼 수 없음";
    draw();
  }
  [w1, w2, w3].forEach((el) => el.addEventListener("input", update));
  update();
})();
