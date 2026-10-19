/* 카드: 접선을 따라 내려가면 방정식의 근에 닿을까? — 뉴턴의 방법 한 걸음씩, 맞는 자릿수 */
(() => {
  const root = document.getElementById("card-adcalc-newton-tangent");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, drag, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const cbrt = Math.cbrt;
  const P = {
    sq: { f: (x) => x * x - 2, d: (x) => 2 * x, r: Math.SQRT2, x0: 3, xr: [-1, 4], yr: [-3, 10], xs: 1, ys: 2 },
    cub: { f: (x) => x ** 3 - 2 * x - 5, d: (x) => 3 * x * x - 2, r: 2.0945514815423265, x0: 3, xr: [-1, 4], yr: [-10, 25], xs: 1, ys: 5 },
    cos: { f: (x) => Math.cos(x) - x, d: (x) => -Math.sin(x) - 1, r: 0.7390851332151607, x0: -1, xr: [-1.5, 2.5], yr: [-2.5, 2.5], xs: 0.5, ys: 1 },
    cbrt: { f: cbrt, d: (x) => 1 / (3 * cbrt(x) ** 2), r: 0, x0: 0.5, xr: [-5, 5], yr: [-2, 2], xs: 1, ys: 0.5 },
  };
  let pk = "sq", xs = [], g = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());

  const digits = (x) => {
    const e = Math.abs(x - P[pk].r);
    if (pk === "cbrt") return null;
    return e === 0 ? 16 : Math.max(0, Math.min(16, Math.floor(-Math.log10(e / Math.max(1, Math.abs(P[pk].r))))));
  };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk];
    g = G.frame(ctx, w, h, { xr: p.xr, yr: p.yr, xs: p.xs, ys: p.ys, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    G.curve(ctx, g, p.f, BLUE, { width: 2.4 });
    // 지나온 접선
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    for (let i = 0; i + 1 < xs.length; i++) {
      const a = xs[i], b = xs[i + 1], last = i + 2 === xs.length;
      ctx.globalAlpha = last ? 1 : 0.45;
      ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0)); ctx.lineTo(g.X(a), g.Y(p.f(a))); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = C.warn; ctx.lineWidth = last ? 2 : 1.4;
      ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(p.f(a))); ctx.lineTo(g.X(b), g.Y(0)); ctx.stroke();
    }
    ctx.restore();
    xs.forEach((x, i) => { if (x >= p.xr[0] && x <= p.xr[1]) G.dot(ctx, g, x, 0, i === 0 ? C.ink : C.warn, i !== xs.length - 1, i === 0 ? 6 : 4); });
    const xn = xs[xs.length - 1];
    if (xn >= p.xr[0] && xn <= p.xr[1]) G.dot(ctx, g, xn, p.f(xn), C.warn);
    G.tag(ctx, g, "x₀을 끌어 옮기세요", g.x0 + 4, g.y0 + 10, C.ink3);
    if (xn < p.xr[0] || xn > p.xr[1]) G.tag(ctx, g, `x${xs.length - 1} = ${n(xn, 3)} (그림 밖)`, g.x0 + g.w - 4, g.y0 + 28, C.warn, "right");
  }

  function show(v, k) {
    const s = v.toFixed(12);
    if (k == null) return s;
    // 맞는 자릿수만큼(유효숫자) 굵게
    let cnt = 0, cut = 0;
    for (let i = 0; i < s.length && cnt < k; i++) { if (/\d/.test(s[i]) && !(cnt === 0 && s[i] === "0")) cnt++; cut = i + 1; }
    return `<b>${s.slice(0, cut)}</b>${s.slice(cut)}`;
  }
  function nums() {
    const xn = xs[xs.length - 1], k = digits(xn);
    $(".n-n").textContent = xs.length - 1;
    $(".n-x").textContent = Math.abs(xn) > 1e6 ? NMPm.n(xn, 0) : n(xn, 9);
    $(".n-d").textContent = pk === "cbrt" ? `|x| = ${n(Math.abs(xn), 3)}` : `${k}자리`;
    $(".nw-tab").innerHTML = xs.slice(-6).map((x, i) => `x<sub>${xs.length - Math.min(6, xs.length) + i}</sub> = ${Math.abs(x) > 1e6 ? x.toExponential(3) : show(x, pk === "cbrt" ? null : digits(x))}`).join("<br>");
    draw();
  }
  function step(k) {
    const p = P[pk];
    for (let i = 0; i < k && xs.length < 40; i++) {
      const x = xs[xs.length - 1], d = p.d(x);
      if (!Number.isFinite(d) || d === 0 || Math.abs(x) > 1e12) break;
      xs.push(x - p.f(x) / d);
    }
    nums();
  }
  const reset = (x0) => { xs = [x0 ?? P[pk].x0]; nums(); };

  drag(cv, (x, y) => (g && Math.abs(x - g.X(xs[0])) < 16 && Math.abs(y - g.Y(0)) < 22 ? 0 : null),
    (_, x) => { const p = P[pk]; let v = Math.round(NM.clamp(g.ix(x), p.xr[0], p.xr[1]) * 100) / 100; if (pk === "cbrt" && v === 0) v = 0.01; reset(v); });
  G.chips(root, ".presets .chip[data-p]", (b) => { pk = b.dataset.p; reset(); });
  $(".go-step").addEventListener("click", () => step(1));
  $(".go-five").addEventListener("click", () => step(5));
  $(".go-reset").addEventListener("click", () => reset());
  reset();
})();
