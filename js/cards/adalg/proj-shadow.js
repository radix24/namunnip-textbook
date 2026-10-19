/* 카드: 비탈에서 썰매를 끄는 힘 중 얼마가 일을 할까? — 비탈 방향 정사영 (마찰 없는 모형) */
(() => {
  const root = document.getElementById("card-adalg-proj-shadow");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, label, dot, seg, deg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const al = $(".al");
  let Fv = [3, 2.5], pl = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const u = () => { const t = (+al.value * Math.PI) / 180; return [Math.cos(t), Math.sin(t)]; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pl = L.plane(ctx, { x: 0, y: 0, w, h }, 4.2, { ox: -1.6, oy: -1.2 });
    const U = u(), p = L.scl(U, L.dot(Fv, U)), perp = L.sub(Fv, p), N = [-U[1], U[0]];
    // 비탈과 땅
    ctx.fillStyle = "rgba(141,141,146,.18)"; ctx.beginPath();
    ctx.moveTo(...pl.P(...L.scl(U, -6))); ctx.lineTo(...pl.P(...L.scl(U, 9))); ctx.lineTo(...pl.P(...L.add(L.scl(U, 9), [0, -9]))); ctx.lineTo(...pl.P(...L.add(L.scl(U, -6), [0, -9]))); ctx.closePath(); ctx.fill();
    seg(ctx, ...pl.P(...L.scl(U, -6)), ...pl.P(...L.scl(U, 9)), C.ink2, 2);
    // 빛줄기(비탈에 수직)
    ctx.save(); ctx.globalAlpha = 0.35;
    for (let k = -1; k <= 7; k++) { const q = L.scl(U, k * 0.8); NMPm.arrow(ctx, ...pl.P(...L.add(q, L.scl(N, 4.2))), ...pl.P(...L.add(q, L.scl(N, 0.15))), C.amber, 1, 6); }
    ctx.restore();
    // 썰매
    const box = [[-0.9, 0], [0.1, 0], [0.1, 0.45], [-0.9, 0.45]].map(([s, t]) => L.add(L.scl(U, s), L.scl(N, t)));
    ctx.fillStyle = "rgba(63,111,163,.25)"; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5;
    ctx.beginPath(); box.forEach((q, i) => (i ? ctx.lineTo(...pl.P(...q)) : ctx.moveTo(...pl.P(...q)))); ctx.closePath(); ctx.fill(); ctx.stroke();
    // 성분
    seg(ctx, ...pl.P(...p), ...pl.P(...Fv), C.warn, 1.6, [5, 4]);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...p), C.forest, 4);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...perp), C.warn, 1.8);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...Fv), C.ink, 2.6);
    // 직각 표시
    const r = 0.25, c0 = L.add(p, L.scl(U, -Math.sign(L.dot(Fv, U)) * r)), c1 = L.add(c0, L.scl(N, Math.sign(L.dot(Fv, N)) * r)), c2 = L.add(p, L.scl(N, Math.sign(L.dot(Fv, N)) * r));
    if (Math.abs(L.dot(Fv, N)) > 0.3 && Math.abs(L.dot(Fv, U)) > 0.3) { ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...pl.P(...c0)); ctx.lineTo(...pl.P(...c1)); ctx.lineTo(...pl.P(...c2)); ctx.stroke(); }
    label(ctx, "F", pl.P(...Fv)[0] + 9, pl.P(...Fv)[1] - 9, C.ink, "left", `italic 700 15px ${F.serif}`);
    label(ctx, "proj", pl.P(...p)[0] + 6, pl.P(...p)[1] + 14, C.forest, "left", `600 12px ${F.sans}`);
    dot(ctx, ...pl.P(...Fv), C.ink, 6, true);
  }
  function update() {
    const U = u(), fu = L.dot(Fv, U);
    $(".al-out").textContent = al.value;
    $(".n-f").textContent = `${L.n(L.norm(Fv) * 10, 1)} N`;
    $(".n-p").textContent = `${L.n(fu * 10, 1)} N (각 ${L.n(deg(Math.acos(Math.max(-1, Math.min(1, fu / (L.norm(Fv) || 1))))), 0)}°)`;
    $(".n-w").textContent = `${L.n(fu * 10 * 10, 0)} J`;
    draw();
  }
  drag(cv, (x, y) => (pl && Math.hypot(x - pl.P(...Fv)[0], y - pl.P(...Fv)[1]) < 18 ? "F" : null), (who, x, y) => {
    let q = pl.inv(x, y); const m = L.norm(q); if (m > 5) q = L.scl(q, 5 / m);
    Fv = q.map((v) => Math.round(v * 10) / 10); update();
  }, null, "none");
  al.addEventListener("input", update);
  update();
})();
