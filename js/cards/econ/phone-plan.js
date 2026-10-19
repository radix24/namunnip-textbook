/* 카드: 한 달에 데이터를 얼마나 쓰면 어떤 요금제가 가장 쌀까? — 구간별 일차함수와 교점 (가상 요금제) */
(() => {
  const root = document.getElementById("card-econ-phone-plan");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), XM = 25;
  const PL = [["A", (x) => 15000 + 5000 * Math.max(0, x - 2), E.BLUE], ["B", (x) => 30000 + 2000 * Math.max(0, x - 8), E.ORANGE], ["C", () => 49000, E.PURPLE]];
  const cheapest = (x) => { let b = 0; PL.forEach((p, i) => { if (p[1](x) < PL[b][1](x) - 1e-9) b = i; }); return b; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: 80000, xt: [0, 5, 10, 15, 20, 25], yt: [[0, "0"], [20000, "2만"], [40000, "4만"], [60000, "6만"], [80000, "8만"]], xlab: "사용량(GB)", ylab: "요금(원)" });
    /* 가장 싼 요금제 띠 */
    for (let i = 0; i < 250; i++) { const x = (i + 0.5) * XM / 250, b = cheapest(x); ctx.fillStyle = PL[b][2]; ctx.globalAlpha = 0.25; ctx.fillRect(P.X(i * XM / 250), P.Y(0) - 8, P.X(XM / 250) - P.X(0) + 0.5, 8); }
    ctx.globalAlpha = 1;
    P.clip(); PL.forEach(([, f, col]) => E.fn(ctx, P, f, 0, XM, col, 2.4)); ctx.restore();
    PL.forEach(([nm, f, col], i) => { const lx = [3.2, 14, 22][i]; E.text(ctx, P.X(lx), P.Y(Math.min(78000, f(lx))) - 6, nm, col, "center", `700 13px ${F.sans}`); });
    const x = +xIn.value; PL.forEach(([, f, col]) => E.dot(ctx, P, x, f(x), col, 4.5));
  }
  function update() {
    const x = +xIn.value, b = cheapest(x);
    $(".x-out").textContent = E.n(x, 1);
    $(".say").textContent = `${PL.map(([nm, f]) => `${nm} ${E.n(f(x))}원`).join(" · ")} → 가장 싼 요금제 ${PL[b][0]}`;
    draw();
  }
  xIn.addEventListener("input", update);
  update();
})();
