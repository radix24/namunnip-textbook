/* 카드: 좌표공간의 어떤 평면과 직선이 부분공간일까? — R³의 부분집합 판정 */
(() => {
  const root = document.getElementById("card-adalg-subspace-3d");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, L = NMLin;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sk = $(".sk"), verdict = $(".verdict");
  const r = () => Math.round((Math.random() * 3 - 1.5) * 2) / 2 || 0.5;
  /* 집합: 안 판정, 원소 뽑기, 그리기, 부분공간 여부 */
  const SETS = [
    { inside: (p) => Math.abs(p[0] + p[1] - p[2]) < 1e-9, pick: () => { const x = r(), y = r(); return [x, y, x + y]; }, sub: true,
      draw: (vw) => vw.poly(vw.quad([0, 0, 0], [0.7071, 0, 0.7071], [-0.408, 0.816, 0.408], 2.4, 2.2), "#74ab66", C.forest, 0.25, 1) },
    { inside: (p) => Math.abs(p[0] + p[1] - p[2] - 2) < 1e-9, pick: () => { const x = r(), y = r(); return [x, y, x + y - 2]; }, sub: false,
      draw: (vw) => vw.poly(vw.quad([0.667, 0.667, -0.667], [0.7071, 0, 0.7071], [-0.408, 0.816, 0.408], 2.4, 2.2), "#74ab66", C.forest, 0.25, 1) },
    { inside: (p) => Math.abs(p[1] - 2 * p[0]) < 1e-9 && Math.abs(p[2] - p[0]) < 1e-9, pick: () => { const t = r(); return [t, 2 * t, t]; }, sub: true,
      draw: (vw) => vw.line([-1.2, -2.4, -1.2], [1.2, 2.4, 1.2], C.forest, 4) },
    { inside: (p) => Math.abs(p[2] * p[2] - p[0] * p[0] - p[1] * p[1]) < 1e-9, pick: () => { const a = Math.floor(Math.random() * 8) * Math.PI / 4, z = r(); return [Math.abs(z) * Math.cos(a), Math.abs(z) * Math.sin(a), z].map((v) => +v.toFixed(12)); }, sub: false,
      draw: (vw) => { for (let k = 0; k < 12; k++) { const a = Math.PI * k / 6; vw.line([-2 * Math.cos(a), -2 * Math.sin(a), -2], [2 * Math.cos(a), 2 * Math.sin(a), 2], "#9fc78f", 1); } [-2, 2].forEach((z) => vw.path(vw.circle([0, 0, z], [1, 0, 0], [0, 1, 0], 2), C.forest, 1.4)); } },
    { inside: (p) => Math.abs(p[2]) < 1e-9 || Math.abs(p[0]) < 1e-9, pick: () => (Math.random() < 0.5 ? [r(), r(), 0] : [0, r(), r()]), sub: false,
      draw: (vw) => { vw.poly(vw.quad([0, 0, 0], [1, 0, 0], [0, 1, 0], 2, 2), "#74ab66", C.forest, 0.22, 1); vw.poly(vw.quad([0, 0, 0], [0, 1, 0], [0, 0, 1], 2, 2), "#74ab66", C.forest, 0.22, 1); } },
  ];
  let k_ = 0, u, v;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 7.5, yaw: -2.3, pitch: 0.42 });
  const pick = () => { const s = SETS[k_]; u = s.pick(); v = s.pick(); if (k_ === 4 && u[2] !== 0 === (v[2] !== 0)) v = u[2] === 0 ? [0, r(), r()] : [r(), r(), 0]; };
  const fmt = (p) => `(${p.map((x) => L.n(x, 2)).join(", ")})`;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(3, 2);
    const s = SETS[k_]; s.draw(vw);
    const sum = L.add(u, v), ku = L.scl(u, +sk.value), col = (p) => (s.inside(p) ? C.forest : C.warn);
    vw.line([0, 0, 0], u, BLUE, 2.6); vw.line([0, 0, 0], v, BLUE, 2.6);
    vw.line([0, 0, 0], sum, col(sum), 2.6); vw.line([0, 0, 0], ku, col(ku), 2, [4, 3]);
    vw.dot(u, BLUE, 4.5); vw.dot(v, BLUE, 4.5); vw.dot(sum, col(sum), 5.5); vw.dot(ku, col(ku), 4.5);
    vw.label(u, "u", BLUE, 8, -6, "left", `italic 700 13px ${F.serif}`); vw.label(v, "v", BLUE, 8, -6, "left", `italic 700 13px ${F.serif}`);
    vw.label(sum, "u + v", col(sum), 8, 8); vw.label(ku, "k·u", col(ku), 8, 8);
    vw.dot([0, 0, 0], s.inside([0, 0, 0]) ? C.forest : C.warn, 4);
  }
  function update() {
    const s = SETS[k_], sum = L.add(u, v), ku = L.scl(u, +sk.value);
    $(".k-out").textContent = L.n(+sk.value, 1);
    $(".st").textContent = `u = ${fmt(u)}, v = ${fmt(v)} · u + v ${s.inside(sum) ? "안 ✓" : "밖 ✗"} · k·u ${s.inside(ku) ? "안 ✓" : "밖 ✗"} · 원점 ${s.inside([0, 0, 0]) ? "포함 ✓" : "없음 ✗"}`;
    draw();
  }
  root.querySelectorAll(".which .chip").forEach((b) => b.addEventListener("click", () => {
    k_ = +b.dataset.s; root.querySelectorAll(".which .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    verdict.textContent = ""; verdict.className = "verdict"; root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
    pick(); update();
  }));
  root.querySelectorAll(".judge .chip").forEach((b) => b.addEventListener("click", () => {
    const ok = (b.dataset.j === "1") === SETS[k_].sub;
    root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    verdict.textContent = ok ? "맞습니다. 두 벡터를 여러 번 뽑아 확인해 보세요." : "다시 생각해 보세요. 원점, 합, 실수배를 하나씩 확인하세요.";
    verdict.className = "verdict " + (ok ? "good" : "bad");
  }));
  $(".go-pick").addEventListener("click", () => { pick(); update(); });
  sk.addEventListener("input", update);
  pick(); update();
})();
