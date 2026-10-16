/* 카드: 이항분포를 정규분포로 어림할 때 왜 0.5를 더하고 뺄까? — 연속성 보정 */
(() => {
  const root = document.getElementById("card-pmath-continuity-corr");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n: fm, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sp = $(".sp"), sk1 = $(".sk1"), sk2 = $(".sk2"), cc = $(".go-cc");
  const { ctx, size } = fit($("canvas"), () => draw());
  const range = () => { const a = +sk1.value, b = +sk2.value; return [Math.min(a, b), Math.max(a, b)]; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +sn.value, p = +sp.value, m = n * p, s = Math.sqrt(n * p * (1 - p)), [k1, k2] = range(), on = cc.getAttribute("aria-pressed") === "true";
    const lo = Math.max(0, Math.floor(m - 4.5 * s)), hi = Math.min(n, Math.ceil(m + 4.5 * s));
    let top = 0; for (let k = lo; k <= hi; k++) top = Math.max(top, NMSim.binom(n, k, p));
    const g = G.frame(ctx, w, h, { xr: [lo - 1, hi + 1], yr: [0, top * 1.15], xs: Math.max(1, Math.ceil((hi - lo) / 10)), ys: top > 0.1 ? 0.05 : top > 0.04 ? 0.01 : 0.005, xf: (v) => fm(v, 0), yf: (v) => fm(v, 3) });
    for (let k = lo; k <= hi; k++) {
      const pk = NMSim.binom(n, k, p), inside = k >= k1 && k <= k2;
      ctx.fillStyle = inside ? "rgba(212,73,58,.55)" : "#d9dbd3";
      ctx.fillRect(g.X(k - 0.5) + 0.5, g.Y(pk), g.X(k + 0.5) - g.X(k - 0.5) - 1, g.Y(0) - g.Y(pk));
    }
    // 곡선 아래 넓이
    const a = on ? k1 - 0.5 : k1, b = on ? k2 + 0.5 : k2;
    ctx.fillStyle = "rgba(63,111,163,.28)"; ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0));
    for (let i = 0; i <= 100; i++) { const x = a + (b - a) * i / 100; ctx.lineTo(g.X(x), g.Y(NMSim.npdf(x, m, s))); }
    ctx.lineTo(g.X(b), g.Y(0)); ctx.closePath(); ctx.fill();
    G.curve(ctx, g, (x) => NMSim.npdf(x, m, s), BLUE, { width: 2.2 });
    G.tag(ctx, g, `N(${fm(m, 1)}, ${fm(s, 2)}²)`, g.x0 + g.w - 4, g.y0 + 10, BLUE, "right");
  }
  function update() {
    const n = +sn.value, p = +sp.value, m = n * p, s = Math.sqrt(n * p * (1 - p));
    sk1.max = n; sk2.max = n;
    const [k1, k2] = range();
    $(".n-out").textContent = n; $(".p-out").textContent = fm(p, 2); $(".k1-out").textContent = sk1.value; $(".k2-out").textContent = sk2.value;
    let ex = 0; for (let k = k1; k <= k2; k++) ex += NMSim.binom(n, k, p);
    const Phi = (x) => NMSim.phi((x - m) / s);
    $(".n-x").textContent = fm(ex, 4);
    $(".n-a").textContent = fm(Phi(k2) - Phi(k1), 4);
    $(".n-c").textContent = fm(Phi(k2 + 0.5) - Phi(k1 - 0.5), 4);
    draw();
  }
  cc.addEventListener("click", () => { cc.setAttribute("aria-pressed", String(cc.getAttribute("aria-pressed") !== "true")); draw(); });
  sn.addEventListener("input", () => { const n = +sn.value, p = +sp.value; sk1.value = Math.round(n * p - Math.sqrt(n * p * (1 - p))); sk2.value = Math.round(n * p + Math.sqrt(n * p * (1 - p))); update(); });
  [sp, sk1, sk2].forEach((el) => el.addEventListener("input", update));
  update();
})();
