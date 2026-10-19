/* 카드: 세 꼭짓점에서 그은 세 선분이 한 점에서 만날 조건은? — 체바의 정리, 세 비의 곱 */
(() => {
  const root = document.getElementById("card-adgeo-ceva");
  if (!root) return;
  const { C } = NM;
  const G = NMTri;
  const $ = (s) => root.querySelector(s);
  let A = [-0.3, 2.2], B = [-2.4, -1.6], Cc = [2.4, -1.4], P = [-0.1, -0.2], t = { D: 0.5, E: 0.5, F: 0.5 }, mode = "P";
  /* D는 BC 위(t: B→C), E는 CA 위(C→A), F는 AB 위(A→B) */
  const pos = () => mode === "P" ? { D: G.meet(A, P, B, Cc), E: G.meet(B, P, Cc, A), F: G.meet(Cc, P, A, B) } : { D: G.lerp(B, Cc, t.D), E: G.lerp(Cc, A, t.E), F: G.lerp(A, B, t.F) };
  const pad = G.pad($("canvas"), {
    R: 3,
    handles: () => { const q = pos(); return [["A", A], ["B", B], ["C", Cc], ...(mode === "P" ? [["P", P]] : [["D", q.D], ["E", q.E], ["F", q.F]])]; },
    move: (who, p) => {
      if (who === "A") A = p; else if (who === "B") B = p; else if (who === "C") Cc = p; else if (who === "P") P = p;
      else { const [X, Y] = { D: [B, Cc], E: [Cc, A], F: [A, B] }[who], d = G.sub(Y, X); t[who] = Math.max(0.03, Math.min(0.97, G.dot(G.sub(p, X), d) / G.dot(d, d))); }
      say();
    },
    draw: (ctx, T) => {
      const q = pos();
      G.seg(ctx, T, A, B, C.ink, 2.4); G.seg(ctx, T, B, Cc, C.ink, 2.4); G.seg(ctx, T, Cc, A, C.ink, 2.4);
      if (!q.D || !q.E || !q.F) return;
      G.seg(ctx, T, A, q.D, "#3f6fa3"); G.seg(ctx, T, B, q.E, C.warn); G.seg(ctx, T, Cc, q.F, C.forest);
      const X1 = G.meet(A, q.D, B, q.E), X2 = G.meet(B, q.E, Cc, q.F), X3 = G.meet(Cc, q.F, A, q.D);
      if (X1 && X2 && X3) { const conc = G.dist(X1, X2) + G.dist(X2, X3) < 1e-3; ctx.fillStyle = conc ? "rgba(116,171,102,.35)" : "rgba(212,73,58,.28)"; ctx.beginPath(); ctx.moveTo(...T(X1)); ctx.lineTo(...T(X2)); ctx.lineTo(...T(X3)); ctx.closePath(); ctx.fill(); }
      [["A", A], ["B", B], ["C", Cc]].forEach(([n, p]) => { G.dot2(ctx, T, p, C.ink, 6, true); G.label(ctx, T, n, p); });
      [["D", q.D, "#3f6fa3"], ["E", q.E, C.warn], ["F", q.F, C.forest]].forEach(([n, p, col]) => { G.dot2(ctx, T, p, col, mode === "DEF" ? 6 : 4, mode === "DEF"); G.label(ctx, T, n, p, col); });
      if (mode === "P") { G.dot2(ctx, T, P, "#e0a02a", 6.5); G.label(ctx, T, "P", P, "#b07a10"); }
    },
  });
  function say() {
    const q = pos(); if (!q.D || !q.E || !q.F) { $(".say").textContent = "P를 삼각형 안쪽에 두세요."; pad.redraw(); return; }
    const r1 = G.dist(B, q.D) / G.dist(q.D, Cc), r2 = G.dist(Cc, q.E) / G.dist(q.E, A), r3 = G.dist(A, q.F) / G.dist(q.F, B), pr = r1 * r2 * r3;
    $(".say").textContent = `BD/DC = ${G.n(r1)}, CE/EA = ${G.n(r2)}, AF/FB = ${G.n(r3)} · 곱 = ${G.n(pr)}` + (Math.abs(pr - 1) < 2e-3 ? " · 한 점에서 만남" : " · 한 점에서 만나지 않음(가운데 삼각형)");
    pad.redraw();
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.m === "DEF" && mode === "P") { const q = pos(); if (q.D && q.E && q.F) { t.D = G.dist(B, q.D) / G.dist(B, Cc); t.E = G.dist(Cc, q.E) / G.dist(Cc, A); t.F = G.dist(A, q.F) / G.dist(A, B); } }
    mode = b.dataset.m; root.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); say();
  }));
  say();
})();
