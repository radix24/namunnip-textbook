/* 카드: 게임 속 3D 물체는 어떻게 그림자를 칠할까? — 면 법선(외적)과 램버트 조명(내적) */
(() => {
  const root = document.getElementById("card-pmath-shading");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, { add, sub, mul, cross, dot, unit } = S;
  const { n } = NMPm;
  const $ = (s) => root.querySelector(s);
  const saz = $(".saz"), sel = $(".sel"), sd = $(".sd"), bn = $(".go-n"), bf = $(".go-flip");
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 3.4, yaw: -2.2, pitch: 0.35 });
  const LV = { 1: [5, 8, "거침"], 2: [9, 14, "보통"], 3: [14, 22, "촘촘함"], 4: [22, 34, "아주 촘촘함"] };

  /* 위도·경도로 나눈 구의 삼각형들. 꼭짓점 순서는 바깥에서 볼 때 시계 반대 방향 */
  function mesh(nl, nm) {
    const V = (i, j) => { const th = Math.PI * i / nl, ph = 2 * Math.PI * j / nm; return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]; };
    const T = [];
    for (let i = 0; i < nl; i++) for (let j = 0; j < nm; j++) {
      const a = V(i, j), b = V(i + 1, j), c = V(i + 1, j + 1), d = V(i, j + 1);
      if (i > 0) T.push([a, b, d]);
      if (i < nl - 1) T.push([b, c, d]);
    }
    return T;
  }
  const light = () => { const az = +saz.value * Math.PI / 180, el = +sel.value * Math.PI / 180; return [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)]; };

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const [nl, nm] = LV[+sd.value], L = light(), flip = bf.getAttribute("aria-pressed") === "true", eye = vw.eye();
    const faces = mesh(nl, nm).map((t) => {
      const u = sub(t[1], t[0]), v = sub(t[2], t[0]);
      let nv = unit(flip ? cross(v, u) : cross(u, v));
      const c = mul(add(add(t[0], t[1]), t[2]), 1 / 3);
      return { t, nv, c, depth: vw.P(c).d };
    });
    faces.sort((a, b) => b.depth - a.depth);
    faces.forEach((f) => {
      if (dot(unit(f.c), eye) < -0.05) return;   // 뒤쪽 면은 안 그림(위치로 판정)
      const br = Math.max(0, dot(f.nv, L)), g = Math.round(28 + 220 * br);
      vw.poly(f.t, `rgb(${g},${Math.round(g * 0.97)},${Math.round(g * 0.9)})`, "rgba(0,0,0,.15)", 1, 0.6);
      if (bn.getAttribute("aria-pressed") === "true") vw.line(f.c, add(f.c, mul(f.nv, 0.25)), "#3f6fa3", 1.2);
    });
    vw.line(mul(L, 1.2), mul(L, 1.7), "#e0a02a", 3);
    vw.dot(mul(L, 1.75), "#e0a02a", 7);
  }
  function update() {
    $(".az-out").textContent = `${saz.value}°`; $(".el-out").textContent = `${sel.value}°`; $(".d-out").textContent = LV[+sd.value][2];
    const [nl, nm] = LV[+sd.value], t = mesh(nl, nm), f = t[Math.floor(t.length / 2)], L = light();
    const u = sub(f[1], f[0]), v = sub(f[2], f[0]), flip = bf.getAttribute("aria-pressed") === "true", nv = unit(flip ? cross(v, u) : cross(u, v));
    const fmt = (p) => `(${p.map((x) => n(x, 2)).join(", ")})`;
    $(".face").textContent = `삼각형 ${t.length}개 · 예: 한 면의 법선 ${fmt(nv)}, 빛 ${fmt(L)}, 내적 ${n(dot(nv, L), 3)} → 밝기 ${n(Math.max(0, dot(nv, L)), 3)}`;
    draw();
  }
  [bn, bf].forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); update(); }));
  [saz, sel, sd].forEach((el) => el.addEventListener("input", update));
  update();
})();
