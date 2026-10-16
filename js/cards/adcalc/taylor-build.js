/* 카드: 차수를 올리면 테일러다항식은 어디까지 함수를 따라갈까? — 함수, T_n, 로그 오차 */
(() => {
  const root = document.getElementById("card-adcalc-taylor-build");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sa = $(".sa");
  const fact = [1]; for (let i = 1; i <= 30; i++) fact[i] = fact[i - 1] * i;
  /* d(k, a): k계도함수의 값 */
  const P = {
    sin: { f: Math.sin, d: (k, a) => [Math.sin(a), Math.cos(a), -Math.sin(a), -Math.cos(a)][k % 4], xr: [-7, 7], yr: [-2.2, 2.2], name: "sin x" },
    exp: { f: Math.exp, d: (k, a) => Math.exp(a), xr: [-4, 4], yr: [-1, 12], name: "eˣ" },
    ln: { f: (x) => (x <= -1 ? NaN : Math.log(1 + x)), d: (k, a) => (k === 0 ? Math.log(1 + a) : (k % 2 ? 1 : -1) * fact[k - 1] / (1 + a) ** k), xr: [-1, 3], yr: [-3, 2.5], name: "ln(1 + x)" },
    flat: { f: (x) => (x === 0 ? 0 : Math.exp(-1 / (x * x))), d: () => 0, xr: [-3, 3], yr: [-0.3, 1.1], name: "e^(−1/x²)", fixed: true },
  };
  let pk = "sin";
  const { ctx, size } = fit($("canvas"), () => draw());
  const coef = () => { const p = P[pk], a = p.fixed ? 0 : pk === "ln" ? Math.max(-0.9, +sa.value) : +sa.value, N = +sn.value; return { a, c: Array.from({ length: N + 1 }, (_, k) => p.d(k, a) / fact[k]) }; };
  const T = (x, { a, c }) => { let s = 0, q = 1; for (const v of c) { s += v * q; q *= x - a; } return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], cc = coef(), top = h * 0.62;
    const g = G.frame(ctx, w, top, { xr: p.xr, yr: p.yr, xs: (p.xr[1] - p.xr[0]) > 8 ? 2 : 1, ys: (p.yr[1] - p.yr[0]) > 8 ? 2 : (p.yr[1] - p.yr[0]) > 3 ? 1 : 0.5, xf: (v) => n(v, 0), yf: (v) => n(v, 1), L: 44 });
    G.curve(ctx, g, p.f, C.ink2, { width: 3, N: 600 });
    G.curve(ctx, g, (x) => T(x, cc), BLUE, { width: 2, N: 600 });
    G.dot(ctx, g, cc.a, p.f(cc.a), C.warn, false, 5);
    G.tag(ctx, g, `회색: ${p.name} · 파랑: T${+sn.value}`, g.x0 + 4, g.y0 + 10, C.ink3);
    // 아래: log10 |오차|
    ctx.save(); ctx.translate(0, top + 6);
    const g2 = G.frame(ctx, w, h - top - 6, { xr: p.xr, yr: [-12, 2], xs: (p.xr[1] - p.xr[0]) > 8 ? 2 : 1, ys: 4, xf: (v) => n(v, 0), yf: (v) => (v === 0 ? "1" : `1e${v}`.replace("-", "−")), L: 44 });
    G.curve(ctx, g2, (x) => { const e = Math.abs(p.f(x) - T(x, cc)); return Number.isFinite(e) ? Math.log10(Math.max(e, 1e-13)) : NaN; }, C.warn, { width: 1.8, N: 600 });
    G.tag(ctx, g2, "|오차| (로그 눈금)", g2.x0 + 4, g2.y0 + 10, C.warn);
    ctx.restore();
  }
  function poly() {
    const { a, c } = coef(), terms = [];
    c.forEach((v, k) => {
      if (Math.abs(v) < 1e-12 || terms.length >= 6) return;
      const b = a === 0 ? "x" : `(x ${a > 0 ? "−" : "+"} ${n(Math.abs(a), 1)})`, pw = k === 0 ? "" : k === 1 ? b : `${b}^${k}`;
      terms.push(`${v < 0 ? "− " : terms.length ? "+ " : ""}${n(Math.abs(v), 5)}${pw ? "·" + pw : ""}`);
    });
    return `T${+sn.value}(x) = ${terms.join(" ") || "0"}${c.filter((v) => Math.abs(v) > 1e-12).length > 6 ? " + …" : ""}`;
  }
  function nums() {
    $(".n-out").textContent = sn.value; $(".a-out").textContent = n(+sa.value, 1);
    $(".poly").textContent = poly();
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; const f = P[pk].fixed; sa.disabled = !!f; if (f) sa.value = 0; root.querySelector(".ac").style.opacity = f ? 0.4 : 1; nums(); });
  [sn, sa].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
