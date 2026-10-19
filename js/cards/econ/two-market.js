/* 카드: 돼지고기 값이 오르면 닭고기 값은 왜 따라 오를까? — 두 시장의 연립 균형을 역행렬로 (가상 함수) */
(() => {
  const root = document.getElementById("card-econ-two-market");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const sIn = $(".s"), A = [[5, -1], [-1, 7]], DET = 34, INV = [[7 / DET, 1 / DET], [1 / DET, 5 / DET]];
  const solve = (s) => { const b = [130 + s, 110]; return [INV[0][0] * b[0] + INV[0][1] * b[1], INV[1][0] * b[0] + INV[1][1] * b[1]]; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const s = +sIn.value, [p1, p2] = solve(s), [q1, q2] = solve(0);
    const P = E.frame(ctx, size, { x0: 0, x1: 50, y0: 0, y1: 35, xt: [0, 10, 20, 30, 40, 50], yt: [0, 10, 20, 30], xlab: "돼지고기 가격 P₁", ylab: "닭고기 가격 P₂", L: 34 });
    P.clip();
    if (s) E.fn(ctx, P, (x) => 5 * x - 130, 0, 50, "rgba(181,83,47,.35)", 1.6, [5, 4]);
    E.fn(ctx, P, (x) => 5 * x - 130 - s, 0, 50, C.warn, 2.4);
    E.fn(ctx, P, (x) => (110 + x) / 7, 0, 50, E.BLUE, 2.4);
    ctx.restore();
    E.text(ctx, P.X(31.5), P.Y(33), "돼지고기 시장 균형", C.warn);
    E.text(ctx, P.X(49), P.Y((110 + 49) / 7) - 8, "닭고기 시장 균형", E.BLUE, "right");
    if (s) E.dot(ctx, P, q1, q2, C.ink3, 4);
    E.dot(ctx, P, p1, p2, C.ink, 5.5, `(${E.n(p1, 2)}, ${E.n(p2, 2)})`, 8, 14);
  }
  function update() {
    const s = +sIn.value, [p1, p2] = solve(s), c = $(".calc");
    $(".s-out").textContent = (s > 0 ? "+" : "") + s;
    c.innerHTML = `\\(\\begin{pmatrix} P_1 \\\\ P_2 \\end{pmatrix} = \\dfrac{1}{34}\\begin{pmatrix} 7 & 1 \\\\ 1 & 5 \\end{pmatrix}\\begin{pmatrix} ${130 + s} \\\\ 110 \\end{pmatrix} = \\begin{pmatrix} ${E.n(p1, 2)} \\\\ ${E.n(p2, 2)} \\end{pmatrix}\\)<br><span class="mono">돼지고기 ${E.n(p1 * 100)}원, 닭고기 ${E.n(p2 * 100)}원(100 g당) · 거래량 돼지 ${E.n(2 * p1 - 10, 1)}톤, 닭 ${E.n(3 * p2 - 5, 1)}톤` + (s ? ` · s = 0일 때보다 돼지고기 ${E.n((7 * s) / 34 * 100)}원, 닭고기 ${E.n(s / 34 * 100)}원 ${s > 0 ? "오름" : "내림"}` : "") + `</span>`;
    if (window.NMMath) NMMath.render(c);
    draw();
  }
  sIn.addEventListener("input", update);
  update();
})();
