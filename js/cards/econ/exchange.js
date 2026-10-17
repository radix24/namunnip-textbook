/* 카드: 환율이 오르면 누가 이득이고 누가 손해일까? — 원화·달러 가치의 비대칭 (모의 값) */
(() => {
  const root = document.getElementById("card-econ-exchange");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), E0 = 1200;
  const { ctx, size } = fit($("canvas"), () => draw());
  const usd = (e) => e / E0 - 1, krw = (e) => E0 / e - 1;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const P = E.frame(ctx, size, { x0: 1000, x1: 1600, y0: -0.4, y1: 0.4, xt: [1000, 1200, 1400, 1600], yt: [[-0.4, "−40%"], [-0.2, "−20%"], [0, "0"], [0.2, "+20%"], [0.4, "+40%"]], xlab: "환율(원/달러)", ylab: "기준(1200원) 대비 가치 변화" });
    E.fn(ctx, P, usd, 1000, 1600, E.BLUE, 2.4);
    E.fn(ctx, P, krw, 1000, 1600, C.warn, 2.4);
    const e = +rIn.value;
    E.dot(ctx, P, e, usd(e), E.BLUE, 5, `달러 ${usd(e) >= 0 ? "+" : ""}${E.pct(usd(e))}`, 8, -6);
    E.dot(ctx, P, e, krw(e), C.warn, 5, `원화 ${krw(e) >= 0 ? "+" : ""}${E.pct(krw(e))}`, 8, 14);
    E.dot(ctx, P, E0, 0, C.ink3, 3.5);
  }
  function update() {
    const e = +rIn.value, d = e - E0;
    $(".r-out").textContent = E.n(e);
    const sign = (x) => (x > 0 ? `${E.n(x)}원 더 듦` : x < 0 ? `${E.n(-x)}원 덜 듦` : "변화 없음");
    $(".w1").textContent = `여행 경비 1000달러 = ${E.n(1000 * e)}원 (${sign(1000 * d)})`;
    $(".w2").textContent = `50달러짜리 수입 가방 = ${E.n(50 * e)}원 (${sign(50 * d)})`;
    $(".w3").textContent = `10달러 제품 1만 개 판매 = ${E.n(1e5 * e / 1e4)}만 원 (${d >= 0 ? "+" : "−"}${E.n(Math.abs(1e5 * d) / 1e4)}만 원)`;
    $(".say").textContent = e === E0 ? "기준 환율입니다. 막대를 움직여 보세요." : `환율 ${E.pct(e / E0 - 1)} 변화 · 원화 ${e > E0 ? "약세" : "강세"} · 1만 원으로 살 수 있는 달러 ${E.n(1e4 / E0, 2)} → ${E.n(1e4 / e, 2)}달러`;
    draw();
  }
  rIn.addEventListener("input", update);
  update();
})();
