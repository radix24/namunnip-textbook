/* 카드: 어디서나 매끄러운 1/(1 + x²)의 급수는 왜 |x| < 1에서만 맞을까? — 중심 a의 테일러 급수(복소 부분분수로 계수 계산)와 수렴반경 √(1 + a²) */
(() => {
  const root = document.getElementById("card-adcalc-radius-why");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sN = $(".sN"), verdict = $(".verdict");
  const f = (x) => 1 / (1 + x * x);
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 1/(1 + x²) = (1/2i)[1/(x − i) − 1/(x + i)], 1/(x − c) = −Σ (x − a)^k / (c − a)^(k+1)
     → 계수 b_k = Im{ 1/(i − a)^(k+1) } ... 을 직접 복소 거듭제곱으로 계산 */
  function coeffs(a, N) {
    // w = 1/(i − a) = (−a − i)/(a² + 1)
    const d = a * a + 1, wr = -a / d, wi = -1 / d;
    const out = []; let pr = wr, pi = wi;   // w^(k+1)
    for (let k = 0; k < N; k++) {
      // b_k = (1/2i)[−w^(k+1) + conj(w)^(k+1)] = −Im(w^(k+1))
      out.push(-pi);
      const nr = pr * wr - pi * wi, ni = pr * wi + pi * wr; pr = nr; pi = ni;
    }
    return out;
  }
  const S = (x, a, cs) => { let s = 0, p = 1; for (const c of cs) { s += c * p; p *= x - a; } return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +sa.value, N = +sN.value, cs = coeffs(a, N), R = Math.sqrt(1 + a * a);
    const g = G.frame(ctx, w, h, { xr: [-4, 4], yr: [-0.6, 1.6], xs: 1, ys: 0.5, xf: (v) => n(v, 0), yf: (v) => n(v, 1) });
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.12)"; ctx.fillRect(g.X(Math.max(-4, a - R)), g.y0, g.X(Math.min(4, a + R)) - g.X(Math.max(-4, a - R)), g.h); ctx.restore();
    G.curve(ctx, g, f, C.ink2, { width: 3 });
    G.curve(ctx, g, (x) => S(x, a, cs), BLUE, { width: 2, N: 800 });
    G.dot(ctx, g, a, f(a), C.warn, false, 5);
    G.tag(ctx, g, `초록 띠: |x − a| < √(1 + a²) = ${n(R, 3)}`, g.x0 + 4, g.y0 + 10, C.forest);
    G.tag(ctx, g, "회색: 1/(1 + x²) · 파랑: 부분합", g.x0 + 4, g.y0 + 28, C.ink3);
  }
  function nums() {
    const a = +sa.value, N = +sN.value, R = Math.sqrt(1 + a * a), cs = coeffs(a, N);
    $(".a-out").textContent = n(a, 2); $(".N-out").textContent = N;
    $(".n-R").textContent = n(R, 4);
    $(".n-I").textContent = `(${n(a - R, 2)}, ${n(a + R, 2)})`;
    const e = Math.abs(S(1.5, a, cs) - f(1.5));
    $(".n-e").textContent = e > 1e6 ? "아주 큼" : n(e, 4);
    draw();
  }
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".guess .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const ok = b.dataset.g === "1.414";
    verdict.textContent = ok ? "맞습니다. 중심 1에서 ±i까지의 거리가 √2입니다. a를 1로 옮겨 확인하세요." : "a를 1로 옮겨 수렴반경 칸을 확인해 보세요.";
    verdict.className = "verdict " + (ok ? "good" : "");
  }));
  [sa, sN].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
