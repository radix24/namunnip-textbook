/* 카드: 가장 가까운 이웃 하나만 믿어도 될까, 여럿에게 물어볼까? — k-최근접 이웃 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-knn");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), mapIn = $(".map"), cv = $("canvas"), COL = ["#e0a02a", "#3f6fa3"], NAME = ["고양이", "강아지"];
  /* 고양이: 둥근 정도 높고 털 길이 다양 / 강아지: 둥근 정도 낮음 — 가상. 강아지 무리 안에 잘못 표시된 고양이 1개 */
  const r = A.rng(5), D = [];
  for (let i = 0; i < 22; i++) D.push([[0.65 + 0.12 * A.gauss(r), 0.45 + 0.18 * A.gauss(r)], 0]);
  for (let i = 0; i < 22; i++) D.push([[0.35 + 0.12 * A.gauss(r), 0.55 + 0.18 * A.gauss(r)], 1]);
  D.push([[0.3, 0.6], 0]);
  D.forEach((d) => { d[0][0] = Math.max(0.03, Math.min(0.97, d[0][0])); d[0][1] = Math.max(0.03, Math.min(0.97, d[0][1])); });
  let q = [0.33, 0.62], P = null;
  const knn = (p, k) => { const s = D.map((d, i) => [A.dist(d[0], p), i]).sort((a, b) => a[0] - b[0]).slice(0, k), v = [0, 0]; s.forEach(([, i]) => v[D[i][1]]++); return { s, v, c: v[0] > v[1] ? 0 : 1 }; };
  const { ctx, size } = fit(cv, () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    P = E.frame(ctx, size, { x0: 0, x1: 1, y0: 0, y1: 1, xt: [[0, "0"], [0.5, "0.5"], [1, "1"]], yt: [[0, "0"], [0.5, "0.5"], [1, "1"]], xlab: "둥근 정도", ylab: "털 길이", L: 30 });
    const k = +kIn.value;
    if (mapIn.checked) { const cell = 8; for (let px = P.L; px < P.L + P.w; px += cell) for (let py = P.T; py < P.T + P.h; py += cell) { ctx.fillStyle = knn(P.inv(px + cell / 2, py + cell / 2), k).c ? "rgba(63,111,163,.13)" : "rgba(224,160,42,.16)"; ctx.fillRect(px, py, cell, cell); } }
    const res = knn(q, k);
    ctx.save(); ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; res.s.forEach(([, i]) => { ctx.beginPath(); ctx.moveTo(P.X(q[0]), P.Y(q[1])); ctx.lineTo(P.X(D[i][0][0]), P.Y(D[i][0][1])); ctx.stroke(); }); ctx.restore();
    D.forEach(([p, c]) => E.dot(ctx, P, p[0], p[1], COL[c], 5));
    res.s.forEach(([, i]) => { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(P.X(D[i][0][0]), P.Y(D[i][0][1]), 8, 0, 7); ctx.stroke(); ctx.restore(); });
    const x = P.X(q[0]), y = P.Y(q[1]); ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); for (let t = 0; t < 10; t++) { const rr = t % 2 ? 4.5 : 10, a = -Math.PI / 2 + (t * Math.PI) / 5; ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function update() {
    const k = +kIn.value, res = knn(q, k);
    $(".k-out").textContent = k;
    $(".say").textContent = `가까운 ${k}개: 고양이 ${res.v[0]}표, 강아지 ${res.v[1]}표 → ${NAME[res.c]}` + (k === 1 ? " · 가장 가까운 하나만 봅니다" : "");
    draw();
  }
  A.drag(cv, () => P, (x, y, PP) => (Math.hypot(PP.X(q[0]) - x, PP.Y(q[1]) - y) < 24 ? 0 : -1), (_, gx, gy) => { q = [Math.max(0, Math.min(1, gx)), Math.max(0, Math.min(1, gy))]; update(); });
  [kIn, mapIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
