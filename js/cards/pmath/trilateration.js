/* 카드: 위성까지의 거리만으로 내 위치를 어떻게 알아낼까? — 구 세 개의 교점(삼변측량), 거리 오차의 영향 */
(() => {
  const root = document.getElementById("card-pmath-trilateration");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { add, sub, mul, dot, cross, len } = S;
  const { n, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const se = $(".se");
  const SAT = [[-3, -1.5, 4.2], [2.8, -2.2, 3.8], [0.4, 3, 4.6]];
  const RX = [[0.5, 0.3, 0], [-1.6, 1.2, 0.2], [1.8, -0.8, 0.1]];
  let rk = 0;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 1.6], span: 11, yaw: -2.25, pitch: 0.35 });
  const fmt = (p) => `(${p.map((v) => n(v, 2)).join(", ")})`;

  /* 세 구 |p − s_i| = d_i의 교점 두 개(없으면 null) */
  function solve(d) {
    const [s1, s2, s3] = SAT;
    const pl = (si, di) => ({ nv: mul(sub(s1, si), 2), c: di * di - d[0] * d[0] - dot(si, si) + dot(s1, s1) });
    const p2 = pl(s2, d[1]), p3 = pl(s3, d[2]);
    const u = cross(p2.nv, p3.nv), uu = dot(u, u);
    const a = dot(p2.nv, p2.nv), b = dot(p2.nv, p3.nv), c = dot(p3.nv, p3.nv), det = a * c - b * b;
    const p0 = add(mul(p2.nv, (p2.c * c - p3.c * b) / det), mul(p3.nv, (p3.c * a - p2.c * b) / det));
    // |p0 + t u − s1|² = d1²
    const w = sub(p0, s1), A = uu, B = 2 * dot(w, u), Cq = dot(w, w) - d[0] * d[0], D = B * B - 4 * A * Cq;
    if (D < 0) return null;
    const t1 = (-B - Math.sqrt(D)) / (2 * A), t2 = (-B + Math.sqrt(D)) / (2 * A);
    return [add(p0, mul(u, t1)), add(p0, mul(u, t2))].sort((x, y) => x[2] - y[2]);
  }
  const dists = () => SAT.map((s) => len(sub(RX[rk], s)) + +se.value);

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    for (let k = -4; k <= 4; k += 2) { vw.line([k, -4, 0], [k, 4, 0], C.rule, 0.8); vw.line([-4, k, 0], [4, k, 0], C.rule, 0.8); }
    const d = dists(), sol = solve(d), cols = [BLUE, PURPLE, C.amber];
    SAT.forEach((s, i) => {
      // 구를 지면(z = 0)으로 자른 원
      const h = s[2], r2 = d[i] * d[i] - h * h;
      if (r2 > 0) vw.path(vw.circle([s[0], s[1], 0], [1, 0, 0], [0, 1, 0], Math.sqrt(r2)), cols[i], 1.4);
      vw.line(s, RX[rk], cols[i], 1, [4, 3]);
      vw.dot(s, cols[i], 6); vw.label(s, `위성 ${i + 1}`, cols[i], 8, -8, "left", `600 11px ${F.sans}`);
    });
    vw.dot(RX[rk], C.ink, 5); vw.label(RX[rk], "실제", C.ink, -8, 12, "right", `600 11px ${F.sans}`);
    if (sol) sol.forEach((p, i) => { vw.dot(p, i === 0 ? C.warn : C.ink3, i === 0 ? 7 : 5); if (i === 1) vw.label(p, "다른 해(우주 쪽)", C.ink3, 8, 0, "left", `11px ${F.sans}`); });
  }
  function update() {
    const d = dists(), sol = solve(d);
    $(".e-out").textContent = n(+se.value, 2);
    $(".n-t").textContent = fmt(RX[rk]);
    if (!sol) { $(".n-p").textContent = "해 없음"; $(".n-err").textContent = "—"; }
    else { $(".n-p").textContent = fmt(sol[0]); $(".n-err").textContent = n(len(sub(sol[0], RX[rk])), 3); }
    $(".step").textContent = `거리 d = ${d.map((v) => n(v, 2)).join(", ")} → 구 두 쌍을 빼서 평면 2개 → 교선을 구 1에 대입 → 이차방정식의 해 2개`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    rk = +b.dataset.r; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  se.addEventListener("input", update);
  update();
})();
