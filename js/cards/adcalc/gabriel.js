/* 카드: 채울 수는 있는데 칠할 수는 없는 나팔이 있을까? — 가브리엘의 나팔, 부피 π와 발산하는 겉넓이 */
(() => {
  const root = document.getElementById("card-adcalc-gabriel");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sb = $(".sb");
  const { ctx, size } = fit($("canvas"), () => draw());
  const V = (b) => Math.PI * (1 - 1 / b);
  /* x = e^u 로 바꾸면 S = 2π ∫0^ln b √(1 + e^−4u) du */
  const S = (b) => 2 * Math.PI * A.simpson((u) => Math.sqrt(1 + Math.exp(-4 * u)), 0, Math.log(b), 400);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const b = 10 ** +sb.value, th = h * 0.5;
    // 위: 나팔 (x: 1 ~ 10 화면, 반지름 1/x)
    const x0 = 24, XS = (w - 64) / 9, cy = th / 2 + 4, RS = th * 0.42;
    const X = (x) => x0 + (x - 1) * XS, rr = (x) => RS / x;
    const xe = Math.min(b, 10);
    ctx.fillStyle = "rgba(63,111,163,.14)"; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const x = 1 + (xe - 1) * i / 200; ctx.lineTo(X(x), cy - rr(x)); }
    for (let i = 200; i >= 0; i--) { const x = 1 + (xe - 1) * i / 200; ctx.lineTo(X(x), cy + rr(x)); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    [1, -1].forEach((sg) => { ctx.beginPath(); for (let i = 0; i <= 200; i++) { const x = 1 + (xe - 1) * i / 200; i ? ctx.lineTo(X(x), cy - sg * rr(x)) : ctx.moveTo(X(x), cy - sg * rr(x)); } ctx.stroke(); });
    [1, 2, 4, 7].filter((x) => x <= xe).forEach((x) => { ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 1; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.ellipse(X(x), cy, rr(x) * 0.25, rr(x), 0, 0, 7); ctx.stroke(); ctx.restore(); });
    ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(1) - 8, cy); ctx.lineTo(w - 6, cy); ctx.stroke(); ctx.restore();
    if (b > 10) label(ctx, `→ x = ${b >= 1e3 ? `10^${n(+sb.value, 1)}` : n(b, 0)}까지 계속`, w - 8, cy - 14, C.ink2, "right", `600 11px ${F.sans}`);
    label(ctx, "x = 1", X(1), th - 4, C.ink3, "center", `10px ${F.mono}`); label(ctx, "x = 10", X(10), th - 4, C.ink3, "center", `10px ${F.mono}`);
    // 아래: log b — V, S
    const gx = 34, gy = th + 12, gw = w - 44, gh = h - gy - 22, ymax = 100;
    const GX = (k) => gx + k / 6 * gw, GY = (v) => gy + gh - Math.min(v, ymax) / ymax * gh;
    NM.axes(ctx, { x0: gx, y0: gy, w: gw, h: gh, X: GX, Y: GY, xt: [0, 1, 2, 3, 4, 5, 6].map((k) => [k, `10${["⁰", "¹", "²", "³", "⁴", "⁵", "⁶"][k]}`]), yt: [0, 25, 50, 75, 100].map((v) => [v, String(v)]) });
    const line = (f, col) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const k = 6 * i / 120; i ? ctx.lineTo(GX(k), GY(f(10 ** k))) : ctx.moveTo(GX(k), GY(f(10 ** k))); } ctx.stroke(); ctx.restore(); };
    line(S, C.warn); line(V, C.forest);
    const k = +sb.value; dot(ctx, GX(k), GY(S(b)), C.warn, 4); dot(ctx, GX(k), GY(V(b)), C.forest, 4);
    label(ctx, "겉넓이", gx + gw - 4, GY(S(1e6)) + 14, C.warn, "right", `600 11px ${F.sans}`);
    label(ctx, "부피 → π", gx + gw - 4, GY(V(1e6)) - 10, C.forest, "right", `600 11px ${F.sans}`);
  }
  function nums() {
    const b = 10 ** +sb.value;
    $(".b-out").textContent = b >= 1e4 ? b.toExponential(1).replace("e+", " × 10^") : n(b, 1);
    $(".n-v").textContent = n(V(b), 5);
    $(".n-s").textContent = n(S(b), 3);
    $(".n-l").textContent = n(2 * Math.PI * Math.log(b), 3);
    draw();
  }
  sb.addEventListener("input", nums);
  nums();
})();
