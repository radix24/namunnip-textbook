/* 카드: 더했다 뺐다를 되풀이하면 어디로 모일까? — 교대급수의 부분합, 오차 범위, 절댓값의 급수 */
(() => {
  const root = document.getElementById("card-adcalc-alt-zigzag");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), NM_ = 60;
  const P = {
    h: { a: (k) => 1 / k, S: Math.LN2, abs: "발산", v: "조건수렴" },
    leib: { a: (k) => 1 / (2 * k - 1), S: Math.PI / 4, abs: "발산", v: "조건수렴" },
    sq: { a: (k) => 1 / (k * k), S: Math.PI ** 2 / 12, abs: "수렴", v: "절대수렴" },
    div: { a: (k) => k / (k + 1), S: null, abs: "발산", v: "발산" },
  };
  let pk = "h";
  const { ctx, size } = fit($("canvas"), () => draw());
  const S = (k) => { let s = 0; for (let i = 1; i <= k; i++) s += (i % 2 ? 1 : -1) * P[pk].a(i); return s; };
  const SA = (k) => { let s = 0; for (let i = 1; i <= k; i++) s += P[pk].a(i); return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], N = +sn.value;
    const g = G.frame(ctx, w, h, { xr: [0, NM_ + 1], yr: [-0.1, 1.6], xs: 10, ys: 0.25, xf: (v) => n(v, 0), yf: (v) => n(v, 2) });
    // 절댓값 급수
    const abs = []; for (let k = 1; k <= NM_; k++) abs.push([k, SA(k)]);
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.4; ctx.beginPath(); abs.forEach(([k, v], i) => (i ? ctx.lineTo(g.X(k), g.Y(v)) : ctx.moveTo(g.X(k), g.Y(v)))); ctx.stroke();
    // 오차 띠: S_N ± a_{N+1}
    const sN = S(N), aN = p.a(N + 1);
    ctx.fillStyle = "rgba(59,124,42,.15)"; ctx.fillRect(g.x0, g.Y(sN + aN), g.w, g.Y(sN - aN) - g.Y(sN + aN));
    ctx.restore();
    if (p.S != null) G.curve(ctx, g, () => p.S, C.warn, { width: 1.4, dash: [5, 4] });
    ctx.strokeStyle = BLUE; ctx.lineWidth = 1.8; ctx.beginPath();
    for (let k = 1; k <= N; k++) { const v = S(k); k > 1 ? ctx.lineTo(g.X(k), g.Y(v)) : ctx.moveTo(g.X(k), g.Y(v)); }
    ctx.stroke();
    for (let k = 1; k <= N; k++) G.dot(ctx, g, k, S(k), BLUE, false, 2.6);
    G.tag(ctx, g, "초록 띠: S(n) ± a(n+1)", g.x0 + g.w - 4, g.y0 + g.h - 10, C.forest, "right");
    G.tag(ctx, g, `회색: Σ|a(n)| — ${p.abs}`, g.x0 + g.w - 4, g.y0 + 10, C.ink3, "right");
  }
  function nums() {
    const p = P[pk], N = +sn.value, sN = S(N);
    $(".n-out").textContent = N;
    $(".n-s").textContent = n(sN, 5);
    $(".n-e").textContent = p.S == null ? "—" : n(Math.abs(p.S - sN), 5);
    $(".n-a").textContent = n(p.a(N + 1), 5);
    const v = $(".n-v"); v.textContent = p.v; v.classList.toggle("bad", p.v === "발산"); v.classList.toggle("good", p.v === "절대수렴");
    draw();
  }
  G.chips(root, ".presets .chip", (b) => { pk = b.dataset.p; nums(); });
  sn.addEventListener("input", nums);
  nums();
})();
