/* 카드: 모양이 다른 물통에 같은 빠르기로 물을 넣으면 수위 그래프는 어떻게 다를까? — 단면 넓이와 수위 변화 */
(() => {
  const root = document.getElementById("card-jmath-tank-graph");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t"), H = 1, N = 400;
  /* 높이 y(0~1)에서의 반지름(통 단면은 원이라 넓이 ∝ r²) */
  const R = [(y) => 0.6, (y) => 0.9 - 0.6 * y, (y) => 0.3 + 0.6 * y, (y) => 0.35 + 0.55 * Math.abs(2 * y - 1)];
  const ANS = [0, 1, 2, 3], NAME = ["원기둥", "아래가 넓은 통", "위가 넓은 통", "허리가 잘록한 통"], SHAPE = ["직선", "점점 가팔라짐", "점점 완만해짐", "가팔라졌다 다시 완만"];
  let s = 0, shown = [false, false, false, false];
  /* 부피 V(y) = ∫ r² dy, 시간 t ∝ V. 표: t(0~100) → y */
  const table = (k) => { const V = [0]; for (let i = 1; i <= N; i++) { const y = (i - 0.5) / N; V.push(V[i - 1] + R[k](y) ** 2 / N); } const tot = V[N]; return V.map((v, i) => [(v / tot) * 100, i / N]); };
  const T = R.map((_, k) => table(k));
  const yAt = (k, t) => { const tb = T[k]; for (let i = 1; i < tb.length; i++) if (tb[i][0] >= t) { const [t0, y0] = tb[i - 1], [t1, y1] = tb[i]; return y0 + ((t - t0) / (t1 - t0 || 1)) * (y1 - y0); } return 1; };
  const tk = fit($(".tank"), () => drawTank()), gr = fit($(".gr"), () => drawGraph());
  function drawTank() {
    const { ctx, size: { w, h } } = tk; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, top = 10, bot = h - 10, sc = (w / 2 - 6) / 0.9, Y = (y) => bot - y * (bot - top), y = yAt(s, +tIn.value);
    ctx.fillStyle = "rgba(63,111,163,.35)"; ctx.beginPath();
    for (let i = 0; i <= 60; i++) { const yy = (y * i) / 60; ctx.lineTo(cx - R[s](yy) * sc, Y(yy)); }
    for (let i = 60; i >= 0; i--) { const yy = (y * i) / 60; ctx.lineTo(cx + R[s](yy) * sc, Y(yy)); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    [-1, 1].forEach((d) => { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const yy = i / 60; ctx.lineTo(cx + d * R[s](yy) * sc, Y(yy)); } ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(cx - R[s](0) * sc, bot); ctx.lineTo(cx + R[s](0) * sc, bot); ctx.stroke();
  }
  function drawGraph() {
    const { ctx, size } = gr; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: 100, y0: 0, y1: 1, xt: [0, 50, 100], yt: [[0, "0"], [1, "가득"]], xlab: "시간(초)", ylab: "수위", L: 40 });
    if (!shown[s]) { E.text(ctx, P.L + P.w / 2, P.T + P.h / 2, "모양을 예측하면 그래프가 나타납니다", C.ink3, "center"); return; }
    const t = +tIn.value;
    E.line(ctx, P, T[s], C.ink3, 1.4, [4, 4]);
    E.line(ctx, P, T[s].filter(([tt]) => tt <= t), E.BLUE, 2.6);
    E.dot(ctx, P, t, yAt(s, t), C.warn, 5);
  }
  function update() { $(".t-out").textContent = tIn.value; drawTank(); drawGraph(); }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { s = +b.dataset.s; root.querySelectorAll("[data-s]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", "false")); $(".verdict").textContent = shown[s] ? `${NAME[s]}: ${SHAPE[ANS[s]]}` : ""; update(); }));
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const ok = +b.dataset.g === ANS[s]; shown[s] = true;
    $(".verdict").textContent = `${ok ? "맞습니다." : "다시 보세요."} ${NAME[s]}의 그래프는 "${SHAPE[ANS[s]]}" 모양입니다. 시간을 움직여 확인하세요.`;
    if (+tIn.value === 0) tIn.value = 60;
    update();
  }));
  tIn.addEventListener("input", update);
  update();
})();
