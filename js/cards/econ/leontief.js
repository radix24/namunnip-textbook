/* 카드: 자동차 수요가 100억 원 늘면 철강은 얼마나 더 만들어야 할까? — X = (I − A)⁻¹D (가상 투입 계수) */
(() => {
  const root = document.getElementById("card-econ-leontief");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const d1In = $(".d1"), d2In = $(".d2");
  /* A[i][j]: 산업 j 1원당 필요한 산업 i의 생산물. 0 = 철강, 1 = 자동차 */
  const A = [[0.2, 0.4], [0.1, 0.1]], NM2 = ["철강", "자동차"];
  const IA = [[1 - A[0][0], -A[0][1]], [-A[1][0], 1 - A[1][1]]], det = IA[0][0] * IA[1][1] - IA[0][1] * IA[1][0];
  const INV = [[IA[1][1] / det, -IA[0][1] / det], [-IA[1][0] / det, IA[0][0] / det]];
  const solve = (d) => [INV[0][0] * d[0] + INV[0][1] * d[1], INV[1][0] * d[0] + INV[1][1] * d[1]];
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const D = [+d1In.value, +d2In.value], X = solve(D), XM = Math.max(200, Math.ceil((Math.max(...X) * 1.2) / 100) * 100);
    const L = 64, R = 16, T = 14, rowH = (h - T - 40) / 2, Xp = (v) => L + (v / XM) * (w - L - R);
    for (let v = 0; v <= XM; v += XM > 400 ? 200 : 100) { ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(Xp(v), T); ctx.lineTo(Xp(v), h - 26); ctx.stroke(); E.text(ctx, Xp(v), h - 12, `${v}억`, C.ink3, "center", `10.5px ${F.mono}`); }
    NM2.forEach((nm, i) => {
      const y = T + i * rowH + rowH * 0.2, bh = rowH * 0.55, parts = [[D[i], "최종 수요", i ? E.BLUE : C.warn], [A[i][0] * X[0], "철강의 재료로", "rgba(181,83,47,.45)"], [A[i][1] * X[1], "자동차의 재료로", "rgba(63,111,163,.45)"]];
      E.text(ctx, L - 6, y + bh / 2 + 4, nm, C.ink, "right", `600 12px ${F.sans}`);
      let x0 = 0; parts.forEach(([v, lab, col]) => { ctx.fillStyle = col; ctx.fillRect(Xp(x0), y, Xp(x0 + v) - Xp(x0), bh); if (Xp(x0 + v) - Xp(x0) > 70) E.text(ctx, Xp(x0 + v / 2), y + bh / 2 + 4, `${lab} ${E.n(v, 1)}`, "#fff", "center", `10.5px ${F.sans}`); x0 += v; });
      E.text(ctx, Xp(x0) + 4, y + bh / 2 + 4, `총 ${E.n(x0, 1)}`, C.ink, "left", `600 11px ${F.mono}`);
    });
  }
  function update() {
    const D = [+d1In.value, +d2In.value], X = solve(D), c = $(".calc");
    $(".d1-out").textContent = D[0]; $(".d2-out").textContent = D[1];
    const f = (x) => E.n(x, 3);
    c.innerHTML = `\\((I - A)^{-1} = \\begin{pmatrix} ${f(INV[0][0])} & ${f(INV[0][1])} \\\\ ${f(INV[1][0])} & ${f(INV[1][1])} \\end{pmatrix}\\)<br>\\(X = (I - A)^{-1}\\begin{pmatrix} ${D[0]} \\\\ ${D[1]} \\end{pmatrix} = \\begin{pmatrix} ${E.n(X[0], 1)} \\\\ ${E.n(X[1], 1)} \\end{pmatrix}\\)<br><span class="mono">자동차 최종 수요 1억 원이 늘면 철강 ${f(INV[0][1])}억, 자동차 ${f(INV[1][1])}억 원을 더 생산해야 합니다</span>`;
    if (window.NMMath) NMMath.render(c);
    draw();
  }
  [d1In, d2In].forEach((el) => el.addEventListener("input", update));
  update();
})();
