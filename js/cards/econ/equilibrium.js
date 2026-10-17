/* 카드: 운동화 값은 왜 결국 한 가격에 자리 잡을까? — 초과 수요·공급과 균형 (모의 함수) */
(() => {
  const root = document.getElementById("card-econ-equilibrium");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, M = NMMarket;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), sdIn = $(".sd"), ssIn = $(".ss"), QM = 1000, PM = 80000;
  const mk = () => ({ a: 900 + +sdIn.value, b: 0.01, c: -100 + +ssIn.value, d: 0.015 });
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const m = mk(), G = M.plot(ctx, size, { QM, PM, xt: [0, 250, 500, 750, 1000], yt: [[0, "0"], [20000, "2만"], [40000, "4만"], [60000, "6만"], [80000, "8만"]], xlab: "하루 거래량(켤레)", ylab: "가격(원)" }), P = G.P;
    P.clip();
    if (+sdIn.value) G.dLine({ a: 900, b: 0.01 }, "rgba(63,111,163,.35)", 1.6, [5, 4]);
    if (+ssIn.value) G.sLine({ c: -100, d: 0.015 }, "rgba(181,83,47,.35)", 1.6, [5, 4]);
    G.dLine(m, M.D); G.sLine(m, M.S);
    ctx.restore();
    const p = +pIn.value, qd = Math.max(0, m.a - m.b * p), qs = Math.max(0, m.c + m.d * p), e = M.eq(m);
    ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(p)); ctx.lineTo(P.X(Math.max(qd, qs)), P.Y(p)); ctx.stroke(); ctx.restore();
    if (Math.abs(qd - qs) > 2) { ctx.save(); ctx.strokeStyle = qd > qs ? C.forest : E.PURPLE; ctx.lineWidth = 6; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.moveTo(P.X(Math.min(qd, qs)), P.Y(p)); ctx.lineTo(P.X(Math.max(qd, qs)), P.Y(p)); ctx.stroke(); ctx.restore(); E.text(ctx, P.X((qd + qs) / 2), P.Y(p) - 8, qd > qs ? "초과 수요" : "초과 공급", qd > qs ? C.forest : E.PURPLE, "center"); }
    E.dot(ctx, P, qd, p, M.D, 4.5); E.dot(ctx, P, qs, p, M.S, 4.5);
    E.dot(ctx, P, e.Q, e.P, C.ink, 5, "균형", 7, 14);
    E.text(ctx, P.X(Math.max(0, m.a - m.b * PM * 0.95)) + 6, P.Y(PM * 0.95), "수요", M.D);
    E.text(ctx, P.X(Math.min(QM - 40, m.c + m.d * PM * 0.95)) - 6, P.Y(PM * 0.95), "공급", M.S, "right");
  }
  function update() {
    const m = mk(), p = +pIn.value, qd = Math.max(0, m.a - m.b * p), qs = Math.max(0, m.c + m.d * p), e = M.eq(m);
    $(".p-out").textContent = E.n(p); $(".sd-out").textContent = (+sdIn.value > 0 ? "+" : "") + sdIn.value; $(".ss-out").textContent = (+ssIn.value > 0 ? "+" : "") + ssIn.value;
    $(".say").textContent = `가격 ${E.n(p)}원: 수요량 ${E.n(qd)}, 공급량 ${E.n(qs)} → ` + (Math.abs(qd - qs) < 3 ? "균형입니다" : qd > qs ? `초과 수요 ${E.n(qd - qs)}켤레 → 가격이 오릅니다` : `초과 공급 ${E.n(qs - qd)}켤레 → 가격이 내립니다`) + ` · 균형 가격 ${E.n(e.P)}원, 균형 거래량 ${E.n(e.Q)}켤레`;
    draw();
  }
  [pIn, sdIn, ssIn].forEach((el) => el.addEventListener("input", update));
  $(".go-eq").addEventListener("click", () => { pIn.value = Math.round(M.eq(mk()).P / 500) * 500; update(); });
  update();
})();
