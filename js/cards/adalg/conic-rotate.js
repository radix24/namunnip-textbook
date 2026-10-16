/* 카드: xy항이 있는 이차곡선은 어떻게 표준형으로 바꿀까? — ax² + 2bxy + cy² = 36, 좌표축을 고유벡터로 돌리기 */
(() => {
  const root = document.getElementById("card-adalg-conic-rotate");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, seg, BLUE, deg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const K = 36, sl = [...root.querySelectorAll("[data-m]")], out = [...root.querySelectorAll("[data-o]")], sIn = $(".s");
  const { ctx, size } = fit($("canvas"), () => draw());
  const A = () => { const [a, b, c] = sl.map((el) => +el.value); return [[a, b], [b, c]]; };
  /* 고윳값·고유벡터(첫 고유벡터가 x축과 이루는 각이 −90° ~ 90°가 되게) */
  function eig() {
    const e = L.eig2(A()); let u = e.vecs[0]; if (u[0] < 0) u = L.scl(u, -1);
    return { l: e.vals, u, v: [-u[1], u[0]], th: Math.atan2(u[1], u[0]) };
  }
  /* 새 좌표의 곡선 λ₁X² + λ₂Y² = K를 점 목록(여러 조각)으로 */
  function pieces(l1, l2) {
    const P = [], N = 200, E = 1e-9;
    if (l1 > E && l2 > E) P.push([...Array(N + 1)].map((_, k) => { const t = (2 * Math.PI * k) / N; return [Math.sqrt(K / l1) * Math.cos(t), Math.sqrt(K / l2) * Math.sin(t)]; }));
    else if (l1 > E && l2 < -E) [1, -1].forEach((s) => P.push([...Array(N + 1)].map((_, k) => { const t = -3 + (6 * k) / N; return [s * Math.sqrt(K / l1) * Math.cosh(t), Math.sqrt(K / -l2) * Math.sinh(t)]; })));
    else if (l1 < -E && l2 > E) [1, -1].forEach((s) => P.push([...Array(N + 1)].map((_, k) => { const t = -3 + (6 * k) / N; return [Math.sqrt(K / -l1) * Math.sinh(t), s * Math.sqrt(K / l2) * Math.cosh(t)]; })));
    else if (l1 > E && Math.abs(l2) <= E) [1, -1].forEach((s) => P.push([[s * Math.sqrt(K / l1), -20], [s * Math.sqrt(K / l1), 20]]));
    else if (l2 > E && Math.abs(l1) <= E) [1, -1].forEach((s) => P.push([[-20, s * Math.sqrt(K / l2)], [20, s * Math.sqrt(K / l2)]]));
    return P;
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 8, { bare: true }), { l, u, v, th } = eig(), s = +sIn.value / 100;
    // 돌아가는 좌표축과 격자
    const a = th * s, U = [Math.cos(a), Math.sin(a)], V = [-Math.sin(a), Math.cos(a)];
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    for (let k = -12; k <= 12; k++) { if (!k) continue; ctx.beginPath(); ctx.moveTo(...pl.P(...L.add(L.scl(U, k), L.scl(V, -14)))); ctx.lineTo(...pl.P(...L.add(L.scl(U, k), L.scl(V, 14)))); ctx.moveTo(...pl.P(...L.add(L.scl(V, k), L.scl(U, -14)))); ctx.lineTo(...pl.P(...L.add(L.scl(V, k), L.scl(U, 14)))); ctx.stroke(); }
    ctx.restore();
    seg(ctx, ...pl.P(...L.scl(U, -14)), ...pl.P(...L.scl(U, 14)), C.warn, 1.6);
    seg(ctx, ...pl.P(...L.scl(V, -14)), ...pl.P(...L.scl(V, 14)), C.forest, 1.6);
    label(ctx, s > 0.99 ? "X" : "x", pl.P(...L.scl(U, 7.2))[0], pl.P(...L.scl(U, 7.2))[1] - 10, C.warn, "center", `italic 700 13px ${F.serif}`);
    label(ctx, s > 0.99 ? "Y" : "y", pl.P(...L.scl(V, 7.2))[0] + 10, pl.P(...L.scl(V, 7.2))[1], C.forest, "left", `italic 700 13px ${F.serif}`);
    // 곡선: 새 좌표 (X, Y) → x = X u + Y v
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4;
    pieces(l[0], l[1]).forEach((pc) => { ctx.beginPath(); pc.forEach(([X, Y], k) => { const p = pl.P(...L.add(L.scl(u, X), L.scl(v, Y))); k ? ctx.lineTo(...p) : ctx.moveTo(...p); }); ctx.stroke(); });
    ctx.restore();
  }
  function update() {
    sl.forEach((el, i) => (out[i].textContent = L.frac(+el.value)));
    $(".s-out").textContent = sIn.value;
    const [[a, b], [, c]] = A(), { l, th } = eig(), f = (x) => L.frac(x), d = a * c - b * b;
    $(".eq").textContent = `${f(a)}x² ${2 * b < 0 ? "−" : "+"} ${f(Math.abs(2 * b))}xy ${c < 0 ? "−" : "+"} ${f(Math.abs(c))}y² = ${K} · det A = ${f(d)}`;
    const kind = l[0] > 1e-9 && l[1] > 1e-9 ? "타원" : l[0] * l[1] < -1e-9 ? "쌍곡선" : Math.max(...l) > 1e-9 ? "평행한 두 직선" : "그래프 없음";
    $(".std").textContent = `새 축: ${L.n(deg(th), 1)}° 회전 → ${L.n(l[0], 3)}X² ${l[1] < 0 ? "−" : "+"} ${L.n(Math.abs(l[1]), 3)}Y² = ${K} · ${kind}`;
    draw();
  }
  [...sl, sIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
