/* 카드: 내일 비 올 확률이 30%일 때 우산을 몇 개 들여놓아야 할까? — 경우별 이익과 기댓값 (가상 가격) */
(() => {
  const root = document.getElementById("card-jmath-stock-decision");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), qIn = $(".q"), COST = 4000, PRICE = 10000, SALV = 2000, DR = 50, DS = 10;
  const prof = (q, d) => PRICE * Math.min(q, d) + SALV * Math.max(0, q - d) - COST * q;
  const ev = (q, p) => p * prof(q, DR) + (1 - p) * prof(q, DS);
  let cv = null;
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx, size } = cv; ctx.clearRect(0, 0, size.w, size.h);
    const p = +pIn.value / 100, q = +qIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: 60, y0: -100000, y1: 320000, xt: [0, 10, 20, 30, 40, 50, 60], yt: [[-100000, "−10만"], [0, "0"], [100000, "10만"], [200000, "20만"], [300000, "30만"]], xlab: "들여놓는 수(개)", ylab: "이익(원)", L: 44 });
    E.fn(ctx, P, () => 0, 0, 60, C.ink3, 1);
    E.fn(ctx, P, (x) => prof(x, DR), 0, 60, E.BLUE, 1.6, [5, 4]);
    E.fn(ctx, P, (x) => prof(x, DS), 0, 60, C.warn, 1.6, [5, 4]);
    E.fn(ctx, P, (x) => ev(x, p), 0, 60, C.forest, 2.6);
    E.text(ctx, P.X(58), P.Y(prof(58, DR)) - 6, "비 올 때", E.BLUE, "right");
    E.text(ctx, P.X(58), P.Y(prof(58, DS)) + 14, "안 올 때", C.warn, "right");
    E.dot(ctx, P, q, ev(q, p), C.forest, 5.5, `기댓값 ${E.n(ev(q, p))}원`, 8, -8);
  }
  function update() {
    const p = +pIn.value / 100, q = +qIn.value;
    $(".p-out").textContent = pIn.value; $(".q-out").textContent = q;
    let best = 0; for (let k = 0; k <= 60; k += 5) if (ev(k, p) > ev(best, p) + 1e-9) best = k;
    $(".say").textContent = `${q}개: 비 오면 ${E.n(prof(q, DR))}원, 안 오면 ${E.n(prof(q, DS))}원 → 기댓값 ${E.n(ev(q, p))}원 · 기댓값이 가장 큰 수량 ${best}개 · 10개를 넘는 우산 1개의 기댓값 8000 × ${p.toFixed(2)} − 2000 = ${E.n(8000 * p - 2000)}원`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "50" ? "맞습니다." : "예측과 다릅니다."} 기댓값은 10개 ${E.n(ev(10, 0.3))}원, 30개 ${E.n(ev(30, 0.3))}원, 50개 ${E.n(ev(50, 0.3))}원으로 50개가 가장 큽니다. 비가 오면 버는 돈(6천 원)이 안 오면 잃는 돈(2천 원)보다 3배 커서, 확률 30%로도 충분합니다.`;
    $(".after").hidden = false; if (!cv) cv = fit($("canvas"), () => draw()); update();
  }));
  [pIn, qIn].forEach((x) => x.addEventListener("input", update));
})();
