/* 카드: 한 개를 더 팔면 수입이 그 가격만큼 늘어날까? — R = (100 − 2Q)Q, R' = 100 − 4Q (가상 수요, 가격은 백 원) */
(() => {
  const root = document.getElementById("card-econ-marginal-revenue");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const qIn = $(".q"), QM = 50;
  const Pf = (q) => 100 - 2 * q, R = (q) => Pf(q) * q, MR = (q) => 100 - 4 * q;
  let cv = null;
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx, size } = cv;
    ctx.clearRect(0, 0, size.w, size.h);
    const q = +qIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: QM, y0: -100, y1: 100, xt: [0, 10, 20, 25, 30, 40, 50], yt: [[-100, "−1만"], [-50, "−5천"], [0, "0"], [50, "5천"], [100, "1만"]], xlab: "판매량 Q(상자)", ylab: "원", L: 44 });
    P.clip();
    E.fn(ctx, P, () => 0, 0, QM, C.ink3, 1);
    ctx.fillStyle = "rgba(63,111,163,.12)"; ctx.fillRect(P.X(0), P.Y(Pf(q)), P.X(q) - P.X(0), P.Y(0) - P.Y(Pf(q)));
    E.fn(ctx, P, Pf, 0, QM, E.BLUE, 2.4);
    E.fn(ctx, P, MR, 0, QM, C.warn, 2.4);
    ctx.restore();
    E.dot(ctx, P, q, Pf(q), E.BLUE, 5, `가격 ${E.n(Pf(q) * 100)}`, 6, -8);
    E.dot(ctx, P, q, MR(q), C.warn, 5, `한계수입 ${E.n(MR(q) * 100)}`, 6, 14);
    E.text(ctx, P.X(2), P.Y(92), "수요곡선 P = 100 − 2Q", E.BLUE);
    E.text(ctx, P.X(26), P.Y(-60), "한계수입 R' = 100 − 4Q", C.warn);
  }
  function update() {
    const q = +qIn.value;
    $(".q-out").textContent = q;
    $(".say").textContent = `총수입 R(${q}) = ${E.n(R(q) * 100)}원(파란 사각형) · 한계수입 R'(${q}) = ${E.n(MR(q) * 100)}원 · 실제 한 상자 더: R(${q + 1}) − R(${q}) = ${E.n((R(q + 1) - R(q)) * 100)}원`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const d = (R(21) - R(20)) * 100;
    $(".verdict").textContent = `${b.dataset.g === "1" ? "맞습니다." : "예측과 다릅니다."} 21상자를 팔려면 값을 5800원으로 내려야 해서 수입은 ${E.n(R(20) * 100)}원 → ${E.n(R(21) * 100)}원, 겨우 ${E.n(d)}원 늘어납니다. 새로 판 한 상자로 5800원을 벌지만, 이미 팔던 20상자에서 200원씩 4000원을 덜 받기 때문입니다.`;
    $(".after").hidden = false; if (!cv) cv = fit($("canvas"), () => draw()); update();
  }));
  qIn.addEventListener("input", update);
})();
