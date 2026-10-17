/* 카드: 설문 자료로 우리 학교 매점의 수요곡선을 만들 수 있을까? — 직선 맞추기와 최소제곱 (가상 자료) */
(() => {
  const root = document.getElementById("card-econ-demand-fit");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas"), QM = 400, PM = 6000;
  /* [가격, 사겠다는 학생 수] — 가상 자료 */
  const D = [[1000, 352], [1500, 318], [2000, 296], [2500, 250], [3000, 236], [3500, 190], [4000, 168], [4500, 118], [5000, 96]];
  /* 손잡이: 가격 1000원과 5000원에서의 수량 */
  let H = [300, 200], ls = null, drag = -1, P = null;
  const { ctx, size } = fit(cv, () => draw());
  const lineQ = (h, pp) => h[0] + ((h[1] - h[0]) * (pp - 1000)) / 4000;
  const sse = (h) => D.reduce((s, [pp, q]) => s + (q - lineQ(h, pp)) ** 2, 0);
  /* 최소제곱: Q = a + bP */
  const LS = (() => { const n = D.length, mx = D.reduce((s, d) => s + d[0], 0) / n, my = D.reduce((s, d) => s + d[1], 0) / n, b = D.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / D.reduce((s, [x]) => s + (x - mx) ** 2, 0); return [my + b * (1000 - mx), my + b * (5000 - mx)]; })();
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    P = E.frame(ctx, size, { x0: 0, x1: QM, y0: 0, y1: PM, xt: [0, 100, 200, 300, 400], yt: [[0, "0"], [2000, "2000"], [4000, "4000"], [6000, "6000"]], xlab: "하루 수요량(개)", ylab: "가격(원)", L: 48 });
    if (ls) E.line(ctx, P, [[ls[0], 1000], [ls[1], 5000]], C.forest, 2, [6, 4]);
    D.forEach(([pp, q]) => { ctx.save(); ctx.strokeStyle = "rgba(181,83,47,.6)"; ctx.beginPath(); ctx.moveTo(P.X(q), P.Y(pp)); ctx.lineTo(P.X(lineQ(H, pp)), P.Y(pp)); ctx.stroke(); ctx.restore(); });
    /* 직선은 자료 범위 밖으로 조금 늘여 그린다 */
    E.line(ctx, P, [[lineQ(H, 500), 500], [lineQ(H, 5500), 5500]], E.BLUE, 2.6);
    D.forEach(([pp, q]) => E.dot(ctx, P, q, pp, C.ink, 3.5));
    H.forEach((q, i) => { E.dot(ctx, P, q, i ? 5000 : 1000, E.BLUE, 7); ctx.save(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P.X(q), P.Y(i ? 5000 : 1000), 7, 0, 7); ctx.stroke(); ctx.restore(); });
  }
  const hin = [$(".h0"), $(".h1")];
  hin.forEach((el, i) => el.addEventListener("input", () => { H[i] = +el.value; update(); }));
  function update() {
    const b = (H[1] - H[0]) / 4000, a = H[0] - 1000 * b;
    hin.forEach((el, i) => { el.value = Math.round(H[i]); root.querySelector(`.h${i}-out`).textContent = Math.round(H[i]); });
    $(".say").textContent = `내 직선: Q = ${E.n(a, 1)} ${b < 0 ? "−" : "+"} ${E.n(Math.abs(b), 4)}P · 오차 제곱합 ${E.n(sse(H))} · 3500원 예측 ${E.n(lineQ(H, 3500))}개` + (ls ? ` · 최소제곱 직선의 오차 제곱합 ${E.n(sse(LS))}, 3500원 예측 ${E.n(lineQ(LS, 3500))}개` : "");
    draw();
  }
  const at = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", (e) => { if (!P) return; const [x, y] = at(e); H.forEach((q, i) => { if (Math.hypot(P.X(q) - x, P.Y(i ? 5000 : 1000) - y) < 22) drag = i; }); if (drag >= 0) cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", (e) => { if (drag < 0) return; const [x] = at(e); H[drag] = Math.max(0, Math.min(QM, P.inv(x, 0)[0])); update(); });
  cv.addEventListener("pointerup", () => (drag = -1));
  $(".go-ls").addEventListener("click", () => { ls = LS; update(); });
  update();
})();
