/* 카드: 멱급수는 x가 얼마일 때까지 수렴할까? — 부분합 그래프와 수렴 구간 띠 */
(() => {
  const root = document.getElementById("card-adcalc-radius");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), bInt = $(".go-int"), NN = 200;
  /* term(k, x): k ≥ 1 항 (fact, geo은 k = 0부터) — 로그로 계산해 넘침을 막는다 */
  const lf = [0]; for (let i = 1; i <= NN + 1; i++) lf[i] = lf[i - 1] + Math.log(i);
  const P = {
    geo: { k0: 0, t: (k, x) => x ** k, a: 0, R: 1, lo: false, hi: false },
    n: { k0: 1, t: (k, x) => x ** k / k, a: 0, R: 1, lo: true, hi: false },
    n2: { k0: 1, t: (k, x) => x ** k / (k * k), a: 0, R: 1, lo: true, hi: true },
    fact: { k0: 0, t: (k, x) => (x === 0 ? (k ? 0 : 1) : Math.sign(x) ** k * Math.exp(k * Math.log(Math.abs(x)) - lf[k])), a: 0, R: Infinity },
    shift: { k0: 0, t: (k, x) => ((x - 2) / 3) ** k, a: 2, R: 3, lo: false, hi: false },
  };
  let pk = "geo";
  const { ctx, size } = fit($("canvas"), () => draw());
  const partials = (x) => { const p = P[pk], out = []; let s = 0; for (let k = p.k0; k <= NN; k++) { s += p.t(k, x); out.push(s); } return out; };
  function status(x) {
    const p = P[pk], d = Math.abs(x - p.a);
    if (!Number.isFinite(p.R) || d < p.R - 1e-9) return "수렴";
    if (d > p.R + 1e-9) return "발산";
    return (x < p.a ? p.lo : p.hi) ? "수렴(끝점)" : "발산(끝점)";
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const x = +sx.value, ps = partials(x), top = h * 0.7;
    const fin = ps.filter(Number.isFinite), mx = Math.min(1e3, Math.max(2, ...fin.map(Math.abs))) * 1.1;
    const lim = mx > 50 ? 50 : mx;
    const g = G.frame(ctx, w, top, { xr: [0, NN], yr: [-lim, lim], xs: 50, ys: lim > 20 ? 10 : lim > 5 ? 2 : 1, xf: (v) => n(v, 0), yf: (v) => n(v, 0) });
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 1.6; ctx.beginPath();
    ps.forEach((v, i) => { const y = g.Y(NM.clamp(v, -lim * 3, lim * 3)); i ? ctx.lineTo(g.X(i), y) : ctx.moveTo(g.X(i), y); });
    ctx.stroke(); ctx.restore();
    G.tag(ctx, g, "부분합 S(n) — 가로축 n", g.x0 + 4, g.y0 + 10, BLUE);
    // 아래: x축과 수렴 구간
    const y0 = top + 26, L = 34, W = w - 44, X = (v) => L + (v + 3) / 9 * W, p = P[pk];
    seg(ctx, L, y0, L + W, y0, C.ink3, 1);
    for (let v = -3; v <= 6; v++) { seg(ctx, X(v), y0 - 3, X(v), y0 + 3, C.ink3, 1); label(ctx, n(v, 0), X(v), y0 + 13, C.ink3, "center", `10px ${F.mono}`); }
    if (bInt.getAttribute("aria-pressed") === "true") {
      const lo = Number.isFinite(p.R) ? p.a - p.R : -3.2, hi = Number.isFinite(p.R) ? p.a + p.R : 6.2;
      ctx.fillStyle = "rgba(59,124,42,.35)"; ctx.fillRect(X(Math.max(lo, -3)), y0 - 6, X(Math.min(hi, 6)) - X(Math.max(lo, -3)), 12);
      if (Number.isFinite(p.R)) [[lo, p.lo], [hi, p.hi]].forEach(([v, c]) => dot(ctx, X(v), y0, C.forest, 5, !c));
      label(ctx, Number.isFinite(p.R) ? `R = ${p.R}` : "R = ∞", L + W, y0 - 16, C.forest, "right", `600 11px ${F.sans}`);
    }
    ctx.save(); ctx.fillStyle = C.warn; ctx.beginPath(); ctx.moveTo(X(x), y0 - 9); ctx.lineTo(X(x) - 6, y0 - 18); ctx.lineTo(X(x) + 6, y0 - 18); ctx.fill(); ctx.restore();
    label(ctx, "x", X(x), y0 - 26, C.warn, "center", `italic 600 12px ${F.serif}`);
  }
  function nums() {
    const x = +sx.value, p = P[pk], ps = partials(x);
    $(".x-out").textContent = n(x, 2);
    const r = Math.abs(p.t(NN, x) / p.t(NN - 1, x));
    $(".n-r").textContent = Number.isFinite(r) ? n(r, 4) : "—";
    const last = ps[ps.length - 1];
    $(".n-s").textContent = Number.isFinite(last) && Math.abs(last) < 1e9 ? n(last, 4) : "발산";
    const st = status(x), v = $(".n-v"); v.textContent = st; v.classList.toggle("bad", st.startsWith("발산")); v.classList.toggle("good", st.startsWith("수렴"));
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; nums(); });
  bInt.addEventListener("click", () => { bInt.setAttribute("aria-pressed", String(bInt.getAttribute("aria-pressed") !== "true")); draw(); });
  sx.addEventListener("input", nums);
  nums();
})();
