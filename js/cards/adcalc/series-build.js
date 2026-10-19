/* 카드: 1/(1 − x) 하나로 ln(1 + x)와 tan⁻¹x의 급수를 만들 수 있을까? — 계수 배열과 함수를 함께 변형 */
(() => {
  const root = document.getElementById("card-adcalc-series-build");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict"), K = 24;   // 계수를 24차까지 들고 다닌다
  const T = {
    ln: { f: (x) => Math.log(1 + x), c: Array.from({ length: K }, (_, k) => (k ? (k % 2 ? 1 : -1) / k : 0)) },
    atan: { f: Math.atan, c: Array.from({ length: K }, (_, k) => (k % 2 ? ((k - 1) / 2 % 2 ? -1 : 1) / k : 0)) },
    sq: { f: (x) => 1 / (1 - x) ** 2, c: Array.from({ length: K }, (_, k) => k + 1) },
    x2: { f: (x) => x / (1 + x * x), c: Array.from({ length: K }, (_, k) => (k % 2 ? ((k - 1) / 2 % 2 ? -1 : 1) : 0)) },
  };
  let tk = "ln", cur;
  const done = new Set();
  const start = () => ({ f: (x) => 1 / (1 - x), c: Array(K).fill(1), hist: [] });
  const { ctx, size } = fit($("canvas"), () => draw());

  const OPS = {
    neg: (s) => ({ f: (x) => s.f(-x), c: s.c.map((v, k) => (k % 2 ? -v : v)), name: "x→−x" }),
    sq: (s) => { const c = Array(K).fill(0); s.c.forEach((v, k) => { if (2 * k < K) c[2 * k] = v; }); return { f: (x) => s.f(x * x), c, name: "x→x²" }; },
    mul: (s) => { const c = Array(K).fill(0); s.c.forEach((v, k) => { if (k + 1 < K) c[k + 1] = v; }); return { f: (x) => x * s.f(x), c, name: "×x" }; },
    d: (s) => ({ f: (x) => (s.f(x + 1e-5) - s.f(x - 1e-5)) / 2e-5, c: s.c.map((_, k) => (k + 1 < K ? (k + 1) * s.c[k + 1] : 0)), name: "미분" }),
    i: (s) => { const c = Array(K).fill(0); s.c.forEach((v, k) => { if (k + 1 < K) c[k + 1] = v / (k + 1); }); /* 피적분함수가 0과 x 사이에서 터지면(두 간격의 결과가 어긋나면) 값을 두지 않는다 */
      return { f: (x) => { const a = A.simpson(s.f, 0, x, 60), b = A.simpson(s.f, 0, x, 120); return Number.isFinite(a) && Math.abs(a - b) <= 1e-3 * (1 + Math.abs(b)) ? b : NaN; }, c, name: "적분" }; },
  };
  /* 분수로 보이기 (분모 60 이하) */
  function frac(v) {
    if (Math.abs(v) < 1e-12) return "0";
    for (let q = 1; q <= 60; q++) { const p = Math.round(v * q); if (Math.abs(p / q - v) < 1e-9) return q === 1 ? String(p) : `${p}/${q}`; }
    return n(v, 3);
  }
  function text(c) {
    const parts = [];
    for (let k = 0; k <= 8; k++) {
      const v = c[k]; if (Math.abs(v) < 1e-12) continue;
      const pw = k === 0 ? "" : k === 1 ? "x" : `x${["", "", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸"][k]}`;
      const f = frac(Math.abs(v)), coef = k && f === "1" ? "" : f;
      parts.push(`${v < 0 ? "− " : parts.length ? "+ " : ""}${coef}${coef && pw && f.includes("/") ? "·" : ""}${pw}`);
    }
    return (parts.join(" ") || "0") + " + …";
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [-1.8, 1.8], yr: [-3, 4], xs: 0.5, ys: 1, xf: (v) => n(v, 1), yf: (v) => n(v, 0) });
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.08)"; ctx.fillRect(g.X(-1), g.y0, g.X(1) - g.X(-1), g.h); ctx.restore();
    G.curve(ctx, g, T[tk].f, C.rule, { width: 6 });
    G.curve(ctx, g, cur.f, C.ink, { width: 2.4, N: 300 });
    G.curve(ctx, g, (x) => { let s = 0, p = 1; for (let k = 0; k <= 8; k++) { s += cur.c[k] * p; p *= x; } return s; }, BLUE, { width: 1.8, dash: [6, 3] });
    G.tag(ctx, g, "옅은 굵은 선: 목표", g.x0 + 4, g.y0 + 10, C.ink3);
  }
  function check() {
    const ok = T[tk].c.every((v, k) => k >= 16 || Math.abs(v - cur.c[k]) < 1e-9);   // 끝 쪽 계수는 연산 중에 잘리므로 16차까지 비교
    if (ok) { done.add(tk); root.querySelector(`.tg .chip[data-t="${tk}"]`).dataset.done = "1"; }
    verdict.textContent = ok ? `목표를 만들었습니다: ${cur.hist.join(" → ")}` : (cur.hist.length ? `지금까지: ${cur.hist.join(" → ")}` : "");
    verdict.className = "verdict " + (ok ? "good" : "");
  }
  function update() { $(".ser").textContent = text(cur.c); check(); draw(); }
  root.querySelectorAll(".ops .chip").forEach((b) => b.addEventListener("click", () => {
    const o = b.dataset.o;
    if (o === "reset") cur = start();
    else { const r = OPS[o](cur); r.hist = cur.hist.concat(r.name); cur = r; }
    update();
  }));
  G.chips(root, ".tg .chip", (b) => { tk = b.dataset.t; cur = start(); update(); });
  cur = start(); update();
})();
