/* 카드: 100 m 사이에 전선을 1 m만 더 길게 걸면 얼마나 처질까? — 처짐 예측과 현수선(길이 2a sinh(d/a)) 확인 */
(() => {
  const root = document.getElementById("card-adcalc-cable-length");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sl = $(".sl"), sg = $(".sg"), verdict = $(".verdict");
  const D = 50;   // 반 간격 (m)
  let shown = false;
  const { ctx, size } = fit($("canvas"), () => draw());

  /* 2a sinh(D/a) = L 을 a에 대해 풀기 (a가 클수록 길이가 짧다) */
  function solveA(L) {
    let lo = 1, hi = 1e7;
    for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); (2 * m * Math.sinh(D / m) > L ? (lo = m) : (hi = m)); }
    return Math.sqrt(lo * hi);
  }
  const state = () => { const L = +sl.value, a = solveA(L); return { L, a, s: a * (Math.cosh(D / a) - 1) }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const sx = (w - 40) / 100, sy = sx * 2, top = 26;
    const X = (x) => 20 + (x + D) * sx, Y = (y) => top + y * sy;   // y: 아래로 처짐 (m)
    // 기둥
    [-D, D].forEach((x) => { seg(ctx, X(x), top - 14, X(x), h - 4, C.ink3, 3); dot(ctx, X(x), top, C.ink, 4); });
    seg(ctx, X(-D), top, X(D), top, C.rule, 1, [2, 4]);
    for (let m = 5; Y(m) < h - 6; m += 5) label(ctx, `${m} m`, X(D) - 6, Y(m), C.ink3, "right", `10px ${F.mono}`);
    // 예측
    const gs = +sg.value;
    seg(ctx, X(-D) + 6, Y(gs), X(D) - 6, Y(gs), C.warn, 1.6, [6, 4]);
    label(ctx, `예측 ${n(gs, 1)} m`, X(-D) + 10, Y(gs) - 9, C.warn, "left", `600 11px ${F.sans}`);
    if (shown) {
      const { a, s } = state();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const x = -D + 2 * D * i / 200, y = s - a * (Math.cosh(x / a) - 1); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
      ctx.stroke();
      seg(ctx, X(0), top, X(0), Y(s), BLUE, 1, [3, 3]);
      label(ctx, `처짐 ${n(s, 2)} m`, X(0) + 6, Y(s) + 12, BLUE, "left", `600 11.5px ${F.sans}`);
    }
  }
  function nums() {
    const { L, a, s } = state();
    $(".l-out").textContent = n(L, 2); $(".g-out").textContent = n(+sg.value, 1);
    $(".n-s").textContent = shown ? `${n(s, 2)} m` : "?";
    $(".n-a").textContent = shown ? n(a, 1) : "?";
    $(".n-L").textContent = shown ? n(2 * a * Math.sinh(D / a), 3) : "?";
    draw();
  }
  $(".go-check").addEventListener("click", () => {
    shown = true;
    const { s } = state(), gs = +sg.value, r = gs / s;
    verdict.textContent = Math.abs(r - 1) < 0.15 ? "예측이 15 % 안쪽으로 맞았습니다." : `실제 처짐은 예측의 ${n(1 / r, 1)}배입니다.`;
    if (gs === 0) verdict.textContent = "처짐이 0이면 전선 길이가 정확히 100 m여야 합니다.";
    verdict.className = "verdict " + (Math.abs(r - 1) < 0.15 ? "good" : "bad");
    nums();
  });
  $(".go-hide").addEventListener("click", () => { shown = false; verdict.textContent = ""; verdict.className = "verdict"; nums(); });
  sl.addEventListener("input", () => { shown = false; verdict.textContent = ""; verdict.className = "verdict"; nums(); });
  sg.addEventListener("input", nums);
  nums();
})();
