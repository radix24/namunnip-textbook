/* 카드: 배추값은 왜 해마다 폭등과 폭락을 되풀이할까? — 거미집 모형 P_t = −dP_{t−1} + (10 + d) (모의 모형, 천 원 단위) */
(() => {
  const root = document.getElementById("card-econ-cobweb");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const dIn = $(".d"), p0In = $(".p0"), PM = 10, QM = 10;
  let path = [];
  const web = fit($(".web"), () => drawWeb()), ts = fit($(".ts"), () => drawTs());
  const d = () => +dIn.value, pe = () => (10 + d()) / (1 + d());
  const reset = () => { path = [+p0In.value / 1000]; };
  const step = () => { const p = path[path.length - 1], q = Math.max(0, d() * (p - 1)), np = Math.max(0, Math.min(PM, 10 - q)); path.push(np); };
  function drawWeb() {
    const { ctx, size } = web; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: QM, y0: 0, y1: PM, xt: [0, 5, 10], yt: [[0, "0"], [5, "5천"], [10, "1만"]], xlab: "생산량", ylab: "가격(원)", L: 38 });
    P.clip();
    E.line(ctx, P, [[10, 0], [0, 10]], E.BLUE, 2.4);
    E.line(ctx, P, [[0, 1], [d() * 9, 10]], C.warn, 2.4);
    /* 거미집: (Q_t, P_{t−1}) → (Q_t, P_t) → (Q_{t+1}, P_t) ... */
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let t = 1; t < path.length; t++) { const q = Math.max(0, d() * (path[t - 1] - 1)); if (t === 1) ctx.moveTo(P.X(q), P.Y(path[0])); else ctx.lineTo(P.X(q), P.Y(path[t - 1])); ctx.lineTo(P.X(q), P.Y(path[t])); }
    ctx.stroke(); ctx.restore(); ctx.restore();
    const qe = 10 - pe(); E.dot(ctx, P, qe, pe(), C.ink3, 4, "균형", 6, -6);
    if (path.length) E.dot(ctx, P, Math.max(0, d() * (path[0] - 1)), path[0], C.forest, 4);
  }
  function drawTs() {
    const { ctx, size } = ts; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const N = Math.max(10, path.length - 1);
    const P = E.frame(ctx, size, { x0: 0, x1: N, y0: 0, y1: PM, xt: [0, Math.round(N / 2), N].map((v) => [v, `${v}년`]), yt: [[0, "0"], [5, "5천"], [10, "1만"]], ylab: "가격(원)", L: 38 });
    E.fn(ctx, P, () => pe(), 0, N, C.ink3, 1.2, [4, 4]);
    E.line(ctx, P, path.map((p, t) => [t, p]), C.forest, 2.2);
    path.forEach((p, t) => E.dot(ctx, P, t, p, C.forest, 3));
  }
  function update() {
    $(".d-out").textContent = E.n(d(), 2); $(".p0-out").textContent = E.n(+p0In.value);
    const n = path.length - 1, last = path[n], k = d();
    $(".say").textContent = `${n}년째 가격 ${E.n(last * 1000)}원 · 균형 가격 ${E.n(pe() * 1000)}원 · 균형과의 차이가 해마다 ${E.n(k, 2)}배(부호는 번갈아) → ${k < 0.999 ? "수렴" : k > 1.001 ? "발산(가격 0이나 1만 원에 막힘)" : "같은 폭으로 반복"}`;
    drawWeb(); drawTs();
  }
  $(".go-step").addEventListener("click", () => { if (path.length < 41) step(); update(); });
  $(".go-10").addEventListener("click", () => { for (let i = 0; i < 10 && path.length < 41; i++) step(); update(); });
  $(".go-reset").addEventListener("click", () => { reset(); update(); });
  [dIn, p0In].forEach((el) => el.addEventListener("input", () => { reset(); update(); }));
  reset(); update();
})();
