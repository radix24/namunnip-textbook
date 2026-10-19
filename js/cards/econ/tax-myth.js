/* 카드: 세율 구간이 올라가면 오히려 손에 쥐는 돈이 줄어들까? — 초과 누진 vs 가상의 단순 구간 방식 */
(() => {
  const root = document.getElementById("card-econ-tax-myth");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, T = NMTax;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x");
  /* 숨겨진 캔버스는 크기가 0이라, 보이게 한 뒤에 맞춘다 */
  let cv = null;
  const net1 = (x) => x - T.tax(x), net2 = (x) => x - T.flatBand(x);
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx, size } = cv;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 2000, x1: 10000, y0: 1500, y1: 8000, xt: [2000, 4000, 6000, 8000, 10000], yt: [2000, 4000, 6000], xlab: "과세표준(만 원)", ylab: "세후 소득(만 원)" });
    E.fn(ctx, P, net1, 2000, 10000, E.BLUE, 2.6);
    /* 단순 구간 방식은 경계에서 끊기므로 구간마다 따로 그린다 */
    T.BR.forEach(([lo], i) => { const hi = i + 1 < T.BR.length ? T.BR[i + 1][0] : 10000; if (hi > 2000) E.fn(ctx, P, net2, Math.max(2000, lo + 0.01), Math.min(10000, hi), C.warn, 2.2, [6, 4]); });
    const x = +xIn.value;
    E.dot(ctx, P, x, net1(x), E.BLUE, 5, "초과 누진", 6, -8);
    E.dot(ctx, P, x, net2(x), C.warn, 5, "단순 구간", 6, 16);
  }
  function update() {
    const x = +xIn.value;
    $(".x-out").textContent = E.n(x);
    $(".say").textContent = `초과 누진: 세금 ${E.n(T.tax(x), 1)}만, 세후 ${E.n(net1(x), 1)}만 원 · 단순 구간: 세금 ${E.n(T.flatBand(x), 1)}만, 세후 ${E.n(net2(x), 1)}만 원`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const d = net1(4010) - net1(3990);
    $(".verdict").textContent = `${b.dataset.g === "up" ? "맞습니다." : "예측과 다릅니다."} 세금은 ${E.n(T.tax(3990), 1)}만 → ${E.n(T.tax(4010), 1)}만 원으로 ${E.n(T.tax(4010) - T.tax(3990), 1)}만 원만 늘고, 세후 소득은 ${E.n(net1(3990), 1)}만 → ${E.n(net1(4010), 1)}만 원으로 ${E.n(d, 1)}만 원 늘어납니다. 4000만 원을 넘은 10만 원에만 25%가 붙기 때문입니다. 만약 소득 전체에 25%를 매기는 방식이었다면 세후 소득이 ${E.n(net2(3990) - net2(4010), 1)}만 원 줄었을 것입니다(아래 점선).`;
    $(".after").hidden = false; if (!cv) cv = fit($("canvas"), () => draw()); update();
  }));
  xIn.addEventListener("input", update);
})();
