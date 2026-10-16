/* 카드: 다섯 점을 모두 지나는 직선이 없으면 어떤 직선이 가장 좋을까? — 정규방정식 AᵀAx = Aᵀy (모의 자료) */
(() => {
  const root = document.getElementById("card-adalg-least-squares");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m"), cIn = $(".c"), ne = $(".ne");
  /* 모의 자료: 추 질량(100 g)과 늘어난 길이(cm) */
  const X = [1, 2, 3, 4, 5], Y = [2.1, 3.9, 6.2, 7.8, 10.1];
  const A = X.map((x) => [x, 1]), At = L.T(A);
  const sol = L.mv(L.inv(L.mul(At, A)), L.mv(At, Y));
  let best = Infinity, shown = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const sse = (m, c) => X.reduce((s, x, i) => s + (Y[i] - (m * x + c)) ** 2, 0);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const fr = axes(w, h);
    const m = +mIn.value, c = +cIn.value;
    // 오차 정사각형(화면 비율 맞춤: 세로 오차를 가로로 같은 픽셀만큼)
    X.forEach((x, i) => {
      const yh = m * x + c, py = fr.Y(Y[i]), ph = fr.Y(yh), side = ph - py;
      ctx.fillStyle = "rgba(224,160,42,.22)"; ctx.strokeStyle = "rgba(224,160,42,.8)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(fr.X(x), Math.min(py, ph), Math.abs(side), Math.abs(side)); ctx.fill(); ctx.stroke();
      seg(ctx, fr.X(x), py, fr.X(x), ph, C.warn, 1.6);
    });
    if (shown) { ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.forest; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(fr.X(0), fr.Y(sol[1])); ctx.lineTo(fr.X(6), fr.Y(sol[0] * 6 + sol[1])); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.rect(fr.L, fr.T, w - fr.L - fr.R, h - fr.T - fr.B); ctx.clip();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(fr.X(0), fr.Y(c)); ctx.lineTo(fr.X(6), fr.Y(m * 6 + c)); ctx.stroke(); ctx.restore();
    X.forEach((x, i) => dot(ctx, fr.X(x), fr.Y(Y[i]), C.ink, 4.5));
  }
  /* 축: x 0–6, y 0–12 */
  function axes(w, h) {
    const Lm = 34, R = 12, T = 12, B = 28, X = (x) => Lm + (x / 6) * (w - Lm - R), Yf = (y) => h - B - (y / 12) * (h - B - T);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let x = 0; x <= 6; x++) { ctx.beginPath(); ctx.moveTo(X(x), T); ctx.lineTo(X(x), h - B); ctx.stroke(); ctx.fillText(x, X(x), h - B + 5); }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let y = 0; y <= 12; y += 2) { ctx.beginPath(); ctx.moveTo(Lm, Yf(y)); ctx.lineTo(w - R, Yf(y)); ctx.stroke(); ctx.fillText(y, Lm - 5, Yf(y)); }
    ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(Lm, Yf(0)); ctx.lineTo(w - R, Yf(0)); ctx.moveTo(X(0), T); ctx.lineTo(X(0), h - B); ctx.stroke();
    label(ctx, "질량(100 g)", w - R, h - B - 10, C.ink2, "right", `600 11px ${F.sans}`);
    label(ctx, "길이(cm)", Lm + 6, T + 6, C.ink2, "left", `600 11px ${F.sans}`);
    return { X, Y: Yf, L: Lm, R, T, B };
  }
  function update() {
    const m = +mIn.value, c = +cIn.value, s = sse(m, c);
    best = Math.min(best, s);
    $(".m-out").textContent = L.n(m, 2); $(".c-out").textContent = L.n(c, 2);
    $(".n-s").textContent = L.n(s, 3); $(".n-best").textContent = L.n(best, 3);
    draw();
  }
  $(".go-solve").addEventListener("click", () => {
    shown = true;
    const AtA = L.mul(At, A), Aty = L.mv(At, Y), r = Y.map((y, i) => y - (sol[0] * X[i] + sol[1])), Atr = L.mv(At, r);
    const f = (x) => L.n(x, 3);
    ne.innerHTML = `<p>\\(A^TA\\) ${L.table(AtA, { f })} \\(\\hat{x}\\) = \\(A^T\\vec{y}\\) ${L.table(Aty.map((v) => [v]), { f })}</p>` +
      `<p>→ \\(m = ${f(sol[0])}\\), \\(c = ${f(sol[1])}\\), 오차 제곱의 합 ${f(sse(...sol))} (내 기록 ${f(best)})</p>` +
      `<p>오차 벡터 \\(\\vec{r}\\)와 두 열의 내적 \\(A^T\\vec{r}\\) = (${Atr.map((v) => f(Math.abs(v) < 1e-9 ? 0 : v)).join(", ")}) → 두 열과 수직</p>`;
    if (window.NMMath) NMMath.render(ne);
    draw();
  });
  [mIn, cIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
