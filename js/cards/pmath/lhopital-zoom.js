/* 카드: 0/0 근처를 크게 확대하면 무엇이 남을까? — f, g의 확대 그림과 매개변수 곡선 (g, f)의 선분·접선 */
(() => {
  const root = document.getElementById("card-pmath-lhopital-zoom");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sz = $(".sz");
  const P = {
    sin: { a: 0, f: Math.sin, g: (x) => x, df: Math.cos, dg: () => 1, L: 1 },
    exp: { a: 0, f: (x) => Math.exp(x) - 1, g: (x) => x, df: Math.exp, dg: () => 1, L: 1 },
    log: { a: 1, f: Math.log, g: (x) => x - 1, df: (x) => 1 / x, dg: () => 1, L: 1 },
    cos: { a: 0, f: (x) => 1 - Math.cos(x), g: (x) => x * x, df: Math.sin, dg: (x) => 2 * x, L: 0.5, twice: true },
  };
  let pk = "sin";
  const { ctx, size } = fit($("canvas"), () => draw());
  const R0 = 2.5;
  const half = () => R0 / 10 ** (+sz.value);
  const probe = () => P[pk].a + 0.6 * half();

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], r = half(), a = p.a, x = probe();
    // 왼쪽: f, g
    const lw = w * 0.52;
    let ymax = 0; for (let i = 0; i <= 60; i++) { const t = a - r + 2 * r * i / 60; if (t > 0 || pk !== "log") ymax = Math.max(ymax, Math.abs(p.f(t)), Math.abs(p.g(t))); }
    ymax = ymax * 1.15 || 1;
    const fmt = (v) => n(v, Math.max(0, Math.ceil(-Math.log10(r)) + 1));
    const g1 = G.frame(ctx, lw, h, { xr: [a - r, a + r], yr: [-ymax, ymax], xs: r / 2, ys: ymax / 2, xf: fmt, yf: (v) => n(v, Math.max(1, Math.ceil(-Math.log10(ymax)) + 1)) });
    const dom = (t) => (pk === "log" && t <= 0 ? NaN : t);
    G.curve(ctx, g1, (t) => p.f(dom(t)), C.forest, { width: 2.4 });
    G.curve(ctx, g1, (t) => p.g(dom(t)), BLUE, { width: 2.4 });
    G.dot(ctx, g1, x, p.f(x), C.forest); G.dot(ctx, g1, x, p.g(x), BLUE);
    G.guide(ctx, g1, x, p.f(x), C.ink3, "x");
    G.tag(ctx, g1, "f (분자)", g1.x0 + 4, g1.y0 + 10, C.forest);
    G.tag(ctx, g1, "g (분모)", g1.x0 + 4, g1.y0 + 28, BLUE);
    // 오른쪽: (g(x), f(x)) — 가로세로 같은 축척
    ctx.save(); ctx.translate(lw + 10, 0);
    const rw = w - lw - 10;
    let m = 0; for (let i = 0; i <= 80; i++) { const t = a - r + 2 * r * i / 80; if (pk === "log" && t <= 0) continue; m = Math.max(m, Math.abs(p.f(t)), Math.abs(p.g(t))); }
    m = m * 1.1 || 1;
    const cx = rw / 2, cy = h / 2, S = Math.min(rw, h) / 2 / m * 0.92;
    const Q = (u, v) => [cx + u * S, cy - v * S];
    seg(ctx, cx - rw / 2 + 4, cy, cx + rw / 2 - 4, cy, C.ink3, 1); seg(ctx, cx, 6, cx, h - 6, C.ink3, 1);
    label(ctx, "g", cx + rw / 2 - 10, cy - 10, BLUE, "center", `italic 700 12px ${F.serif}`);
    label(ctx, "f", cx + 10, 14, C.forest, "center", `italic 700 12px ${F.serif}`);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2.2; ctx.beginPath();
    let first = true;
    for (let i = 0; i <= 300; i++) { const t = a - r + 2 * r * i / 300; if (pk === "log" && t <= 0) continue; const [u, v] = Q(p.g(t), p.f(t)); first ? ctx.moveTo(u, v) : ctx.lineTo(u, v); first = false; }
    ctx.stroke();
    // 접선: 기울기 L (원점)
    const L = p.L, ext = m * 1.2;
    const k = Math.min(ext, ext / Math.max(Math.abs(L), 1e-9));
    seg(ctx, ...Q(-k, -L * k), ...Q(k, L * k), C.warn, 1.6, [6, 4]);
    const [u, v] = Q(p.g(x), p.f(x));
    seg(ctx, cx, cy, u, v, C.forest, 2.6);
    dot(ctx, u, v, C.forest); dot(ctx, cx, cy, C.ink, 3.5);
    label(ctx, p.twice ? "접선 기울기 = (f″/g″)(0) = 1/2" : "접선 기울기 = f′(a)/g′(a)", 6, h - 12, C.warn, "left", `600 11px ${F.sans}`);
    ctx.restore();
  }

  function update() {
    const p = P[pk], x = probe();
    $(".z-out").textContent = n(10 ** (+sz.value), 1);
    $(".n-r").textContent = n(p.f(x) / p.g(x), 6);
    $(".n-d").textContent = n(p.df(x) / p.dg(x), 6);
    $(".n-l").textContent = p.twice ? "0/0 → 한 번 더: 1/2" : n(p.L, 4);
    draw();
  }
  G.chips(root, ".presets .chip", (b) => { pk = b.dataset.p; update(); });
  sz.addEventListener("input", update);
  update();
})();
