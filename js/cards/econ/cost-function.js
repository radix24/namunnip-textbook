/* 카드: 빵집이 하루 200개를 팔아야 본전이 되려면 값을 얼마로 정할까? — C(x) = F + vx, R(x) = px (모의 값) */
(() => {
  const root = document.getElementById("card-econ-cost-function");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const FIn = $(".F"), vIn = $(".v"), pIn = $(".p"), XM = 400, GOAL = 200;
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 금액은 만 원 단위로 그린다 */
  const val = () => ({ F: +FIn.value, v: +vIn.value / 1e4, p: +pIn.value / 1e4 });
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const { F, v, p } = val(), top = Math.ceil(Math.max(F + v * XM, p * XM) / 50) * 50;
    const yt = []; for (let y = 0; y <= top; y += top > 150 ? 50 : 25) yt.push(y);
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: top, xt: [0, 100, 200, 300, 400], yt, xlab: "하루 판매량(개)", ylab: "만 원" });
    P.clip();
    ctx.fillStyle = "rgba(181,83,47,.08)"; ctx.fillRect(P.X(0), P.T, P.X(GOAL) - P.X(0), P.h);
    E.fn(ctx, P, (x) => F + v * x, 0, XM, C.warn, 2.4);
    E.fn(ctx, P, (x) => p * x, 0, XM, E.BLUE, 2.4);
    E.fn(ctx, P, () => F, 0, XM, C.ink3, 1.2, [4, 4]);
    ctx.restore();
    E.text(ctx, P.X(40), P.Y(F + v * 40) - 6, "총비용 C(x)", C.warn);
    E.text(ctx, P.X(XM) - 4, P.Y(Math.min(top, p * XM)) - 6, "총수입 R(x)", E.BLUE, "right");
    E.text(ctx, P.X(0) + 4, P.Y(F) - 4, "고정비", C.ink3);
    if (p > v) { const xb = F / (p - v); if (xb <= XM) E.dot(ctx, P, xb, p * xb, C.ink, 5, `${E.n(xb, 1)}개`, 6, -8); }
    ctx.save(); ctx.strokeStyle = C.forest; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(P.X(GOAL), P.T); ctx.lineTo(P.X(GOAL), P.T + P.h); ctx.stroke(); ctx.restore();
    E.text(ctx, P.X(GOAL) + 4, P.T + 12, "목표 200개", C.forest);
  }
  function update() {
    const { F, v, p } = val();
    $(".F-out").textContent = F; $(".v-out").textContent = E.n(+vIn.value); $(".p-out").textContent = E.n(+pIn.value);
    if (p <= v) { $(".verdict").textContent = "가격이 재료비보다 높지 않아 팔수록 손해입니다."; $(".say").textContent = ""; draw(); return; }
    const xb = F / (p - v), need = +vIn.value + (F * 1e4) / GOAL;
    $(".verdict").textContent = Math.abs(xb - GOAL) < 0.5 ? "손익분기점이 200개입니다. 성공!" : `손익분기점 ${E.n(xb, 1)}개 · ${xb > GOAL ? "가격을 올려야" : "가격을 내려도"} 200개에 맞출 수 있습니다.`;
    $(".say").textContent = `x = F/(p − v) = ${E.n(F * 1e4)}/(${E.n(+pIn.value)} − ${E.n(+vIn.value)}) · 200개에서 이윤 ${E.n((p - v) * GOAL - F, 1)}만 원 · 200개에서 1개당 평균 비용 ${E.n(need)}원`;
    draw();
  }
  [FIn, vIn, pIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
