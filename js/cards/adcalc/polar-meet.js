/* 카드: 두 극방정식을 연립하면 교점이 모두 나올까? — 교점 찾기와 연립으로 얻는 교점 비교, 같은 θ의 두 점 */
(() => {
  const root = document.getElementById("card-adcalc-polar-meet");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, rad, label, seg, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), bEq = $(".go-eq"), cv = $("canvas"), PI = Math.PI;
  const pol = (r, t) => [r * Math.cos(t), r * Math.sin(t)];
  const P = [
    { f: (t) => 1 + Math.cos(t), g: (t) => 3 * Math.cos(t), rmax: 3.2, gT: PI,
      pts: [pol(1.5, PI / 3), pol(1.5, -PI / 3), [0, 0]], eq: [0, 1] },
    { f: (t) => Math.cos(2 * t), g: () => 0.5, rmax: 1.15, gT: 2 * PI,
      pts: [1, 2, 4, 5, 7, 8, 10, 11].map((k) => pol(0.5, k * PI / 6)), eq: [0, 3, 4, 7] },
  ];
  let pk = 0, pf = null;
  const found = new Set();
  const { ctx, size } = fit(cv, () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], t = rad(+st.value);
    pf = A.pframe(ctx, w, h, { rmax: p.rmax, rings: 2, rays: 12 });
    A.pcurve(ctx, pf, p.f, 0, 2 * PI, BLUE, { width: 2.4 });
    A.pcurve(ctx, pf, p.g, 0, p.gT, C.forest, { width: 2.4 });
    const XY = ([x, y]) => [pf.cx + x * pf.S, pf.cy - y * pf.S];
    if (bEq.getAttribute("aria-pressed") === "true") p.eq.forEach((i) => { const [x, y] = XY(p.pts[i]); ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - 8, y - 8, 16, 16); ctx.restore(); });
    found.forEach((i) => { const [x, y] = XY(p.pts[i]); dot(ctx, x, y, C.warn, 5.5); });
    // 같은 θ의 두 점
    const [ax, ay] = pf.P(p.f(t), t), [bx, by] = pf.P(p.g(t), t);
    seg(ctx, ax, ay, bx, by, C.ink3, 1, [3, 3]);
    dot(ctx, ax, ay, BLUE, 4.5, true); dot(ctx, bx, by, C.forest, 4.5, true);
    label(ctx, "파랑·초록 ○: 같은 θ의 두 점", 6, h - 22, C.ink3, "left", `11px ${F.sans}`);
    if (bEq.getAttribute("aria-pressed") === "true") label(ctx, "□: 연립해서 얻은 교점", 6, h - 8, C.ink, "left", `11px ${F.sans}`);
  }
  function nums() {
    const p = P[pk], t = rad(+st.value);
    $(".t-out").textContent = `${st.value}°`;
    $(".n-f").textContent = `${found.size} / ${p.pts.length}`;
    $(".n-e").textContent = bEq.getAttribute("aria-pressed") === "true" ? `${p.eq.length}개` : "?";
    const [a, b] = pol(p.f(t), t), [c, d] = pol(p.g(t), t);
    $(".n-d").textContent = n(Math.hypot(a - c, b - d), 3);
    draw();
  }
  cv.addEventListener("click", (e) => {
    if (!pf) return;
    const bb = cv.getBoundingClientRect(), x = (e.clientX - bb.left - pf.cx) / pf.S, y = (pf.cy - (e.clientY - bb.top)) / pf.S;
    P[pk].pts.forEach((q, i) => { if (Math.hypot(q[0] - x, q[1] - y) < P[pk].rmax * 0.07) found.add(i); });
    nums();
  });
  G.chips(root, ".pk .chip", (b) => { pk = +b.dataset.p; found.clear(); bEq.setAttribute("aria-pressed", "false"); nums(); });
  bEq.addEventListener("click", () => { bEq.setAttribute("aria-pressed", String(bEq.getAttribute("aria-pressed") !== "true")); nums(); });
  $(".go-reset").addEventListener("click", () => { found.clear(); nums(); });
  st.addEventListener("input", nums);
  nums();
})();
