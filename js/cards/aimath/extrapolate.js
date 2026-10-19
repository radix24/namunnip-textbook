/* 카드: 처음 몇 해의 추세로 10년 뒤를 예측해도 될까? — 직선·이차 추세선의 외삽 vs 로지스틱 성장 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-extrapolate");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), mIn = $(".m"), Y = 15;
  /* 실제(가상): 로지스틱 1000/(1 + e^(−0.7(t − 6))) 만 명에 작은 흔들림 */
  const jit = [3, -8, 5, -4, 10, -12, 8, -6, 4, -9, 6, -3, 2, -5, 4, 1];
  const real = [...Array(Y + 1)].map((_, t) => Math.max(0, 1000 / (1 + Math.exp(-0.7 * (t - 6))) + jit[t]));
  let showReal = false;
  /* 최소제곱 다항식(차수 1 또는 2): 정규방정식 */
  function polyfit(n, deg) {
    const xs = [...Array(n)].map((_, t) => t + 1), ys = xs.map((t) => real[t]), k = deg + 1;
    const M = [...Array(k)].map((_, i) => [...Array(k)].map((_, j) => xs.reduce((s, x) => s + x ** (i + j), 0))), v = [...Array(k)].map((_, i) => xs.reduce((s, x, q) => s + ys[q] * x ** i, 0));
    for (let c = 0; c < k; c++) { let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]]; [v[c], v[p]] = [v[p], v[c]]; for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let j = c; j < k; j++) M[r][j] -= f * M[c][j]; v[r] -= f * v[c]; } }
    const co = v.map((x, i) => x / M[i][i]);
    return (t) => co.reduce((s, c, i) => s + c * t ** i, 0);
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const n = +nIn.value, f = polyfit(n, +mIn.value);
    const P = E.frame(ctx, size, { x0: 0, x1: Y + 0.5, y0: 0, y1: 1600, xt: [1, 5, 10, 15].map((v) => [v, `${v}년`]), yt: [0, 400, 800, 1200, 1600], ylab: "사용자(만 명)", L: 44 });
    ctx.fillStyle = "rgba(116,171,102,.1)"; ctx.fillRect(P.X(0.5), P.T, P.X(n + 0.5) - P.X(0.5), P.h);
    E.text(ctx, P.X(1), P.T + 12, "학습 구간", C.forest);
    P.clip(); E.fn(ctx, P, f, 0.5, Y + 0.5, E.BLUE, 2.4); ctx.restore();
    real.forEach((v, t) => { if (t < 1) return; if (t <= n) E.dot(ctx, P, t, v, C.ink, 4.5); else if (showReal) { ctx.save(); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P.X(t), P.Y(v), 4.5, 0, 7); ctx.stroke(); ctx.restore(); } });
    E.dot(ctx, P, Y, Math.min(1590, Math.max(0, f(Y))), E.BLUE, 5, `예측 ${E.n(f(Y))}`, -6, -8);
  }
  function update() {
    const n = +nIn.value, f = polyfit(n, +mIn.value);
    $(".n-out").textContent = n;
    $(".say").textContent = `${+mIn.value === 1 ? "직선" : "이차곡선"} 추세선, 처음 ${n}년으로 학습 · 15년째 예측 ${E.n(f(Y))}만 명` + (showReal ? ` · 실제 ${E.n(real[Y])}만 명 → 오차 ${E.n(f(Y) - real[Y])}만 명 (빈 점: 실제 값, 사용자는 한계에 가까워지며 늘지 않음)` : "");
    draw();
  }
  [nIn, mIn].forEach((el) => el.addEventListener("input", update));
  $(".go-real").addEventListener("click", () => { showReal = true; update(); });
  update();
})();
