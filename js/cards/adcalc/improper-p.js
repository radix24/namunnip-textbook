/* 카드: 끝없이 뻗은 꼬리 아래의 넓이는 유한할까? — ∫1^∞ x^−p, ∫0^1 x^−p 의 넓이와 끝에 따른 변화 */
(() => {
  const root = document.getElementById("card-adcalc-improper-p");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sp = $(".sp"), sk = $(".sk");
  let mode = "inf";
  const { ctx, size } = fit($("canvas"), () => draw());

  /* ∫ x^−p from u to v (0 < u < v) */
  const I = (p, u, v) => (Math.abs(p - 1) < 1e-9 ? Math.log(v / u) : (v ** (1 - p) - u ** (1 - p)) / (1 - p));
  const end = () => (mode === "inf" ? 10 ** +sk.value : 10 ** -sk.value);
  const area = (p, e) => (mode === "inf" ? I(p, 1, e) : I(p, e, 1));
  const lim = (p) => (mode === "inf" ? (p > 1 ? 1 / (p - 1) : Infinity) : (p < 1 ? 1 / (1 - p) : Infinity));

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = +sp.value, e = end(), top = h * 0.62;
    const xr = mode === "inf" ? [0, 10] : [0, 1.2], yr = mode === "inf" ? [0, 1.4] : [0, 8];
    const g = G.frame(ctx, w, top, { xr, yr, xs: mode === "inf" ? 1 : 0.2, ys: mode === "inf" ? 0.5 : 2, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    const f = (x) => (x <= 0 ? NaN : x ** -p);
    const a0 = mode === "inf" ? 1 : e, a1 = mode === "inf" ? Math.min(e, xr[1]) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.fillStyle = "rgba(59,124,42,.22)"; ctx.beginPath(); ctx.moveTo(g.X(a0), g.Y(0));
    for (let i = 0; i <= 300; i++) { const x = a0 + (a1 - a0) * i / 300; ctx.lineTo(g.X(x), g.Y(Math.min(f(x), yr[1] * 2))); }
    ctx.lineTo(g.X(a1), g.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
    G.curve(ctx, g, f, BLUE, { width: 2.4, N: 800, from: 0.002 });
    if (mode === "inf" && e > xr[1]) G.tag(ctx, g, `→ b = ${e >= 1000 ? NMAdcSci(e) : n(e, 0)}까지 계속`, g.x0 + g.w - 4, g.Y(0) - 12, C.forest, "right");
    if (mode === "zero") G.tag(ctx, g, `a = ${e < 0.001 ? NMAdcSci(e) : n(e, 4)}`, g.X(Math.max(e, 0.05)) + 4, g.Y(0) - 12, C.forest);
    G.tag(ctx, g, `y = 1/x^${n(p, 2)}`, g.x0 + g.w * 0.5, g.y0 + 10, BLUE);
    // 아래: 끝(로그 눈금) — 넓이
    const bx = 34, by = top + 20, bw = w - 44, bh = h - by - 22;
    const L = lim(p), ymax = Math.min(12, Number.isFinite(L) ? Math.max(L * 1.25, 1) : 12);
    const X = (k) => bx + k / 4 * bw, Y = (v) => by + bh - Math.min(v, ymax) / ymax * bh;
    NM.axes(ctx, { x0: bx, y0: by, w: bw, h: bh, X, Y, xt: [0, 1, 2, 3, 4].map((k) => [k, mode === "inf" ? `10${["⁰", "¹", "²", "³", "⁴"][k]}` : `10${["⁰", "⁻¹", "⁻²", "⁻³", "⁻⁴"][k]}`]), yt: NMSimTicks(ymax) });
    if (Number.isFinite(L)) { ctx.save(); ctx.strokeStyle = C.warn; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(bx, Y(L)); ctx.lineTo(bx + bw, Y(L)); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const k = 4 * i / 200, ee = mode === "inf" ? 10 ** k : 10 ** -k; const v = area(p, ee); i ? ctx.lineTo(X(k), Y(v)) : ctx.moveTo(X(k), Y(v)); }
    ctx.stroke(); ctx.restore();
    const kk = +sk.value; NMPm.dot(ctx, X(kk), Y(area(p, e)), C.forest, 4);
    label(ctx, "넓이", bx + 4, by + 6, C.ink3, "left", `11px ${F.sans}`);
  }
  const NMAdcSci = (v) => { const e = Math.round(Math.log10(v)); return `10^${e}`; };
  const NMSimTicks = (ymax) => { const st = ymax > 6 ? 2 : ymax > 2.5 ? 1 : 0.5; const t = []; for (let v = 0; v <= ymax + 1e-9; v += st) t.push([v, n(v, 1)]); return t; };

  function nums() {
    const p = +sp.value, e = end(), L = lim(p);
    $(".p-out").textContent = n(p, 2);
    $(".k-out").textContent = e >= 1000 || e < 0.001 ? e.toExponential(1).replace("e+", " × 10^").replace("e-", " × 10^−") : n(e, 4);
    $(".n-a").textContent = n(area(p, e), 4);
    $(".n-l").textContent = Number.isFinite(L) ? n(L, 4) : "∞";
    const v = $(".n-v"); v.textContent = Number.isFinite(L) ? "수렴" : "발산"; v.classList.toggle("good", Number.isFinite(L)); v.classList.toggle("bad", !Number.isFinite(L));
    draw();
  }
  G.chips(root, ".mode .chip", (b) => {
    mode = b.dataset.m;
    $(".k-lab").innerHTML = mode === "inf" ? "위끝 b" : "아래끝 a";
    sp.value = mode === "inf" ? 2 : 0.5; sk.value = 1; nums();
  });
  [sp, sk].forEach((s) => s.addEventListener("input", nums));
  $(".k-lab").textContent = "위끝 b";
  nums();
})();
