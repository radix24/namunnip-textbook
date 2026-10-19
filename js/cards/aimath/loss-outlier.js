/* 카드: 잘못 입력된 자료 하나가 들어오면 어떤 손실함수가 더 크게 흔들릴까? — MSE 직선 vs MAE 직선 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-loss-outlier");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const BASE = [[1, 2.1], [2, 3.2], [3, 3.8], [4, 5.2], [5, 5.9], [6, 7.1], [7, 7.8], [8, 9.2]], OUT = [7.5, 22];
  let withOut = false, cv = null;
  const data = () => (withOut ? [...BASE, OUT] : BASE);
  const mse = (D) => { const n = D.length, mx = D.reduce((s, d) => s + d[0], 0) / n, my = D.reduce((s, d) => s + d[1], 0) / n, a = D.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / D.reduce((s, [x]) => s + (x - mx) ** 2, 0); return [a, my - a * mx]; };
  /* MAE 직선: 최솟값이 자료점 두 개를 지나는 직선 중에 있음 → 모든 쌍을 시험 */
  const mae = (D) => { let best = null, bl = Infinity; for (let i = 0; i < D.length; i++) for (let j = i + 1; j < D.length; j++) { if (D[i][0] === D[j][0]) continue; const a = (D[j][1] - D[i][1]) / (D[j][0] - D[i][0]), b = D[i][1] - a * D[i][0], l = D.reduce((s, [x, y]) => s + Math.abs(y - a * x - b), 0); if (l < bl) { bl = l; best = [a, b]; } } return best; };
  const M0 = mse(BASE), A0 = mae(BASE);
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx, size } = cv;
    ctx.clearRect(0, 0, size.w, size.h);
    const D = data(), m = mse(D), a = mae(D);
    const P = E.frame(ctx, size, { x0: 0, x1: 9, y0: 0, y1: 24, xt: [0, 2, 4, 6, 8], yt: [0, 8, 16, 24], L: 32 });
    P.clip();
    if (withOut) { E.fn(ctx, P, (x) => M0[0] * x + M0[1], 0, 9, "rgba(63,111,163,.35)", 1.4, [4, 4]); E.fn(ctx, P, (x) => A0[0] * x + A0[1], 0, 9, "rgba(224,160,42,.45)", 1.4, [4, 4]); }
    E.fn(ctx, P, (x) => m[0] * x + m[1], 0, 9, E.BLUE, 2.4);
    E.fn(ctx, P, (x) => a[0] * x + a[1], 0, 9, E.ORANGE, 2.4, [8, 4]);
    ctx.restore();
    D.forEach(([x, y]) => E.dot(ctx, P, x, y, x === OUT[0] && y === OUT[1] ? C.warn : C.ink, x === OUT[0] && y === OUT[1] ? 6 : 4, x === OUT[0] && y === OUT[1] ? "튀는 자료" : "", 8, 4));
    E.text(ctx, P.L + 6, P.T + 12, "파랑: 제곱오차 · 주황 점선: 절댓값오차", C.ink2);
    if (withOut) E.text(ctx, P.L + 6, P.T + 26, "흐린 선: 튀는 자료 넣기 전", C.ink3);
  }
  function update() {
    const D = data(), m = mse(D), a = mae(D);
    $(".say").textContent = `제곱오차 직선 y = ${m[0].toFixed(2)}x + ${m[1].toFixed(2)}${withOut ? ` (기울기 변화 ${(m[0] - M0[0]).toFixed(2)})` : ""} · 절댓값오차 직선 y = ${a[0].toFixed(2)}x + ${a[1].toFixed(2)}${withOut ? ` (기울기 변화 ${(a[0] - A0[0]).toFixed(2)})` : ""}`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "mse" ? "맞습니다." : "예측과 다릅니다."} 제곱오차는 튀는 자료의 큰 오차를 제곱해 크게 세므로, 그 오차를 줄이려고 직선 전체가 끌려 올라갑니다. 절댓값오차 직선은 거의 그대로입니다.`;
    withOut = true; const t = $(".go-toggle"); t.disabled = false;
    if (!cv) cv = fit($("canvas"), () => draw());
    update();
  }));
  $(".go-toggle").addEventListener("click", () => { withOut = !withOut; update(); });
  /* 예측 전에도 튀는 자료가 없는 기본 자료와 두 직선을 그려 둔다 */
  cv = fit($("canvas"), () => draw());
  update();
})();
