/* 카드: 삼각형의 세 중심이 한 직선 위에 있을까? — 오일러 직선, HG : GO = 2 : 1, 구점원 */
(() => {
  const root = document.getElementById("card-adgeo-euler-line");
  if (!root) return;
  const { C } = NM;
  const G = NMTri;
  const $ = (s) => root.querySelector(s);
  let P = { A: [-0.6, 2.0], B: [-2.2, -1.4], C: [2.3, -1.2] }, show = { aux: false, nine: false, inc: false };
  const pad = G.pad($("canvas"), {
    R: 3.3,
    handles: () => Object.entries(P),
    move: (who, p) => { P[who] = p; say(); },
    draw: (ctx, T, s) => {
      const { A, B } = P, Cc = P.C, O = G.circum(A, B, Cc), Gc = G.centroid(A, B, Cc), H = G.ortho(A, B, Cc);
      G.seg(ctx, T, A, B, C.ink, 2.4); G.seg(ctx, T, B, Cc, C.ink, 2.4); G.seg(ctx, T, Cc, A, C.ink, 2.4);
      if (!O) return;
      G.circle(ctx, T, s, O, G.dist(O, A), "rgba(141,141,146,.7)", 1.2);
      if (show.aux) {
        [[A, B], [B, Cc], [Cc, A]].forEach(([X, Y]) => { const M = G.lerp(X, Y, 0.5); G.seg(ctx, T, M, O, "rgba(63,111,163,.6)", 1.2, [4, 3]); });
        [[A, B, Cc], [B, Cc, A], [Cc, A, B]].forEach(([V, X, Y]) => { G.seg(ctx, T, V, G.lerp(X, Y, 0.5), "rgba(59,124,42,.6)", 1.2, [4, 3]); G.seg(ctx, T, V, G.foot(V, X, Y), "rgba(181,83,47,.6)", 1.2, [4, 3]); });
      }
      if (show.nine) {
        const N = G.lerp(O, H, 0.5), r = G.dist(O, A) / 2; G.circle(ctx, T, s, N, r, "#7b5ea7", 2);
        const pts = [[A, B], [B, Cc], [Cc, A]].map(([X, Y]) => G.lerp(X, Y, 0.5)).concat([[A, B, Cc], [B, Cc, A], [Cc, A, B]].map(([V, X, Y]) => G.foot(V, X, Y)), [A, B, Cc].map((V) => G.lerp(V, H, 0.5)));
        pts.forEach((p) => G.dot2(ctx, T, p, "#7b5ea7", 3.5)); G.dot2(ctx, T, N, "#7b5ea7", 4); G.label(ctx, T, "N", N, "#7b5ea7");
      }
      // 오일러 직선
      const d = G.sub(H, O), L = G.len(d);
      if (L > 1e-6) { const u = G.mul(d, 1 / L); G.seg(ctx, T, G.add(O, G.mul(u, -8)), G.add(O, G.mul(u, 8)), "#e0a02a", 2.4); }
      if (show.inc) { const I = G.incenter(A, B, Cc); G.dot2(ctx, T, I, C.ink2, 4.5); G.label(ctx, T, "I", I, C.ink2); }
      [["O", O, "#3f6fa3"], ["G", Gc, C.forest], ["H", H, C.warn]].forEach(([n, p, col]) => { G.dot2(ctx, T, p, col, 5.5); G.label(ctx, T, n, p, col); });
      Object.entries(P).forEach(([n, p]) => { G.dot2(ctx, T, p, C.ink, 6, true); G.label(ctx, T, n, p, C.ink, -18, -10); });
    },
  });
  function say() {
    const { A, B } = P, Cc = P.C, O = G.circum(A, B, Cc), Gc = G.centroid(A, B, Cc), H = G.ortho(A, B, Cc);
    if (!O) { $(".say").textContent = "세 점이 한 직선 위에 있습니다."; pad.redraw(); return; }
    const col = Math.abs(G.cross(G.sub(Gc, O), G.sub(H, O))) < 1e-9, hg = G.dist(H, Gc), go = G.dist(Gc, O);
    const angs = [G.angleAt(A, B, Cc), G.angleAt(B, Cc, A), G.angleAt(Cc, A, B)], mx = Math.max(...angs);
    $(".say").textContent = `O, G, H ${col ? "한 직선 위" : "한 직선 위 아님"} · HG = ${G.n(hg)}, GO = ${G.n(go)}` + (go > 1e-6 ? `, HG : GO = ${G.n(hg / go)} : 1` : " (정삼각형: 모두 한 점)") + ` · 가장 큰 각 ${G.n(mx, 1)}° (${mx > 90.05 ? "둔각" : mx > 89.95 ? "직각" : "예각"}삼각형)`;
    pad.redraw();
  }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { show[b.dataset.s] = !show[b.dataset.s]; b.setAttribute("aria-pressed", String(show[b.dataset.s])); pad.redraw(); }));
  say();
})();
