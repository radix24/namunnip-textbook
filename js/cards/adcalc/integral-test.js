/* 카드: Σ1/n²은 유한하고 Σ1/n은 무한한 까닭은? — 막대와 곡선, 적분판정법 */
(() => {
  const root = document.getElementById("card-adcalc-integral-test");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sp = $(".sp"), sN = $(".sN");
  let side = "in";
  const { ctx, size } = fit($("canvas"), () => draw());
  const I = (p, b) => (Math.abs(p - 1) < 1e-9 ? Math.log(b) : (b ** (1 - p) - 1) / (1 - p));
  const Nv = () => Math.round(10 ** +sN.value);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = +sp.value, N = Nv(), XM = 10;
    const g = G.frame(ctx, w, h, { xr: [0, XM + 0.3], yr: [0, 1.15], xs: 1, ys: 0.25, xf: (v) => n(v, 0), yf: (v) => n(v, 2) });
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    for (let k = side === "in" ? 2 : 1; k <= Math.min(N, XM); k++) {
      const x0 = side === "in" ? k - 1 : k, y = k ** -p;
      ctx.fillStyle = side === "in" ? "rgba(59,124,42,.3)" : "rgba(181,83,47,.22)";
      ctx.strokeStyle = side === "in" ? C.forest : C.warn; ctx.lineWidth = 1;
      ctx.fillRect(g.X(x0), g.Y(y), g.X(x0 + 1) - g.X(x0), g.Y(0) - g.Y(y));
      ctx.strokeRect(g.X(x0), g.Y(y), g.X(x0 + 1) - g.X(x0), g.Y(0) - g.Y(y));
    }
    ctx.restore();
    G.curve(ctx, g, (x) => (x <= 0 ? NaN : x ** -p), BLUE, { width: 2.4, from: 0.85 });
    G.tag(ctx, g, `y = 1/x^${n(p, 2)}`, g.X(1.6), g.Y(0.95), BLUE);
    if (N > XM) G.tag(ctx, g, `n = ${N}까지 계속 (그림은 10까지)`, g.x0 + g.w - 4, g.y0 + 10, C.ink3, "right");
  }
  function nums() {
    const p = +sp.value, N = Nv();
    let s = 0; for (let k = 1; k <= N; k++) s += k ** -p;
    $(".p-out").textContent = n(p, 2); $(".N-out").textContent = N;
    $(".n-s").textContent = n(s, 5);
    $(".n-i").textContent = n(I(p, N), 5);
    $(".n-b").textContent = p > 1 ? n(1 + 1 / (p - 1), 5) : "∞";
    draw();
  }
  G.chips(root, ".presets .chip", (b) => { side = b.dataset.s; draw(); });
  [sp, sN].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
