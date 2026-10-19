/* 카드: 극한을 L로 놓고 방정식을 풀면 끝일까? — 증명 조립과 거미줄 그림 */
(() => {
  const root = document.getElementById("card-adcalc-monotone-proof");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  let stage = -1, fk = "nest";
  const F = { nest: { g: (x) => Math.sqrt(2 + x), a1: Math.SQRT2, r: [0, 3] }, dbl: { g: (x) => 2 * x, a1: 1, r: [0, 9] } };
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = F[fk], [lo, hi] = p.r;
    const g = G.frame(ctx, w, h, { xr: [lo, hi], yr: [lo, hi], xs: hi > 5 ? 2 : 0.5, ys: hi > 5 ? 2 : 0.5, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    G.curve(ctx, g, (x) => x, C.ink3, { width: 1.4, dash: [4, 4] });
    G.curve(ctx, g, p.g, BLUE, { width: 2.4 });
    const show = fk === "dbl" ? 6 : stage + 1;   // 단계 수만큼 거미줄을 그린다
    let x = p.a1;
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(g.X(x), g.Y(lo));
    for (let i = 0; i < Math.max(0, show) * 2; i++) { const y = p.g(x); ctx.lineTo(g.X(x), g.Y(y)); ctx.lineTo(g.X(y), g.Y(y)); x = y; }
    ctx.stroke(); ctx.restore();
    if (fk === "nest") {
      if (stage >= 0) G.curve(ctx, g, () => 2, C.forest, { width: 1.2, dash: [2, 3] });
      if (stage >= 4) G.dot(ctx, g, 2, 2, C.forest, false, 5);
      G.tag(ctx, g, "y = √(2 + x)", g.x0 + 4, g.y0 + 10, BLUE);
      if (stage >= 0) G.tag(ctx, g, "천장 y = 2", g.x0 + 4, g.Y(2) - 10, C.forest);
    } else {
      G.dot(ctx, g, 0, 0, C.warn, true, 5);
      G.tag(ctx, g, "y = 2x — L = 0은 후보일 뿐", g.x0 + 4, g.y0 + 10, BLUE);
    }
  }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d", "e"], onStep(i) { stage = i; draw(); } });
  G.chips(root, ".presets .chip[data-f]", (b) => { fk = b.dataset.f; draw(); });
  draw();
})();
