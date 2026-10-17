/* 카드: 두 점까지 거리의 비가 2 : 1인 점은 어디에 모일까? — 아폴로니오스의 원 */
(() => {
  const root = document.getElementById("card-adgeo-apollonius");
  if (!root) return;
  const { C } = NM;
  const G = NMTri;
  const $ = (s) => root.querySelector(s);
  const A = [-1, 0], B = [1, 0], kIn = $(".k");
  let P = [0.5, 1.2], marks = [], show = false;
  const circ = (k) => { if (Math.abs(k - 1) < 1e-9) return null; const c = (k * k + 1) / (k * k - 1), r = (2 * k) / Math.abs(k * k - 1); return { c: [c, 0], r }; };
  const pad = G.pad($("canvas"), {
    R: 2.6, cx: 0.6,
    handles: () => [["P", P]],
    move: (w, p) => { P = p; const k = +kIn.value, ratio = G.dist(P, A) / G.dist(P, B); if (Math.abs(ratio - k) < 0.04 && !marks.some((m) => G.dist(m, P) < 0.08)) marks.push(P.slice()); say(); },
    draw: (ctx, T, s) => {
      const k = +kIn.value, ci = circ(k);
      if (show) { if (ci) G.circle(ctx, T, s, ci.c, ci.r, C.forest, 2.2, [6, 4]); else G.seg(ctx, T, [0, -5], [0, 5], C.forest, 2.2, [6, 4]); }
      G.seg(ctx, T, [-5, 0], [6, 0], C.rule, 1);
      marks.forEach((m) => G.dot2(ctx, T, m, C.forest, 4));
      G.seg(ctx, T, P, A, "#3f6fa3", 2); G.seg(ctx, T, P, B, C.warn, 2);
      G.dot2(ctx, T, A, "#3f6fa3", 6); G.label(ctx, T, "A", A, "#3f6fa3", -8, 14); G.dot2(ctx, T, B, C.warn, 6); G.label(ctx, T, "B", B, C.warn, -4, 14);
      if (show && ci) { const inn = [(k * 1 + 1 * -1) / (k + 1), 0], out = [(k * 1 - 1 * -1) / (k - 1), 0]; [inn, out].forEach((q) => G.dot2(ctx, T, q, C.forest, 5, true)); }
      G.dot2(ctx, T, P, "#e0a02a", 7); G.label(ctx, T, "P", P, "#b07a10");
    },
  });
  function say() {
    const k = +kIn.value, ratio = G.dist(P, A) / G.dist(P, B), ci = circ(k);
    $(".k-out").textContent = G.n(k, 2);
    $(".say").textContent = `PA = ${G.n(G.dist(P, A), 2)}, PB = ${G.n(G.dist(P, B), 2)}, PA : PB = ${G.n(ratio, 2)} : 1 · 찍은 점 ${marks.length}개` + (show ? (ci ? ` · 자취: 중심 (${G.n(ci.c[0], 2)}, 0), 반지름 ${G.n(ci.r, 2)}인 원` : " · 자취: 수직이등분선 x = 0") : "");
    pad.redraw();
  }
  $(".go-show").addEventListener("click", (e) => { show = !show; e.target.setAttribute("aria-pressed", String(show)); say(); });
  $(".go-clr").addEventListener("click", () => { marks = []; say(); });
  kIn.addEventListener("input", () => { marks = []; say(); });
  say();
})();
