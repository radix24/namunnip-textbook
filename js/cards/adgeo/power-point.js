/* 카드: 원을 지나는 직선을 아무렇게나 그어도 변하지 않는 곱은? — 방멱 PA·PB = |OP² − r²| */
(() => {
  const root = document.getElementById("card-adgeo-power-point");
  if (!root) return;
  const { C } = NM;
  const G = NMTri;
  const $ = (s) => root.querySelector(s);
  const O = [0, 0], r = 1.6;
  let P = [2.4, 0.9], th = [Math.PI + 0.12, Math.PI + 0.62];
  const hit = (k) => { const u = [Math.cos(th[k]), Math.sin(th[k])], f = G.sub(P, O), b = G.dot(f, u), c = G.dot(f, f) - r * r, D = b * b - c; if (D < 0) return null; const s = Math.sqrt(D); return [G.add(P, G.mul(u, -b - s)), G.add(P, G.mul(u, -b + s))]; };
  const handle = (k) => G.add(P, G.mul([Math.cos(th[k]), Math.sin(th[k])], 0.9));
  const pad = G.pad($("canvas"), {
    R: 3,
    handles: () => [["P", P], ["h0", handle(0)], ["h1", handle(1)]],
    move: (who, p) => { if (who === "P") P = p; else { const k = +who[1]; th[k] = Math.atan2(p[1] - P[1], p[0] - P[0]); } say(); },
    draw: (ctx, T, s) => {
      G.circle(ctx, T, s, O, r, C.ink, 2.2); G.dot2(ctx, T, O, C.ink2, 3); G.label(ctx, T, "O", O, C.ink2);
      const cols = ["#3f6fa3", C.warn];
      [0, 1].forEach((k) => {
        const u = [Math.cos(th[k]), Math.sin(th[k])]; G.seg(ctx, T, G.add(P, G.mul(u, -6)), G.add(P, G.mul(u, 6)), "rgba(141,141,146,.5)", 1.2);
        const h = hit(k); if (h) { G.seg(ctx, T, P, h[0], cols[k], 3); G.seg(ctx, T, P, h[1], cols[k], 1.6, [5, 3]); h.forEach((q, j) => { G.dot2(ctx, T, q, cols[k], 4.5); G.label(ctx, T, ["AB", "CD"][k][j], q, cols[k]); }); }
        G.dot2(ctx, T, handle(k), cols[k], 6, true);
      });
      const d = G.dist(O, P);
      if (d > r + 1e-6) { const a = Math.atan2(P[1] - O[1], P[0] - O[0]), b = Math.acos(r / d), Tp = G.add(O, G.mul([Math.cos(a + b), Math.sin(a + b)], r)); G.seg(ctx, T, P, Tp, C.forest, 2.4); G.dot2(ctx, T, Tp, C.forest, 4.5); G.label(ctx, T, "T", Tp, C.forest); }
      G.dot2(ctx, T, P, "#e0a02a", 7); G.label(ctx, T, "P", P, "#b07a10");
    },
  });
  function say() {
    const d = G.dist(O, P), pw = d * d - r * r, h0 = hit(0), h1 = hit(1), f = (h) => (h ? `${G.n(G.dist(P, h[0]), 2)} × ${G.n(G.dist(P, h[1]), 2)} = ${G.n(G.dist(P, h[0]) * G.dist(P, h[1]), 3)}` : "원과 만나지 않음");
    $(".say").textContent = `PA·PB: ${f(h0)} · PC·PD: ${f(h1)} · |OP² − r²| = ${G.n(Math.abs(pw), 3)}` + (pw > 1e-6 ? ` = PT² (P는 원 밖)` : pw < -1e-6 ? " (P는 원 안)" : " (P는 원 위)");
    pad.redraw();
  }
  say();
})();
