/* 카드: 학교 축제 공연 티켓 값을 얼마로 정해야 수익이 가장 클까? — (p − c)·min(1200 − 60p, 좌석) (가상 설문) */
(() => {
  const root = document.getElementById("card-econ-ticket-price");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), cIn = $(".c"), sIn = $(".s");
  let showBest = false;
  const N = (p) => Math.max(0, Math.min(1200 - 60 * p, +sIn.value)), prof = (p) => (p - +cIn.value) * N(p);
  /* 최적: 좌석이 넉넉하면 10 + c/2, 아니면 좌석이 꽉 차는 값 (1200 − S)/60 과 비교 */
  const best = () => { const c = +cIn.value, S = +sIn.value, p1 = 10 + c / 2, pFull = (1200 - S) / 60; return Math.max(p1, pFull); };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const p = +pIn.value, S = +sIn.value, pFull = (1200 - S) / 60;
    const P = E.frame(ctx, size, { x0: 0, x1: 20, y0: -2000, y1: 8000, xt: [0, 5, 10, 15, 20], yt: [[-2000, "−200만"], [0, "0"], [4000, "400만"], [8000, "800만"]], xlab: "티켓 값 p(천 원)", ylab: "수익", L: 50 });
    if (pFull > 0) { ctx.fillStyle = "rgba(224,160,42,.14)"; ctx.fillRect(P.X(0), P.T, P.X(pFull) - P.X(0), P.h); E.text(ctx, P.X(0) + 4, P.T + 12, "좌석이 꽉 찬 구간", E.ORANGE); }
    P.clip();
    E.fn(ctx, P, () => 0, 0, 20, C.ink3, 1);
    E.fn(ctx, P, (t) => (t - +cIn.value) * Math.max(0, 1200 - 60 * t), 0, 20, C.ink3, 1.2, [4, 4]);
    E.fn(ctx, P, prof, 0, 20, E.BLUE, 2.6);
    ctx.restore();
    E.dot(ctx, P, p, prof(p), C.warn, 5.5);
    if (showBest) { const b = best(); E.dot(ctx, P, b, prof(b), C.forest, 5.5, `최적 ${E.n(b, 1)}천 원`, 6, -8); }
  }
  function update() {
    const p = +pIn.value, c = +cIn.value, n = N(p);
    $(".p-out").textContent = E.n(p, 1); $(".c-out").textContent = E.n(c, 1); $(".s-out").textContent = sIn.value;
    const b = best();
    $(".say").textContent = `관객 ${E.n(n)}명 · 수입 ${E.n(p * n * 1000)}원 · 비용 ${E.n(c * n * 1000)}원 · 수익 ${E.n(prof(p) * 1000)}원` + (showBest ? ` · 최적: p = ${E.n(b, 2)}천 원, 관객 ${E.n(N(b))}명, 수익 ${E.n(prof(b) * 1000)}원${b > 10 + c / 2 + 1e-9 ? " (좌석 제한 때문에 값을 더 올림)" : " (π'(p) = 0)"}` : "");
    draw();
  }
  [pIn, cIn, sIn].forEach((el) => el.addEventListener("input", update));
  $(".go-best").addEventListener("click", () => { showBest = true; update(); });
  update();
})();
