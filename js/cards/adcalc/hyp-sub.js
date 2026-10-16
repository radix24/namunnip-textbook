/* 카드: 근호 속의 x² + 1을 없애는 치환은? — 치환 고르기와 넓이 검산 */
(() => {
  const root = document.getElementById("card-adcalc-hyp-sub");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sb = $(".sb"), verdict = $(".verdict");
  const Q = [
    { f: (x) => 1 / Math.sqrt(x * x + 1), a: 0, bmax: 3, F: A.asinh, ok: "sinh", expr: "sinh⁻¹ b", yr: [0, 1.2],
      msg: { sinh: "√(sinh²t + 1) = cosh t, dx = cosh t dt → ∫ dt = t + C", sin: "√(sin²t + 1)은 근호가 남습니다.", cosh: "√(cosh²t + 1)은 근호가 남습니다." } },
    { f: (x) => (x <= 1 ? NaN : 1 / Math.sqrt(x * x - 1)), a: 1, bmax: 3, F: A.acosh, ok: "cosh", expr: "cosh⁻¹ b", yr: [0, 3],
      msg: { cosh: "√(cosh²t − 1) = sinh t, dx = sinh t dt → ∫ dt = t + C", sin: "sin t는 1보다 클 수 없어 x > 1을 나타내지 못합니다.", sinh: "√(sinh²t − 1)은 근호가 남습니다." } },
    { f: (x) => (x >= 1 ? NaN : 1 / Math.sqrt(1 - x * x)), a: 0, bmax: 0.995, F: Math.asin, ok: "sin", expr: "sin⁻¹ b", yr: [0, 3],
      msg: { sin: "√(1 − sin²t) = cos t, dx = cos t dt → ∫ dt = t + C", sinh: "√(1 − sinh²t)은 근호가 남습니다.", cosh: "1 − cosh²t ≤ 0이라 근호 안이 음수가 됩니다." } },
    { f: (x) => Math.sqrt(x * x + 1), a: 0, bmax: 3, F: (b) => (b * Math.sqrt(b * b + 1) + A.asinh(b)) / 2, ok: "sinh", expr: "½(b√(b²+1) + sinh⁻¹ b)", yr: [0, 3.4],
      msg: { sinh: "√(sinh²t + 1) · cosh t dt = cosh²t dt = ½(1 + cosh 2t) dt", sin: "√(sin²t + 1)은 근호가 남습니다.", cosh: "√(cosh²t + 1)은 근호가 남습니다." } },
  ];
  let qk = 0;
  const solved = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());
  const bval = () => Math.min(+sb.value, Q[qk].bmax);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const q = Q[qk], b = bval();
    const g = G.frame(ctx, w, h, { xr: [0, 3], yr: q.yr, xs: 0.5, ys: q.yr[1] > 2 ? 1 : 0.5, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    if (b > q.a) {
      ctx.save(); ctx.fillStyle = "rgba(59,124,42,.2)"; ctx.beginPath(); ctx.moveTo(g.X(q.a), g.Y(0));
      for (let i = 0; i <= 200; i++) { const x = q.a + (b - q.a) * i / 200, y = q.f(x); ctx.lineTo(g.X(x), g.Y(Number.isFinite(y) ? Math.min(y, q.yr[1] * 1.5) : q.yr[1] * 1.5)); }
      ctx.lineTo(g.X(b), g.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    G.curve(ctx, g, q.f, BLUE, { width: 2.4, N: 800 });
    G.tag(ctx, g, `구간 [${n(q.a, 0)}, ${n(b, 2)}]`, g.x0 + g.w - 4, g.y0 + 10, C.forest, "right");
  }
  /* 수치 넓이: 끝에서 무한대로 커지는 경우(1, 2번)는 끝 근처를 치환해 심프슨 */
  function area() {
    const q = Q[qk], b = bval();
    if (b <= q.a) return 0;
    if (qk === 1) return A.simpson((u) => 2 / Math.sqrt(2 + u * u), 0, Math.sqrt(b - 1), 600);   // x = 1 + u²
    if (qk === 2) return A.simpson((v) => 2 / Math.sqrt(2 - v * v), Math.sqrt(1 - b), 1, 600);    // x = 1 − v²
    return A.simpson(q.f, q.a, b, 600);
  }
  function nums() {
    const q = Q[qk], b = bval();
    $(".b-out").textContent = n(b, 3);
    $(".n-num").textContent = n(area(), 5);
    const s = solved.has(qk);
    $(".n-f").textContent = s ? n(q.F(b) - q.F(q.a), 5) : "?";
    $(".n-e").textContent = s ? q.expr : "치환을 고르세요";
    draw();
  }
  root.querySelectorAll(".subs .chip").forEach((bt) => bt.addEventListener("click", () => {
    const q = Q[qk], k = bt.dataset.s, ok = k === q.ok;
    if (ok) solved.add(qk);
    verdict.textContent = (ok ? "맞습니다. " : "") + q.msg[k];
    verdict.className = "verdict " + (ok ? "good" : "bad");
    nums();
  }));
  G.chips(root, ".q-pick .chip", (bt) => { qk = +bt.dataset.q; verdict.textContent = ""; verdict.className = "verdict"; if (qk === 1 && +sb.value < 1) sb.value = 2; nums(); });
  sb.addEventListener("input", nums);
  nums();
})();
