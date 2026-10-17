/* 카드: 원에 내접하는 사각형의 두 대각선의 곱은 무엇과 같을까? — 톨레미의 정리와 부등식 */
(() => {
  const root = document.getElementById("card-adgeo-ptolemy");
  if (!root) return;
  const { C } = NM;
  const G = NMTri;
  const $ = (s) => root.querySelector(s);
  const r = 2;
  let ang = { A: 2.2, B: 3.5, C: 5.2, D: 0.6 }, off = false, Dfree = null;
  const onC = (a) => [r * Math.cos(a), r * Math.sin(a)];
  const pos = (k) => (k === "D" && off && Dfree ? Dfree : onC(ang[k]));
  const pad = G.pad($("canvas"), {
    R: 2.9,
    handles: () => ["A", "B", "C", "D"].map((k) => [k, pos(k)]),
    move: (who, p) => { if (who === "D" && off) Dfree = p; else ang[who] = Math.atan2(p[1], p[0]); say(); },
    draw: (ctx, T, s) => {
      G.circle(ctx, T, s, [0, 0], r, C.ink3, 1.5);
      const [A, B, Cc, D] = ["A", "B", "C", "D"].map(pos);
      ctx.fillStyle = "rgba(63,111,163,.1)"; ctx.beginPath(); [A, B, Cc, D].forEach((p, i) => (i ? ctx.lineTo(...T(p)) : ctx.moveTo(...T(p)))); ctx.closePath(); ctx.fill();
      [[A, B], [B, Cc], [Cc, D], [D, A]].forEach(([p, q], i) => G.seg(ctx, T, p, q, i % 2 ? C.warn : "#3f6fa3", 2.6));
      G.seg(ctx, T, A, Cc, C.forest, 2.2, [6, 4]); G.seg(ctx, T, B, D, C.forest, 2.2, [6, 4]);
      [["A", A], ["B", B], ["C", Cc], ["D", D]].forEach(([n, p]) => { G.dot2(ctx, T, p, C.ink, 6, true); G.label(ctx, T, n, p); });
    },
  });
  function say() {
    const [A, B, Cc, D] = ["A", "B", "C", "D"].map(pos), d = G.dist;
    const lhs = d(A, Cc) * d(B, D), rhs = d(A, B) * d(Cc, D) + d(A, D) * d(B, Cc);
    $(".say").textContent = `AC·BD = ${G.n(lhs)} · AB·CD + AD·BC = ${G.n(rhs)}` + (Math.abs(lhs - rhs) < 1e-6 ? " · 같음" : lhs < rhs ? " · 왼쪽이 더 작음(톨레미 부등식)" : " · 순서를 확인하세요(A, B, C, D가 차례로 있어야 함)");
    pad.redraw();
  }
  $(".go-off").addEventListener("click", (e) => { off = !off; Dfree = off ? G.mul(onC(ang.D), 1.25) : null; e.target.setAttribute("aria-pressed", String(off)); say(); });
  $(".go-sq").addEventListener("click", () => { off = false; Dfree = null; $(".go-off").setAttribute("aria-pressed", "false"); ang = { A: Math.PI - 0.6, B: Math.PI + 0.6, C: -0.6, D: 0.6 }; say(); const [A, B, Cc] = ["A", "B", "C"].map(pos); $(".say").textContent += ` · 직사각형: AC² = ${G.n(G.dist(A, Cc) ** 2)} = AB² + BC² = ${G.n(G.dist(A, B) ** 2 + G.dist(B, Cc) ** 2)}`; });
  say();
})();
